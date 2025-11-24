# Installation Guide

## Prerequisites

- Node.js >= 16.0.0
- npm, yarn, or pnpm
- Lark/Feishu account with API access
- Tenant access token or user access token

## Installation Methods

### NPM

```bash
npm install @hypelab/lark-dashboard-sdk
```

### Yarn

```bash
yarn add @hypelab/lark-dashboard-sdk
```

### PNPM

```bash
pnpm add @hypelab/lark-dashboard-sdk
```

## Getting API Credentials

1. Go to Lark Open Platform: https://open.larksuite.com
2. Create or select your app
3. Get tenant access token from app credentials
4. Ensure dashboard API permissions are enabled

## Environment Setup

Create `.env` file:

```env
LARK_API_KEY=your_tenant_access_token_here
LARK_REGION=sg
LARK_LOGGING=false
```

## Verification

Test your installation:

```typescript
import { LarkDashboardClient } from '@hypelab/lark-dashboard-sdk';

const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY!,
  region: 'sg',
});

console.log('Client initialized successfully!');
```

## MCP Server Setup

### For Claude Code

1. Edit `~/.claude.json`:

```json
{
  "mcpServers": {
    "lark-dashboard": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@hypelab/lark-dashboard-sdk"],
      "env": {
        "LARK_API_KEY": "your_api_key",
        "LARK_REGION": "sg"
      }
    }
  }
}
```

2. Restart Claude Desktop

### For Other MCP Clients

Use the MCP server binary:

```bash
npx @hypelab/lark-dashboard-sdk
```

Or install globally:

```bash
npm install -g @hypelab/lark-dashboard-sdk
lark-dashboard-mcp
```

## Troubleshooting

### Module not found

```bash
npm install --save @hypelab/lark-dashboard-sdk
```

### Permission denied

```bash
sudo npm install -g @hypelab/lark-dashboard-sdk
```

### TypeScript errors

Ensure TypeScript >= 4.5:

```bash
npm install --save-dev typescript@latest
```
