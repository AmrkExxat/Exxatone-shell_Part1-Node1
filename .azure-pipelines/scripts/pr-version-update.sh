#!/bin/bash
set -e

SOURCE_BRANCH=${PR_SOURCE_BRANCH##refs/heads/}
TARGET_BRANCH=${PR_TARGET_BRANCH##refs/heads/}

echo "Source branch : $SOURCE_BRANCH"
echo "Target branch : $TARGET_BRANCH"
echo "PR ID         : $PR_ID"

# Configure Git
git config --global user.email "$GIT_USER_EMAIL"
git config --global user.name "$GIT_USER_NAME"
git remote set-url origin https://$SYSTEM_ACCESSTOKEN@dev.azure.com/exxat-team/Exxat-UI/_git/Exxat-UI

# Read release type from PR description tag: [Minor] / [Major]
# Defaults to Patch if no tag is present.
echo "Reading release type from PR description..."
PR_JSON=$(curl -sf \
  -H "Authorization: Bearer $SYSTEM_ACCESSTOKEN" \
  "${AZURE_DEVOPS_ORG_URL}${AZURE_DEVOPS_PROJECT}/_apis/git/repositories/${BUILD_REPOSITORY_ID}/pullrequests/${PR_ID}?api-version=7.1")
PR_DESCRIPTION=$(echo "$PR_JSON" | jq -r '.description // ""')

RELEASE_TYPE="Patch"
if echo "$PR_DESCRIPTION" | grep -qi -- '- \[x\] \[Major\]'; then
  RELEASE_TYPE="Major"
elif echo "$PR_DESCRIPTION" | grep -qi -- '- \[x\] \[Minor\]'; then
  RELEASE_TYPE="Minor"
fi

echo "Release type  : $RELEASE_TYPE"

git fetch origin "$TARGET_BRANCH"
git fetch origin "$SOURCE_BRANCH"

# Strip -beta suffix (dev builds) to get the base semver for comparison
strip_suffix() {
  echo "$1" | sed 's/-beta//'
}

# Returns 0 (true) if $1 is strictly greater than $2 in semver order
semver_gt() {
  local higher
  higher=$(printf '%s\n' "$1" "$2" | sort -V | tail -1)
  [ "$higher" == "$1" ] && [ "$1" != "$2" ]
}

TARGET_VERSION=$(git show "origin/$TARGET_BRANCH:package.json" | jq -r .version)
TARGET_VERSION_CLEAN=$(strip_suffix "$TARGET_VERSION")

SOURCE_VERSION=$(git show "origin/$SOURCE_BRANCH:package.json" | jq -r .version)
SOURCE_VERSION_CLEAN=$(strip_suffix "$SOURCE_VERSION")

echo "Target version (clean) : $TARGET_VERSION_CLEAN"
echo "Source version (clean) : $SOURCE_VERSION_CLEAN"

# Skip if this branch was already bumped ahead of the target
if semver_gt "$SOURCE_VERSION_CLEAN" "$TARGET_VERSION_CLEAN"; then
  echo "Source branch already bumped ($SOURCE_VERSION_CLEAN > $TARGET_VERSION_CLEAN). Skipping."
  exit 0
fi

# Query all open PRs targeting the same branch.
# Because the environment exclusive lock serialises pipeline runs, by the time
# this pipeline executes the previous one has already pushed its version bump,
# so the API will return the correct latest version for every sibling PR branch.
echo "Querying open PRs targeting '$TARGET_BRANCH'..."
PRS_JSON=$(curl -sf \
  -H "Authorization: Bearer $SYSTEM_ACCESSTOKEN" \
  -H "Content-Type: application/json" \
  "${AZURE_DEVOPS_ORG_URL}${AZURE_DEVOPS_PROJECT}/_apis/git/repositories/${BUILD_REPOSITORY_ID}/pullrequests?searchCriteria.targetRefName=refs/heads/${TARGET_BRANCH}&searchCriteria.status=active&api-version=7.1")

PR_SOURCE_BRANCHES=$(echo "$PRS_JSON" | jq -r '.value[].sourceRefName' | sed 's|refs/heads/||')

# Find the highest version across the target branch and all sibling PR branches
MAX_VERSION="$TARGET_VERSION_CLEAN"

for branch in $PR_SOURCE_BRANCHES; do
  [ "$branch" == "$SOURCE_BRANCH" ] && continue
  git fetch origin "$branch" 2>/dev/null || { echo "Could not fetch '$branch', skipping."; continue; }
  BRANCH_VERSION=$(git show "origin/$branch:package.json" 2>/dev/null | jq -r .version 2>/dev/null || echo "")
  [ -z "$BRANCH_VERSION" ] && continue
  BRANCH_VERSION_CLEAN=$(strip_suffix "$BRANCH_VERSION")
  echo "  PR branch '$branch' : $BRANCH_VERSION_CLEAN"
  if semver_gt "$BRANCH_VERSION_CLEAN" "$MAX_VERSION"; then
    MAX_VERSION="$BRANCH_VERSION_CLEAN"
  fi
done

echo "Bumping from max version: $MAX_VERSION"

IFS='.' read -r MAJOR MINOR PATCH <<< "$MAX_VERSION"

if [ "$RELEASE_TYPE" == "Patch" ]; then
  PATCH=$((PATCH + 1))
elif [ "$RELEASE_TYPE" == "Minor" ]; then
  MINOR=$((MINOR + 1))
  PATCH=0
elif [ "$RELEASE_TYPE" == "Major" ]; then
  MAJOR=$((MAJOR + 1))
  MINOR=0
  PATCH=0
fi

NEW_VERSION="$MAJOR.$MINOR.$PATCH"

if [ "$TARGET_BRANCH" == "dev" ]; then
  NEW_VERSION="$NEW_VERSION-beta"
fi

echo "New version: $NEW_VERSION"

# Checkout the PR source branch and apply changes
git checkout -B "$SOURCE_BRANCH" "origin/$SOURCE_BRANCH"

jq --arg v "$NEW_VERSION" '.version = $v' package.json > temp.json && mv temp.json package.json
jq --arg v "$NEW_VERSION" '.version = $v | .packages[""].version = $v' package-lock.json > temp-lock.json && mv temp-lock.json package-lock.json

# [skip ci] prevents this commit from re-triggering the PR pipeline
git add package.json package-lock.json
git commit -m "chore: bump version to $NEW_VERSION [skip ci]" || echo "Nothing to commit"
git push origin "$SOURCE_BRANCH"

echo "Done. Version $NEW_VERSION pushed to $SOURCE_BRANCH."

# Post a comment on the PR so the developer knows what version will be published
echo "Posting version comment on PR #$PR_ID..."
COMMENT="📦 **Version \`$NEW_VERSION\`** has been assigned to this PR and will be published once it is merged and the build pipeline completes."
PAYLOAD=$(jq -n --arg msg "$COMMENT" \
  '{comments: [{parentCommentId: 0, content: $msg, commentType: 1}], status: "closed"}')
curl -sf \
  -X POST \
  -H "Authorization: Bearer $SYSTEM_ACCESSTOKEN" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  "${AZURE_DEVOPS_ORG_URL}${AZURE_DEVOPS_PROJECT}/_apis/git/repositories/${BUILD_REPOSITORY_ID}/pullRequests/${PR_ID}/threads?api-version=7.1" \
  || echo "Warning: could not post PR comment"
