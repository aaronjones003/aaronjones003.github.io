#!/bin/bash
# Manual deployment script for aaronjones003.github.io
# Uses direct git push to gh-pages branch instead of gh-pages npm package
# which has HTTP 400 errors

set -e

echo "Building site..."
npm run build

echo "Checking out gh-pages branch..."
git checkout gh-pages

echo "Copying built files..."
# Copy everything from dist/ to root of gh-pages
rsync -av --delete dist/ . --exclude=.git --exclude=node_modules

echo "Committing changes..."
git add -A
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"

echo "Pushing to gh-pages..."
git push origin gh-pages

echo "Returning to main branch..."
git checkout main

echo "✓ Deployment complete!"
echo "Site will be live at https://onigiri.zone in a few minutes"
