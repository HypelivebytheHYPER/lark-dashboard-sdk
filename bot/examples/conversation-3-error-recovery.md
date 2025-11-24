# Example Conversation 3: Error Recovery

This example shows how the bot handles errors and helps users recover from mistakes.

---

## Scenario 1: Missing App Token

### User Message 1
```
Create a sales dashboard
```

### Bot Response 1
```
❓ I need an app token to create the dashboard. Please provide it like:
"Create dashboard with app_token: YOUR_APP_TOKEN"
```

### User Message 2
```
Create a sales dashboard with app_token: MyAppToken123
```

### Bot Response 2
```
⏳ Creating dashboard "sales dashboard"...
✅ Dashboard Created Successfully
```

**Learning:** Bot prompts for missing required information.

---

## Scenario 2: Missing Table ID

### User Message 1
```
Add a bar chart showing revenue by category
```

### Bot Response 1
```
❓ I need a table ID. Example: "table_id: tblXXXX"
```

### User Message 2
```
Add a bar chart with table_id: tblSales, x_axis: Category, y_axis: Revenue
```

### Bot Response 2
```
⏳ Adding bar chart...
✅ Bar chart added successfully!
```

**Learning:** Bot identifies missing parameters and guides users.

---

## Scenario 3: Invalid Chart Type

### User Message 1
```
Add a pyramid chart with table_id: tblData, x_axis: Month, y_axis: Sales
```

### Bot Response 1
```
❓ What type of chart? (bar, line, pie, scatter, area, column, funnel, radar, table)
```

### User Message 2
```
Add a funnel chart with table_id: tblData, x_axis: Month, y_axis: Sales
```

### Bot Response 2
```
⏳ Adding funnel chart...
✅ Funnel chart added successfully!
```

**Learning:** Bot suggests valid options when user input is unclear.

---

## Scenario 4: No Dashboard Context

### User Message 1
```
Add metrics showing revenue
```

### Bot Response 1
```
❓ Please create a dashboard first.
```

### User Message 2
```
Create dashboard "Revenue Tracker" with app_token: RevenueApp456
```

### Bot Response 2
```
✅ Dashboard Created Successfully
```

### User Message 3
```
Add sum of Revenue metric with table_id: tblRevenue, field: Revenue
```

### Bot Response 3
```
✅ Metrics block added successfully!
```

**Learning:** Bot enforces workflow - dashboard must exist before adding blocks.

---

## Scenario 5: API Error

### User Message 1
```
Add bar chart with table_id: tblInvalid, x_axis: X, y_axis: Y
```

### Bot Response 1
```
❌ Failed to add chart: Table not found or access denied. Please check:
1. Table ID is correct
2. Bot has access to the base
3. Table exists and is not archived
```

**Learning:** Bot provides helpful error messages with troubleshooting steps.

---

## Scenario 6: Unclear Intent

### User Message 1
```
Show me something interesting
```

### Bot Response 1
```
I'm not sure what you want me to do. Type "help" to see available commands.
```

### User Message 2
```
help
```

### Bot Response 2
```
🤖 **Lark Dashboard Assistant**

I can help you create dashboards using natural language! Here's what I can do:

**Create Dashboard:**
- "Create a sales dashboard with app_token: YOUR_TOKEN"

**Add Chart:**
- "Add a bar chart with table_id: tbl123, x_axis: Category, y_axis: Sales"

[... full help message ...]
```

**Learning:** Bot directs users to help when intent is unclear.

---

## Scenario 7: Typo Recovery

### User Message 1
```
Add bart chart with table_id: tblSales
```

### Bot Response 1
```
❓ What type of chart? (bar, line, pie, scatter, area, column, funnel, radar, table)
```

**Learning:** Bot tolerates typos by asking for clarification.

---

## Scenario 8: Multi-step Error Recovery

### User Message 1
```
Create dashboard
```

### Bot Response 1
```
❓ I need an app token to create the dashboard.
```

### User Message 2
```
app_token: MyToken
```

### Bot Response 2
```
❓ What would you like to name this dashboard?
```

### User Message 3
```
Sales Dashboard
```

### Bot Response 3
```
⏳ Creating dashboard "Sales Dashboard"...
✅ Dashboard Created Successfully
```

**Learning:** Bot can handle multi-turn clarifications with context memory.

---

## Error Recovery Best Practices

### 1. Clear Error Messages
- ❌ "Error"
- ✅ "I need an app token to create the dashboard"

### 2. Provide Examples
- ❌ "Missing field"
- ✅ "Example: table_id: tblXXXX"

### 3. Suggest Alternatives
- ❌ "Invalid type"
- ✅ "Try: bar, line, pie, scatter, area, column, funnel, radar, table"

### 4. Maintain Context
- Remember previous messages
- Don't ask for same information twice
- Help users complete interrupted workflows

### 5. Graceful Degradation
- Provide fallback responses
- Never leave user stuck
- Always offer help as last resort

---

## Tips for Users

1. **Start with Help**: Type "help" to see all commands
2. **Provide Complete Information**: Include app_token, table_id, and field names
3. **Check Error Messages**: They contain helpful troubleshooting steps
4. **Try Again**: Bot maintains context, you can retry with corrections
5. **Ask Questions**: Bot will guide you through missing information
