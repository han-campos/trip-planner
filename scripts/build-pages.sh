#!/usr/bin/env bash
# Build the React app in trip/ and publish the output to the repo root so
# GitHub Pages ("Deploy from a branch" → / (root)) can serve it.
# Run this before committing any change you want to appear on the live site.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root/trip"

npm ci --silent 2>/dev/null || npm install --silent
npm run build

# Replace only the generated files; everything else at the root is left alone.
rm -rf "$repo_root/assets"
cp -R dist/assets "$repo_root/assets"
cp dist/index.html "$repo_root/index.html"
touch "$repo_root/.nojekyll"

echo "Published trip/dist → repo root. Commit index.html, assets/ and .nojekyll."
