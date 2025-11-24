#!/bin/bash

# GitHub Release Script for Lark Dashboard SDK
# This script creates a GitHub release

set -e

echo "========================================"
echo "GitHub Release Deployment"
echo "========================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get package info
VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME=$(node -p "require('./package.json').name")
TAG="v$VERSION"

echo -e "${BLUE}Version:${NC} $VERSION"
echo -e "${BLUE}Tag:${NC} $TAG"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}✗ GitHub CLI (gh) not found${NC}"
    echo ""
    echo "Please install GitHub CLI:"
    echo "  macOS: brew install gh"
    echo "  Linux: https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
    echo "  Windows: https://github.com/cli/cli/releases"
    echo ""
    echo "Then authenticate: gh auth login"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}✗ Not authenticated with GitHub${NC}"
    echo ""
    echo "Please authenticate: gh auth login"
    exit 1
fi

echo -e "${GREEN}✓${NC} GitHub CLI authenticated"
echo ""

# Check if tag exists
if ! git rev-parse "$TAG" &> /dev/null; then
    echo -e "${YELLOW}Tag $TAG does not exist. Creating...${NC}"
    git tag -a "$TAG" -m "Release $VERSION"
    echo -e "${GREEN}✓${NC} Created tag: $TAG"
fi

# Push tag if not pushed
if ! git ls-remote --tags origin | grep -q "$TAG"; then
    echo "Pushing tag to origin..."
    git push origin "$TAG"
    echo -e "${GREEN}✓${NC} Tag pushed to origin"
else
    echo -e "${GREEN}✓${NC} Tag already on origin"
fi

echo ""
echo "Step 1: Generate release notes"
echo "------------------------------"

# Extract changelog for this version
RELEASE_NOTES_FILE="/tmp/release-notes-$VERSION.md"

# Check if CHANGELOG.md exists
if [ -f "CHANGELOG.md" ]; then
    # Try to extract section for this version
    awk "/## \[$VERSION\]/,/## \[/" CHANGELOG.md | head -n -1 > "$RELEASE_NOTES_FILE"

    # If empty, use a default message
    if [ ! -s "$RELEASE_NOTES_FILE" ]; then
        cat > "$RELEASE_NOTES_FILE" << EOF
# Release $VERSION

## Installation

\`\`\`bash
npm install $PACKAGE_NAME
\`\`\`

## What's New

See [CHANGELOG.md](CHANGELOG.md) for details.

## Documentation

- [API Documentation](API.md)
- [Quick Start Guide](QUICK_START.md)
- [Deployment Guide](DEPLOYMENT.md)

## MCP Server

This release includes the Lark Dashboard MCP server for Claude Code integration.

\`\`\`bash
npx lark-dashboard-mcp
\`\`\`

## Links

- [npm Package](https://www.npmjs.com/package/$PACKAGE_NAME)
- [Documentation](https://github.com/hypelab/lark-dashboard-sdk#readme)
EOF
    fi
else
    # Create default release notes
    cat > "$RELEASE_NOTES_FILE" << EOF
# Release $VERSION

## Installation

\`\`\`bash
npm install $PACKAGE_NAME
\`\`\`

## Features

- Production-ready TypeScript SDK for Lark/Feishu dashboards
- Fluent builder API for creating dashboards, views, and blocks
- Built-in MCP server for Claude Code integration
- Comprehensive type definitions
- Full test coverage

## MCP Server

\`\`\`bash
npx lark-dashboard-mcp
\`\`\`

## Links

- [npm Package](https://www.npmjs.com/package/$PACKAGE_NAME)
- [Documentation](https://github.com/hypelab/lark-dashboard-sdk#readme)
EOF
fi

echo "Release notes prepared:"
echo "----------------------"
cat "$RELEASE_NOTES_FILE"
echo "----------------------"
echo ""

# Confirmation
read -p "Create GitHub release? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Release cancelled."
    rm "$RELEASE_NOTES_FILE"
    exit 0
fi

echo ""
echo "Step 2: Creating GitHub release"
echo "-------------------------------"

# Create release
gh release create "$TAG" \
    --title "Release $VERSION" \
    --notes-file "$RELEASE_NOTES_FILE" \
    --verify-tag

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================"
    echo "✓ GitHub release created successfully!"
    echo "========================================${NC}"
    echo ""
    echo "Release: $TAG"
    echo ""
    echo "View release:"
    echo "https://github.com/hypelab/lark-dashboard-sdk/releases/tag/$TAG"
    echo ""

    # Clean up
    rm "$RELEASE_NOTES_FILE"

    echo "Step 3: Post-release tasks"
    echo "-------------------------"
    echo ""
    echo "Recommended next steps:"
    echo "1. Verify npm package: npm view $PACKAGE_NAME"
    echo "2. Test installation: npm install -g $PACKAGE_NAME"
    echo "3. Update documentation if needed"
    echo "4. Announce release on social media"
    echo "5. Monitor for issues: https://github.com/hypelab/lark-dashboard-sdk/issues"
    echo ""

else
    echo ""
    echo -e "${RED}✗ Failed to create GitHub release${NC}"
    echo ""
    rm "$RELEASE_NOTES_FILE"
    exit 1
fi
