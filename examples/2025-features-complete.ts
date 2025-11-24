/**
 * Complete 2025 Features Example
 * Demonstrates all new 2025 dashboard capabilities in one comprehensive example
 */

import {
  LarkDashboardClient,
  ChartBlockBuilder,
  MetricsBlockBuilder,
  ListBlockBuilder,
  TabPageBlockBuilder,
  DashboardPermissionBuilder,
  BlockPermissionBuilder,
  ChartType,
  AggregationType,
  FilterOperator,
  FilterConjunction,
  PermissionLevel,
  Dashboard,
  DashboardSettings,
  DashboardTheme,
} from '../src';

async function main() {
  // Initialize client
  const client = new LarkDashboardClient({
    apiKey: process.env.LARK_API_KEY || 'your_api_key',
    region: 'sg',
    logging: true,
  });

  const appToken = 'your_app_token';
  const salesTableId = 'sales_table_id';
  const customersTableId = 'customers_table_id';
  const productsTableId = 'products_table_id';

  console.log('Creating Advanced 2025 Dashboard with All Features...\n');

  // ========================================
  // 1. ENHANCED CHART BLOCKS WITH 2025 FEATURES
  // ========================================
  console.log('1. Creating enhanced charts with new features...');

  // Heatmap Chart (New 2025)
  const heatmapChart = ChartBlockBuilder
    .chartType(ChartType.HEATMAP)
    .dataSource(appToken, salesTableId, undefined, 300, true) // Auto-refresh every 5 min, caching enabled
    .title('Sales Heatmap by Region & Time')
    .xAxis('Time Period', undefined, undefined, 'MMM YYYY', true)
    .yAxis([{
      fieldName: 'Sales',
      aggregation: AggregationType.SUM,
      format: '$#,##0.00',
      showGrid: true,
      scale: 'linear',
    }])
    .colors(['#4ade80', '#fbbf24', '#f87171'])
    .animation({
      enabled: true,
      duration: 1000,
      easing: 'easeInOut',
      delay: 100,
    })
    .tooltip({
      enabled: true,
      format: '${value}',
      shared: true,
      position: 'auto',
    })
    .responsive(true)
    .theme('auto')
    .exportEnabled(true)
    .zoomEnabled(true)
    .panEnabled(true)
    .crosshair(true)
    .position(0, 0)
    .size(6, 4)
    .build();

  // Waterfall Chart (New 2025)
  const waterfallChart = ChartBlockBuilder
    .chartType(ChartType.WATERFALL)
    .dataSource(appToken, salesTableId)
    .title('Revenue Breakdown')
    .xAxis('Category')
    .yAxis([{
      fieldName: 'Amount',
      aggregation: AggregationType.SUM,
      format: '$#,##0',
    }])
    .colors(['#22c55e', '#ef4444'])
    .animation({ enabled: true, duration: 800 })
    .exportEnabled(true)
    .position(6, 0)
    .size(6, 4)
    .build();

  // Gauge Chart (New 2025)
  const gaugeChart = ChartBlockBuilder
    .chartType(ChartType.GAUGE)
    .dataSource(appToken, salesTableId)
    .title('Sales Target Achievement')
    .yAxis([{
      fieldName: 'Sales',
      aggregation: AggregationType.SUM,
      min: 0,
      max: 1000000,
    }])
    .colors(['#ef4444', '#fbbf24', '#22c55e'])
    .position(0, 4)
    .size(3, 3)
    .build();

  // ========================================
  // 2. ENHANCED METRICS WITH 2025 FEATURES
  // ========================================
  console.log('2. Creating enhanced metrics with comparisons...');

  const enhancedMetrics = MetricsBlockBuilder
    .dataSource(appToken, salesTableId, undefined, 60, true) // Auto-refresh every minute
    .field('Revenue')
    .aggregation(AggregationType.SUM)
    .title('Total Revenue')
    .prefix('$')
    .decimals(2)
    .showTrend(true, 'Previous Period')
    .comparisonEnabled(true)
    .comparisonPeriod('month')
    .sparklineEnabled(true)
    .target(1000000)
    .targetLabel('Monthly Target')
    .conditionalFormat({
      operator: FilterOperator.IS_GREATER,
      value: 1000000,
      color: '#22c55e',
      backgroundColor: '#f0fdf4',
      textStyle: { bold: true, fontSize: 24 },
    })
    .position(3, 4)
    .size(3, 3)
    .build();

  // ========================================
  // 3. LIST BLOCKS WITH ADVANCED LAYOUTS
  // ========================================
  console.log('3. Creating list blocks with new layouts...');

  const productList = ListBlockBuilder.grid()
    .dataSource(appToken, productsTableId)
    .title('Featured Products')
    .titleField('Product Name')
    .subtitleField('Price')
    .descriptionField('Description')
    .imageField('Image')
    .badgeField('Status')
    .metaFields(['Category', 'Rating', 'Stock'])
    .addLinkButton('View', '/products/{id}', 'eye', 'primary')
    .addLinkButton('Edit', '/products/edit/{id}', 'edit', 'secondary')
    .addDeleteButton()
    .sortDesc('Rating')
    .filters(FilterConjunction.AND, [
      {
        fieldName: 'Status',
        operator: FilterOperator.IS,
        value: 'Active',
      },
      {
        fieldName: 'Stock',
        operator: FilterOperator.IS_GREATER,
        value: 0,
      },
    ])
    .pagination(true, 24)
    .showSearch(true)
    .showFilters(true)
    .groupBy('Category')
    .clickable(true, 'detail')
    .position(6, 4)
    .size(6, 6)
    .build();

  const customerList = ListBlockBuilder.detailed()
    .dataSource(appToken, customersTableId)
    .title('VIP Customers')
    .titleField('Customer Name')
    .subtitleField('Email')
    .descriptionField('Notes')
    .imageField('Avatar')
    .badgeField('Tier')
    .metaFields(['Total Orders', 'Lifetime Value', 'Last Purchase', 'Location'])
    .addLinkButton('View Profile', '/customers/{id}', 'user')
    .addLinkButton('Send Email', 'mailto:{email}', 'mail')
    .addEditButton()
    .sortDesc('Lifetime Value')
    .filters(FilterConjunction.AND, [
      {
        fieldName: 'Tier',
        operator: FilterOperator.IS_ANY_OF,
        values: ['Gold', 'Platinum', 'Diamond'],
      },
    ])
    .pagination(true, 15)
    .showSearch(true)
    .position(0, 7)
    .size(6, 6)
    .build();

  // ========================================
  // 4. TAB/PAGE BLOCKS FOR ORGANIZATION
  // ========================================
  console.log('4. Creating tab/page blocks...');

  const mainTabs = TabPageBlockBuilder.horizontalTabs()
    .title('Business Dashboard')
    .tab('overview', 'Overview', [
      'revenue-metrics-1',
      'sales-chart-1',
      'customer-count-1',
    ], {
      icon: 'home',
      badge: 'Live',
    })
    .tab('sales', 'Sales Analytics', [
      'sales-heatmap-1',
      'sales-waterfall-1',
      'sales-list-1',
    ], {
      icon: 'trending-up',
    })
    .tab('customers', 'Customer Insights', [
      'customer-list-1',
      'customer-chart-1',
      'customer-segments-1',
    ], {
      icon: 'users',
      badge: 1247,
    })
    .tab('products', 'Product Catalog', [
      'product-list-1',
      'product-performance-1',
    ], {
      icon: 'package',
    })
    .tab('reports', 'Reports', [
      'report-builder-1',
      'scheduled-reports-1',
    ], {
      icon: 'file-text',
    })
    .defaultTab('overview')
    .showTabCount(true)
    .animateTransition(true)
    .allowReorder(true)
    .position(0, 13)
    .size(12, 10)
    .build();

  // ========================================
  // 5. ADVANCED PERMISSION CONFIGURATION
  // ========================================
  console.log('5. Setting up advanced permissions...');

  // Dashboard-level permissions
  const dashboardPermission = new DashboardPermissionBuilder()
    .shareWithTeam()
    .addTeam('team_sales', PermissionLevel.EDIT)
    .addTeam('team_marketing', PermissionLevel.VIEW)
    .addUser('user_ceo', PermissionLevel.ADMIN)
    .addUser('user_sales_director', PermissionLevel.ADMIN)
    .addDepartment('dept_finance', PermissionLevel.VIEW)
    .allowComments(true)
    .allowExport(true)
    .allowShare(true)
    .enablePublicLink(true, 'ViewDash2025!')
    .expiresInDays(365)
    .build();

  // Block-level permission for sensitive data
  const financialBlockPermission = new BlockPermissionBuilder()
    .blockId('revenue-metrics-1')
    .addUser('user_ceo', PermissionLevel.ADMIN)
    .addUser('user_cfo', PermissionLevel.ADMIN)
    .addTeam('team_finance', PermissionLevel.VIEW)
    .inheritFromDashboard(false)
    .build();

  // ========================================
  // 6. DASHBOARD THEME AND SETTINGS
  // ========================================
  console.log('6. Configuring dashboard theme and settings...');

  const customTheme: DashboardTheme = {
    name: 'Corporate Blue',
    colorPrimary: '#2563eb',
    colorSecondary: '#7c3aed',
    colorBackground: '#f8fafc',
    colorText: '#1e293b',
    colorBorder: '#e2e8f0',
    fontFamily: 'Inter, system-ui, sans-serif',
    borderRadius: 8,
  };

  const dashboardSettings: DashboardSettings = {
    autoRefresh: true,
    refreshInterval: 300, // 5 minutes
    theme: customTheme,
    fullscreenEnabled: true,
    exportEnabled: true,
    printEnabled: true,
    timezone: 'Asia/Singapore',
    locale: 'en-US',
  };

  // ========================================
  // 7. COMPLETE DASHBOARD DEFINITION
  // ========================================
  console.log('7. Building complete dashboard...');

  const completeDashboard: Dashboard = {
    name: 'Advanced Business Intelligence Dashboard 2025',
    appToken,
    description: 'Comprehensive dashboard showcasing all 2025 features including enhanced charts, list blocks, tab navigation, and advanced permissions',
    tags: ['business-intelligence', 'sales', 'analytics', '2025'],
    blocks: [
      heatmapChart,
      waterfallChart,
      gaugeChart,
      enhancedMetrics,
      productList,
      customerList,
      mainTabs,
    ],
    permission: dashboardPermission,
    settings: dashboardSettings,
    version: '2.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user_admin',
  };

  console.log('\n========================================');
  console.log('Complete 2025 Dashboard Configuration:');
  console.log('========================================\n');
  console.log(JSON.stringify(completeDashboard, null, 2));

  // ========================================
  // 8. ADDITIONAL 2025 FEATURES SHOWCASE
  // ========================================
  console.log('\n8. Demonstrating additional 2025 features...');

  // Sankey Diagram for Flow Analysis
  const sankeyChart = ChartBlockBuilder
    .chartType(ChartType.SANKEY)
    .dataSource(appToken, salesTableId)
    .title('Customer Journey Flow')
    .xAxis('Source')
    .yAxis([{
      fieldName: 'Target',
      aggregation: AggregationType.COUNT,
    }])
    .colors(['#3b82f6', '#10b981', '#f59e0b', '#ef4444'])
    .animation({ enabled: true, duration: 1200 })
    .build();

  // Candlestick Chart for Financial Data
  const candlestickChart = ChartBlockBuilder
    .chartType(ChartType.CANDLESTICK)
    .dataSource(appToken, salesTableId)
    .title('Stock Price Movement')
    .xAxis('Date', undefined, undefined, 'YYYY-MM-DD')
    .yAxis([
      { fieldName: 'Open', label: 'Open' },
      { fieldName: 'High', label: 'High' },
      { fieldName: 'Low', label: 'Low' },
      { fieldName: 'Close', label: 'Close' },
    ])
    .colors(['#22c55e', '#ef4444'])
    .zoomEnabled(true)
    .panEnabled(true)
    .build();

  // Advanced Filtering with New Operators
  const advancedFilterList = ListBlockBuilder.vertical()
    .dataSource(appToken, salesTableId)
    .title('Recent Orders')
    .titleField('Order ID')
    .subtitleField('Customer')
    .filters(FilterConjunction.AND, [
      {
        fieldName: 'Order Date',
        operator: FilterOperator.IS_WITHIN_DAYS,
        value: 7,
      },
      {
        fieldName: 'Total Amount',
        operator: FilterOperator.IS_BETWEEN,
        value: 100,
        secondValue: 1000,
      },
      {
        fieldName: 'Status',
        operator: FilterOperator.IS_ANY_OF,
        values: ['Processing', 'Shipped'],
      },
      {
        fieldName: 'Customer Email',
        operator: FilterOperator.MATCHES_REGEX,
        value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      },
    ])
    .build();

  console.log('\nAdditional Charts:');
  console.log('- Sankey Diagram:', sankeyChart.blockType);
  console.log('- Candlestick Chart:', candlestickChart.blockType);
  console.log('- Advanced Filter List:', advancedFilterList.blockType);

  // ========================================
  // 9. RESPONSIVE LAYOUT WITH BREAKPOINTS
  // ========================================
  console.log('\n9. Creating responsive layout...');

  const responsiveLayout = {
    columns: [
      {
        width: 12,
        blockIds: ['header-1'],
        minWidth: 320,
        collapsible: false,
      },
      {
        width: 8,
        blockIds: ['main-content-1', 'main-content-2'],
        minWidth: 640,
        maxWidth: 1200,
        collapsible: true,
        collapsed: false,
      },
      {
        width: 4,
        blockIds: ['sidebar-1', 'sidebar-2'],
        minWidth: 320,
        collapsible: true,
        collapsed: false,
      },
    ],
    gap: 16,
    padding: 24,
    responsive: true,
    breakpoints: {
      mobile: 640,
      tablet: 1024,
      desktop: 1280,
    },
    backgroundColor: '#ffffff',
    borderRadius: 12,
  };

  console.log('Responsive Layout:', JSON.stringify(responsiveLayout, null, 2));

  // ========================================
  // SUMMARY
  // ========================================
  console.log('\n========================================');
  console.log('2025 Features Implementation Complete!');
  console.log('========================================\n');

  console.log('Implemented Features:');
  console.log('✓ New Chart Types: Heatmap, Waterfall, Gauge, Sankey, Candlestick');
  console.log('✓ Enhanced Chart Configs: Animation, Tooltips, Zoom, Pan, Crosshair');
  console.log('✓ Advanced Metrics: Comparisons, Sparklines, Targets, Rich Formatting');
  console.log('✓ List Blocks: 5 Layout Styles, Action Buttons, Advanced Filtering');
  console.log('✓ Tab/Page Blocks: 5 Layout Types, Navigation, Badge Support');
  console.log('✓ Permission Management: Dashboard & Block Level, Expiration, Validation');
  console.log('✓ Enhanced Filtering: 9 New Operators, Regex, Date Ranges');
  console.log('✓ Dashboard Settings: Auto-refresh, Themes, Export, Timezone');
  console.log('✓ Responsive Layouts: Breakpoints, Collapsible Columns');
  console.log('✓ Performance: Auto-refresh, Caching, Optimization');

  console.log('\nDashboard Statistics:');
  console.log(`- Total Blocks: ${completeDashboard.blocks?.length || 0}`);
  console.log(`- Permission Entities: ${dashboardPermission.entities?.length || 0}`);
  console.log(`- Tab Count: ${mainTabs.config.tabs?.length || 0}`);
  console.log(`- Version: ${completeDashboard.version}`);
}

// Run the example
main().catch(console.error);
