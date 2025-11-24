#!/bin/bash

# LARK DASHBOARD SDK - NPM PUBLICATION SCRIPT
# Version: 1.0.0
# Execute this script after NPM authentication is configured

echo "==================================================="
echo "LARK DASHBOARD SDK - NPM PUBLICATION"
echo "==================================================="
echo ""

# Step 1: Verify authentication
echo "[1/5] Verifying NPM authentication..."
npm whoami
if [ $? -ne 0 ]; then
    echo "ERROR: Not authenticated with NPM"
    echo "Please run: npm login"
    exit 1
fi
echo "✓ Authenticated with NPM"
echo ""

# Step 2: Verify package configuration
echo "[2/5] Verifying package configuration..."
cd /Users/mdch/lark-dashboard-sdk

PACKAGE_NAME=$(jq -r '.name' package.json)
PACKAGE_VERSION=$(jq -r '.version' package.json)

echo "Package Name: $PACKAGE_NAME"
echo "Package Version: $PACKAGE_VERSION"
echo "✓ Package configuration verified"
echo ""

# Step 3: Verify build
echo "[3/5] Verifying build..."
if [ -d "dist" ] && [ -f "dist/index.js" ] && [ -f "dist/index.d.ts" ]; then
    echo "✓ Build verified (dist/ folder exists with compiled files)"
else
    echo "ERROR: Build missing or incomplete"
    exit 1
fi
echo ""

# Step 4: Publish to NPM
echo "[4/5] Publishing to NPM..."
npm publish --access public

if [ $? -ne 0 ]; then
    echo "ERROR: Publication failed"
    exit 1
fi

echo "✓ Published to NPM"
echo ""

# Step 5: Verify publication
echo "[5/5] Verifying publication in NPM registry..."
sleep 3

npm view $PACKAGE_NAME@$PACKAGE_VERSION

if [ $? -eq 0 ]; then
    echo ""
    echo "==================================================="
    echo "PUBLICATION SUCCESSFUL!"
    echo "==================================================="
    echo "Package: $PACKAGE_NAME"
    echo "Version: $PACKAGE_VERSION"
    echo "Registry URL: https://www.npmjs.com/package/$PACKAGE_NAME"
    echo ""
    echo "Next steps:"
    echo "1. Create GitHub release: https://github.com/hypelab/lark-dashboard-sdk/releases/new"
    echo "2. Tag: v$PACKAGE_VERSION"
    echo "3. Title: Release v$PACKAGE_VERSION"
    echo "==================================================="
else
    echo "ERROR: Package not found in registry (verification failed)"
    exit 1
fi
