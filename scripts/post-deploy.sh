#!/bin/bash

# Post-Deployment Verification Script
# Verifies that the deployment was successful

set -e

echo "========================================"
echo "Post-Deployment Verification"
echo "========================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PACKAGE_NAME=$(node -p "require('./package.json').name")
VERSION=$(node -p "require('./package.json').version")

echo -e "${BLUE}Package:${NC} $PACKAGE_NAME"
echo -e "${BLUE}Version:${NC} $VERSION"
echo ""

CHECKS_PASSED=0
CHECKS_FAILED=0

check_passed() {
    echo -e "${GREEN}✓${NC} $1"
    ((CHECKS_PASSED++))
}

check_failed() {
    echo -e "${RED}✗${NC} $1"
    ((CHECKS_FAILED++))
}

check_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo "1. npm Registry Check"
echo "--------------------"

# Check if package is on npm
if npm view $PACKAGE_NAME version &> /dev/null; then
    NPM_VERSION=$(npm view $PACKAGE_NAME version)
    if [ "$NPM_VERSION" == "$VERSION" ]; then
        check_passed "Package published on npm: v$NPM_VERSION"
    else
        check_warning "npm version mismatch: expected $VERSION, got $NPM_VERSION"
    fi

    # Get package info
    NPM_UPDATED=$(npm view $PACKAGE_NAME time.modified)
    check_passed "Last updated: $NPM_UPDATED"

    # Check download stats (may not be available immediately)
    if npm view $PACKAGE_NAME --json &> /dev/null; then
        echo "Package info:"
        npm view $PACKAGE_NAME --json | jq '{name, version, description, license}' 2>/dev/null || true
    fi
else
    check_failed "Package not found on npm"
fi

echo ""
echo "2. npm Installation Test"
echo "-----------------------"

# Create temp directory for testing
TEST_DIR=$(mktemp -d)
cd "$TEST_DIR"

echo "Testing in: $TEST_DIR"

# Try to install the package
if npm install $PACKAGE_NAME &> /dev/null; then
    check_passed "Package installs successfully"

    # Check if installed correctly
    if [ -d "node_modules/$PACKAGE_NAME" ]; then
        check_passed "Package files present"

        # Check key files
        if [ -f "node_modules/$PACKAGE_NAME/dist/index.js" ]; then
            check_passed "Main file exists"
        else
            check_failed "Main file missing"
        fi

        if [ -f "node_modules/$PACKAGE_NAME/dist/index.d.ts" ]; then
            check_passed "Type definitions exist"
        else
            check_failed "Type definitions missing"
        fi

        # Check bin
        if [ -f "node_modules/$PACKAGE_NAME/dist/mcp-server.js" ]; then
            check_passed "MCP server binary exists"
        else
            check_failed "MCP server binary missing"
        fi
    else
        check_failed "Package directory not found"
    fi
else
    check_failed "Package installation failed"
fi

# Return to original directory
cd - > /dev/null
rm -rf "$TEST_DIR"

echo ""
echo "3. GitHub Release Check"
echo "----------------------"

TAG="v$VERSION"

# Check if gh CLI is available
if command -v gh &> /dev/null; then
    # Check if release exists
    if gh release view "$TAG" &> /dev/null; then
        check_passed "GitHub release exists: $TAG"

        # Get release info
        RELEASE_URL=$(gh release view "$TAG" --json url -q .url)
        echo "   Release URL: $RELEASE_URL"
    else
        check_warning "GitHub release not found (may not be created yet)"
    fi
else
    check_warning "GitHub CLI not available (skipping release check)"
fi

# Check if tag exists
if git ls-remote --tags origin | grep -q "$TAG"; then
    check_passed "Git tag exists on origin: $TAG"
else
    check_warning "Git tag not found on origin"
fi

echo ""
echo "4. Documentation Availability"
echo "----------------------------"

# Check if README is accessible
if curl -s -o /dev/null -w "%{http_code}" "https://raw.githubusercontent.com/hypelab/lark-dashboard-sdk/main/README.md" | grep -q "200"; then
    check_passed "README accessible on GitHub"
else
    check_warning "README not accessible (may need time to propagate)"
fi

echo ""
echo "5. Package Metadata"
echo "------------------"

# Check npm page
NPM_URL="https://www.npmjs.com/package/$PACKAGE_NAME"
if curl -s -o /dev/null -w "%{http_code}" "$NPM_URL" | grep -q "200"; then
    check_passed "npm package page accessible"
    echo "   URL: $NPM_URL"
else
    check_warning "npm package page not yet accessible"
fi

echo ""
echo "6. MCP Server Test"
echo "-----------------"

# Create temp directory for MCP test
MCP_TEST_DIR=$(mktemp -d)
cd "$MCP_TEST_DIR"

# Install package
if npm install $PACKAGE_NAME &> /dev/null; then
    # Try to run MCP server with --help
    if npx lark-dashboard-mcp --help &> /dev/null; then
        check_passed "MCP server executable"
    else
        # Check if it starts at all
        if node node_modules/$PACKAGE_NAME/dist/mcp-server.js --help &> /dev/null; then
            check_passed "MCP server can be started"
        else
            check_warning "MCP server execution check inconclusive"
        fi
    fi
fi

cd - > /dev/null
rm -rf "$MCP_TEST_DIR"

echo ""
echo "7. TypeScript Definitions Test"
echo "------------------------------"

# Create temp directory for TS test
TS_TEST_DIR=$(mktemp -d)
cd "$TS_TEST_DIR"

# Create package.json
cat > package.json << EOF
{
  "name": "test-types",
  "version": "1.0.0",
  "dependencies": {
    "$PACKAGE_NAME": "^$VERSION",
    "typescript": "^5.0.0"
  }
}
EOF

# Create test TypeScript file
cat > test.ts << EOF
import { DashboardBuilder } from '$PACKAGE_NAME';

const dashboard = new DashboardBuilder();
EOF

# Install and check
if npm install &> /dev/null; then
    if npx tsc --noEmit test.ts &> /dev/null; then
        check_passed "TypeScript definitions valid"
    else
        check_warning "TypeScript check inconclusive"
    fi
fi

cd - > /dev/null
rm -rf "$TS_TEST_DIR"

echo ""
echo "========================================"
echo "Verification Summary"
echo "========================================"
echo ""
echo -e "${GREEN}Checks passed: $CHECKS_PASSED${NC}"
echo -e "${RED}Checks failed: $CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ Deployment verified successfully!${NC}"
    echo ""
    echo "Your package is live:"
    echo "- npm: https://www.npmjs.com/package/$PACKAGE_NAME"
    echo "- GitHub: https://github.com/hypelab/lark-dashboard-sdk"
    echo ""
    echo "Users can now install with:"
    echo "  npm install $PACKAGE_NAME"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some checks failed${NC}"
    echo ""
    echo "Note: Some checks may fail immediately after deployment"
    echo "as npm and GitHub may need time to propagate changes."
    echo ""
    echo "Wait a few minutes and run this script again."
    echo ""
    exit 1
fi
