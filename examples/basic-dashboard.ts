/**
 * Basic Dashboard Example
 * Creates a simple dashboard with a chart and metrics
 */

import {
  LarkDashboardClient,
  ChartBlockBuilder,
  MetricsBlockBuilder,
  ChartType,
  AggregationType,
} from '../src';

async function main() {
  // Initialize client
  const client = new LarkDashboardClient({
    apiKey: process.env.LARK_API_KEY!,
    region: 'sg',
    logging: true,
  });

  // Configuration
  const APP_TOKEN = 'FUVdb7bebaVLeMsKJgJlnsX2gzd'; // HypeLAB Automation base
  const TABLE_ID = 'your_table_id'; // Replace with actual table ID

  try {
    console.log('Creating dashboard...');

    // Step 1: Create dashboard
    const dashboardId = await client.createDashboard({
      name: 'Sales Overview Dashboard',
      appToken: APP_TOKEN,
    });

    console.log(`✓ Dashboard created: ${dashboardId}`);

    // Step 2: Add metrics block (Total Revenue)
    const metricsBlock = new MetricsBlockBuilder()
      .dataSource(APP_TOKEN, TABLE_ID)
      .field('revenue')
      .aggregation(AggregationType.SUM)
      .title('Total Revenue')
      .prefix('$')
      .decimals(2)
      .position(0, 0)
      .size(4, 2)
      .build();

    const metricsBlockId = await client.addBlock(APP_TOKEN, dashboardId, metricsBlock);
    console.log(`✓ Metrics block created: ${metricsBlockId}`);

    // Step 3: Add bar chart (Sales by Product)
    const chartBlock = ChartBlockBuilder.bar()
      .dataSource(APP_TOKEN, TABLE_ID)
      .xAxis('product_name')
      .yAxis([{
        fieldName: 'revenue',
        aggregation: AggregationType.SUM,
        label: 'Revenue',
      }])
      .title('Sales by Product')
      .showLegend(true)
      .position(0, 2)
      .size(8, 4)
      .build();

    const chartBlockId = await client.addBlock(APP_TOKEN, dashboardId, chartBlock);
    console.log(`✓ Chart block created: ${chartBlockId}`);

    console.log('\n✓ Dashboard created successfully!');
    console.log(`View at: https://hypelive.sg.larksuite.com/base/${APP_TOKEN}`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { main };
