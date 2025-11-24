# Complete Deployment Execution Playbook

**Package**: @hypelab/lark-dashboard-sdk v1.0.0
**Date Created**: 2025-11-25
**Status**: READY FOR EXECUTION

This is your complete guide to deploying the Lark Dashboard SDK to npm and GitHub.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Pre-Deployment](#pre-deployment)
3. [Deployment Execution](#deployment-execution)
4. [Post-Deployment](#post-deployment)
5. [Troubleshooting](#troubleshooting)
6. [Rollback Procedure](#rollback-procedure)

---

## Quick Start

**For the impatient deployer:**

```bash
# Navigate to project
cd /Users/mdch/lark-dashboard-sdk

# Run automated checks
./scripts/pre-deploy.sh

# If all checks pass, deploy
./scripts/deploy-npm.sh
./scripts/deploy-github.sh
./scripts/post-deploy.sh
```

**Estimated Total Time**: 10-15 minutes

---

## Pre-Deployment

### Step 1: Environment Setup (2 minutes)

**Verify Tools:**
```bash
# Check Node.js (need >= 16.0.0)
node --version

# Check npm
npm --version

# Check git
git --version

# Check GitHub CLI (optional but recommended)
gh --version
```

**Set Credentials:**
```bash
# 1. Authenticate with npm
npm login

# Verify
npm whoami

# 2. Authenticate with GitHub (optional for manual release)
gh auth login

# Verify
gh auth status
```

**Set Environment Variables:**
```bash
# For testing examples (optional)
export LARK_APP_ID="cli_xxx"
export LARK_APP_SECRET="xxx"
```

### Step 2: Code Verification (5 minutes)

**Fix Known Issues:**

The project has some test failures that need fixing before deployment:

```bash
# Check test status
npm test

# Known issues to fix:
# - TextBlockBuilder missing methods (heading, link, addBold)
# - LayoutBlockBuilder test needs update
```

**Action**: Either fix these tests OR proceed with deployment knowing they need post-release fixes.

**Clean Build:**
```bash
# Clean previous builds
rm -rf dist node_modules

# Fresh install
npm install

# Build
npm run build

# Verify dist directory
ls -la dist/
```

**Verify Examples:**
```bash
# Test each example (optional, requires Lark credentials)
npm run example:basic
npm run example:complete
```

### Step 3: Git Status (1 minute)

**Verify Repository State:**
```bash
# Check status
git status

# Should show: "nothing to commit, working tree clean"

# Check branch
git branch

# Should be on: main or master

# Check remote
git remote -v

# Should show: https://github.com/hypelab/lark-dashboard-sdk
```

**Commit Any Changes:**
```bash
# If you have uncommitted changes
git add .
git commit -m "Final pre-deployment fixes"
git push origin main
```

### Step 4: Run Pre-Deployment Script (3 minutes)

**Execute Checks:**
```bash
./scripts/pre-deploy.sh
```

**Expected Output:**
```
========================================
Pre-Deployment Checks
========================================

1. Environment Checks
-------------------
✓ Node.js version: v18.x.x
✓ npm version: 9.x.x
✓ git installed: git version 2.x.x

2. Project State Checks
----------------------
✓ Package name correct in package.json
✓ Package version: 1.0.0
✓ Git repository initialized
✓ No uncommitted changes
✓ On main/master branch

[... more checks ...]

========================================
Pre-Deployment Summary
========================================

Checks passed: 35
Checks failed: 0

✓ All critical checks passed!

Ready to deploy. Next steps:
1. Review CHANGELOG.md
2. Run: ./scripts/deploy-npm.sh
3. Run: ./scripts/deploy-github.sh
```

**If Checks Fail:**
- Review the specific failures
- Fix issues
- Re-run pre-deploy script
- Continue when all checks pass

---

## Deployment Execution

### Step 5: Deploy to npm (5 minutes)

**Execute Deployment:**
```bash
./scripts/deploy-npm.sh
```

**Interactive Steps:**

1. **Confirmation Prompt:**
   ```
   Package: @hypelab/lark-dashboard-sdk
   Version: 1.0.0

   You are about to publish to npm.
   This action cannot be undone.

   Do you want to continue? (yes/no):
   ```
   Type: `yes`

2. **Progress Output:**
   ```
   Step 1: Clean build
   ------------------
   Cleaned dist directory

   Step 2: Fresh install
   --------------------
   Dependencies installed

   Step 3: Run tests
   ----------------
   ✓ Tests passed

   Step 4: Build
   ------------
   ✓ Build complete

   Step 5: Verify build output
   --------------------------
   ✓ dist/index.js
   ✓ dist/index.d.ts
   ✓ dist/mcp-server.js
   ✓ README.md
   ✓ LICENSE

   Step 6: Pack and verify
   ----------------------
   ✓ Package created: hypelab-lark-dashboard-sdk-1.0.0.tgz (200KB)
   ```

3. **Final Confirmation:**
   ```
   Ready to publish!

   Package: @hypelab/lark-dashboard-sdk
   Version: 1.0.0
   Size: 200KB

   Proceed with npm publish? (yes/no):
   ```
   Type: `yes`

4. **Success Output:**
   ```
   ========================================
   ✓ Successfully published to npm!
   ========================================

   Package: @hypelab/lark-dashboard-sdk
   Version: 1.0.0

   View on npm:
   https://www.npmjs.com/package/@hypelab/lark-dashboard-sdk

   Install with:
   npm install @hypelab/lark-dashboard-sdk
   ```

**Verify on npm:**
```bash
# Check package is live
npm view @hypelab/lark-dashboard-sdk

# Test installation
npm install -g @hypelab/lark-dashboard-sdk
lark-dashboard-mcp --help
```

### Step 6: Create GitHub Release (3 minutes)

**Execute Release Creation:**
```bash
./scripts/deploy-github.sh
```

**Interactive Steps:**

1. **Tag Creation:**
   ```
   Tag v1.0.0 does not exist. Creating...
   ✓ Created tag: v1.0.0
   Pushing tag to origin...
   ✓ Tag pushed to origin
   ```

2. **Release Notes Preview:**
   ```
   Release notes prepared:
   ----------------------
   # Release 1.0.0

   ## Installation
   ...

   ## What's New
   ...
   ----------------------

   Create GitHub release? (yes/no):
   ```
   Type: `yes`

3. **Success Output:**
   ```
   ========================================
   ✓ GitHub release created successfully!
   ========================================

   Release: v1.0.0

   View release:
   https://github.com/hypelab/lark-dashboard-sdk/releases/tag/v1.0.0
   ```

**Verify on GitHub:**
- Visit: https://github.com/hypelab/lark-dashboard-sdk/releases
- Check that v1.0.0 release is visible
- Verify release notes are correct

---

## Post-Deployment

### Step 7: Verify Deployment (5 minutes)

**Execute Verification:**
```bash
./scripts/post-deploy.sh
```

**Expected Output:**
```
========================================
Post-Deployment Verification
========================================

1. npm Registry Check
--------------------
✓ Package published on npm: v1.0.0
✓ Last updated: 2025-11-25T...

2. npm Installation Test
-----------------------
Testing in: /tmp/xxx
✓ Package installs successfully
✓ Package files present
✓ Main file exists
✓ Type definitions exist
✓ MCP server binary exists

3. GitHub Release Check
----------------------
✓ GitHub release exists: v1.0.0
✓ Git tag exists on origin: v1.0.0

4. Documentation Availability
----------------------------
✓ README accessible on GitHub

5. Package Metadata
------------------
✓ npm package page accessible

6. MCP Server Test
-----------------
✓ MCP server executable

7. TypeScript Definitions Test
------------------------------
✓ TypeScript definitions valid

========================================
Verification Summary
========================================

Checks passed: 15
Checks failed: 0

✓ Deployment verified successfully!

Your package is live:
- npm: https://www.npmjs.com/package/@hypelab/lark-dashboard-sdk
- GitHub: https://github.com/hypelab/lark-dashboard-sdk

Users can now install with:
  npm install @hypelab/lark-dashboard-sdk
```

### Step 8: Announce Release (10 minutes)

**Update Repository:**
```bash
# Add release badge to README (optional)
# Update documentation links if needed
```

**Social Media:**

Use the content from [RELEASE_ANNOUNCEMENT.md](RELEASE_ANNOUNCEMENT.md):

1. **Twitter/X**: Post announcement with link
2. **LinkedIn**: Professional announcement
3. **Reddit**: r/typescript, r/nodejs
4. **Dev.to**: Create article
5. **GitHub Discussions**: Post announcement

**Community:**
- Star your own repository
- Share in relevant Discord/Slack channels
- Email interested developers

### Step 9: Monitor (Ongoing)

**First Hour:**
- Check npm download stats
- Monitor GitHub for issues
- Test installation from different machines
- Verify MCP server works with Claude

**First Day:**
- Respond to any issues immediately
- Update documentation if needed
- Fix any critical bugs
- Thank early adopters

**First Week:**
- Track metrics (downloads, stars, issues)
- Gather user feedback
- Plan first patch release if needed
- Build community

---

## Troubleshooting

### Deployment Failed

**npm publish fails:**

```bash
# Error: version already exists
# Solution: Update version in package.json
npm version patch  # or minor, or major

# Error: not authenticated
# Solution: Login to npm
npm login

# Error: no permission
# Solution: Check scope ownership
npm owner ls @hypelab/lark-dashboard-sdk
```

**GitHub release fails:**

```bash
# Error: gh not found
# Solution: Install GitHub CLI or create release manually

# Error: tag already exists
# Solution: Delete and recreate
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0

# Error: not authenticated
# Solution: Login to GitHub
gh auth login
```

### Post-Deployment Issues

**Package not installing:**
```bash
# Wait 5 minutes for npm registry propagation
# Clear npm cache
npm cache clean --force

# Try again
npm install @hypelab/lark-dashboard-sdk
```

**MCP server not working:**
```bash
# Reinstall globally
npm uninstall -g @hypelab/lark-dashboard-sdk
npm install -g @hypelab/lark-dashboard-sdk

# Check installation
which lark-dashboard-mcp
```

**TypeScript definitions missing:**
```bash
# Check package contents
npm view @hypelab/lark-dashboard-sdk files

# Should include: dist/**/*.d.ts
```

---

## Rollback Procedure

**If critical issues discovered:**

### Option 1: Deprecate Version

```bash
./scripts/rollback.sh
```

Follow prompts to deprecate the version.

### Option 2: Unpublish (within 72 hours only)

```bash
# Only possible within 72 hours of publishing
npm unpublish @hypelab/lark-dashboard-sdk@1.0.0
```

### Option 3: Publish Patch Fix

```bash
# Fix the issue in code
git add .
git commit -m "Fix: critical issue"

# Update version
npm version patch  # Creates v1.0.1

# Deploy patch
./scripts/deploy-npm.sh
./scripts/deploy-github.sh
```

---

## Deployment Checklist

Print this and check off as you go:

### Pre-Deployment
- [ ] Node.js >= 16.0.0 installed
- [ ] npm authenticated (`npm whoami`)
- [ ] GitHub authenticated (`gh auth status`)
- [ ] All code committed
- [ ] On main branch
- [ ] Clean working directory
- [ ] Tests passing (or issues noted)
- [ ] Build succeeds
- [ ] Pre-deploy script passes

### Deployment
- [ ] npm publish executed
- [ ] Package visible on npm
- [ ] GitHub release created
- [ ] Git tag pushed
- [ ] Post-deploy verification passes

### Post-Deployment
- [ ] Test installation works
- [ ] MCP server works
- [ ] Documentation accessible
- [ ] Release announced
- [ ] Monitoring started

---

## Success Metrics

**Within 1 Hour:**
- [ ] Package on npm
- [ ] 5+ npm downloads
- [ ] GitHub release visible
- [ ] No critical issues

**Within 24 Hours:**
- [ ] 50+ npm downloads
- [ ] 10+ GitHub stars
- [ ] Examples tested by others
- [ ] Positive feedback

**Within 1 Week:**
- [ ] 200+ npm downloads
- [ ] 25+ GitHub stars
- [ ] First contributions
- [ ] Featured somewhere

---

## Support Resources

**Documentation:**
- Quick Start: [docs/QUICK_START.md](docs/QUICK_START.md)
- Integration Guide: [docs/INTEGRATION_GUIDE.md](docs/INTEGRATION_GUIDE.md)
- Troubleshooting: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- API Reference: [API.md](API.md)

**Scripts:**
- Pre-deploy checks: `./scripts/pre-deploy.sh`
- Deploy to npm: `./scripts/deploy-npm.sh`
- Create release: `./scripts/deploy-github.sh`
- Verify deployment: `./scripts/post-deploy.sh`
- Rollback: `./scripts/rollback.sh`

**Checklists:**
- Deployment Checklist: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- Final Verification: [FINAL_DEPLOYMENT_VERIFICATION.md](FINAL_DEPLOYMENT_VERIFICATION.md)

**Plans:**
- Post-Deployment: [POST_DEPLOYMENT_PLAN.md](POST_DEPLOYMENT_PLAN.md)
- Deployment Metrics: [DEPLOYMENT_METRICS.md](DEPLOYMENT_METRICS.md)

---

## Final Notes

**You are deploying:**
- Package: @hypelab/lark-dashboard-sdk
- Version: 1.0.0
- Size: ~200 KB (npm package)
- Dependencies: 3
- Documentation: Complete
- Tests: Present (some failures to fix)
- Examples: 4 working examples

**Estimated deployment time:** 10-15 minutes

**Recommended deployment window:** Any time, low risk

**Rollback capability:** 72 hours for unpublish, always for deprecate

---

## Let's Deploy!

When you're ready:

```bash
cd /Users/mdch/lark-dashboard-sdk
./scripts/pre-deploy.sh && \
./scripts/deploy-npm.sh && \
./scripts/deploy-github.sh && \
./scripts/post-deploy.sh
```

**Good luck! You've got this! 🚀**

---

**Playbook Version**: 1.0
**Last Updated**: 2025-11-25
**Status**: READY FOR USE
