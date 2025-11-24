#!/bin/bash

# Pre-deployment Checks for Lark Dashboard SDK
# This script performs all necessary checks before deployment

set -e

echo "========================================"
echo "Pre-Deployment Checks"
echo "========================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to report check status
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

echo "1. Environment Checks"
echo "-------------------"

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -ge 16 ]; then
        check_passed "Node.js version: $NODE_VERSION"
    else
        check_failed "Node.js version too old: $NODE_VERSION (requires >=16.0.0)"
    fi
else
    check_failed "Node.js not found"
fi

# Check npm version
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    check_passed "npm version: $NPM_VERSION"
else
    check_failed "npm not found"
fi

# Check git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    check_passed "git installed: $GIT_VERSION"
else
    check_failed "git not found"
fi

echo ""
echo "2. Project State Checks"
echo "----------------------"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    check_failed "package.json not found. Are you in the project root?"
    exit 1
fi

# Check package.json
if grep -q "@hypelab/lark-dashboard-sdk" package.json; then
    check_passed "Package name correct in package.json"
else
    check_failed "Package name incorrect in package.json"
fi

# Check version
VERSION=$(node -p "require('./package.json').version")
check_passed "Package version: $VERSION"

# Check if git is initialized
if [ -d ".git" ]; then
    check_passed "Git repository initialized"
else
    check_failed "Not a git repository"
fi

# Check for uncommitted changes
if [ -z "$(git status --porcelain)" ]; then
    check_passed "No uncommitted changes"
else
    check_warning "Uncommitted changes detected:"
    git status --short
fi

# Check current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" == "main" ] || [ "$BRANCH" == "master" ]; then
    check_passed "On main/master branch: $BRANCH"
else
    check_warning "Not on main branch: $BRANCH"
fi

echo ""
echo "3. Dependencies Check"
echo "--------------------"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    check_passed "node_modules directory exists"
else
    check_failed "node_modules not found. Run: npm install"
fi

# Check for package-lock.json
if [ -f "package-lock.json" ]; then
    check_passed "package-lock.json exists"
else
    check_warning "package-lock.json not found"
fi

echo ""
echo "4. Build Check"
echo "-------------"

# Check if dist directory exists
if [ -d "dist" ]; then
    check_passed "dist directory exists"

    # Check key files
    if [ -f "dist/index.js" ]; then
        check_passed "dist/index.js exists"
    else
        check_failed "dist/index.js not found"
    fi

    if [ -f "dist/index.d.ts" ]; then
        check_passed "dist/index.d.ts exists"
    else
        check_failed "dist/index.d.ts not found"
    fi

    if [ -f "dist/mcp-server.js" ]; then
        check_passed "dist/mcp-server.js exists"
    else
        check_failed "dist/mcp-server.js not found"
    fi
else
    check_failed "dist directory not found. Run: npm run build"
fi

echo ""
echo "5. Test Check"
echo "------------"

# Run tests
echo "Running tests..."
if npm test 2>&1 | tee /tmp/test-output.log; then
    check_passed "All tests passing"
else
    check_failed "Tests failed. Check output above."
fi

echo ""
echo "6. Lint Check"
echo "------------"

# Run linter
if npm run lint; then
    check_passed "Linting passed"
else
    check_warning "Linting found issues (non-blocking)"
fi

echo ""
echo "7. Documentation Check"
echo "---------------------"

# Check for required documentation files
for file in README.md LICENSE CHANGELOG.md API.md DEPLOYMENT.md; do
    if [ -f "$file" ]; then
        check_passed "$file exists"
    else
        check_failed "$file not found"
    fi
done

# Check documentation directory
if [ -d "docs" ]; then
    DOC_COUNT=$(find docs -name "*.md" | wc -l)
    check_passed "docs directory exists ($DOC_COUNT markdown files)"
else
    check_warning "docs directory not found"
fi

echo ""
echo "8. Examples Check"
echo "----------------"

# Check examples directory
if [ -d "examples" ]; then
    EXAMPLE_COUNT=$(find examples -name "*.ts" | wc -l)
    check_passed "examples directory exists ($EXAMPLE_COUNT examples)"
else
    check_failed "examples directory not found"
fi

echo ""
echo "9. Package Configuration"
echo "-----------------------"

# Check files field in package.json
if grep -q '"files"' package.json; then
    check_passed "files field defined in package.json"
else
    check_warning "files field not defined in package.json"
fi

# Check bin field
if grep -q '"bin"' package.json; then
    check_passed "bin field defined in package.json"
else
    check_warning "bin field not defined in package.json"
fi

# Check engines field
if grep -q '"engines"' package.json; then
    check_passed "engines field defined in package.json"
else
    check_warning "engines field not defined in package.json"
fi

echo ""
echo "10. Credentials Check"
echo "--------------------"

# Check npm authentication
if npm whoami &> /dev/null; then
    NPM_USER=$(npm whoami)
    check_passed "npm authenticated as: $NPM_USER"
else
    check_failed "Not authenticated with npm. Run: npm login"
fi

# Check if package exists on npm
if npm view @hypelab/lark-dashboard-sdk version &> /dev/null; then
    CURRENT_NPM_VERSION=$(npm view @hypelab/lark-dashboard-sdk version)
    check_warning "Package exists on npm: v$CURRENT_NPM_VERSION"

    # Compare versions
    if [ "$VERSION" == "$CURRENT_NPM_VERSION" ]; then
        check_failed "Version $VERSION already published. Update version in package.json"
    else
        check_passed "Version $VERSION is new"
    fi
else
    check_passed "Package not yet published (first release)"
fi

echo ""
echo "11. Security Check"
echo "-----------------"

# Check for .env files in git
if git ls-files | grep -q "\.env$"; then
    check_failed ".env file tracked in git"
else
    check_passed "No .env files in git"
fi

# Check for common secrets patterns
if git grep -i "api[_-]key\|secret\|password\|token" -- "*.ts" "*.js" | grep -v "\/\/" | grep -v "test" | grep -v "example" &> /dev/null; then
    check_warning "Potential secrets found in code (review manually)"
else
    check_passed "No obvious secrets in code"
fi

echo ""
echo "12. Bundle Size Check"
echo "--------------------"

if [ -d "dist" ]; then
    BUNDLE_SIZE=$(du -sh dist | cut -f1)
    check_passed "Bundle size: $BUNDLE_SIZE"
else
    check_warning "Cannot check bundle size (no dist directory)"
fi

echo ""
echo "========================================"
echo "Pre-Deployment Summary"
echo "========================================"
echo ""
echo -e "${GREEN}Checks passed: $CHECKS_PASSED${NC}"
echo -e "${RED}Checks failed: $CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
    echo ""
    echo "Ready to deploy. Next steps:"
    echo "1. Review CHANGELOG.md"
    echo "2. Run: ./scripts/deploy-npm.sh"
    echo "3. Run: ./scripts/deploy-github.sh"
    echo ""
    exit 0
else
    echo -e "${RED}✗ $CHECKS_FAILED check(s) failed${NC}"
    echo ""
    echo "Please fix the issues above before deploying."
    echo ""
    exit 1
fi
