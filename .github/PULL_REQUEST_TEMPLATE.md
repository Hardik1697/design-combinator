<!-- Thanks for contributing! Keep PRs focused — one change per PR is easiest to review. -->

## What this changes

<!-- One or two sentences. If it addresses an issue, link it: Closes #123 -->

## Type

- [ ] Bug fix
- [ ] New dimension / capability
- [ ] Docs
- [ ] Other

## Checklist

- [ ] I ran the test loop on a real page — generated a config, ran `gen.mjs`, served with `serve.sh`, and confirmed the change works live in a browser with no console errors
- [ ] If I touched the engine or schema: `config.example.json` still validates and `gen.mjs` still runs
- [ ] No absolute paths (`~/.claude/...`, `/home/...`) and no private/business names introduced — everything stays generic and plugin-portable
- [ ] I updated the relevant docs (`references/*`, README) if behavior changed

## Notes for the reviewer

<!-- Tradeoffs, screenshots of the dock, anything you want a second look at -->
