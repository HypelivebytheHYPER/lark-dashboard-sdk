#!/bin/bash

# Rollback Script for Lark Dashboard SDK
# Use this to rollback a problematic release

set -e

echo "========================================"
echo "Deployment Rollback"
echo "========================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PACKAGE_NAME=$(node -p "require('./package.json').name")
CURRENT_VERSION=$(node -p "require('./package.json').version")

echo -e "${BLUE}Package:${NC} $PACKAGE_NAME"
echo -e "${BLUE}Current Version:${NC} $CURRENT_VERSION"
echo ""

# Warning
echo -e "${RED}WARNING: This will attempt to rollback the current release${NC}"
echo ""
echo "This script will:"
echo "1. Deprecate the current version on npm"
echo "2. Delete the GitHub release"
echo "3. Delete the git tag"
echo ""

# Get version to rollback
read -p "Which version do you want to rollback? (default: $CURRENT_VERSION): " ROLLBACK_VERSION
ROLLBACK_VERSION=${ROLLBACK_VERSION:-$CURRENT_VERSION}

TAG="v$ROLLBACK_VERSION"

echo ""
echo "You are about to rollback version: $ROLLBACK_VERSION"
read -p "Are you sure? (type 'ROLLBACK' to confirm): " CONFIRM

if [ "$CONFIRM" != "ROLLBACK" ]; then
    echo "Rollback cancelled."
    exit 0
fi

echo ""
echo "Step 1: Deprecate npm package"
echo "-----------------------------"

# Check if npm authenticated
if ! npm whoami &> /dev/null; then
    echo -e "${RED}✗ Not authenticated with npm${NC}"
    echo "Run: npm login"
    exit 1
fi

# Deprecate the version
read -p "Enter deprecation message: " DEPRECATION_MSG
DEPRECATION_MSG=${DEPRECATION_MSG:-"This version has been deprecated due to issues"}

if npm deprecate "$PACKAGE_NAME@$ROLLBACK_VERSION" "$DEPRECATION_MSG"; then
    echo -e "${GREEN}✓${NC} Version $ROLLBACK_VERSION deprecated on npm"
    echo "   Message: $DEPRECATION_MSG"
else
    echo -e "${RED}✗ Failed to deprecate version${NC}"
    exit 1
fi

echo ""
echo "Step 2: Remove GitHub release"
echo "----------------------------"

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠ GitHub CLI not found, skipping release deletion${NC}"
    echo "Manually delete release at: https://github.com/hypelab/lark-dashboard-sdk/releases/tag/$TAG"
else
    # Check if release exists
    if gh release view "$TAG" &> /dev/null; then
        read -p "Delete GitHub release $TAG? (yes/no): " DELETE_RELEASE
        if [ "$DELETE_RELEASE" == "yes" ]; then
            if gh release delete "$TAG" --yes; then
                echo -e "${GREEN}✓${NC} GitHub release deleted"
            else
                echo -e "${RED}✗ Failed to delete release${NC}"
            fi
        fi
    else
        echo "Release $TAG not found on GitHub"
    fi
fi

echo ""
echo "Step 3: Remove git tag"
echo "---------------------"

# Check if tag exists locally
if git rev-parse "$TAG" &> /dev/null; then
    read -p "Delete local git tag $TAG? (yes/no): " DELETE_LOCAL_TAG
    if [ "$DELETE_LOCAL_TAG" == "yes" ]; then
        git tag -d "$TAG"
        echo -e "${GREEN}✓${NC} Local tag deleted"
    fi
fi

# Check if tag exists on origin
if git ls-remote --tags origin | grep -q "$TAG"; then
    read -p "Delete remote git tag $TAG? (yes/no): " DELETE_REMOTE_TAG
    if [ "$DELETE_REMOTE_TAG" == "yes" ]; then
        git push origin ":refs/tags/$TAG"
        echo -e "${GREEN}✓${NC} Remote tag deleted"
    fi
fi

echo ""
echo "Step 4: Rollback summary"
echo "-----------------------"

echo ""
echo "Rollback actions completed:"
echo "- npm: Version $ROLLBACK_VERSION deprecated"
echo "- GitHub: Release deleted (if confirmed)"
echo "- Git: Tags deleted (if confirmed)"
echo ""

# Show available versions
echo "Available versions on npm:"
npm view $PACKAGE_NAME versions --json | jq -r '.[]' | tail -5

echo ""
echo "Step 5: Next steps"
echo "-----------------"

echo ""
echo "Recommended actions:"
echo ""
echo "1. If you want to unpublish (within 72 hours):"
echo "   npm unpublish $PACKAGE_NAME@$ROLLBACK_VERSION"
echo "   Note: This is only possible within 72 hours of publishing"
echo ""
echo "2. Fix the issues in your code"
echo ""
echo "3. Update version in package.json to a new version"
echo ""
echo "4. Re-deploy with fixed version:"
echo "   ./scripts/pre-deploy.sh"
echo "   ./scripts/deploy-npm.sh"
echo "   ./scripts/deploy-github.sh"
echo ""
echo "5. Communicate the rollback to users:"
echo "   - Create GitHub issue explaining the rollback"
echo "   - Update documentation"
echo "   - Notify users if needed"
echo ""

echo -e "${YELLOW}Important Notes:${NC}"
echo "- Deprecated versions are still installable but show a warning"
echo "- To completely remove, use 'npm unpublish' (only within 72 hours)"
echo "- After 72 hours, deprecated versions cannot be unpublished"
echo "- Users on deprecated version should upgrade to latest"
echo ""
