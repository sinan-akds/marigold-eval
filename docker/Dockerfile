# Hermetic image for the Marigold UI-generation eval.
# Bakes the full toolchain (Node, pnpm, Claude Code CLI, the built marigold
# validate tool with its real dependency closure, Chromium) + the test-app.
# The eval repo itself (code + configs + results) is bind-mounted at runtime so
# results persist to the host and configs stay editable without a rebuild.
#
# Runs as the non-root `node` user (uid 1000): Claude Code refuses
# --dangerously-skip-permissions as root, and uid 1000 matches the host owner of
# the bind-mounted eval repo so results stay writable.
FROM node:22-bookworm

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
 && apt-get install -y --no-install-recommends jq git ca-certificates curl \
 && rm -rf /var/lib/apt/lists/*

# pnpm (pinned) + Claude Code CLI, both installed globally to /usr/local (world-
# executable) as root so the non-root `node` user can run them. Claude's
# root/sudo guard keys on the RUNNING uid (node, 1000), not the install path.
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate \
 && npm i -g @anthropic-ai/claude-code

# Shared, world-readable browser path so both the validate render harness and
# the @playwright/mcp browser resolve the same Chromium as the non-root user.
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# --- Validate toolchain: self-contained deploys of validate + its sibling cli
#     (real node_modules, exact @marigold closure + playwright + render harness)
#     produced on the host by build.sh, plus the theme. validate resolves the
#     cli as <validatePackage>/../cli, so they must stay siblings. ---
# node-owned: the render harness (Vite) writes a cache under the cli package's
# node_modules at run time, so the non-root user needs write access here.
COPY --chown=node:node marigold/   /opt/marigold/
COPY theme-rui/  /opt/theme-rui/
ENV MARIGOLD_VALIDATE_PKG=/opt/marigold/validate
ENV MARIGOLD_THEME_PATH=/opt/theme-rui

# Provide a `marigold` command on PATH so the agent can run
# `marigold validate src/TestApp.tsx` exactly as the system prompt instructs.
# Without it the agent gets "command not found" and has to discover the raw
# node invocation itself. Points at the @marigold/cli binary — the single
# source of truth that the scoring also uses, so agent feedback and measurement
# apply the same checks and severities (a11y findings are warnings).
RUN printf '%s\n' \
      '#!/usr/bin/env bash' \
      'exec node /opt/marigold/cli/dist/bin/marigold.mjs "$@"' \
      > /usr/local/bin/marigold \
 && chmod +x /usr/local/bin/marigold

# Chromium + OS deps matching the bundled playwright (1.58.2), installed to the
# shared path and made world-readable for the node user.
RUN cd /opt/marigold/cli \
 && npx playwright install --with-deps chromium \
 && chmod -R a+rX /ms-playwright

# --- Test-app baked in with its own installed deps (published @marigold) ---
# The eval harness creates a git worktree off this app per run, so it must be a
# git repo. Init + commit BEFORE installing deps so node_modules stays
# untracked. Owned by node so the non-root user can write .git/worktrees.
COPY --chown=node:node test-app/ /work/test-app/
USER node
RUN cd /work/test-app \
 && git init -q \
 && git -c user.email=eval@local -c user.name=eval add -A \
 && git -c user.email=eval@local -c user.name=eval commit -qm "eval base" \
 && pnpm install --frozen-lockfile
ENV MARIGOLD_PROJECT_DIR=/work/test-app

# Pre-warm the @playwright/mcp browser used by mcp-stack/full-stack runs
RUN npx -y @playwright/mcp@0.0.75 --help >/dev/null 2>&1 || true

USER root
WORKDIR /work/eval
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
USER node
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
