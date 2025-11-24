# Deployment Guide

## Pre-Deployment Checklist

- [x] Code is production-ready
- [x] All TypeScript files compile without errors
- [x] API client implementation complete
- [x] All block builders implemented
- [x] MCP server wrapper complete
- [x] Comprehensive examples created
- [x] Full documentation written
- [x] Package.json configured correctly
- [x] License file included
- [ ] Tests written and passing
- [ ] Security audit completed
- [ ] Performance benchmarks run

## Build Process

### 1. Install Dependencies

```bash
cd /Users/mdch/lark-dashboard-sdk
npm install
```

### 2. Build TypeScript

```bash
npm run build
```

This compiles TypeScript to JavaScript in `/dist` directory.

### 3. Verify Build

```bash
ls -la dist/
# Should see:
# - index.js
# - index.d.ts
# - mcp-server.js
# - api/
# - builders/
# - utils/
# - types.js
```

### 4. Test Examples

```bash
# Set environment variables
export LARK_API_KEY="your_api_key"
export LARK_REGION="sg"

# Test basic example
npm run example:basic

# Test complete example
npm run example:complete
```

### 5. Test MCP Server

```bash
# Start MCP server
npm run mcp:start

# Should output: "Lark Dashboard MCP Server started"
```

## NPM Publishing

### 1. Login to NPM

```bash
npm login
```

### 2. Version Bump

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

### 3. Publish

```bash
# Dry run first
npm publish --dry-run

# Actual publish
npm publish --access public
```

### 4. Verify Publication

```bash
npm info @hypelab/lark-dashboard-sdk
```

## MCP Server Deployment

### Global Installation

Users can install globally:

```bash
npm install -g @hypelab/lark-dashboard-sdk
```

Then run:

```bash
lark-dashboard-mcp
```

### Claude Desktop Configuration

Add to `~/.claude.json`:

```json
{
  "mcpServers": {
    "lark-dashboard": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@hypelab/lark-dashboard-sdk"],
      "env": {
        "LARK_API_KEY": "${LARK_API_KEY}",
        "LARK_REGION": "sg"
      },
      "category": "PLATFORMS",
      "description": "Lark Dashboard SDK - Create and manage Lark dashboards",
      "scope": "user"
    }
  }
}
```

## Testing Deployment

### 1. Test with HypeLAB Automation Base

```bash
export LARK_API_KEY="your_api_key"
export LARK_REGION="sg"

# Create test dashboard
node << 'EOTEST'
const { LarkDashboardClient } = require('./dist');

const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY,
  region: 'sg',
});

(async () => {
  try {
    const dashboardId = await client.createDashboard({
      name: 'Test Dashboard - ' + new Date().toISOString(),
      appToken: 'FUVdb7bebaVLeMsKJgJlnsX2gzd',
    });
    console.log('✓ Dashboard created:', dashboardId);
    console.log('View at: https://hypelive.sg.larksuite.com/base/FUVdb7bebaVLeMsKJgJlnsX2gzd');
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
})();
EOTEST
```

### 2. Verify All Block Types

Test creating each block type:

```bash
npm run example:complete
```

### 3. Test MCP Integration

1. Configure Claude Desktop with the package
2. Restart Claude
3. Ask Claude: "Create a dashboard in base FUVdb7bebaVLeMsKJgJlnsX2gzd"
4. Verify tools are available and working

## Post-Deployment

### 1. Tag Release

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 2. Create GitHub Release

- Go to GitHub releases
- Create new release from tag
- Add release notes
- Attach artifacts if needed

### 3. Update Documentation

- Update README with latest examples
- Update CHANGELOG.md
- Update version in documentation

### 4. Announce

- Post on social media
- Update project website
- Notify users

## Rollback Procedure

If issues are found:

```bash
# Unpublish version (within 72 hours)
npm unpublish @hypelab/lark-dashboard-sdk@1.0.0

# Or deprecate
npm deprecate @hypelab/lark-dashboard-sdk@1.0.0 "Critical bug, use 1.0.1"
```

## Monitoring

### 1. NPM Downloads

```bash
npm info @hypelab/lark-dashboard-sdk downloads
```

### 2. GitHub Issues

Monitor for bug reports and feature requests.

### 3. User Feedback

Collect feedback from users and iterate.

## Maintenance

### Regular Updates

- Update dependencies quarterly
- Fix security vulnerabilities immediately
- Add requested features
- Improve documentation based on feedback

### Version Strategy

- Patch (x.x.X): Bug fixes
- Minor (x.X.x): New features, backward compatible
- Major (X.x.x): Breaking changes

## Support Channels

- GitHub Issues: Bug reports and features
- Email: dev@hypelab.com
- Documentation: /docs directory
- Examples: /examples directory

## Success Metrics

Track:
- NPM downloads per week
- GitHub stars
- Issue resolution time
- User feedback ratings
- MCP server adoption

## Final Verification

Before announcing:

- [ ] Package installs correctly: `npm install @hypelab/lark-dashboard-sdk`
- [ ] Examples run successfully
- [ ] MCP server starts without errors
- [ ] Claude Desktop integration works
- [ ] Documentation is complete and accurate
- [ ] All tests pass
- [ ] Security audit clean
- [ ] Performance acceptable
- [ ] Error handling robust
- [ ] Logging informative

## Next Steps

1. Build the package: `npm run build`
2. Test thoroughly with HypeLAB base
3. Publish to NPM: `npm publish`
4. Configure in Claude Desktop
5. Test MCP integration
6. Announce release
7. Monitor feedback
8. Iterate and improve
