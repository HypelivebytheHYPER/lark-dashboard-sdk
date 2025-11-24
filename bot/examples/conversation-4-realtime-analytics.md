# Example Conversation 4: Real-time Analytics Dashboard

This example shows creating a real-time analytics dashboard for monitoring live data.

---

## Conversation Flow

### User Message 1
```
Create a real-time analytics dashboard with app_token: AnalyticsApp789
```

### Bot Response 1
```
⏳ Creating dashboard "real-time analytics dashboard"...
✅ Dashboard Created Successfully

real-time analytics dashboard

[View Dashboard]

Blocks Created:
1. Dashboard header

💡 You can now add blocks to this dashboard:
- "Add a bar chart showing sales by category"
- "Add metrics showing total revenue"
- "Add a grid view of the data"
```

---

### User Message 2
```
Add heading "Live System Metrics - Last 5 Minutes"
```

### Bot Response 2
```
✅ Text block added successfully!
```

---

### User Message 3
```
Add metrics for active users, table_id: tblMetrics, field: ActiveUsers, aggregation: count
```

### Bot Response 3
```
⏳ Adding metrics block...
✅ Metrics block added successfully!
```

---

### User Message 4
```
Add sum of requests metric with table_id: tblMetrics, field: RequestCount
```

### Bot Response 4
```
⏳ Adding metrics block...
✅ Metrics block added successfully!
```

---

### User Message 5
```
Add average response time metric, table_id: tblMetrics, field: ResponseTime, aggregation: avg
```

### Bot Response 5
```
⏳ Adding metrics block...
✅ Metrics block added successfully!
```

---

### User Message 6
```
Add area chart showing request rate over time, table_id: tblMetrics, x_axis: Timestamp, y_axis: RequestRate
```

### Bot Response 6
```
⏳ Adding area chart...
✅ Area chart added successfully!
```

---

### User Message 7
```
Add line chart for response time trends, table_id: tblMetrics, x_axis: Timestamp, y_axis: ResponseTime
```

### Bot Response 7
```
⏳ Adding line chart...
✅ Line chart added successfully!
```

---

### User Message 8
```
Add pie chart showing errors by type, table_id: tblErrors, x_axis: ErrorType, y_axis: ErrorCount
```

### Bot Response 8
```
⏳ Adding pie chart...
✅ Pie chart added successfully!
```

---

### User Message 9
```
Add grid view with table_id: tblMetrics
```

### Bot Response 9
```
⏳ Adding grid view...
✅ Grid view added successfully!
```

---

## Final Dashboard Structure

**Dashboard Name:** real-time analytics dashboard

**Blocks:**
1. Text Block: "Live System Metrics - Last 5 Minutes" (Heading)
2. Metrics Block: Active Users (COUNT)
3. Metrics Block: Total Requests (SUM)
4. Metrics Block: Avg Response Time (AVG)
5. Chart Block: Request Rate Over Time (Area Chart)
6. Chart Block: Response Time Trends (Line Chart)
7. Chart Block: Errors by Type (Pie Chart)
8. View Block: Raw Metrics Data (Grid View)

**Dashboard URL:** `https://feishu.cn/base/AnalyticsApp789?table=blk_xxxxx`

---

## Key Features

1. **Multiple Metrics**: Track different KPIs simultaneously
2. **Time Series Charts**: Area and line charts for trends
3. **Error Monitoring**: Pie chart for error distribution
4. **Raw Data Access**: Grid view for detailed inspection
5. **Descriptive Headers**: Clear title explaining data timeframe

---

## Use Cases

This dashboard pattern works well for:

- **System Monitoring**: CPU, memory, disk usage
- **Application Metrics**: Request rates, error rates, latency
- **Business Analytics**: Sales, conversions, user activity
- **IoT Data**: Sensor readings, device status
- **Log Analysis**: Error counts, warning trends

---

## Real-time Updates

For true real-time dashboards:

1. **Data Source**: Connect to real-time Lark Base table
2. **Auto-refresh**: Lark automatically refreshes dashboard views
3. **Update Frequency**: Depends on data source update rate
4. **Time Windows**: Use view filters for "last 5 minutes", "last hour", etc.

---

## Advanced Tips

### Time-based Filters

When creating views, use Lark's filter features:

```
Add grid view with table_id: tblMetrics, view_id: viewLast5Min
```

Pre-configure `viewLast5Min` in Lark Base to filter:
- Timestamp >= NOW() - 5 minutes

### Multiple Time Windows

Create multiple dashboards for different time ranges:

```
Create dashboard "Real-time (5 min)" with app_token: xxx
Create dashboard "Recent (1 hour)" with app_token: xxx
Create dashboard "Daily (24 hours)" with app_token: xxx
```

### Alert Thresholds

Add visual indicators with color-coded metrics:

```
Add metrics with threshold colors:
- Green: < 100ms response time
- Yellow: 100-500ms
- Red: > 500ms
```

---

## Monitoring Best Practices

1. **Start Simple**: Begin with 3-5 key metrics
2. **Add Context**: Use text blocks to explain metrics
3. **Show Trends**: Include time series charts
4. **Enable Drill-down**: Add grid view for detailed analysis
5. **Set Refresh Rate**: Configure appropriate update frequency
6. **Test Alerts**: Verify error detection works
7. **Document Thresholds**: Note what values are "normal"
