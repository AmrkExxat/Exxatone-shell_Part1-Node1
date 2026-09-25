#!/bin/bash
set -e

PUBLISHED_VERSION=$(jq -r .version package.json)
MERGE_COMMIT="$BUILD_SOURCEVERSION"

echo "Published version : $PUBLISHED_VERSION"
echo "Merge commit      : $MERGE_COMMIT"

# Find the PR that was merged to trigger this build using the merge commit SHA
echo "Looking up PR associated with commit $MERGE_COMMIT..."
PR_JSON=$(curl -sf \
  -H "Authorization: Bearer $SYSTEM_ACCESSTOKEN" \
  "${AZURE_DEVOPS_ORG_URL}${AZURE_DEVOPS_PROJECT}/_apis/git/repositories/${BUILD_REPOSITORY_ID}/commits/${MERGE_COMMIT}/pullRequests?api-version=7.1") \
  || { echo "Warning: could not query PRs. Skipping notification."; exit 0; }

PR_ID=$(echo "$PR_JSON" | jq -r '.value[0].pullRequestId // empty')

if [ -z "$PR_ID" ]; then
  echo "No associated PR found for this commit. Skipping notification."
  exit 0
fi

echo "Found PR #$PR_ID. Posting published notification..."
COMMENT="✅ **Version \`$PUBLISHED_VERSION\`** has been successfully published to the feed!"
PAYLOAD=$(jq -n --arg msg "$COMMENT" \
  '{comments: [{parentCommentId: 0, content: $msg, commentType: 1}], status: "closed"}')
curl -sf \
  -X POST \
  -H "Authorization: Bearer $SYSTEM_ACCESSTOKEN" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  "${AZURE_DEVOPS_ORG_URL}${AZURE_DEVOPS_PROJECT}/_apis/git/repositories/${BUILD_REPOSITORY_ID}/pullRequests/${PR_ID}/threads?api-version=7.1" \
  || echo "Warning: could not post PR comment"

echo "Notification posted on PR #$PR_ID."
