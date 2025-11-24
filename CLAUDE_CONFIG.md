# Claude Code Configuration Guide

## Quick Setup

Add this to your `~/.claude.json` file:

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
      "description": "Lark Dashboard - Create and manage Lark dashboards",
      "auth": "LARK_API_KEY (env variable)",
      "scope": "user"
    },
    "lark-mcp": {
      "type": "http",
      "url": "https://lark-mcp.hypelive.app/mcp",
      "headers": {
        "X-API-Key": "${LARK_MCP_API_KEY}",
        "Content-Type": "application/json"
      },
      "category": "PLATFORMS",
      "description": "Lark MCP - Feishu/Lark Bases, Tables, Records management",
      "auth": "LARK_MCP_API_KEY (X-API-Key header)",
      "scope": "user"
    }
  }
}
```

## Environment Variables

Set these in your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
export LARK_API_KEY="your_tenant_access_token"
export LARK_REGION="sg"  # or "cn" or "us"
export LARK_MCP_API_KEY="your_lark_mcp_api_key"
```

Then restart your terminal or run:

```bash
source ~/.zshrc  # or source ~/.bashrc
```

## Verification

### 1. Check Configuration

```bash
cat ~/.claude.json | jq '.mcpServers."lark-dashboard"'
```

### 2. Test Environment Variables

```bash
echo $LARK_API_KEY
echo $LARK_REGION
```

### 3. Test MCP Server

```bash
LARK_API_KEY=your_key npx @hypelab/lark-dashboard-sdk
```

Should output: "Lark Dashboard MCP Server started"

### 4. Restart Claude Desktop

Close and reopen Claude Desktop to load the new configuration.

### 5. Test in Claude

Ask Claude:

```
List all dashboards in base FUVdb7bebaVLeMsKJgJlnsX2gzd
```

or

```
Create a dashboard called "Sales Analytics" in base FUVdb7bebaVLeMsKJgJlnsX2gzd
```

## Using with Claude Code

### Complete Workflow Example

```
I need to create a sales dashboard for the HypeLAB Automation base.

Base: FUVdb7bebaVLeMsKJgJlnsX2gzd

Steps:
1. First, list all tables in the base to find the sales table
2. Create a new dashboard called "Sales Analytics Dashboard"
3. Add these blocks:
   - Header text block: "Sales Analytics Dashboard"
   - Metrics block showing total revenue (SUM of revenue field)
   - Bar chart showing revenue by product
   - Line chart showing revenue trend over time
   - Grid view of recent orders
```

Claude will:
1. Use `lark-mcp` tools to list tables and get table structure
2. Use `lark-dashboard` tools to create the dashboard
3. Use `lark-dashboard` tools to add each block
4. Provide you with the dashboard URL

### Example Prompts

**Basic Dashboard:**
```
Create a simple dashboard in base FUVdb7bebaVLeMsKJgJlnsX2gzd with:
- Total orders count metric
- Revenue by month bar chart
```

**Complex Dashboard:**
```
Create a comprehensive analytics dashboard with:
- 4 KPI metrics (revenue, orders, avg order value, conversion rate)
- Revenue trend line chart
- Product category pie chart
- Top 10 products bar chart
- Recent orders grid view
```

**Update Existing:**
```
Add a new chart to dashboard [dashboard_id]:
- Funnel chart showing sales pipeline stages
```

**Multi-Source:**
```
Create a dashboard combining data from:
- Sales table: revenue metrics
- Inventory table: stock levels
- Orders table: order count
```

## Integrated Workflow

### Chain Operations

You can chain `lark-mcp` and `lark-dashboard` operations:

```
1. Create a new base table for products
2. Add sample product records
3. Create a dashboard showing:
   - Total products count
   - Products by category chart
   - Product list view
```

Claude will use:
- `lark-mcp` → `lark_create_table`
- `lark-mcp` → `lark_batch_create_records`
- `lark-dashboard` → `create_dashboard`
- `lark-dashboard` → `create_metrics_block`
- `lark-dashboard` → `create_chart_block`
- `lark-dashboard` → `create_view_block`

## Troubleshooting

### Tools Not Showing

1. Check config syntax: `jq . ~/.claude.json`
2. Verify environment variables: `env | grep LARK`
3. Restart Claude Desktop
4. Check logs: `tail -f ~/Library/Logs/Claude/mcp*.log`

### Authentication Errors

1. Verify API key is correct
2. Check key has dashboard permissions
3. Ensure region matches your Lark instance

### Dashboard Not Visible

1. Open base URL: `https://hypelive.sg.larksuite.com/base/[APP_TOKEN]`
2. Look for dashboard in left sidebar
3. Refresh page if needed

## Best Practices

### 1. Use Descriptive Names

```
Bad: "Dashboard 1"
Good: "Q4 2024 Sales Performance Dashboard"
```

### 2. Plan Structure First

Ask Claude to plan before executing:

```
Before creating the dashboard, please:
1. List available tables and their fields
2. Suggest an appropriate dashboard structure
3. Then proceed with creation
```

### 3. Verify After Creation

```
After creating the dashboard, please:
1. List all dashboards to confirm it exists
2. Provide the direct URL to view it
```

### 4. Clean Up Test Dashboards

```
Delete the test dashboard [dashboard_id] from base [app_token]
```

## Advanced Usage

### Template Dashboards

Save dashboard configurations for reuse:

```
Create a "Sales Dashboard Template" with:
- [specific blocks]

Then apply this template to 3 different sales tables.
```

### Scheduled Updates

Combined with automation tools:

```
Set up a workflow that:
1. Updates sales data (via lark-mcp)
2. Refreshes dashboard views
3. Sends notification
```

### Dynamic Dashboards

```
Create a dashboard that shows:
- Today's metrics (using view filters)
- This week's trends
- Month-to-date comparison
```

## Support

- Documentation: `/docs` in the SDK repository
- Examples: `/examples` directory
- Issues: GitHub repository
- Claude: Ask questions directly in Claude Code

## Tips

1. Always specify the base app token
2. Use table and field names exactly as they appear
3. Check aggregation types match field types
4. Use views to filter data at source
5. Keep dashboard focused and simple
6. Test with small datasets first

## Next Steps

1. Configure Claude Desktop with your settings
2. Restart Claude
3. Test basic commands
4. Create your first dashboard
5. Explore advanced features
6. Share feedback and improvements
