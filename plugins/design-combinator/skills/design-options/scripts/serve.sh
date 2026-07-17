#!/usr/bin/env bash
# serve.sh <dir> — serve <dir> over http on a free port, in the background, and print the URL.
#
# Usage:
#   bash serve.sh <dir>
#
# Why this exists (screenshot gotcha #1): file:// URLs are blocked for playwright-cli
# screenshots and behave inconsistently for relative asset paths (css/img/font). Always
# serve over http instead of opening files directly.
set -euo pipefail

DIR="${1:-}"
if [ -z "$DIR" ]; then
  echo "usage: serve.sh <dir>" >&2
  exit 1
fi
if [ ! -d "$DIR" ]; then
  echo "error: not a directory: $DIR" >&2
  exit 1
fi

# Find a free port by asking the OS for an ephemeral one, then double-checking it's free.
find_free_port() {
  python3 - <<'PY' 2>/dev/null || true
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(("127.0.0.1", 0))
print(s.getsockname()[1])
s.close()
PY
}

PORT="$(find_free_port)"
if [ -z "$PORT" ]; then
  # Fallback: pick a pseudo-random port in the high range and hope for the best.
  PORT=$(( (RANDOM % 20000) + 20000 ))
fi

LOGFILE="$(mktemp -t design-options-serve.XXXXXX.log)"

# Launch via `( cd DIR && exec nohup <server> ) &` — the `exec` replaces the
# subshell's own process image instead of forking a child under it, so the PID
# bash hands back via $! is the actual server process's PID (not a wrapper's).
if command -v python3 >/dev/null 2>&1; then
  ( cd "$DIR" && exec nohup python3 -m http.server "$PORT" --bind 127.0.0.1 >"$LOGFILE" 2>&1 ) &
  SERVER_PID=$!
elif command -v npx >/dev/null 2>&1; then
  ( cd "$DIR" && exec nohup npx --yes http-server -p "$PORT" -a 127.0.0.1 -c-1 >"$LOGFILE" 2>&1 ) &
  SERVER_PID=$!
else
  echo "error: neither python3 nor npx is available to serve files" >&2
  exit 1
fi
disown "$SERVER_PID" 2>/dev/null || true

# Give the server a moment to bind, then verify.
for _ in 1 2 3 4 5 6 7 8 9 10; do
  if command -v curl >/dev/null 2>&1; then
    if curl -s -o /dev/null -m 1 "http://127.0.0.1:${PORT}/"; then
      break
    fi
  fi
  sleep 0.3
done

echo "Serving ${DIR} at: http://127.0.0.1:${PORT}/"
echo "PID: ${SERVER_PID}  (log: ${LOGFILE})"
echo "Kill it with: kill ${SERVER_PID}"
