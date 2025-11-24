# Troubleshooting Guide

## Common Issues

### Authentication Errors

#### Error: "Invalid authentication token"

**Symptoms:**
- 401 Unauthorized errors
- "Authentication failed" messages

**Solutions:**
1. Verify API key is correct
2. Check token hasn't expired
3. Ensure correct region is specified
4. Verify token has dashboard permissions

```typescript
// Check your config
const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY!,
  region: 'sg', // Match your Lark region
  logging: true, // Enable to see detailed errors
});
```

### Rate Limiting

#### Error: "Rate limit exceeded" (429)

**Symptoms:**
- 429 status code
- "Too many requests" messages

**Solutions:**
- SDK automatically retries with exponential backoff
- Reduce request frequency
- Use batch operations (`addBlocks` instead of multiple `addBlock`)

```typescript
// Good: Batch operation
const results = await client.addBlocks(appToken, dashboardId, [
  block1, block2, block3
]);

// Bad: Multiple requests
await client.addBlock(appToken, dashboardId, block1);
await client.addBlock(appToken, dashboardId, block2);
await client.addBlock(appToken, dashboardId, block3);
```

### Data Not Showing

#### Dashboard is empty or shows no data

**Symptoms:**
- Dashboard created but blocks don't appear
- Charts show "No data"
- Metrics show 0 or empty

**Solutions:**

1. **Verify table ID and field names:**
```typescript
// Check table exists
const tables = await larkClient.listTables(appToken);
console.log('Available tables:', tables);

// Check field names match exactly (case-sensitive)
const fields = await larkClient.listFields(appToken, tableId);
console.log('Available fields:', fields);
```

2. **Check data exists:**
```typescript
// Verify table has records
const records = await larkClient.getTableRecords(appToken, tableId);
console.log('Record count:', records.length);
```

3. **Verify aggregation type matches field type:**
- Use `COUNT` for any field
- Use `SUM`, `AVG`, `MAX`, `MIN` for number fields only
- Use `EMPTY`, `FILLED` for checking null values

4. **Check view filters:**
```typescript
// If using viewId, ensure it doesn't filter out all data
const block = ChartBlockBuilder.bar()
  .dataSource(appToken, tableId) // Don't specify viewId if unsure
  .xAxis('product')
  .yAxis([{ fieldName: 'revenue', aggregation: AggregationType.SUM }])
  .build();
```

### MCP Server Issues

#### MCP server not responding

**Symptoms:**
- Claude doesn't see the tools
- "Server unavailable" errors

**Solutions:**

1. **Check Claude config syntax:**
```json
{
  "mcpServers": {
    "lark-dashboard": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@hypelab/lark-dashboard-sdk"],
      "env": {
        "LARK_API_KEY": "your_key_here",
        "LARK_REGION": "sg"
      }
    }
  }
}
```

2. **Verify environment variables:**
```bash
# Check if variables are set
echo $LARK_API_KEY
echo $LARK_REGION
```

3. **Restart Claude Desktop:**
- Close Claude completely
- Wait 5 seconds
- Reopen Claude

4. **Check logs:**
```bash
# macOS
tail -f ~/Library/Logs/Claude/mcp*.log

# Linux
tail -f ~/.config/Claude/logs/mcp*.log
```

#### MCP tools not appearing

**Solutions:**

1. **Test MCP server manually:**
```bash
# Run MCP server directly
LARK_API_KEY=your_key npx @hypelab/lark-dashboard-sdk

# Should output: "Lark Dashboard MCP Server started"
```

2. **Reinstall package:**
```bash
npm uninstall -g @hypelab/lark-dashboard-sdk
npm install -g @hypelab/lark-dashboard-sdk
```

### Build Errors

#### TypeScript compilation errors

**Symptoms:**
- `npm run build` fails
- Type errors in your code

**Solutions:**

1. **Update TypeScript:**
```bash
npm install --save-dev typescript@latest
```

2. **Check tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  }
}
```

3. **Clean and rebuild:**
```bash
rm -rf dist node_modules
npm install
npm run build
```

### API Errors

#### Error: "Block type not supported"

**Solution:**
Verify block type enum value:

```typescript
// Correct
import { BlockType } from '@hypelab/lark-dashboard-sdk';
block.blockType = BlockType.CHART; // 1

// Wrong
block.blockType = 'chart'; // String not accepted
```

#### Error: "Invalid field aggregation"

**Solution:**
Match aggregation to field type:

```typescript
// Number field - OK
.field('revenue')
.aggregation(AggregationType.SUM)

// Text field - Use COUNT
.field('product_name')
.aggregation(AggregationType.COUNT)

// Date field - Use COUNT or UNIQUE
.field('created_date')
.aggregation(AggregationType.COUNT)
```

### Performance Issues

#### Dashboard loads slowly

**Solutions:**

1. **Limit data points:**
```typescript
// Use view with filters to reduce data
const chart = ChartBlockBuilder.bar()
  .dataSource(appToken, tableId, 'recent_30_days_view')
  .build();
```

2. **Optimize aggregations:**
```typescript
// Good: Single aggregation
.yAxis([{ fieldName: 'revenue', aggregation: AggregationType.SUM }])

// Bad: Multiple complex aggregations
.yAxis([
  { fieldName: 'revenue', aggregation: AggregationType.SUM },
  { fieldName: 'profit', aggregation: AggregationType.AVG },
  { fieldName: 'cost', aggregation: AggregationType.SUM },
])
```

3. **Use appropriate chart types:**
- Bar/Column: < 50 categories
- Line: < 100 data points
- Pie: < 10 slices
- Table: < 1000 rows

### Network Issues

#### Error: "Request timeout"

**Solutions:**

1. **Increase timeout:**
```typescript
const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY!,
  timeout: 60000, // 60 seconds
});
```

2. **Check network connectivity:**
```bash
# Test API endpoint
curl -I https://open.larksuite.com/open-apis/bitable/v1/apps
```

3. **Verify proxy settings:**
```bash
# If behind proxy
export HTTP_PROXY=http://proxy.example.com:8080
export HTTPS_PROXY=http://proxy.example.com:8080
```

### Debug Mode

Enable detailed logging:

```typescript
const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY!,
  logging: true, // Enable debug logs
});
```

## Getting Help

1. **Check documentation:** `/docs` directory
2. **Review examples:** `/examples` directory
3. **GitHub Issues:** Report bugs and request features
4. **Lark API Docs:** https://open.larksuite.com/document

## Diagnostic Checklist

Before reporting an issue:

- [ ] API key is valid and has correct permissions
- [ ] Region is correctly specified (sg/cn/us)
- [ ] Table ID and field names are correct (case-sensitive)
- [ ] Data exists in source table
- [ ] Aggregation type matches field type
- [ ] No rate limiting (check 429 errors)
- [ ] Network connectivity is working
- [ ] Latest SDK version installed
- [ ] Logs reviewed for errors
- [ ] Examples work correctly

## Error Codes Reference

| Code | Meaning | Solution |
|------|---------|----------|
| 0 | Success | No action needed |
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Verify API key |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Verify IDs are correct |
| 429 | Rate Limited | Reduce request frequency |
| 500 | Server Error | Retry request |
| 503 | Service Unavailable | Wait and retry |
