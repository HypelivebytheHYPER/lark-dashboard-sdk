/**
 * List Block Example (New 2025)
 * Demonstrates the new list block functionality with various layouts
 */

import {
  LarkDashboardClient,
  ListBlockBuilder,
  FilterOperator,
  FilterConjunction,
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

  console.log('Creating dashboards with list blocks...\n');

  // Example 1: Vertical List with Detailed Layout
  console.log('1. Creating vertical list with task items...');
  const taskList = ListBlockBuilder.vertical()
    .dataSource(appToken, tableId)
    .title('Active Tasks')
    .titleField('Task Name')
    .subtitleField('Assignee')
    .descriptionField('Description')
    .badgeField('Status')
    .imageField('Avatar')
    .metaFields(['Due Date', 'Priority', 'Category'])
    .addEditButton()
    .addDeleteButton()
    .addLinkButton('View Details', '/tasks/{id}', 'eye', 'primary')
    .sortDesc('Created At')
    .sortAsc('Priority', 2)
    .filters(FilterConjunction.AND, [
      {
        fieldName: 'Status',
        operator: FilterOperator.IS_NOT,
        value: 'Completed',
      },
      {
        fieldName: 'Due Date',
        operator: FilterOperator.IS_AFTER_DATE,
        value: new Date().toISOString(),
      },
    ])
    .pagination(true, 20)
    .showSearch(true)
    .showFilters(true)
    .clickable(true, 'detail')
    .position(0, 0)
    .size(12, 6)
    .build();

  // Example 2: Grid Layout for Product Catalog
  console.log('2. Creating grid list for products...');
  const productGrid = ListBlockBuilder.grid()
    .dataSource(appToken, tableId)
    .title('Product Catalog')
    .titleField('Product Name')
    .subtitleField('Price')
    .descriptionField('Description')
    .imageField('Product Image')
    .badgeField('Stock Status')
    .metaFields(['Category', 'Rating', 'Reviews'])
    .addLinkButton('View', '/products/{id}', 'shopping-cart')
    .addLinkButton('Add to Cart', '/cart/add/{id}', 'plus', 'success')
    .sortDesc('Rating')
    .filters(FilterConjunction.AND, [
      {
        fieldName: 'Stock Status',
        operator: FilterOperator.IS_NOT,
        value: 'Out of Stock',
      },
    ])
    .pagination(true, 24)
    .showSearch(true)
    .groupBy('Category')
    .clickable(true, 'detail')
    .position(0, 6)
    .size(12, 6)
    .build();

  // Example 3: Compact List for Notifications
  console.log('3. Creating compact list for notifications...');
  const notificationList = ListBlockBuilder.compact()
    .dataSource(appToken, tableId)
    .title('Recent Notifications')
    .titleField('Message')
    .subtitleField('Time')
    .iconField('Icon')
    .badgeField('Unread')
    .metaFields(['Type'])
    .sortDesc('Created At')
    .pagination(true, 50)
    .clickable(true, 'custom')
    .position(0, 12)
    .size(6, 4)
    .build();

  // Example 4: Horizontal List for Team Members
  console.log('4. Creating horizontal list for team...');
  const teamList = ListBlockBuilder.horizontal()
    .dataSource(appToken, tableId)
    .title('Team Members')
    .titleField('Name')
    .subtitleField('Role')
    .imageField('Avatar')
    .badgeField('Online Status')
    .metaFields(['Department', 'Location'])
    .addLinkButton('Profile', '/users/{id}', 'user')
    .addLinkButton('Message', '/chat/{id}', 'message', 'info')
    .sortAsc('Name')
    .pagination(false)
    .position(6, 12)
    .size(6, 4)
    .build();

  // Example 5: Detailed List with All Features
  console.log('5. Creating detailed list with advanced filtering...');
  const detailedList = ListBlockBuilder.detailed()
    .dataSource(appToken, tableId)
    .title('Customer Orders')
    .titleField('Order ID')
    .subtitleField('Customer Name')
    .descriptionField('Order Details')
    .badgeField('Order Status')
    .metaFields(['Order Date', 'Total Amount', 'Payment Method', 'Shipping Address'])
    .addEditButton('Edit Order', 'edit')
    .addLinkButton('View Invoice', '/invoices/{id}', 'file-text')
    .addLinkButton('Track Shipment', '/tracking/{id}', 'truck', 'info')
    .sortDesc('Order Date')
    .sortDesc('Total Amount', 2)
    .filters(FilterConjunction.OR, [
      {
        fieldName: 'Order Status',
        operator: FilterOperator.IS_ANY_OF,
        values: ['Processing', 'Shipped', 'Pending'],
      },
      {
        fieldName: 'Total Amount',
        operator: FilterOperator.IS_GREATER,
        value: 1000,
      },
    ])
    .pagination(true, 15)
    .showSearch(true)
    .showFilters(true)
    .groupBy('Order Status')
    .clickable(true, 'detail')
    .position(0, 16)
    .size(12, 8)
    .build();

  console.log('\nList blocks created successfully!');
  console.log('\nBlock configurations:');
  console.log('1. Task List:', JSON.stringify(taskList.config, null, 2));
  console.log('2. Product Grid:', JSON.stringify(productGrid.config, null, 2));
  console.log('3. Notifications:', JSON.stringify(notificationList.config, null, 2));
  console.log('4. Team List:', JSON.stringify(teamList.config, null, 2));
  console.log('5. Detailed Orders:', JSON.stringify(detailedList.config, null, 2));

  // Note: Actual API integration would require dashboard creation endpoint
  // This example demonstrates the builder patterns and configurations
}

// Run the example
main().catch(console.error);
