/**
 * Permissions Example (New 2025)
 * Demonstrates advanced permission management for dashboards and blocks
 */

import {
  LarkDashboardClient,
  DashboardPermissionBuilder,
  BlockPermissionBuilder,
  PermissionHelper,
  PermissionLevel,
  SharingMode,
  ChartBlockBuilder,
  MetricsBlockBuilder,
  ChartType,
  AggregationType,
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

  console.log('Creating dashboards with advanced permissions...\n');

  // Example 1: Private Dashboard (Owner Only)
  console.log('1. Creating private dashboard...');
  const privateDashboardPermission = new DashboardPermissionBuilder()
    .private()
    .allowComments(false)
    .allowExport(false)
    .allowShare(false)
    .build();

  console.log('Private Permission:', JSON.stringify(privateDashboardPermission, null, 2));

  // Example 2: Public Dashboard (Anyone Can View)
  console.log('\n2. Creating public dashboard...');
  const publicDashboardPermission = new DashboardPermissionBuilder()
    .public()
    .allowComments(true)
    .allowExport(true)
    .allowShare(false)
    .build();

  console.log('Public Permission:', JSON.stringify(publicDashboardPermission, null, 2));

  // Example 3: Share Via Link with Password
  console.log('\n3. Creating dashboard with password-protected link...');
  const linkSharePermission = new DashboardPermissionBuilder()
    .shareViaLink('SecureP@ss123')
    .allowComments(true)
    .allowExport(false)
    .allowShare(false)
    .expiresInDays(30)
    .build();

  console.log('Link Share Permission:', JSON.stringify(linkSharePermission, null, 2));

  // Example 4: Team Dashboard with Specific Permissions
  console.log('\n4. Creating team dashboard with role-based access...');
  const teamDashboardPermission = new DashboardPermissionBuilder()
    .shareWithTeam()
    .addTeam('team_marketing', PermissionLevel.EDIT)
    .addTeam('team_sales', PermissionLevel.VIEW)
    .addUser('user_ceo', PermissionLevel.ADMIN)
    .addUser('user_analyst', PermissionLevel.EDIT)
    .addDepartment('dept_finance', PermissionLevel.VIEW)
    .allowComments(true)
    .allowExport(true)
    .allowShare(true)
    .build();

  console.log('Team Permission:', JSON.stringify(teamDashboardPermission, null, 2));

  // Example 5: Dashboard with Specific Users and Expiration
  console.log('\n5. Creating dashboard for specific users with expiration...');
  const specificUsersPermission = new DashboardPermissionBuilder()
    .shareWithUsers()
    .addUser('user_alice', PermissionLevel.ADMIN)
    .addUser('user_bob', PermissionLevel.EDIT)
    .addUser('user_charlie', PermissionLevel.VIEW)
    .addUser('user_diana', PermissionLevel.COMMENT)
    .addTeam('team_executives', PermissionLevel.ADMIN)
    .allowComments(true)
    .allowExport(true)
    .allowShare(false)
    .expiresInDays(90)
    .build();

  console.log('Specific Users Permission:', JSON.stringify(specificUsersPermission, null, 2));

  // Example 6: Block-Level Permissions
  console.log('\n6. Creating blocks with specific permissions...');

  // Public metrics block
  const publicMetricsBlock = MetricsBlockBuilder
    .dataSource(appToken, tableId)
    .field('Total Sales')
    .aggregation(AggregationType.SUM)
    .title('Total Sales')
    .prefix('$')
    .build();

  // Sensitive financial block with restricted access
  const sensitiveFinancialPermission = new BlockPermissionBuilder()
    .blockId('financial-metrics-1')
    .addUser('user_cfo', PermissionLevel.ADMIN)
    .addUser('user_accountant', PermissionLevel.VIEW)
    .addTeam('team_finance', PermissionLevel.VIEW)
    .inheritFromDashboard(false)
    .build();

  console.log('Block Permission:', JSON.stringify(sensitiveFinancialPermission, null, 2));

  // Example 7: Complex Multi-Level Permission Structure
  console.log('\n7. Creating complex permission structure...');

  const complexPermission = new DashboardPermissionBuilder()
    .shareWithUsers()
    // Executives - Full Control
    .addUser('user_ceo', PermissionLevel.OWNER)
    .addUser('user_cto', PermissionLevel.ADMIN)
    .addUser('user_cfo', PermissionLevel.ADMIN)
    // Managers - Edit Access
    .addTeam('team_managers', PermissionLevel.EDIT)
    .addDepartment('dept_leadership', PermissionLevel.EDIT)
    // Employees - View Only
    .addTeam('team_all_employees', PermissionLevel.VIEW)
    // Contractors - Comment Only
    .addUser('user_contractor_1', PermissionLevel.COMMENT)
    .addUser('user_contractor_2', PermissionLevel.COMMENT)
    .allowComments(true)
    .allowExport(false)
    .allowShare(true)
    .enablePublicLink(true, 'ViewOnlyP@ss')
    .expiresInDays(180)
    .build();

  console.log('Complex Permission:', JSON.stringify(complexPermission, null, 2));

  // Example 8: Permission Validation
  console.log('\n8. Validating permissions...');

  const validPermission = new DashboardPermissionBuilder()
    .shareWithUsers()
    .addUser('user_test', PermissionLevel.EDIT)
    .allowComments(true)
    .build();

  const validation = PermissionHelper.validate(validPermission);
  console.log('Validation Result:', validation);

  // Example 9: Invalid Permission (should fail validation)
  console.log('\n9. Testing invalid permission...');

  try {
    const invalidPermission = new DashboardPermissionBuilder()
      .shareWithUsers()
      // No users added - should fail validation
      .allowComments(true)
      .build();

    const invalidValidation = PermissionHelper.validate(invalidPermission);
    console.log('Invalid Permission Validation:', invalidValidation);
  } catch (error) {
    console.log('Expected error:', error);
  }

  // Example 10: Permission Level Checking
  console.log('\n10. Checking permission levels...');

  const userLevel = PermissionLevel.EDIT;
  const requiredLevel = PermissionLevel.VIEW;

  const hasPermission = PermissionHelper.hasPermission(userLevel, requiredLevel);
  console.log(`User with ${userLevel} has ${requiredLevel} permission:`, hasPermission);

  const levels = [
    PermissionLevel.VIEW,
    PermissionLevel.EDIT,
    PermissionLevel.COMMENT,
    PermissionLevel.ADMIN,
  ];
  const highestLevel = PermissionHelper.getHighestLevel(levels);
  console.log('Highest permission level:', highestLevel);

  // Example 11: Complete Dashboard with Permissions
  console.log('\n11. Creating complete dashboard with permissions...');

  // Create dashboard permission
  const dashboardPermission = new DashboardPermissionBuilder()
    .shareWithTeam()
    .addTeam('team_analytics', PermissionLevel.EDIT)
    .addTeam('team_business', PermissionLevel.VIEW)
    .addUser('user_data_admin', PermissionLevel.ADMIN)
    .allowComments(true)
    .allowExport(true)
    .allowShare(true)
    .build();

  // Create chart with public access
  const publicChart = ChartBlockBuilder.bar()
    .dataSource(appToken, tableId)
    .title('Sales by Region')
    .chartType(ChartType.BAR)
    .xAxis('Region')
    .yAxis([{ fieldName: 'Sales', aggregation: AggregationType.SUM }])
    .position(0, 0)
    .size(6, 4)
    .build();

  // Create sensitive metrics with restricted access
  const sensitiveMetrics = MetricsBlockBuilder
    .dataSource(appToken, tableId)
    .field('Profit Margin')
    .aggregation(AggregationType.AVG)
    .title('Profit Margin')
    .suffix('%')
    .decimals(2)
    .position(6, 0)
    .size(6, 4)
    .build();

  const sensitiveBlockPermission = new BlockPermissionBuilder()
    .blockId('sensitive-metrics-1')
    .addUser('user_data_admin', PermissionLevel.ADMIN)
    .addTeam('team_finance', PermissionLevel.VIEW)
    .inheritFromDashboard(false)
    .build();

  console.log('\nDashboard Permission:', JSON.stringify(dashboardPermission, null, 2));
  console.log('Sensitive Block Permission:', JSON.stringify(sensitiveBlockPermission, null, 2));

  // Example 12: Temporary Access with Expiration
  console.log('\n12. Creating temporary access permission...');

  const temporaryPermission = new DashboardPermissionBuilder()
    .shareViaLink('TempP@ss456')
    .allowComments(false)
    .allowExport(false)
    .allowShare(false)
    .expiresInDays(7)
    .build();

  const isExpired = PermissionHelper.isExpired(temporaryPermission);
  console.log('Temporary Permission:', JSON.stringify(temporaryPermission, null, 2));
  console.log('Is Expired:', isExpired);

  console.log('\nPermission examples completed successfully!');
}

// Run the example
main().catch(console.error);
