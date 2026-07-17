/* =============================================================================
   dock.js — design-combinator runtime (config-driven, generalized)
   -----------------------------------------------------------------------------
   Ported from the per-wedge source combinator engine. Zero hardcoded catalog: the
   dimension catalog, defaults, multi-registry, jump map, namespace and brand
   copy all come from `window.CMB` (written by combinator.data.js, the output
   of gen.mjs) — { meta, dims, defaults, multi, jump, variantRegistry }.

   Architecture (unchanged from the source engine):
     - Normal mode  : renders the dock chrome + a same-origin <iframe> of THIS
       SAME document in ?embed=1 mode as the "stage". Dock <-> stage talk over
       postMessage (works on file://, unlike direct contentDocument writes).
     - Embed mode   : (?embed=1) shows the inlined target page, applies config
       from the URL hash + postMessage, force-reveals content when motion is
       off, and runs its own identify/peek/flash/pick since it owns the DOM.

   gen.mjs only injects two empty stubs, `#cmb-dock` and `#cmb-fab` — it does
   NOT wrap the target's body content in a stage container or create a stage
   host element (that scaffolding was hand-authored into the source engine's
   static combinator.html; the generalized generator has no target-specific
   markup to author it against). `ensureScaffold()` below builds that scaffolding once,
   at runtime, on first script execution — moving the target page's own body
   content into `.cmb-stage` (kept `display:none` by dock.css until embed mode
   flips it visible) and creating `#cmb-stage-host` for the iframe. This is the
   one structural addition beyond a straight port; see dock-features.md.

   Apply mechanism: token + component dims are attribute writes —
   `documentElement.dataset[key] = value` — the generated combinator.effects.css
   (`html[data-key="value"]{...}`) does all the visual work. Multi dims store a
   space-joined token string, matched by `~=` in the generated CSS. Markup (M3)
   dims are recorded in cfg/data-* exactly like any other dim; the actual DOM
   swap is `applyMarkup()` (stage-side, embed mode) — it captures each markup
   dim's original section outerHTML at boot, swaps in `variantRegistry[key][v]`
   on toggle (or restores the captured original for the default option), then
   re-wires reveal state + known JS hooks on the fresh nodes. `eApply` runs all
   markup swaps in a first pass so token/component dataset attrs (pass two)
   always land on the latest DOM — see dock-features.md.
   ========================================================================= */
(function () {
  "use strict";

  var CMB = window.CMB;
  if (!CMB) { console.error("dock.js: window.CMB not found — combinator.data.js must load before dock.js"); return; }

  var META = CMB.meta || {};
  var BRAND = META.brand || "combinator";
  var DIMSFLAT = CMB.dims || [];              // flat catalog: {key,label,cat,icon,mechanism,cssVars,target,multi,default,jumpSelector,options:[{name,rationale}]}
  var DEFAULTS = CMB.defaults || {};          // key -> default option name
  var MULTI = CMB.multi || {};                // key -> true for space-joined multi dims
  var JUMP = CMB.jump || {};                  // key -> jumpSelector

  var DIM = {}; DIMSFLAT.forEach(function (d) { DIM[d.key] = d; });
  var KEYS = DIMSFLAT.map(function (d) { return d.key; });
  function isMulti(k) { return !!MULTI[k]; }

  /* group the flat catalog back into category sections for the accordion,
     preserving first-seen category order (== config.categories order, since
     gen.mjs emits dims in document order). */
  var DIMS = (function () {
    var order = [], byCat = {};
    DIMSFLAT.forEach(function (d) {
      var cat = d.cat || "General";
      if (!byCat[cat]) { byCat[cat] = { cat: cat, icon: d.icon || "squares-four", dims: [] }; order.push(byCat[cat]); }
      byCat[cat].dims.push(d);
    });
    return order;
  })();

  /* ===== serialize ===== */
  function serialize(cfg) { return KEYS.map(function (k) { return k + ":" + (cfg[k] || ""); }).join("|"); }
  function deserialize(s) { var o = {}; (s || "").split("|").forEach(function (p) { var i = p.indexOf(":"); if (i > 0) o[p.slice(0, i)] = p.slice(i + 1); }); return o; }

  /* ===== scaffold: build .cmb-stage + #cmb-stage-host once, on either load =====
     gen.mjs only stubs #cmb-dock / #cmb-fab. Everything else the dock↔stage
     split needs (the stage wrapper, the iframe host) is runtime-built here so
     it works for ANY target page without per-page generator changes. */
  function ensureScaffold() {
    if (document.querySelector(".cmb-stage")) return;
    var body = document.body;
    var dockStub = document.getElementById("cmb-dock");
    var fabStub = document.getElementById("cmb-fab");
    var kids = Array.prototype.slice.call(body.children).filter(function (n) {
      return n !== dockStub && n !== fabStub && n.tagName !== "SCRIPT";
    });
    var stage = document.createElement("div");
    stage.className = "cmb-stage";
    kids.forEach(function (n) { stage.appendChild(n); });
    body.insertBefore(stage, body.firstChild);
    var host = document.createElement("div");
    host.id = "cmb-stage-host";
    host.dataset.vp = "desktop";
    if (dockStub) body.insertBefore(host, dockStub); else body.appendChild(host);
  }
  ensureScaffold();

  var EMBED = /[?&]embed=1/.test(location.search);

  /* =========================================================================
     EMBED MODE — the stage. Renders the inlined target page, applies config
     from the URL hash AND from postMessage (so the dock works cross-origin,
     incl. file://). Runs its own identify/peek/flash since it owns the DOM.
     ========================================================================= */
  if (EMBED) {
    document.documentElement.classList.add("cmb-embed-html");
    var eroot = document.documentElement;

    function isHexColor(v) { return typeof v === "string" && /^#[0-9a-fA-F]{3,8}$/.test(v); }

    /* markup (M3) swap state — captured/updated live, never baked at gen time:
       markupOriginal[key]  = that dim's target outerHTML as originally served
                               (the `current` option's payload — gen.mjs never
                               bakes this into variantRegistry, see below)
       markupApplied[key]   = the option name currently showing in the DOM,
                               so re-selecting the same option is a no-op
                               instead of a redundant destroy+recreate */
    var markupOriginal = {}, markupApplied = {};
    function captureMarkupOriginals() {
      DIMSFLAT.forEach(function (d) {
        if (d.mechanism !== "markup" || !d.target) return;
        var node = document.querySelector(d.target);
        if (!node) return;
        markupOriginal[d.key] = node.outerHTML;
        markupApplied[d.key] = DEFAULTS[d.key]; // DOM currently shows the default, verbatim
      });
    }

    /* re-wire after a swap. combinator.data.js (gen.mjs) only ever emits
       {name, rationale} per option — an option's `rewire` metadata
       (config-schema.md: reveal/ids/hooks) is NOT threaded through to
       window.CMB, so there's nothing per-option to branch on here. These
       run unconditionally instead, and are no-ops when the fragment doesn't
       need them. */
    function reWireReveal(root) {
      // outerHTML replacement makes brand-new nodes, so any [data-reveal]
      // the fragment carries starts hidden again — the page's own
      // IntersectionObserver already fired-and-unobserved the OLD node and
      // will never see the new one scroll into view. Force it visible now
      // under both reveal-class conventions this runtime accounts for
      // ("is-visible" — the page's own reveal convention, e.g. an
      // IntersectionObserver-driven class; "in" — this runtime's existing
      // reduced-motion fallback below) since the schema names neither.
      var nodes = [];
      if (root.hasAttribute && root.hasAttribute("data-reveal")) nodes.push(root);
      if (root.querySelectorAll) nodes = nodes.concat(Array.prototype.slice.call(root.querySelectorAll("[data-reveal]")));
      nodes.forEach(function (n) { n.classList.add("is-visible"); n.classList.add("in"); });
    }
    function reWireHooks(root) {
      // Rebind the one interactive hook this stage knows how to rebind
      // (FAQ toggles), scoped to the freshly-swapped subtree only. Safe to
      // call unconditionally: outerHTML replacement always yields brand-new
      // nodes, so a scoped rebind here can never double-bind a listener.
      if (root.querySelectorAll) bindFaq(root);
    }

    function applyMarkup(key, optionName) {
      var d = DIM[key]; if (!d || !d.target) return;
      if (markupApplied[key] === optionName) return; // already showing this option
      var isCurrent = optionName === DEFAULTS[key];
      var html = isCurrent ? markupOriginal[key] : ((CMB.variantRegistry && CMB.variantRegistry[key]) || {})[optionName];
      if (html == null) return; // unknown option / nothing captured yet — never throw
      var node = document.querySelector(d.target);
      if (!node) return;
      node.outerHTML = html;
      markupApplied[key] = optionName;
      var fresh = document.querySelector(d.target); // previous node reference is dead — relocate
      if (fresh) { reWireReveal(fresh); reWireHooks(fresh); }
    }

    function eApply(cfg) {
      // Pass 1 — markup swaps first: each swapped section must exist before
      // pass 2 (re-)applies token/component dataset attrs to <html>, so the
      // CSS descendant rules + inherited custom properties that drive combo-
      // holds land on the freshly-swapped nodes in this same synchronous
      // pass rather than depending on KEYS' incidental ordering.
      KEYS.forEach(function (k) {
        var d = DIM[k];
        if (d && d.mechanism === "markup") applyMarkup(k, (cfg && cfg[k] != null) ? cfg[k] : DEFAULTS[k]);
      });
      KEYS.forEach(function (k) {
        var v = (cfg && cfg[k] != null) ? cfg[k] : DEFAULTS[k];
        eroot.dataset[k] = v;
        var d = DIM[k];
        // custom-hex escape hatch (generalized from the source engine's
        // --paper setProperty path): any token dim whose live value is a hex
        // colour writes straight to its cssVars, bypassing the generated
        // [data-key=value] rules (which can't enumerate arbitrary hexes).
        if (d && d.mechanism === "token" && d.cssVars && d.cssVars.length) {
          if (isHexColor(v)) { d.cssVars.forEach(function (cv) { eroot.style.setProperty(cv, v); }); }
          else { d.cssVars.forEach(function (cv) { eroot.style.removeProperty(cv); }); }
        }
      });
      // Scroll-reveal restored: let the page's own IntersectionObserver
      // animate sections in as you scroll. Only force everything visible
      // when motion is off or the OS asks for reduced motion.
      var still = eroot.dataset.motion === "none" || matchMedia("(prefers-reduced-motion:reduce)").matches;
      if (still) {
        document.querySelectorAll("[data-reveal]").forEach(function (e) { e.classList.add("in"); });
        document.querySelectorAll(".num").forEach(function (n) {
          var t = n.dataset.to, p = n.dataset.prefix || "", s = n.dataset.suffix || ""; if (t) n.textContent = p + t + s;
        });
      }
      eCursor(eroot.dataset.cursor); eEntrance(eroot.dataset.entrance);
    }

    /* cursor follower (dot / ring-follow) — inert no-op when the config has
       no "cursor" dim, since eroot.dataset.cursor is then simply undefined. */
    var curEl = null, curRaf = null, curX = 0, curY = 0, curTX = 0, curTY = 0;
    function eCursorMove(ev) { curX = ev.clientX; curY = ev.clientY; }
    function eCursorTick() {
      curTX += (curX - curTX) * 0.18; curTY += (curY - curTY) * 0.18;
      if (curEl) curEl.style.transform = "translate(" + curTX + "px," + curTY + "px) translate(-50%,-50%)"; curRaf = requestAnimationFrame(eCursorTick);
    }
    function eCursor(val) {
      var follow = (val === "dot" || val === "ring-follow");
      if (follow) {
        if (!curEl) {
          curEl = document.createElement("div"); curEl.id = "cmb-cursor"; document.body.appendChild(curEl);
          document.addEventListener("mousemove", eCursorMove, { passive: true }); curRaf = requestAnimationFrame(eCursorTick);
        }
        curEl.className = (val === "ring-follow") ? "ring" : "dot";
      } else if (curEl) { document.removeEventListener("mousemove", eCursorMove); if (curRaf) cancelAnimationFrame(curRaf); curRaf = null; curEl.remove(); curEl = null; }
    }
    /* page-load entrance — inert no-op when the config has no "entrance" dim */
    var lastEntrance = null, entTO = null;
    function eEntrance(val) {
      if (val === lastEntrance) return; lastEntrance = val;
      var b = document.body; b.classList.remove("cmb-ent-fade", "cmb-ent-curtain", "cmb-ent-blur", "cmb-ent-stagger");
      if (!val || val === "none") return;
      var cls = val === "fade" ? "cmb-ent-fade" : val === "curtain" ? "cmb-ent-curtain" : val === "blur-in" ? "cmb-ent-blur" : "cmb-ent-stagger";
      void b.offsetWidth; b.classList.add(cls);
      clearTimeout(entTO); entTO = setTimeout(function () { b.classList.remove(cls); }, 1500);
    }

    /* identify / peek target selectors — derived from the config, not
       hardcoded per-page regions. Prefer a dim's `target` (markup dims: the
       real section selector) and fall back to `jumpSelector` (the one real
       anchor every dim carries). This means peek/identify for token and
       component dims points at their single "take me there" anchor rather
       than every affected element — config-schema.md doesn't currently carry
       a full "affected elements" selector for those two mechanisms. */
    function dimSelector(d) { return (d && (d.target || d.jumpSelector)) || null; }
    var EREG = (function () {
      var seen = {}, out = [];
      DIMSFLAT.forEach(function (d) {
        var sel = dimSelector(d); if (!sel || seen[sel]) return; seen[sel] = true; out.push([sel, d.label]);
      });
      return out;
    })();
    var eLayer, eOn = false, eRaf = null, eBadges = [];
    function eEnsure() { if (!eLayer) { eLayer = document.createElement("div"); eLayer.className = "cmb-idlayer"; document.body.appendChild(eLayer); } }
    var pointers = [];
    function clearPointers() { pointers.forEach(function (p) { if (p.parentNode) p.remove(); }); pointers = []; }
    function ePoint(rc, color) {
      eEnsure(); var w = 14, h = 16, left = rc.left - w - 6, side = "left";
      if (left < 4) { side = "right"; left = rc.right + 6; }
      var y = Math.max(6, Math.min(rc.top + rc.height / 2 - h / 2, innerHeight - h - 6));
      var p = document.createElement("div"); p.className = "cmb-pointer " + side; p.style.color = color || "#1a4d2e";
      p.style.transform = "translate(" + left + "px," + y + "px)"; eLayer.appendChild(p); pointers.push(p);
    }
    function eBuild() {
      eEnsure(); eLayer.innerHTML = ""; eBadges = [];
      EREG.forEach(function (r) {
        var t = document.querySelector(r[0]); if (!t) return;
        var p = document.createElement("div"); p.className = "cmb-pointer left"; p.style.color = "#1a4d2e"; eLayer.appendChild(p); eBadges.push({ n: p, t: t });
      });
    }
    function ePos() {
      eBadges.forEach(function (b) {
        var rc = b.t.getBoundingClientRect(); var w = 14, h = 16, left = rc.left - w - 6, side = "left";
        if (left < 4) { side = "right"; left = rc.right + 6; } b.n.className = "cmb-pointer " + side;
        var y = Math.max(6, Math.min(rc.top + rc.height / 2 - h / 2, innerHeight - h - 6)); b.n.style.transform = "translate(" + left + "px," + y + "px)";
        b.n.style.opacity = (rc.bottom < 10 || rc.top > innerHeight - 10) ? "0" : "1";
      });
      if (eOn) eRaf = requestAnimationFrame(ePos);
    }
    function eIdentify(on) {
      eOn = on; document.body.classList.toggle("cmb-identify", on);
      if (on) { eBuild(); ePos(); } else { if (eRaf) cancelAnimationFrame(eRaf); eRaf = null; if (eLayer) eLayer.innerHTML = ""; }
    }
    function ePeek(k, on) {
      clearPointers(); var d = DIM[k]; var sel = dimSelector(d); if (!sel || !on) return;
      document.querySelectorAll(sel).forEach(function (n) { ePoint(n.getBoundingClientRect(), "#913240"); });
    }
    function eFlash(k) {
      var d = DIM[k]; var sel = dimSelector(d); if (!sel) return; var n = document.querySelector(sel); if (!n) return;
      n.classList.add("cmb-flash"); setTimeout(function () { n.classList.remove("cmb-flash"); }, 900);
    }

    /* pick / inspect: hover the page -> tell the dock which control owns it.
       DETECT is built from each dim's target (markup) or jumpSelector,
       sorted longest-selector-first as a specific-before-general heuristic
       (the source engine hand-ordered its DETECT list the same way). */
    var DETECT = (function () {
      var list = [];
      DIMSFLAT.forEach(function (d) { var sel = dimSelector(d); if (sel) list.push([sel, d.key]); });
      list.sort(function (a, b) { return b[0].length - a[0].length; });
      return list;
    })();
    var pickOn = false, pickEl = null;
    function eFind(node) { if (!node || !node.closest) return null; for (var i = 0; i < DETECT.length; i++) { var m = node.closest(DETECT[i][0]); if (m) return { k: DETECT[i][1], el: m }; } return null; }
    function eClearPick() { clearPointers(); pickEl = null; }
    function eMove(ev) { clearPointers(); var hit = eFind(ev.target); if (hit) { pickEl = hit.el; ePoint(hit.el.getBoundingClientRect(), "#1a4d2e"); } else pickEl = null; }
    function eClick(ev) { var hit = eFind(ev.target); if (hit) { ev.preventDefault(); ev.stopPropagation(); try { parent.postMessage({ cmb: "picked", k: hit.k }, "*"); } catch (e) {} } }
    function ePick(on) {
      pickOn = on; document.body.classList.toggle("cmb-picking", on);
      if (on) { document.addEventListener("mousemove", eMove, true); document.addEventListener("click", eClick, true); }
      else { document.removeEventListener("mousemove", eMove, true); document.removeEventListener("click", eClick, true); eClearPick(); }
    }

    function bindFaq(scope) {
      (scope || document).querySelectorAll(".faq-q").forEach(function (q) {
        q.addEventListener("click", function () {
          var item = q.closest(".faq-item"); if (!item) return;
          var open = item.classList.toggle("open"); q.setAttribute("aria-expanded", open ? "true" : "false");
        });
      });
    }
    function embedSetup() { bindFaq(document); }
    function run() {
      captureMarkupOriginals(); // BEFORE any eApply/swap — this is the live `current` fragment
      var h = location.hash.match(/cfg=([^&]+)/);
      eApply(h ? deserialize(decodeURIComponent(h[1])) : {});
      embedSetup(); document.body.classList.add("cmb-embed");
      if (parent !== window) { try { parent.postMessage({ cmb: "ready" }, "*"); } catch (e) {} }
    }
    addEventListener("message", function (e) {
      var m = e.data || {}; if (!m.cmb) return;
      if (m.cmb === "cfg") eApply(m.cfg);
      else if (m.cmb === "identify") eIdentify(!!m.on);
      else if (m.cmb === "peek") ePeek(m.k, !!m.on);
      else if (m.cmb === "flash") eFlash(m.k);
      else if (m.cmb === "pick") ePick(!!m.on);
      else if (m.cmb === "scroll") {
        var sel = m.sel || JUMP[m.k]; var el = sel && document.querySelector(sel);
        if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.classList.add("cmb-jumpflash"); setTimeout(function () { el.classList.remove("cmb-jumpflash"); }, 1400); }
      }
    });
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
    addEventListener("hashchange", function () { var h = location.hash.match(/cfg=([^&]+)/); eApply(h ? deserialize(decodeURIComponent(h[1])) : {}); });
    return;
  }

  /* =========================================================================
     NORMAL MODE — dock holds the config; posts it to the stage iframe.
     ========================================================================= */
  var frame, frameReady = false, idOn = false, pickOn = false;
  var state = {}; KEYS.forEach(function (k) { state[k] = DEFAULTS[k]; });
  function send(msg) { if (frame && frame.contentWindow) try { frame.contentWindow.postMessage(msg, "*"); } catch (e) {} }
  function pushCfg() { send({ cmb: "cfg", cfg: state }); }
  function getVal(k) { return state[k] != null ? state[k] : DEFAULTS[k]; }
  function setVal(k, v) { state[k] = v; }
  function hasToken(k, t) { return (getVal(k) || "").split(/\s+/).indexOf(t) >= 0; }
  function toggleToken(k, t) { var s = (getVal(k) || "").split(/\s+/).filter(Boolean); var i = s.indexOf(t); if (i >= 0) s.splice(i, 1); else s.push(t); state[k] = s.join(" "); }
  function currentCfg() { var o = {}; KEYS.forEach(function (k) { o[k] = getVal(k); }); return o; }
  function applyAll(cfg) { KEYS.forEach(function (k) { if (cfg[k] != null) state[k] = cfg[k]; }); syncPressed(); persist(); pushCfg(); }

  /* ---- namespace: every localStorage key + the URL-hash mirror keys off
     window.CMB.meta.brand, so multiple generated pages never collide ---- */
  var LS = BRAND + ".combinator";
  var LOCKS = LS + ".locks";
  var SNAPS = LS + ".snaps";

  /* ---- locks: which dims are frozen during Randomize (randomize-scope only) ---- */
  var locks = {};
  function isLocked(k) { return !!locks[k]; }
  function setLock(k, on) { if (on) locks[k] = true; else delete locks[k]; }
  function toggleLock(k) { setLock(k, !isLocked(k)); syncLocks(); persist(); }
  function catKeys(c) { return c.dims.map(function (d) { return d.key; }); }
  function catState(c) { var ks = catKeys(c), n = ks.filter(isLocked).length; return n === 0 ? "none" : (n === ks.length ? "all" : "some"); }
  function lockCategory(c, on) { catKeys(c).forEach(function (k) { setLock(k, on); }); syncLocks(); persist(); }
  function anyLocked() { return KEYS.some(isLocked); }
  function allLocked() { return KEYS.every(isLocked); }
  function lockAll(on) { KEYS.forEach(function (k) { setLock(k, on); }); syncLocks(); persist(); }
  function loadLocks() {
    var h = location.hash.match(/lock=([^&|]+)/), arr = null;
    if (h) { arr = decodeURIComponent(h[1]).split(",").filter(Boolean); }
    else { try { var s = localStorage.getItem(LOCKS); if (s) arr = JSON.parse(s); } catch (e) {} }
    locks = {}; (arr || []).forEach(function (k) { if (DIM[k]) locks[k] = true; });
  }
  function syncLocks() {
    dock.querySelectorAll(".cmb-grp").forEach(function (g) {
      var on = isLocked(g.dataset.k); g.classList.toggle("cmb-locked", on);
      var b = g.querySelector(".cmb-lock"); if (b) { b.setAttribute("aria-pressed", on ? "true" : "false"); b.innerHTML = "<i class='ph ph-" + (on ? "lock-simple" : "lock-simple-open") + "'></i>"; }
    });
    DIMS.forEach(function (c, ci) {
      var b = dock.querySelector('.cmb-catlock[data-cat="' + ci + '"]'); if (!b) return;
      var st = catState(c); b.classList.toggle("on", st === "all"); b.classList.toggle("partial", st === "some");
      b.innerHTML = "<i class='ph ph-" + (st === "none" ? "lock-simple-open" : "lock-simple") + "'></i>";
    });
    var la = document.getElementById("cmb-lockall"); if (la) {
      var all = allLocked();
      la.setAttribute("aria-pressed", anyLocked() ? "true" : "false");
      la.innerHTML = "<i class='ph ph-" + (anyLocked() ? "lock-simple" : "lock-simple-open") + "'></i> " + (all ? "Unlock all" : "Lock all");
    }
  }

  var dock = document.getElementById("cmb-dock");
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---- dock chrome: gen.mjs only stubs an empty #cmb-dock / #cmb-fab; build
     the header/actions/viewport/snapshots shell here, using the SAME class
     names as the source combinator.css chrome so a ported dock.css matches. ---- */
  function buildChrome() {
    dock.setAttribute("aria-label", "Design combinator controls");
    dock.innerHTML =
      '<div class="cmb-head">' +
        '<div class="cmb-title"><span class="cmb-dot"></span> Combinator <small>' + BRAND + ' landing</small></div>' +
        '<div class="cmb-acts">' +
          '<button id="cmb-rand" title="Randomize (R)"><i class="ph ph-shuffle"></i> Randomize</button>' +
          '<button id="cmb-reset" title="Reset to landing default (0)"><i class="ph ph-arrow-counter-clockwise"></i> Reset</button>' +
          '<button id="cmb-copy" title="Copy config as data-* string"><i class="ph ph-copy"></i> Copy</button>' +
          '<button id="cmb-save" title="Save this permutation"><i class="ph ph-star"></i> Save</button>' +
          '<button id="cmb-id-btn" aria-pressed="false" title="Identify elements (L)"><i class="ph ph-crosshair"></i> Identify</button>' +
        '</div>' +
        '<div class="cmb-vps">' +
          '<span class="cmb-vps-lab">View</span>' +
          '<button class="cmb-vp" data-vp="desktop" aria-pressed="true">Desktop</button>' +
          '<button class="cmb-vp" data-vp="tablet">Tablet</button>' +
          '<button class="cmb-vp" data-vp="phone">Phone</button>' +
        '</div>' +
      '</div>' +
      '<div class="cmb-scroll">' +
        '<div class="cmb-snaps-wrap"><div class="cmb-subh">Saved permutations</div><div id="cmb-snaps"></div></div>' +
      '</div>';
    var fab = document.getElementById("cmb-fab");
    if (fab) { fab.innerHTML = "<i class='ph ph-sliders-horizontal'></i>"; fab.title = "Show / hide dock (\\)"; fab.setAttribute("role", "button"); fab.setAttribute("tabindex", "0"); }
  }

  /* ---- dock render: the per-dim accordion, appended into .cmb-scroll ---- */
  function renderDock() {
    var body = el("div", "cmb-body");
    DIMS.forEach(function (c, ci) {
      var sec = el("section", "cmb-cat" + (ci === 0 ? " open" : ""));
      var head = el("button", "cmb-cat-h", "<span><i class='ph ph-" + c.icon + "'></i> " + c.cat + "</span><i class='ph ph-caret-down cmb-caret'></i>");
      head.addEventListener("click", function () { sec.classList.toggle("open"); });
      var clk = el("span", "cmb-catlock", "<i class='ph ph-lock-simple-open'></i>"); clk.dataset.cat = ci; clk.setAttribute("role", "button");
      clk.title = "Lock every dim in this category (skip when randomizing)";
      clk.addEventListener("click", function (ev) { ev.stopPropagation(); lockCategory(c, catState(c) !== "all"); });
      head.insertBefore(clk, head.querySelector(".cmb-caret"));
      var wrap = el("div", "cmb-cat-body");
      c.dims.forEach(function (d) {
        var grp = el("div", "cmb-grp"); grp.dataset.k = d.key;
        var lab = el("div", "cmb-lab"); lab.appendChild(el("span", null, d.label));
        // "take me there" — the dim's own jumpSelector (falls back to its
        // markup target's first selector when jumpSelector is missing).
        var jt = JUMP[d.key] || ((d.target || "").split(",")[0].trim());
        var jb = el("button", "cmb-jump", "<i class='ph ph-crosshair'></i>"); jb.title = "Take me there — scroll the stage to it";
        jb.dataset.k = d.key;
        jb.addEventListener("click", function (ev) { ev.stopPropagation(); send({ cmb: "scroll", k: d.key, sel: jt }); });
        lab.appendChild(jb);
        var code = el("code", "cmb-k"); code.setAttribute("data-cur", ""); lab.appendChild(code);
        var lk = el("button", "cmb-lock", "<i class='ph ph-lock-simple-open'></i>"); lk.dataset.k = d.key; lk.title = "Lock (skip when randomizing)";
        lk.addEventListener("click", function (ev) { ev.stopPropagation(); toggleLock(d.key); });
        lab.appendChild(lk);
        grp.appendChild(lab);
        var opts = el("div", "cmb-opts");
        (d.options || []).forEach(function (o) {
          var b = el("button", "cmb-opt", (o.name || "").replace(/-/g, " "));
          b.dataset.k = d.key; b.dataset.v = o.name; if (o.rationale) b.title = o.rationale;
          b.addEventListener("click", function () { choose(d.key, o.name); });
          opts.appendChild(b);
        });
        grp.appendChild(opts);
        wrap.appendChild(grp);
      });
      sec.appendChild(head); sec.appendChild(wrap); body.appendChild(sec);
    });
    dock.querySelector(".cmb-scroll").appendChild(body);
    syncPressed(); syncLocks();
  }
  function choose(k, v) {
    if (isMulti(k)) toggleToken(k, v); else setVal(k, v);
    syncPressed(); persist(); pushCfg();
  }
  function syncPressed() {
    dock.querySelectorAll(".cmb-opt").forEach(function (b) {
      var k = b.dataset.k, v = b.dataset.v, on = isMulti(k) ? hasToken(k, v) : (getVal(k) === v);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    dock.querySelectorAll(".cmb-grp").forEach(function (g) {
      var k = g.dataset.k, cur = g.querySelector("[data-cur]"); if (cur) cur.textContent = isMulti(k) ? (getVal(k) || "·") : getVal(k);
    });
  }

  /* ---- identify / peek (delegated to the stage via postMessage) ---- */
  function setIdentify(on) { idOn = on; document.getElementById("cmb-id-btn").setAttribute("aria-pressed", on ? "true" : "false"); send({ cmb: "identify", on: on }); }

  /* ---- inspect (reverse peek): hover an element in the stage -> jump the dock to its control ---- */
  function setPick(on) { pickOn = on; var b = document.getElementById("cmb-pick-btn"); if (b) b.setAttribute("aria-pressed", on ? "true" : "false"); send({ cmb: "pick", on: on }); if (!on) clearTarget(); }
  function clearTarget() { dock.querySelectorAll(".cmb-grp.cmb-target").forEach(function (g) { g.classList.remove("cmb-target"); }); }
  function focusDim(k) {
    clearTarget(); if (!k) return; var grp = dock.querySelector('.cmb-grp[data-k="' + k + '"]'); if (!grp) return;
    var cat = grp.closest(".cmb-cat"); if (cat) cat.classList.add("open"); grp.scrollIntoView({ block: "center" });
    grp.classList.add("cmb-target"); setTimeout(function () { grp.classList.remove("cmb-target"); }, 1200);
  }

  /* ---- persistence (namespaced to window.CMB.meta.brand) ---- */
  function persist() {
    try { localStorage.setItem(LS, JSON.stringify(currentCfg())); } catch (e) {}
    try { localStorage.setItem(LOCKS, JSON.stringify(Object.keys(locks))); } catch (e) {}
    try {
      var lk = Object.keys(locks), h = "#cfg=" + encodeURIComponent(serialize(currentCfg()));
      if (lk.length) h += "&lock=" + encodeURIComponent(lk.join(","));
      history.replaceState(null, "", h);
    } catch (e) {}
  }
  function loadCfg() {
    var h = location.hash.match(/cfg=([^&]+)/); if (h) return deserialize(decodeURIComponent(h[1]));
    try { var s = localStorage.getItem(LS); if (s) return JSON.parse(s); } catch (e) {} return null;
  }

  /* ---- snapshots ---- */
  function getSnaps() { try { return JSON.parse(localStorage.getItem(SNAPS) || "[]"); } catch (e) { return []; } }
  function setSnaps(a) { try { localStorage.setItem(SNAPS, JSON.stringify(a)); } catch (e) {} renderSnaps(); }
  function saveSnap() {
    var n = prompt("Name this permutation:", "v" + (getSnaps().length + 1)); if (!n) return;
    var a = getSnaps(); a.push({ name: n, cfg: currentCfg(), locks: Object.keys(locks) }); setSnaps(a); toast("Saved “" + n + "”");
  }
  function applySnap(s) { locks = {}; (s.locks || []).forEach(function (k) { if (DIM[k]) locks[k] = true; }); applyAll(s.cfg); syncLocks(); }
  function renderSnaps() {
    var w = document.getElementById("cmb-snaps"); if (!w) return; var a = getSnaps(); w.innerHTML = "";
    if (!a.length) { w.innerHTML = "<p class='cmb-empty'>None yet — tweak, then Save.</p>"; return; }
    a.forEach(function (s, i) {
      var row = el("div", "cmb-snap", "<span>" + s.name + "</span>");
      var load = el("button", "cmb-mini", "Load"); load.onclick = function () { applySnap(s); toast("Loaded “" + s.name + "”"); };
      var cmp = el("button", "cmb-mini", "Compare"); cmp.onclick = function () { openCompare(s.cfg, s.name); };
      var ren = el("button", "cmb-mini", "<i class='ph ph-pencil-simple'></i>"); ren.title = "Rename";
      ren.onclick = function () { var nn = prompt("Rename permutation:", s.name); if (nn == null) return; nn = nn.trim(); if (!nn || nn === s.name) return; var arr = getSnaps(); arr[i].name = nn; setSnaps(arr); toast("Renamed to “" + nn + "”"); };
      var del = el("button", "cmb-mini", "✕"); del.title = "Delete";
      del.onclick = function () { if (!confirm("Delete permutation “" + s.name + "”? This can't be undone.")) return; var arr = getSnaps(); arr.splice(i, 1); setSnaps(arr); toast("Deleted “" + s.name + "”"); };
      row.appendChild(load); row.appendChild(cmp); row.appendChild(ren); row.appendChild(del); w.appendChild(row);
    });
  }

  /* ---- compare (two self-iframes, embed) ---- */
  function openCompare(cfgB, nameB) {
    var ov = el("div", "cmb-compare");
    ov.innerHTML = "<div class='cmb-cmp-bar'><b>Compare</b><span>A current · B " + (nameB || "snapshot") + "</span><button id='cmb-cmp-x'>Close ✕</button></div>";
    var grid = el("div", "cmb-cmp-grid"); grid.appendChild(cmpCol(currentCfg(), "A — current")); grid.appendChild(cmpCol(cfgB, "B — " + (nameB || "snapshot")));
    ov.appendChild(grid); document.body.appendChild(ov);
    document.getElementById("cmb-cmp-x").onclick = function () { ov.remove(); };
  }
  function cmpCol(cfg, label) {
    var c = el("div", "cmb-cmp-col", "<div class='cmb-cmp-lab'>" + label + "</div>");
    var f = el("iframe", "cmb-cmp-if"); f.src = location.pathname + "?embed=1#cfg=" + encodeURIComponent(serialize(cfg)); c.appendChild(f); return c;
  }

  /* ---- viewport ---- */
  function setViewport(w) {
    document.getElementById("cmb-stage-host").dataset.vp = w;
    document.querySelectorAll(".cmb-vp").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.vp === w ? "true" : "false"); });
  }

  /* ---- copy / randomize / reset ---- */
  function copyCfg() {
    var changed = KEYS.filter(function (k) { return getVal(k) !== DEFAULTS[k]; });
    var str = changed.map(function (k) { return 'data-' + k + '="' + getVal(k) + '"'; }).join(" ");
    // markup (M3) picks: a data-* attr alone doesn't carry which section
    // variant was chosen (the swap itself lives in variantRegistry, not on
    // the element), so append a human-readable note per non-default pick.
    var markupNotes = changed.filter(function (k) { var d = DIM[k]; return d && d.mechanism === "markup"; })
      .map(function (k) { return '/* section ' + k + ': variant "' + getVal(k) + '" (swap markup) */'; });
    if (markupNotes.length) str = (str ? str + "\n" : "") + markupNotes.join("\n");
    var ta = el("textarea"); ta.value = str || "(all defaults)"; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast("Config copied"); } catch (e) { toast("Copy failed"); } ta.remove();
  }
  function randomize() {
    if (allLocked()) { toast("All locked — nothing to randomize"); return; }
    KEYS.forEach(function (k) {
      if (isLocked(k)) return; var d = DIM[k]; if (!d || !d.options || !d.options.length) return;
      if (isMulti(k)) { state[k] = d.options.filter(function () { return Math.random() > 0.5; }).map(function (o) { return o.name; }).join(" "); }
      else { state[k] = d.options[Math.floor(Math.random() * d.options.length)].name; }
    });
    syncPressed(); persist(); pushCfg(); toast(anyLocked() ? "Randomized the unlocked" : "Randomized");
  }
  function reset() { applyAll(DEFAULTS); toast("Reset to landing default"); }

  /* ---- toast ---- */
  var toastEl = el("div", "cmb-toast"); var tt;
  function toast(m) { document.body.appendChild(toastEl); toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { toastEl.classList.remove("show"); }, 1500); }

  /* ---- stage iframe boot ---- */
  function buildStage() {
    var host = document.getElementById("cmb-stage-host");
    var startCfg = loadCfg(); if (startCfg) KEYS.forEach(function (k) { if (startCfg[k] != null) state[k] = startCfg[k]; });
    frame = el("iframe", "cmb-frame"); frame.id = "cmb-frame";
    frame.src = location.pathname + "?embed=1#cfg=" + encodeURIComponent(serialize(state));
    frame.addEventListener("load", function () { frameReady = true; pushCfg(); if (idOn) send({ cmb: "identify", on: true }); });
    addEventListener("message", function (e) { if (e.data && e.data.cmb === "ready") { pushCfg(); if (idOn) send({ cmb: "identify", on: true }); } });
    host.appendChild(frame);
    syncPressed();
  }

  function bind(id, fn) { var e = document.getElementById(id); if (e) e.addEventListener("click", fn); }
  function boot() {
    loadLocks();
    buildChrome();
    buildStage(); renderDock(); renderSnaps();
    bind("cmb-rand", randomize); bind("cmb-reset", reset); bind("cmb-copy", copyCfg); bind("cmb-save", saveSnap);
    // Lock-all / Unlock-all toggle, next to Randomize
    var rb = document.getElementById("cmb-rand");
    if (rb) {
      var la = el("button", null, "<i class='ph ph-lock-simple-open'></i> Lock all"); la.id = "cmb-lockall";
      la.title = "Lock / unlock every dimension (locked dims are skipped by Randomize)";
      la.addEventListener("click", function () { lockAll(!anyLocked()); });
      rb.parentNode.insertBefore(la, rb.nextSibling); syncLocks();
    }
    document.getElementById("cmb-id-btn").addEventListener("click", function () { setIdentify(!idOn); });
    // inject the Inspect (reverse-peek) toggle next to Identify
    var idb = document.getElementById("cmb-id-btn");
    var pickBtn = el("button", null, "<i class='ph ph-cursor-click'></i> Inspect"); pickBtn.id = "cmb-pick-btn";
    pickBtn.setAttribute("aria-pressed", "false"); pickBtn.title = "Inspect: click an element on the page to jump to its control (P)";
    idb.parentNode.insertBefore(pickBtn, idb.nextSibling);
    pickBtn.addEventListener("click", function () { setPick(!pickOn); });
    // collapse / expand all dock sections
    var colBtn = el("button", null, "<i class='ph ph-arrows-in-line-vertical'></i> Collapse"); colBtn.id = "cmb-collapse";
    colBtn.title = "Collapse / expand all sections"; pickBtn.parentNode.insertBefore(colBtn, pickBtn.nextSibling);
    colBtn.addEventListener("click", function () {
      var anyOpen = dock.querySelector(".cmb-cat.open");
      dock.querySelectorAll(".cmb-cat").forEach(function (c) { c.classList.toggle("open", !anyOpen); });
      colBtn.innerHTML = anyOpen ? "<i class='ph ph-arrows-out-line-vertical'></i> Expand" : "<i class='ph ph-arrows-in-line-vertical'></i> Collapse";
    });
    addEventListener("message", function (e) { if (e.data && e.data.cmb === "picked") focusDim(e.data.k); });
    document.querySelectorAll(".cmb-vp").forEach(function (b) { b.addEventListener("click", function () { setViewport(b.dataset.vp); }); });
    // make View + Saved permutations collapsible
    (function () {
      var vps = document.querySelector(".cmb-vps"), vlab = vps && vps.querySelector(".cmb-vps-lab");
      if (vlab) { vlab.insertAdjacentHTML("beforeend", " <i class='ph ph-caret-down cmb-caret'></i>"); vlab.addEventListener("click", function () { vps.classList.toggle("cmb-collapsed"); }); }
      var sw = document.querySelector(".cmb-snaps-wrap"), sh = sw && sw.querySelector(".cmb-subh");
      if (sh) { sh.insertAdjacentHTML("beforeend", " <i class='ph ph-caret-down cmb-caret'></i>"); sh.addEventListener("click", function () { sw.classList.toggle("cmb-collapsed"); }); }
    })();
    document.getElementById("cmb-fab").addEventListener("click", function () { document.body.classList.toggle("cmb-dock-hidden"); });
    // collapse the whole sidebar from a header button (FAB brings it back)
    var hide = el("button", null, "<i class='ph ph-caret-double-right'></i>"); hide.id = "cmb-hide"; hide.title = "Hide controls (\\)";
    var titleEl = document.querySelector(".cmb-title"); if (titleEl) { titleEl.appendChild(hide); hide.addEventListener("click", function () { document.body.classList.add("cmb-dock-hidden"); }); }
    addEventListener("keydown", function (e) {
      if (/input|textarea/i.test((e.target.tagName || ""))) return; var k = e.key.toLowerCase();
      if (k === "l") setIdentify(!idOn); else if (k === "p") setPick(!pickOn); else if (k === "r" && !e.metaKey && !e.ctrlKey) randomize(); else if (k === "\\") document.body.classList.toggle("cmb-dock-hidden"); else if (k === "0") reset();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();

  // extend (never replace) window.CMB — combinator.data.js's meta/dims/etc.
  // stay intact; only attach the runtime hooks callers might want to poke.
  CMB.apply = applyAll; CMB.reset = reset;
})();
