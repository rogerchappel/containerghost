# ContainerGhost Orchestration

ContainerGhost is intentionally simple to operate:

1. Run `npm install` once in a clean checkout.
2. Use `npm run build` to compile the CLI.
3. Use `containerghost scan <path>` for reviewable Markdown/JSON evidence.
4. Use `containerghost check <path> --fail-on ...` in CI or agent gates.
5. Run `bash scripts/validate.sh` before publishing changes.

No network calls, hosted control plane, or hidden state are required.
