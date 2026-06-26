#!/usr/bin/env bash
# Builds the hermetic eval image. Run from anywhere.
#   docker/build.sh
set -euo pipefail

EVAL_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CTX="$EVAL_ROOT/docker"
MARIGOLD_REPO="${MARIGOLD_REPO:-$HOME/GitHub/reservix/marigold}"
TEST_APP="${TEST_APP:-$HOME/GitHub/private/uni/marigold-test-app}"

echo "==> 1/3  Deploying validate + cli as siblings (self-contained dep closures)..."
# validate shells out to its sibling @marigold/cli (resolved as ../cli), so deploy both side by side
# package-scoped deploy avoids a monorepo-wide build. cached unless FORCE_DEPLOY=1
if [ -n "${FORCE_DEPLOY:-}" ] || [ ! -d "$CTX/marigold/cli/node_modules" ]; then
  rm -rf "$CTX/marigold"
  mkdir -p "$CTX/marigold"
  ( cd "$MARIGOLD_REPO" && pnpm --filter @marigold-ui/validate deploy --prod --legacy "$CTX/marigold/validate" )
  ( cd "$MARIGOLD_REPO" && pnpm --filter @marigold/cli      deploy --prod --legacy "$CTX/marigold/cli" )
  # the cli render harness (dist/harness) is produced by copy-harness, not tsdown
  if [ ! -d "$CTX/marigold/cli/dist/harness" ]; then
    cp -r "$MARIGOLD_REPO/packages/cli/dist/harness" "$CTX/marigold/cli/dist/harness"
  fi
else
  echo "   (cached deploy in $CTX/marigold — set FORCE_DEPLOY=1 to refresh)"
fi
# the isolated cli deploy omits some render deps that resolve via hoisting in the monorepo
# fill them from the validate deploy without clobbering cli's own
cp -rn "$CTX/marigold/validate/node_modules/." "$CTX/marigold/cli/node_modules/" 2>/dev/null || true

echo "==> 2/3  Staging theme + test-app into the build context..."
rm -rf "$CTX/theme-rui" "$CTX/test-app"
cp -r "$MARIGOLD_REPO/themes/theme-rui" "$CTX/theme-rui"
# test-app sources only, node_modules is reinstalled in the image
rsync -a --exclude node_modules --exclude '.git' "$TEST_APP/" "$CTX/test-app/"

echo "==> 3/3  docker build..."
docker build -t marigold-eval:latest "$CTX"

echo "Done. Run with docker/run.sh"
