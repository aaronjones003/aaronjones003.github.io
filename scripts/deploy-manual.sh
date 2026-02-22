#!/bin/bash
# Manual deployment script for aaronjones003.github.io
# Uses direct git push to gh-pages branch instead of gh-pages npm package
# which has HTTP 400 errors

set -e

echo "Building site on main branch..."
npm run build

echo "Copying dist to temp location..."
rm -rf /tmp/portfolio-dist
cp -r dist /tmp/portfolio-dist

echo "Checking out gh-pages branch..."
git checkout gh-pages

echo "Copying built files to gh-pages..."
# Copy everything from temp dist/ to root of gh-pages
rsync -av --delete /tmp/portfolio-dist/ . --exclude=.git --exclude=node_modules --exclude=.gitignore

echo "Committing changes..."
git add -A
if git diff --staged --quiet; then
  echo "No changes to commit"
else
  git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "Pushing to gh-pages..."
  git push origin gh-pages
fi

echo "Cleaning up..."
rm -rf /tmp/portfolio-dist

echo "Returning to main branch..."
git checkout main

echo "✓ Deployment complete!"
echo "Site will be live at https://onigiri.zone in a few minutes"
