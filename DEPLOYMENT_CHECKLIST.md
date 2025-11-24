# Deployment Checklist

Complete this checklist before deploying the Lark Dashboard SDK.

## Pre-Deployment Verification

### Code Quality
- [ ] All TypeScript files compile without errors
- [ ] No TypeScript `any` types without justification
- [ ] All functions have proper JSDoc comments
- [ ] Code follows project style guide
- [ ] No console.log statements in production code
- [ ] All TODOs resolved or documented

### Testing
- [ ] All unit tests passing
- [ ] Test coverage > 80%
- [ ] Integration tests passing
- [ ] Example code tested and working
- [ ] MCP server tested manually
- [ ] Error handling tested
- [ ] Edge cases covered

### Build Verification
- [ ] `npm run build` completes successfully
- [ ] `dist/` directory contains all required files
- [ ] `dist/index.js` exists and is valid
- [ ] `dist/index.d.ts` exists and is valid
- [ ] `dist/mcp-server.js` exists and is executable
- [ ] Source maps generated correctly
- [ ] No build warnings

### Security
- [ ] No secrets in code
- [ ] No API keys committed
- [ ] `.env` files not tracked in git
- [ ] Dependencies audited (`npm audit`)
- [ ] No high/critical vulnerabilities
- [ ] Package access set to public
- [ ] License file present and correct

### Package Configuration
- [ ] `package.json` version updated
- [ ] Package name correct: `@hypelab/lark-dashboard-sdk`
- [ ] Main entry point correct: `dist/index.js`
- [ ] Types entry point correct: `dist/index.d.ts`
- [ ] Bin entry point correct: `dist/mcp-server.js`
- [ ] Files array includes only necessary files
- [ ] Keywords relevant and complete
- [ ] Repository URL correct
- [ ] Author information correct
- [ ] License field correct (MIT)
- [ ] Engines field specifies Node >= 16
- [ ] Homepage URL correct

### Documentation
- [ ] README.md complete and accurate
- [ ] README.md has installation instructions
- [ ] README.md has usage examples
- [ ] API.md generated and up-to-date
- [ ] CHANGELOG.md updated for this version
- [ ] Breaking changes documented
- [ ] Migration guide provided (if needed)
- [ ] All code examples working
- [ ] Links in documentation valid
- [ ] Badges in README current

### Examples
- [ ] All example files run without errors
- [ ] Examples use latest API
- [ ] Examples demonstrate key features
- [ ] Example output documented
- [ ] Environment setup documented

### Git Status
- [ ] All changes committed
- [ ] No uncommitted files
- [ ] On main/master branch
- [ ] Branch up-to-date with remote
- [ ] No merge conflicts
- [ ] Clean working directory

### Credentials
- [ ] npm authenticated (`npm whoami`)
- [ ] npm account has publish rights
- [ ] GitHub authenticated (`gh auth status`)
- [ ] Git configured correctly

### Version Management
- [ ] Version number follows semver
- [ ] Version not already published on npm
- [ ] Git tag doesn't exist yet
- [ ] CHANGELOG.md has section for this version
- [ ] Breaking changes version increment correct

## Deployment Execution

### Pre-Deployment
- [ ] Run `./scripts/pre-deploy.sh`
- [ ] All pre-deployment checks passed
- [ ] Review output carefully
- [ ] Fix any issues found

### NPM Deployment
- [ ] Run `./scripts/deploy-npm.sh`
- [ ] Confirm publication when prompted
- [ ] Verify package on npm
- [ ] Test installation: `npm install @hypelab/lark-dashboard-sdk`
- [ ] Save npm publish output

### GitHub Deployment
- [ ] Run `./scripts/deploy-github.sh`
- [ ] Review release notes
- [ ] Confirm release creation
- [ ] Verify release on GitHub
- [ ] Check release assets

### Post-Deployment
- [ ] Run `./scripts/post-deploy.sh`
- [ ] All verification checks passed
- [ ] Package accessible on npm
- [ ] GitHub release visible
- [ ] Documentation updated

## Post-Deployment Tasks

### Verification
- [ ] Install package globally: `npm install -g @hypelab/lark-dashboard-sdk`
- [ ] Test CLI: `lark-dashboard-mcp --help`
- [ ] Create test project and install package
- [ ] Import package in test project
- [ ] Run example code
- [ ] Verify TypeScript definitions work
- [ ] Check npm package page
- [ ] Verify download statistics visible

### Communication
- [ ] Announce release on GitHub Discussions
- [ ] Update project website (if applicable)
- [ ] Post on social media
- [ ] Notify contributors
- [ ] Update status badges

### Monitoring
- [ ] Watch npm download stats
- [ ] Monitor GitHub issues
- [ ] Check for bug reports
- [ ] Monitor npm deprecation warnings
- [ ] Review user feedback

### Documentation Updates
- [ ] Update main README if needed
- [ ] Update badges with new version
- [ ] Publish API documentation
- [ ] Update examples if needed

## Rollback Plan

If issues are discovered:

### Immediate Actions
- [ ] Document the issue
- [ ] Assess severity
- [ ] Decide: patch fix or rollback

### Rollback Procedure
- [ ] Run `./scripts/rollback.sh`
- [ ] Deprecate problematic version
- [ ] Delete GitHub release
- [ ] Remove git tags
- [ ] Communicate rollback

### Fix and Re-deploy
- [ ] Fix the issue
- [ ] Update version number
- [ ] Run full checklist again
- [ ] Deploy fixed version
- [ ] Announce fix

## Final Sign-Off

Before proceeding with deployment:

### Team Approval
- [ ] Code reviewed by team member
- [ ] Tests reviewed and approved
- [ ] Documentation reviewed
- [ ] Release notes approved

### Technical Approval
- [ ] All automated checks passed
- [ ] Manual testing completed
- [ ] Performance acceptable
- [ ] No known critical bugs

### Business Approval
- [ ] Release timing appropriate
- [ ] No conflicts with other releases
- [ ] Support team notified
- [ ] Marketing prepared (if applicable)

## Deployment Commands

When all checks are complete, execute in order:

```bash
# 1. Pre-deployment checks
./scripts/pre-deploy.sh

# 2. Deploy to npm
./scripts/deploy-npm.sh

# 3. Create GitHub release
./scripts/deploy-github.sh

# 4. Verify deployment
./scripts/post-deploy.sh
```

## Emergency Contacts

- **Package Owner**: [Your Email]
- **npm Support**: support@npmjs.com
- **GitHub Support**: https://support.github.com

## Notes

Version: ____________________

Deployed By: ____________________

Date: ____________________

Issues Found: ____________________

Resolution: ____________________
