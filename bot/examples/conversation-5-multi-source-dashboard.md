# Example Conversation 5: Multi-source Dashboard

This example demonstrates creating a dashboard that combines data from multiple tables.

---

## Conversation Flow

### User Message 1
```
Create dashboard "Executive Summary" with app_token: ExecutiveBase456
```

### Bot Response 1
```
⏳ Creating dashboard "Executive Summary"...
✅ Dashboard Created Successfully

Executive Summary

[View Dashboard]
```

---

### User Message 2
```
Add heading "Company Overview - Q1 2025"
```

### Bot Response 2
```
✅ Text block added successfully!
```

---

### Section 1: Sales Metrics

### User Message 3
```
Add text "Sales Performance"
```

### Bot Response 3
```
✅ Text block added successfully!
```

---

### User Message 4
```
Add sum of Revenue metric with table_id: tblSales, field: Revenue
```

### Bot Response 4
```
⏳ Adding metrics block...
✅ Metrics block added successfully!
```

---

### User Message 5
```
Add bar chart showing revenue by region, table_id: tblSales, x_axis: Region, y_axis: Revenue
```

### Bot Response 5
```
⏳ Adding bar chart...
✅ Bar chart added successfully!
```

---

### Section 2: Customer Metrics

### User Message 6
```
Add text "Customer Acquisition"
```

### Bot Response 6
```
✅ Text block added successfully!
```

---

### User Message 7
```
Add count of customers metric with table_id: tblCustomers, field: CustomerID
```

### Bot Response 7
```
⏳ Adding metrics block...
✅ Metrics block added successfully!
```

---

### User Message 8
```
Add line chart showing new customers over time, table_id: tblCustomers, x_axis: SignupDate, y_axis: CustomerID
```

### Bot Response 8
```
⏳ Adding line chart...
✅ Line chart added successfully!
```

---

### Section 3: Product Performance

### User Message 9
```
Add text "Top Products"
```

### Bot Response 9
```
✅ Text block added successfully!
```

---

### User Message 10
```
Add bar chart with table_id: tblProducts, x_axis: ProductName, y_axis: UnitsSold
```

### Bot Response 10
```
⏳ Adding bar chart...
✅ Bar chart added successfully!
```

---

### Section 4: Team Activity

### User Message 11
```
Add text "Team Activity"
```

### Bot Response 11
```
✅ Text block added successfully!
```

---

### User Message 12
```
Add metrics for completed tasks, table_id: tblTasks, field: TaskID, aggregation: count
```

### Bot Response 12
```
⏳ Adding metrics block...
✅ Metrics block added successfully!
```

---

### User Message 13
```
Add kanban view with table_id: tblTasks
```

### Bot Response 13
```
⏳ Adding kanban view...
✅ Kanban view added successfully!
```

---

## Final Dashboard Structure

**Dashboard Name:** Executive Summary

**Data Sources:**
- tblSales (Sales data)
- tblCustomers (Customer data)
- tblProducts (Product data)
- tblTasks (Task tracking)

**Blocks:**

1. Text Block: "Company Overview - Q1 2025" (Heading)

**Sales Performance:**
2. Text Block: "Sales Performance"
3. Metrics: Total Revenue (from tblSales)
4. Chart: Revenue by Region (from tblSales)

**Customer Acquisition:**
5. Text Block: "Customer Acquisition"
6. Metrics: Total Customers (from tblCustomers)
7. Chart: New Customers Over Time (from tblCustomers)

**Top Products:**
8. Text Block: "Top Products"
9. Chart: Products by Units Sold (from tblProducts)

**Team Activity:**
10. Text Block: "Team Activity"
11. Metrics: Completed Tasks (from tblTasks)
12. View: Task Kanban Board (from tblTasks)

**Dashboard URL:** `https://feishu.cn/base/ExecutiveBase456?table=blk_xxxxx`

---

## Key Features

1. **Multiple Data Sources**: Combines 4 different tables
2. **Organized Sections**: Text blocks create clear sections
3. **Varied Visualizations**: Metrics, charts, and views
4. **Comprehensive Overview**: Sales, customers, products, and tasks
5. **Executive-friendly**: High-level summary with drill-down options

---

## Dashboard Organization Tips

### Use Text Blocks as Section Headers

```
Add text "Sales Performance"
Add text "Customer Metrics"
Add text "Product Analysis"
```

### Logical Flow

1. Start with overview/summary
2. Group related metrics together
3. Progress from high-level to detailed
4. End with actionable views (kanban, grid)

### Visual Hierarchy

- **Heading**: Main dashboard title
- **Text**: Section headers
- **Metrics**: Key numbers first
- **Charts**: Supporting visualizations
- **Views**: Detailed data exploration

---

## Multi-source Patterns

### Pattern 1: Departmental Dashboard

Combine data from different departments:
- Sales team (tblSales)
- Marketing team (tblCampaigns)
- Support team (tblTickets)
- Product team (tblFeatures)

### Pattern 2: Customer Journey

Track customer lifecycle:
- Leads (tblLeads)
- Opportunities (tblOpportunities)
- Customers (tblCustomers)
- Support (tblTickets)

### Pattern 3: Project Overview

Monitor project health:
- Tasks (tblTasks)
- Milestones (tblMilestones)
- Resources (tblResources)
- Budget (tblBudget)

---

## Data Integration Best Practices

### 1. Consistent Naming

Use consistent field names across tables:
- `CustomerID` (not `customer_id`, `custID`, etc.)
- `Revenue` (not `sales`, `income`, etc.)

### 2. Shared Dimensions

Ensure tables share common dimensions:
- Date fields (for time-based analysis)
- Category fields (for grouping)
- ID fields (for relationships)

### 3. Data Freshness

Keep data up-to-date:
- Use Lark Base automations
- Set up API integrations
- Schedule regular imports

### 4. Access Control

Verify bot has access to all tables:
```
Check permissions for:
- tblSales
- tblCustomers
- tblProducts
- tblTasks
```

---

## Advanced Multi-source Scenarios

### Cross-table Calculations

For metrics that span tables, pre-calculate in Lark Base:

1. Create calculated fields
2. Use Lark Base formulas
3. Reference in dashboard blocks

Example:
```
# In Lark Base
Customer Lifetime Value =
  LOOKUP(tblOrders, CustomerID, SUM(OrderTotal))
```

Then display in dashboard:
```
Add metrics for CLV, table_id: tblCustomers, field: CustomerLifetimeValue
```

### Time-aligned Views

Ensure all data uses same time periods:

```
Add line chart (sales) for Jan-Mar 2025
Add line chart (customers) for Jan-Mar 2025
Add line chart (products) for Jan-Mar 2025
```

Use view filters or date range parameters to align timeframes.

---

## Conversation Tips

1. **Plan Structure First**: Decide on sections before creating
2. **Create Incrementally**: Add blocks one at a time
3. **Test Data Sources**: Verify each table_id is correct
4. **Add Context**: Use text blocks liberally
5. **Review Layout**: Check dashboard after each section
6. **Iterate**: Add/remove blocks as needed

The bot makes it easy to build complex multi-source dashboards through natural conversation!
