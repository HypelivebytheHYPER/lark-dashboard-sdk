# Tutorial 4: MCP Integration with Claude (15 Minutes)

## What You'll Learn
- Set up the SDK as an MCP server
- Use Claude Code to create dashboards via natural language
- Leverage AI for dashboard generation
- Integrate MCP with Claude Code IDE

## Prerequisites
- Completed Tutorials 1-3
- Claude Code installed
- Basic understanding of Model Context Protocol

## Time Estimate: 15 minutes

## Section 1: What is MCP?

The Model Context Protocol (MCP) allows Claude to interact directly with your tools and APIs.

### How It Works

```
Your Request
    ↓
Claude Code
    ↓
MCP Server (Lark Dashboard SDK)
    ↓
Lark API
    ↓
Your Dashboards
```

### Benefits

1. **Natural Language**: Describe dashboards in plain English
2. **Automation**: Claude handles technical details
3. **Integration**: Works seamlessly with Claude Code
4. **Smart**: Claude understands context and suggests improvements

## Section 2: Setup

### Step 1: Install the SDK

```bash
npm install @hypelab/lark-dashboard-sdk
```

### Step 2: Start the MCP Server

The SDK includes a built-in MCP server:

```bash
# Start the server
LARK_API_KEY="your-api-key-here" LARK_REGION="sg" \
  npx @hypelab/lark-dashboard-sdk
```

The server listens on stdio and exposes these tools:

- `create_dashboard` - Create a new dashboard
- `create_chart_block` - Add chart visualizations
- `create_metrics_block` - Add KPI metrics
- `create_view_block` - Add table/kanban views
- `create_text_block` - Add text content
- `list_dashboards` - List existing dashboards
- `delete_dashboard` - Remove dashboards

### Step 3: Configure Claude Code

Add to your `~/.claude.json` or Claude Code configuration:

```json
{
  "mcpServers": {
    "lark-dashboard": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@hypelab/lark-dashboard-sdk"],
      "env": {
        "LARK_API_KEY": "your-api-key-here",
        "LARK_REGION": "sg"
      }
    }
  }
}
```

### Step 4: Verify Setup

In Claude Code, you should see the Lark Dashboard MCP server available in the tools menu.

## Section 3: Using with Claude Code

### Example 1: Simple Dashboard Request

In Claude Code, describe what you want:

```
Create a sales dashboard with:
- Total revenue metric showing $X.XXX format
- Monthly revenue trend line chart
- Sales breakdown by region bar chart
- Revenue distribution pie chart

Use the table 'sales_2025' in app token 'bitable_abc123'
```

Claude will automatically:
1. Parse your requirements
2. Create the dashboard
3. Generate all blocks with proper configurations
4. Return the dashboard ID

### Example 2: Complex Dashboard

```
Build a customer analytics dashboard for our Q1 2025 campaign showing:
- Total unique customers (KPI)
- Customers by acquisition channel (bar chart)
- Customer lifetime value distribution (histogram)
- Customer retention rate trend (line chart)
- Top 10 customers table view

Filter to only completed transactions. Use the 'customers' table in 'bitable_xyz789'
```

Claude handles:
- Complex filters
- Multiple aggregations
- Proper field mappings
- Error handling

### Example 3: Dashboard Modification

```
I have a dashboard showing sales by region.
Can you add:
1. A metric showing total number of transactions
2. A pie chart showing sales percentage by product type

Dashboard ID: dsh_abc123
Use table 'sales_2025' in app 'bitable_def456'
```

Claude will:
- Identify the existing dashboard
- Create new blocks
- Add them to the dashboard
- Show you the updated configuration

## Section 4: MCP Tool Reference

### create_dashboard

Create a new dashboard:

```
Parameters:
- name (string): Dashboard name
- appToken (string): Lark Bitable app token
- description (optional): Dashboard description

Returns:
- dashboardId (string): ID of created dashboard
```

**Claude will use this automatically when you ask to create a new dashboard.**

### create_chart_block

Add a chart to a dashboard:

```
Parameters:
- chartType (string): 'bar', 'line', 'pie', 'scatter', 'area', 'column', 'funnel', 'radar'
- appToken (string): App token
- tableId (string): Table ID
- xAxis (object): X-axis configuration
- yAxis (array): Y-axis configuration with aggregations
- title (string): Chart title
- filters (optional): Data filters

Returns:
- blockId (string): ID of created block
- config (object): Block configuration
```

### create_metrics_block

Add a KPI metric:

```
Parameters:
- appToken (string): App token
- tableId (string): Table ID
- fieldName (string): Field to aggregate
- aggregation (string): 'sum', 'avg', 'count', 'distinct_count', 'max', 'min'
- title (string): Metric title
- prefix (optional): Currency symbol or label
- suffix (optional): Unit label
- decimals (optional): Decimal places

Returns:
- blockId (string): ID of created block
- config (object): Block configuration
```

### create_view_block

Embed a table view:

```
Parameters:
- viewType (string): 'table', 'kanban', 'gallery', 'gantt', 'form', 'calendar', 'timeline'
- appToken (string): App token
- tableId (string): Table ID
- viewId (string): View ID
- title (string): View title
- height (optional): Height in pixels

Returns:
- blockId (string): ID of created block
- config (object): Block configuration
```

### create_text_block

Add text content:

```
Parameters:
- content (string): Text content
- blockType (string): 'heading', 'paragraph', 'title'
- alignment (optional): 'left', 'center', 'right'

Returns:
- blockId (string): ID of created block
- config (object): Block configuration
```

### list_dashboards

List all dashboards:

```
Parameters:
- appToken (string): App token

Returns:
- dashboards (array): List of dashboard objects
  - id (string): Dashboard ID
  - name (string): Dashboard name
  - createdAt (string): Creation timestamp
  - blocks (number): Number of blocks
```

### delete_dashboard

Remove a dashboard:

```
Parameters:
- appToken (string): App token
- dashboardId (string): Dashboard ID to delete

Returns:
- success (boolean): Deletion status
```

## Section 5: Advanced Claude Prompting

### Prompt 1: Data Analysis Dashboard

```
Create a comprehensive data analysis dashboard for our product analytics.

Include these KPIs:
1. Total Page Views (metric)
2. Unique Sessions (metric)
3. Conversion Rate (metric)

And these visualizations:
1. Daily Views Trend (line chart)
2. Top 10 Referrers (bar chart)
3. Device Distribution (pie chart)
4. User Table (table view showing: name, email, signup_date, status)

Data source:
- App: bitable_prod_analytics
- Table: events_2025
- Views:
  - Grid view: grid_user_list
  - Kanban view: kanban_status

Filter to only Q1 2025 data (Jan 1 - Mar 31).

Add a header "Product Analytics - Q1 2025"
```

Claude will create a complete, professional dashboard with all specifications.

### Prompt 2: Iterative Refinement

```
I created a dashboard but want to refine it.

Current dashboard: dsh_analytics_q1
Current app: bitable_prod

Changes needed:
1. Change the revenue chart to show monthly instead of daily
2. Add a metric showing top customer name
3. Remove the pie chart
4. Add a bar chart comparing revenue vs expenses
5. Increase chart heights to 500px

Please make these updates.
```

Claude will:
1. Understand your current setup
2. Modify blocks appropriately
3. Handle field mappings
4. Apply all changes

### Prompt 3: Template Generation

```
I need 5 similar dashboards for different regions.
Create dashboard templates for:
1. North America
2. Europe
3. Asia-Pacific
4. Latin America
5. Middle East & Africa

Each should have the same structure:
- Regional Revenue Total (metric)
- Monthly Trend (line chart)
- Top Cities (bar chart)
- Customer List (table view)

Use table 'regional_sales' with a 'region' filter field.
```

Claude creates all 5 dashboards efficiently.

## Section 6: Error Handling with MCP

Claude handles errors automatically, but you can help:

### Clear Error Messages

Good prompt:
```
Create a dashboard using:
- App token: bitable_sales_2025
- Table: orders
- Fields: order_date, amount, customer_name

Show monthly revenue trend.
```

Vague prompt (may cause errors):
```
Create a dashboard with my sales data.
```

### Debugging

If Claude makes an error:

```
I'm getting an error: "Field 'quantity' not found"

Can you:
1. List what fields are available in the 'orders' table
2. Use the correct field name for quantity
3. Recreate the chart
```

Claude will:
1. Investigate the available fields
2. Use the correct field names
3. Retry the operation

## Section 7: Best Practices for MCP Usage

### 1. Provide Clear Context

```
GOOD:
"Create a dashboard for Q1 2025 sales performance using:
- App token: bitable_abc123
- Table: sales_transactions
- Available fields: date, region, amount, customer_id, product_category
Show regional breakdown and monthly trend."

AVOID:
"Make a sales dashboard."
```

### 2. Specify Field Names Explicitly

```
GOOD:
"Add a metric showing COUNT of 'transaction_id' field with title 'Total Transactions'"

AVOID:
"Add a count metric"
```

### 3. Use Existing Tools

```
GOOD:
"List the dashboards in app bitable_prod, then add a new chart to the
'Sales Dashboard' showing revenue by category."

AVOID:
"Get my dashboards." (Claude won't know which app)
```

### 4. Chain Operations

Claude can handle multi-step requests:

```
"First, create a dashboard called 'Performance Review'.
Then add:
1. A metric for total revenue
2. A chart showing monthly trend
3. A table view of top performers
Show me the dashboard ID when done."
```

## Section 8: Production Setup

### Environment Variables

Create a `.env` file:

```bash
LARK_API_KEY=your-tenant-access-token
LARK_REGION=sg
LARK_LOGGING=false
NODE_ENV=production
```

### Start MCP Server in Production

```bash
# Using PM2
pm2 start "npx @hypelab/lark-dashboard-sdk" \
  --name "lark-dashboard-mcp" \
  --env LARK_API_KEY=your-key,LARK_REGION=sg

# Using systemd
# Create /etc/systemd/system/lark-dashboard.service
[Unit]
Description=Lark Dashboard MCP Server
After=network.target

[Service]
Type=simple
User=app
WorkingDirectory=/app
Environment="LARK_API_KEY=your-key"
Environment="LARK_REGION=sg"
ExecStart=/usr/bin/npx @hypelab/lark-dashboard-sdk
Restart=always

[Install]
WantedBy=multi-user.target
```

### Health Checks

Claude can verify the MCP server is working:

```
"Test the MCP connection by listing all dashboards in app bitable_test.
If that works, create a simple test dashboard called 'MCP Health Check'."
```

## Section 9: Advanced Workflows

### Workflow 1: Auto-Generate Dashboard from Data Structure

```
I have a Lark table with columns: date, product, quantity, price, customer_type

Generate a complete sales dashboard showing:
- Total quantity sold
- Total revenue
- Average order value
- Quantity by product (bar)
- Revenue trend (line)
- Customer type breakdown (pie)
- Recent orders table

Intelligently choose aggregations and chart types.
```

### Workflow 2: Dashboard from CSV

```
I'm uploading a CSV with sales data. Create a Lark table from it,
then generate a dashboard showing key metrics and trends.

CSV structure: date, region, product, units, revenue
```

### Workflow 3: Scheduled Updates

```
Create a Python script that:
1. Uses the MCP server to list all dashboards
2. For each dashboard, check if there are more than 1000 data points
3. Create an optimized version with date filters
4. Save the dashboard IDs to a report
```

Claude generates the complete script.

## Checkpoint: Knowledge Test

1. **What does MCP stand for?**
   - Model Context Protocol

2. **How do you pass an API key to the MCP server?**
   - Via environment variable: `LARK_API_KEY=...`

3. **Can Claude create multiple dashboards in one request?**
   - Yes, you can ask for template generation or bulk creation

4. **What happens if a field doesn't exist?**
   - Claude will report an error and ask you to verify field names

## Next Steps

- Read [Tutorial 5: Building Multi-Source Dashboards](05-MULTI-SOURCE-DASHBOARDS.md)
- Explore advanced Claude prompting techniques
- Build production workflows

## Summary

You've learned:
- How to set up MCP with the Lark Dashboard SDK
- How to describe dashboards to Claude in plain English
- Best practices for effective prompting
- Advanced workflows and production setup

You can now leverage AI to dramatically speed up dashboard creation!
