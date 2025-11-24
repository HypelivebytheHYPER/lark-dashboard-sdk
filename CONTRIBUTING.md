# Contributing to Lark Dashboard SDK

Thank you for your interest in contributing to Lark Dashboard SDK! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/lark-dashboard-sdk.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Setup

### Prerequisites

- Node.js >= 16.0.0
- npm >= 7.0.0
- TypeScript >= 5.0.0

### Install Dependencies

```bash
npm install
```

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

### Run Tests

```bash
npm test
```

### Lint

```bash
npm run lint
```

## Project Structure

```
lark-dashboard-sdk/
├── src/
│   ├── api/              # API client implementations
│   ├── builders/         # Block builder classes
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── client.ts         # Main client class
│   └── index.ts          # Public exports
├── tests/                # Test files
├── examples/             # Usage examples
└── docs/                 # Documentation
```

## Coding Guidelines

### TypeScript

- Use strict TypeScript mode
- Define interfaces for all public APIs
- Use enums for fixed value sets
- Add JSDoc comments to all public methods
- Avoid `any` types when possible

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Max line length: 100 characters
- Follow ESLint rules

### Naming Conventions

- Classes: PascalCase (e.g., `ChartBlockBuilder`)
- Methods: camelCase (e.g., `createBlock`)
- Constants: UPPER_SNAKE_CASE (e.g., `DEFAULT_COLORS`)
- Interfaces: PascalCase (e.g., `ChartConfig`)
- Enums: PascalCase (e.g., `ChartType`)

### Comments

- Add JSDoc comments to all public methods
- Include parameter descriptions
- Include return type descriptions
- Add examples for complex methods

Example:

```typescript
/**
 * Create a dashboard block
 *
 * @param appToken - Application token
 * @param block - Dashboard block configuration
 * @returns Created block information
 *
 * @example
 * ```typescript
 * const block = ChartBlockBuilder.bar()
 *   .dataSource('appToken', 'tableId')
 *   .build();
 * const result = await client.createBlock('appToken', block);
 * ```
 */
async createBlock(appToken: string, block: DashboardBlock): Promise<DashboardResponse>
```

## Testing

### Writing Tests

- Write tests for all new features
- Use Jest for testing
- Place tests in `tests/` directory
- Name test files: `*.test.ts`
- Aim for >80% code coverage

### Test Structure

```typescript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do something', () => {
      // Arrange
      const input = ...;

      // Act
      const result = ...;

      // Assert
      expect(result).toBe(...);
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/client.test.ts

# Run with coverage
npm test -- --coverage
```

## Adding New Features

### Block Types

To add a new block type:

1. Add enum value to `BlockType` in `types.ts`
2. Create configuration interface in `types.ts`
3. Create builder class in `builders/`
4. Add validation function in `utils/validation.ts`
5. Update `DashboardApi` to handle new type
6. Add tests
7. Update documentation

### Chart Types

To add a new chart type:

1. Add enum value to `ChartType` in `types.ts`
2. Add factory method to `ChartBlockBuilder`
3. Update validation if needed
4. Add tests
5. Update documentation

## Pull Request Process

1. Update documentation for any new features
2. Add tests for new functionality
3. Ensure all tests pass: `npm test`
4. Ensure code passes linting: `npm run lint`
5. Update CHANGELOG.md
6. Create pull request with clear description

### PR Title Format

Use conventional commits format:

- `feat: Add new feature`
- `fix: Fix bug`
- `docs: Update documentation`
- `test: Add tests`
- `refactor: Refactor code`
- `chore: Update dependencies`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Checklist
- [ ] Tests pass
- [ ] Linting passes
- [ ] Documentation updated
- [ ] CHANGELOG updated
```

## Documentation

### README.md

Update README.md for:
- New features
- API changes
- Configuration options
- Examples

### API.md

Update API.md for:
- New methods
- New types
- New parameters
- Return value changes

### Examples

Add examples for:
- New features
- Complex use cases
- Common patterns

## Versioning

We use [Semantic Versioning](https://semver.org/):

- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Create GitHub release
6. Publish to npm: `npm publish`

## Questions?

Feel free to open an issue for:
- Questions about contributing
- Feature requests
- Bug reports
- General discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
