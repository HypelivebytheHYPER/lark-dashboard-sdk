# Example Conversation 2: Team Performance Dashboard

This example demonstrates creating a team performance tracking dashboard with various metrics and charts.

---

## Conversation Flow

### User Message 1
```
Create dashboard called "Team Performance Q1" with app_token: TeamBase123
```

### Bot Response 1
```
⏳ Creating dashboard "Team Performance Q1"...

✅ Dashboard Created Successfully

Team Performance Q1

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
Add line chart showing completed tasks over time, table_id: tblTasks, x_axis: CompletionDate, y_axis: TaskCount
```

### Bot Response 2
```
⏳ Adding line chart...
✅ Line chart added successfully!
```

---

### User Message 3
```
Add count of tasks metric with table_id: tblTasks, field: TaskID
```

### Bot Response 3
```
⏳ Adding metrics block...
✅ Metrics block added successfully!
```

---

### User Message 4
```
Add another metric for average completion time, table_id: tblTasks, field: CompletionTime, aggregation: avg
```

### Bot Response 4
```
⏳ Adding metrics block...
✅ Metrics block added successfully!
```

---

### User Message 5
```
Add pie chart with table_id: tblTasks, x_axis: Priority, y_axis: TaskCount
```

### Bot Response 5
```
⏳ Adding pie chart...
✅ Pie chart added successfully!
```

---

### User Message 6
```
Add kanban view with table_id: tblTasks
```

### Bot Response 6
```
⏳ Adding kanban view...
✅ Kanban view added successfully!
```

---

### User Message 7
```
Add text "Dashboard shows team task completion metrics for Q1 2025"
```

### Bot Response 7
```
✅ Text block added successfully!
```

---

## Final Dashboard Structure

**Dashboard Name:** Team Performance Q1

**Blocks:**
1. Text Block: Description
2. Metrics Block: Total Tasks (COUNT)
3. Metrics Block: Avg Completion Time (AVG)
4. Chart Block: Tasks Over Time (Line Chart)
5. Chart Block: Tasks by Priority (Pie Chart)
6. View Block: Task Kanban Board (Kanban View)

**Dashboard URL:** `https://feishu.cn/base/TeamBase123?table=blk_xxxxx`

---

## Key Features Demonstrated

1. **Custom Dashboard Name**: Explicit naming with "called" keyword
2. **Multiple Chart Types**: Line chart and pie chart in same dashboard
3. **Multiple Metrics**: Track different aggregations (COUNT, AVG)
4. **Different View Types**: Kanban for visual task management
5. **Descriptive Text**: Added context with text block

---

## Natural Language Variations

These messages would also work:

- "Add line graph of tasks completed by date"
- "Show me total number of tasks"
- "Add average time to complete"
- "Create a pie chart for task priorities"
- "Add a kanban board"
- "Add description text"

The bot understands various phrasings!

---

## Multi-turn Context

Notice how the bot:
- Remembers the app_token (TeamBase123)
- Doesn't ask for dashboard_id after creation
- Maintains conversation flow
- Allows adding multiple blocks sequentially
