#!/bin/bash

# NPM Deployment Script for Lark Dashboard SDK
# This script publishes the package to npm

set -e

echo "========================================"
echo "NPM Deployment"
echo "========================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get package info
PACKAGE_NAME=$(node -p "require('./package.json').name")
VERSION=$(node -p "require('./package.json').version")

echo -e "${BLUE}Package:${NC} $PACKAGE_NAME"
echo -e "${BLUE}Version:${NC} $VERSION"
echo ""

# Confirmation prompt
echo -e "${YELLOW}You are about to publish to npm.${NC}"
echo "This action cannot be undone."
echo ""
read -p "Do you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "Step 1: Clean build"
echo "------------------"

# Clean previous build
if [ -d "dist" ]; then
    rm -rf dist
    echo "Cleaned dist directory"
fi

echo ""
echo "Step 2: Fresh install"
echo "--------------------"

# Fresh install dependencies
rm -rf node_modules
npm install
echo "Dependencies installed"

echo ""
echo "Step 3: Run tests"
echo "----------------"

# Run tests
npm test
echo -e "${GREEN}✓${NC} Tests passed"

echo ""
echo "Step 4: Build"
echo "------------"

# Build the project
npm run build
echo -e "${GREEN}✓${NC} Build complete"

echo ""
echo "Step 5: Verify build output"
echo "--------------------------"

# Check key files exist
REQUIRED_FILES=(
    "dist/index.js"
    "dist/index.d.ts"
    "dist/mcp-server.js"
    "README.md"
    "LICENSE"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file not found"
        exit 1
    fi
done

echo ""
echo "Step 6: Pack and verify"
echo "----------------------"

# Create tarball
npm pack

TARBALL="${PACKAGE_NAME//@/-}-${VERSION}.tgz"
TARBALL="${TARBALL//\//-}"

if [ -f "$TARBALL" ]; then
    TARBALL_SIZE=$(du -h "$TARBALL" | cut -f1)
    echo -e "${GREEN}✓${NC} Package created: $TARBALL ($TARBALL_SIZE)"

    # List contents
    echo ""
    echo "Package contents:"
    tar -tzf "$TARBALL" | head -20
    echo ""

    # Show full contents count
    FILE_COUNT=$(tar -tzf "$TARBALL" | wc -l)
    echo "Total files in package: $FILE_COUNT"
else
    echo -e "${RED}✗${NC} Failed to create package"
    exit 1
fi

echo ""
echo "Step 7: Final confirmation"
echo "-------------------------"

echo ""
echo -e "${YELLOW}Ready to publish!${NC}"
echo ""
echo "Package: $PACKAGE_NAME"
echo "Version: $VERSION"
echo "Size: $TARBALL_SIZE"
echo ""
read -p "Proceed with npm publish? (yes/no): " FINAL_CONFIRM

if [ "$FINAL_CONFIRM" != "yes" ]; then
    echo "Deployment cancelled."
    rm "$TARBALL"
    exit 0
fi

echo ""
echo "Step 8: Publishing to npm"
echo "------------------------"

# Publish to npm
npm publish --access public

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}========================================"
    echo "✓ Successfully published to npm!"
    echo "========================================${NC}"
    echo ""
    echo "Package: $PACKAGE_NAME"
    echo "Version: $VERSION"
    echo ""
    echo "View on npm:"
    echo "https://www.npmjs.com/package/$PACKAGE_NAME"
    echo ""
    echo "Install with:"
    echo "npm install $PACKAGE_NAME"
    echo ""

    # Clean up tarball
    rm "$TARBALL"

    # Create git tag
    echo "Step 9: Creating git tag"
    echo "-----------------------"

    TAG="v$VERSION"
    git tag -a "$TAG" -m "Release $VERSION"
    echo -e "${GREEN}✓${NC} Created git tag: $TAG"

    echo ""
    echo "Next steps:"
    echo "1. Push git tag: git push origin $TAG"
    echo "2. Create GitHub release: ./scripts/deploy-github.sh"
    echo "3. Verify installation: npm install -g $PACKAGE_NAME"
    echo ""

else
    echo ""
    echo -e "${RED}✗ npm publish failed${NC}"
    echo ""
    echo "Common issues:"
    echo "- Version already published (update version in package.json)"
    echo "- Not authenticated (run: npm login)"
    echo "- Network issues (check connection)"
    echo ""

    # Clean up tarball
    rm "$TARBALL"

    exit 1
fi
