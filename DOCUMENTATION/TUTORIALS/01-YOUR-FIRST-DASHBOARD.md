# Tutorial 1: Your First Dashboard (5 Minutes)

## What You'll Learn
- How to authenticate with the Lark API
- Create your first dashboard
- Add a simple chart block
- View your created dashboard

## Prerequisites
- Node.js 16+ installed
- A Lark/Feishu workspace
- A valid Lark API key with dashboard permissions
- Basic JavaScript/TypeScript knowledge

## Time Estimate: 5 minutes

## Step 1: Installation and Setup

### Install the SDK

```bash
npm install @hypelab/lark-dashboard-sdk
```

### Get Your API Key

1. Log in to your Lark workspace
2. Go to Admin Console > Third-party applications
3. Create a new application and get your API key
4. Note your region: 'sg' (Singapore), 'cn' (China), or 'us' (US)

### Create Your First Script

Create a file called `first-dashboard.ts`:

```typescript
import { LarkDashboardClient, ChartBlockBuilder, AggregationType } from '@hypelab/lark-dashboard-sdk';

// Initialize the client
const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY || 'your-api-key-here',
  region: 'sg', // Change to your region
  logging: true, // Enable logging to see what's happening
});

async function main() {
  try {
    console.log('Creating dashboard...');

    // Step 1: Create a dashboard
    const dashboardId = await client.createDashboard({
      name: 'My First Dashboard',
      appToken: 'YOUR_APP_TOKEN', // Replace with your app token
    });

    console.log(`Dashboard created with ID: ${dashboardId}`);

    // Step 2: Create a simple bar chart
    const chartBlock = ChartBlockBuilder.bar()
      .dataSource('YOUR_APP_TOKEN', 'YOUR_TABLE_ID') // Replace these
      .xAxis({ fieldName: 'Month' })
      .yAxis([
        {
          fieldName: 'Revenue',
          aggregation: AggregationType.SUM,
          label: 'Total Revenue'
        }
      ])
      .title('Monthly Revenue')
      .colors(['#3b82f6']) // Blue color
      .build();

    console.log('Adding chart to dashboard...');

    // Step 3: Add the chart to the dashboard
    const blockId = await client.addBlock(
      'YOUR_APP_TOKEN',
      dashboardId,
      chartBlock
    );

    console.log(`Chart added with ID: ${blockId}`);
    console.log('Dashboard created successfully!');
    console.log(`View your dashboard at: https://app.lark.com/bitable/YOUR_APP_TOKEN/dashboard/${dashboardId}`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
```

## Step 2: Prepare Your Data

Before running the script, you need:

1. **App Token**: A Lark Bitable app containing your data
2. **Table ID**: The specific table with your data
3. **Field Names**: The column names you want to visualize

### Find Your App Token and Table ID

1. Open your Bitable app
2. Click the URL bar - it shows: `https://app.lark.com/bitable/{APP_TOKEN}`
3. Open any table
4. Click the table dropdown - it shows: `{TABLE_ID}`

### Example Data Structure

Create a simple table with these columns:
- Month (text): "Jan", "Feb", "Mar", "Apr", "May"
- Revenue (number): 10000, 15000, 12000, 18000, 22000

## Step 3: Run Your Script

```bash
# Set your API key as environment variable
export LARK_API_KEY="your-api-key-here"

# Run the script
npx ts-node first-dashboard.ts
```

## Expected Output

```
Creating dashboard...
[LOG] POST /open-apis/v1/bitables/{appToken}/dashboards
Dashboard created with ID: dsh_abc123def456
Adding chart to dashboard...
[LOG] POST /open-apis/v1/bitables/{appToken}/dashboards/{dashboardId}/blocks
Chart added with ID: blk_xyz789
Dashboard created successfully!
View your dashboard at: https://app.lark.com/bitable/YOUR_APP_TOKEN/dashboard/dsh_abc123def456
```

## Troubleshooting

### "Invalid API Key" Error
- Verify your API key in Lark admin console
- Make sure it's a valid tenant access token
- Check that the token hasn't expired

### "App Token not found" Error
- Verify you're using the correct app token from the URL
- Make sure the app is accessible to your user account
- Check that the app has at least one table

### "Field not found" Error
- Verify the field names exactly match your table columns
- Field names are case-sensitive
- Use the column header text exactly as it appears

## What Happened?

1. **Authenticated**: Connected to Lark using your API key
2. **Created Dashboard**: Added a new dashboard container
3. **Built Chart Block**: Created a bar chart configuration
4. **Added Block**: Placed the chart on your dashboard

## Next Steps

- Read [Tutorial 2: Adding Charts & Metrics](02-CHARTS-AND-METRICS.md)
- Explore different chart types
- Add multiple blocks to one dashboard

## Complete Working Example

See `/examples/basic-dashboard.ts` for a production-ready example with error handling.

## Key Concepts

| Concept | Meaning |
|---------|---------|
| **API Key** | Authentication credential from Lark |
| **App Token** | Unique identifier for your Bitable app |
| **Table ID** | Unique identifier for a table in your app |
| **Dashboard** | Container for visualization blocks |
| **Block** | Individual chart, metric, table, or text element |
| **Aggregation** | How to summarize data (SUM, COUNT, AVG, etc.) |

## Summary

You've successfully:
- Set up the SDK
- Created your first dashboard
- Added a chart block with real data

The dashboard is now live and you can view it in your Lark workspace!
