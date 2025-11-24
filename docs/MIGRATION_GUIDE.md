# Migration Guide

Guide for upgrading between versions of Lark Dashboard SDK.

## Version 1.0.0 (Initial Release)

This is the first stable release. No migration needed for new users.

### What's New

- Complete TypeScript SDK for Lark Dashboard creation
- Fluent builder API
- MCP server support
- Full type definitions
- Comprehensive examples

### Installation

```bash
npm install @hypelab/lark-dashboard-sdk
```

## Future Migrations

This section will be updated with migration guides for future versions.

### Breaking Changes Policy

We follow semantic versioning (semver):

- **Major version** (2.0.0): Breaking changes
- **Minor version** (1.1.0): New features, backwards compatible
- **Patch version** (1.0.1): Bug fixes, backwards compatible

### Deprecation Policy

1. Features are marked deprecated in a minor version
2. Deprecation warnings are shown for at least 2 minor versions
3. Features are removed in the next major version

Example timeline:
- v1.1.0: Feature marked deprecated
- v1.2.0: Still works with warning
- v1.3.0: Still works with warning
- v2.0.0: Feature removed

## Migration Best Practices

### Before Upgrading

1. **Read the changelog**: Check CHANGELOG.md for all changes
2. **Review breaking changes**: Look for BREAKING CHANGE notes
3. **Check deprecation warnings**: Run your code and note warnings
4. **Backup your code**: Commit all changes to git
5. **Test in development**: Never upgrade directly in production

### Upgrade Process

```bash
# 1. Check current version
npm list @hypelab/lark-dashboard-sdk

# 2. Check available versions
npm view @hypelab/lark-dashboard-sdk versions

# 3. Read changelog
npm view @hypelab/lark-dashboard-sdk@next dist.tarball
# Download and check CHANGELOG.md

# 4. Upgrade to specific version
npm install @hypelab/lark-dashboard-sdk@1.x.x

# 5. Run tests
npm test

# 6. Test your application
npm start
```

### Testing After Upgrade

```typescript
// Create a test file to verify functionality
import { DashboardBuilder } from '@hypelab/lark-dashboard-sdk';

async function testUpgrade() {
  console.log('Testing SDK after upgrade...');

  try {
    // Test basic functionality
    const dashboard = new DashboardBuilder()
      .setName('Test Dashboard')
      .addView('test')
        .addMetricsBlock()
          .addMetric('Test', '123')
          .end();

    console.log('✓ Basic functionality works');

    // Test your specific use cases
    // Add your test code here

  } catch (error) {
    console.error('✗ Upgrade test failed:', error);
    throw error;
  }
}

testUpgrade();
```

## Reporting Migration Issues

If you encounter issues during migration:

1. Check the [troubleshooting guide](TROUBLESHOOTING.md)
2. Search [GitHub issues](https://github.com/hypelab/lark-dashboard-sdk/issues)
3. Create a new issue with:
   - Old version number
   - New version number
   - Error messages
   - Code sample showing the issue
   - Steps to reproduce

## Stay Updated

- Watch the [GitHub repository](https://github.com/hypelab/lark-dashboard-sdk)
- Read the [CHANGELOG.md](../CHANGELOG.md)
- Check release notes for each version

## Version Compatibility

### Node.js Compatibility

| SDK Version | Node.js Version | Status |
|-------------|----------------|--------|
| 1.0.0 | >= 16.0.0 | Active |

### Lark API Compatibility

| SDK Version | Lark API Version | Status |
|-------------|-----------------|--------|
| 1.0.0 | v1 | Active |

## Rollback Instructions

If you need to rollback to a previous version:

```bash
# 1. Check what version you need
npm view @hypelab/lark-dashboard-sdk versions

# 2. Install specific version
npm install @hypelab/lark-dashboard-sdk@1.0.0

# 3. Verify
npm list @hypelab/lark-dashboard-sdk

# 4. Test
npm test
```

## Getting Help

- **Documentation**: [Full docs](https://github.com/hypelab/lark-dashboard-sdk)
- **Issues**: [GitHub Issues](https://github.com/hypelab/lark-dashboard-sdk/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hypelab/lark-dashboard-sdk/discussions)
