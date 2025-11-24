/**
 * Complete Dashboard Example
 */

import {
  LarkDashboardClient,
  ChartBlockBuilder,
  MetricsBlockBuilder,
  AggregationType,
} from '../src';

async function main() {
  const client = new LarkDashboardClient({
    apiKey: process.env.LARK_API_KEY!,
    region: 'sg',
  });

  const APP_TOKEN = 'FUVdb7bebaVLeMsKJgJlnsX2gzd';
  const TABLE_ID = 'your_table_id';

  const dashboardId = await client.createDashboard({
    name: 'Analytics Dashboard',
    appToken: APP_TOKEN,
  });

  console.log('Dashboard created:', dashboardId);
}

if (require.main === module) {
  main();
}
