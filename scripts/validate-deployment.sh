#!/bin/bash
# Validates GitHub Pages deployment
# Checks that the latest pages-build-deployment workflow succeeded

echo "Checking GitHub Pages deployment status..."

# Get the latest workflow run
LATEST_RUN=$(gh run list --repo aaronjones003/aaronjones003.github.io \
  --workflow="pages-build-deployment" \
  --limit 1 \
  --json conclusion,status,createdAt \
  --jq '.[0]')

STATUS=$(echo "$LATEST_RUN" | jq -r '.status')
CONCLUSION=$(echo "$LATEST_RUN" | jq -r '.conclusion')
CREATED=$(echo "$LATEST_RUN" | jq -r '.createdAt')

echo ""
echo "Latest deployment:"
echo "  Time: $CREATED"
echo "  Status: $STATUS"
echo "  Result: $CONCLUSION"
echo ""

if [ "$CONCLUSION" = "success" ]; then
  echo "✓ Deployment successful!"
  exit 0
elif [ "$STATUS" = "in_progress" ]; then
  echo "⏳ Deployment in progress..."
  exit 0
else
  echo "✗ Deployment failed!"
  echo ""
  echo "View logs with:"
  echo "  gh run list --repo aaronjones003/aaronjones003.github.io --limit 5"
  exit 1
fi
