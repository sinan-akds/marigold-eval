# Hermetic image for the eval.
# Bakes the toolchain (Node, pnpm, Claude Code, the built validate tool, Chromium) and the test-app.
# The eval repo is bind-mounted at runtime so results persist and configs stay editable.
# Runs as non-root node (uid 1000), because Claude Code refuses --dangerously-skip-permissions as root.
FROM node:22-bookworm

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
 && apt-get install -y --no-install-recommends jq git ca-certificates curl \
 && rm -rf /var/lib/apt/lists/*

# pnpm and Claude Code installed globally so the non-root node user can run them
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate \
 && npm i -g @anthropic-ai/claude-code

# shared browser path so the render harness and the playwright MCP use the same Chromium
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# self-contained deploys of validate and its sibling cli (built on the host by build.sh) plus the theme
# validate resolves cli as ../cli so they stay siblings. node-owned because the render harness writes a cache here
COPY --chown=node:node marigold/   /opt/marigold/
COPY theme-rui/  /opt/theme-rui/
ENV MARIGOLD_VALIDATE_PKG=/opt/marigold/validate
ENV MARIGOLD_THEME_PATH=/opt/theme-rui

# provide a `marigold` command on PATH so the agent can run `marigold validate` as the system prompt instructs
# points at @marigold/cli, the same tool the scoring uses
RUN printf '%s\n' \
      '#!/usr/bin/env bash' \
      'exec node /opt/marigold/cli/dist/bin/marigold.mjs "$@"' \
      > /usr/local/bin/marigold \
 && chmod +x /usr/local/bin/marigold

# Chromium matching the bundled playwright, world-readable for the node user
RUN cd /opt/marigold/cli \
 && npx playwright install --with-deps chromium \
 && chmod -R a+rX /ms-playwright

# test-app baked in with installed deps. the harness creates a git worktree per run,
# so init and commit before installing so node_modules stays untracked
COPY --chown=node:node test-app/ /work/test-app/
USER node
RUN cd /work/test-app \
 && git init -q \
 && git -c user.email=eval@local -c user.name=eval add -A \
 && git -c user.email=eval@local -c user.name=eval commit -qm "eval base" \
 && pnpm install --frozen-lockfile
ENV MARIGOLD_PROJECT_DIR=/work/test-app

# pre-warm the playwright MCP browser used by mcp-stack and full-stack runs
RUN npx -y @playwright/mcp@0.0.75 --help >/dev/null 2>&1 || true

USER root
WORKDIR /work/eval
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
USER node
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
