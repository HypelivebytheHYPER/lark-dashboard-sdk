/**
 * Tab/Page Block Example (New 2025)
 * Demonstrates tabbed interfaces and page navigation
 */

import {
  LarkDashboardClient,
  TabPageBlockBuilder,
  ChartBlockBuilder,
  MetricsBlockBuilder,
  ListBlockBuilder,
  ChartType,
  AggregationType,
  ListLayoutStyle,
} from '../src';

async function main() {
  // Initialize client
  const client = new LarkDashboardClient({
    apiKey: process.env.LARK_API_KEY || 'your_api_key',
    region: 'sg',
    logging: true,
  });

  const appToken = 'your_app_token';
  const tableId = 'your_table_id';

  console.log('Creating dashboards with tab/page blocks...\n');

  // Example 1: Horizontal Tabs Dashboard
  console.log('1. Creating horizontal tabs for analytics dashboard...');

  // Create blocks for each tab
  const overviewMetrics = MetricsBlockBuilder
    .dataSource(appToken, tableId)
    .field('Revenue')
    .aggregation(AggregationType.SUM)
    .title('Total Revenue')
    .prefix('$')
    .decimals(2)
    .build();

  const salesChart = ChartBlockBuilder.line()
    .dataSource(appToken, tableId)
    .title('Sales Trend')
    .xAxis('Date')
    .yAxis([{ fieldName: 'Sales', aggregation: AggregationType.SUM }])
    .build();

  const customerList = ListBlockBuilder.vertical()
    .dataSource(appToken, tableId)
    .layoutStyle(ListLayoutStyle.VERTICAL)
    .titleField('Customer Name')
    .subtitleField('Email')
    .build();

  const horizontalTabs = TabPageBlockBuilder.horizontalTabs()
    .title('Analytics Dashboard')
    .tab('overview', 'Overview', ['overview-metrics-1', 'overview-chart-1'], {
      icon: 'dashboard',
      badge: 'new',
    })
    .tab('sales', 'Sales', ['sales-chart-1', 'sales-metrics-1'], {
      icon: 'trending-up',
    })
    .tab('customers', 'Customers', ['customer-list-1'], {
      icon: 'users',
      badge: 124,
    })
    .tab('reports', 'Reports', ['report-chart-1', 'report-table-1'], {
      icon: 'file-text',
    })
    .defaultTab('overview')
    .showTabCount(true)
    .animateTransition(true)
    .position(0, 0)
    .size(12, 8)
    .build();

  // Example 2: Vertical Tabs Sidebar
  console.log('2. Creating vertical tabs sidebar...');
  const verticalTabs = TabPageBlockBuilder.verticalTabs()
    .title('Settings Panel')
    .tab('general', 'General', ['settings-general-1'], {
      icon: 'settings',
    })
    .tab('users', 'Users & Permissions', ['settings-users-1'], {
      icon: 'users',
    })
    .tab('integrations', 'Integrations', ['settings-integrations-1'], {
      icon: 'link',
    })
    .tab('billing', 'Billing', ['settings-billing-1'], {
      icon: 'credit-card',
      badge: 'Pro',
    })
    .tab('advanced', 'Advanced', ['settings-advanced-1'], {
      icon: 'sliders',
    })
    .defaultTab('general')
    .allowReorder(false)
    .position(0, 8)
    .size(12, 6)
    .build();

  // Example 3: Pills Layout
  console.log('3. Creating pills layout for filters...');
  const pillsTabs = TabPageBlockBuilder.pills()
    .title('Product Categories')
    .tab('all', 'All Products', ['products-all'], {
      badge: 1250,
    })
    .tab('electronics', 'Electronics', ['products-electronics'], {
      icon: 'monitor',
      badge: 340,
    })
    .tab('clothing', 'Clothing', ['products-clothing'], {
      icon: 'shopping-bag',
      badge: 520,
    })
    .tab('food', 'Food & Beverage', ['products-food'], {
      icon: 'coffee',
      badge: 180,
    })
    .tab('books', 'Books', ['products-books'], {
      icon: 'book',
      badge: 210,
    })
    .defaultTab('all')
    .showTabCount(true)
    .animateTransition(true)
    .position(0, 14)
    .size(12, 2)
    .build();

  // Example 4: Sidebar Navigation
  console.log('4. Creating sidebar navigation...');
  const sidebarTabs = TabPageBlockBuilder.sidebar()
    .title('Project Management')
    .tab('dashboard', 'Dashboard', ['project-dashboard-1'], {
      icon: 'home',
    })
    .tab('tasks', 'Tasks', ['project-tasks-1'], {
      icon: 'check-square',
      badge: 23,
    })
    .tab('calendar', 'Calendar', ['project-calendar-1'], {
      icon: 'calendar',
    })
    .tab('team', 'Team', ['project-team-1'], {
      icon: 'users',
      badge: 12,
    })
    .tab('files', 'Files', ['project-files-1'], {
      icon: 'folder',
    })
    .tab('settings', 'Settings', ['project-settings-1'], {
      icon: 'settings',
    })
    .defaultTab('dashboard')
    .allowReorder(false)
    .position(0, 16)
    .size(12, 8)
    .build();

  // Example 5: Dropdown Tabs (Mobile-Friendly)
  console.log('5. Creating dropdown tabs for mobile...');
  const dropdownTabs = TabPageBlockBuilder.dropdown()
    .title('Quick Actions')
    .tab('create', 'Create New', ['quick-create-1'], {
      icon: 'plus-circle',
    })
    .tab('import', 'Import Data', ['quick-import-1'], {
      icon: 'upload',
    })
    .tab('export', 'Export Data', ['quick-export-1'], {
      icon: 'download',
    })
    .tab('share', 'Share Dashboard', ['quick-share-1'], {
      icon: 'share-2',
    })
    .defaultTab('create')
    .position(0, 24)
    .size(12, 4)
    .build();

  // Example 6: Advanced Tab Management
  console.log('6. Creating tabs with advanced features...');
  const advancedTabs = TabPageBlockBuilder.horizontalTabs()
    .title('Document Editor')
    .tab('document-1', 'Untitled Document', ['editor-1'], {
      icon: 'file',
      badge: 'Draft',
    })
    .tab('document-2', 'Q1 Report', ['editor-2'], {
      icon: 'file-text',
      badge: 'Editing',
    })
    .tab('document-3', 'Meeting Notes', ['editor-3'], {
      icon: 'file-text',
    })
    .defaultTab('document-1')
    .showTabCount(false)
    .animateTransition(true)
    .allowReorder(true)
    .allowClose(true)
    .maxTabs(10)
    .position(0, 28)
    .size(12, 10)
    .build();

  console.log('\nTab/Page blocks created successfully!');
  console.log('\nBlock configurations:');
  console.log('1. Horizontal Tabs:', JSON.stringify(horizontalTabs.config, null, 2));
  console.log('2. Vertical Tabs:', JSON.stringify(verticalTabs.config, null, 2));
  console.log('3. Pills Layout:', JSON.stringify(pillsTabs.config, null, 2));
  console.log('4. Sidebar Navigation:', JSON.stringify(sidebarTabs.config, null, 2));
  console.log('5. Dropdown Tabs:', JSON.stringify(dropdownTabs.config, null, 2));
  console.log('6. Advanced Tabs:', JSON.stringify(advancedTabs.config, null, 2));

  // Complete Example: Multi-Tab Analytics Dashboard
  console.log('\n7. Creating complete multi-tab analytics dashboard...');

  const completeTabDashboard = TabPageBlockBuilder.horizontalTabs()
    .title('Business Intelligence Dashboard')
    .tab('home', 'Home', [
      'home-welcome-text',
      'home-key-metrics-1',
      'home-key-metrics-2',
      'home-key-metrics-3',
      'home-recent-activity',
    ], {
      icon: 'home',
    })
    .tab('revenue', 'Revenue Analysis', [
      'revenue-chart-1',
      'revenue-chart-2',
      'revenue-breakdown',
      'revenue-forecast',
    ], {
      icon: 'dollar-sign',
      badge: 'Updated',
    })
    .tab('customers', 'Customer Insights', [
      'customer-metrics',
      'customer-growth-chart',
      'customer-list',
      'customer-segments',
    ], {
      icon: 'users',
      badge: 2847,
    })
    .tab('products', 'Product Performance', [
      'product-sales-chart',
      'product-list',
      'product-categories',
    ], {
      icon: 'package',
    })
    .tab('marketing', 'Marketing', [
      'marketing-campaigns',
      'marketing-roi',
      'marketing-channels',
    ], {
      icon: 'trending-up',
    })
    .tab('reports', 'Reports & Export', [
      'reports-builder',
      'reports-scheduled',
      'reports-history',
    ], {
      icon: 'file-text',
    })
    .defaultTab('home')
    .showTabCount(true)
    .animateTransition(true)
    .allowReorder(true)
    .position(0, 38)
    .size(12, 12)
    .build();

  console.log('Complete Dashboard:', JSON.stringify(completeTabDashboard.config, null, 2));
}

// Run the example
main().catch(console.error);
