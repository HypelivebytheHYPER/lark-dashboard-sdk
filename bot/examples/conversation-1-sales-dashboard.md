# Example Conversation 1: Creating a Sales Dashboard

This example shows how to create a complete sales dashboard with multiple blocks.

---

## Conversation Flow

### User Message 1
```
Create a sales dashboard with app_token: FUVdb7bebaVLeMsKJgJlnsX2gzd
```

### Bot Response 1
```
⏳ Creating dashboard "sales dashboard"...
```

### Bot Response 2 (Success Card)
```
✅ Dashboard Created Successfully

Sales dashboard

[View Dashboard]

Blocks Created:
1. Dashboard header

[Open Dashboard Button]

💡 You can now add blocks to this dashboard:
- "Add a bar chart showing sales by category"
- "Add metrics showing total revenue"
- "Add a grid view of the data"
```

---

### User Message 2
```
Add a bar chart with table_id: tblSalesData, x_axis: Month, y_axis: Revenue
```

### Bot Response 3
```
⏳ Adding bar chart...
✅ Bar chart added successfully!
```

---

### User Message 3
```
Add sum of Revenue metric with table_id: tblSalesData, field: Revenue
```

### Bot Response 4
```
⏳ Adding metrics block...
✅ Metrics block added successfully!
```

---

### User Message 4
```
Add grid view with table_id: tblSalesData
```

### Bot Response 5
```
⏳ Adding grid view...
✅ Grid view added successfully!
```

---

### User Message 5
```
Add heading "Sales Performance Q1 2025"
```

### Bot Response 6
```
✅ Text block added successfully!
```

---

## Final Dashboard Structure

**Dashboard Name:** Sales dashboard

**Blocks:**
1. Text Block: "Sales Performance Q1 2025" (Heading)
2. Metrics Block: Total Revenue (SUM)
3. Chart Block: Revenue by Month (Bar Chart)
4. View Block: Sales Data (Grid View)

**Dashboard URL:** `https://feishu.cn/base/FUVdb7bebaVLeMsKJgJlnsX2gzd?table=blk_xxxxx`

---

## Key Learnings

1. **Context Memory**: Bot remembers the current dashboard and app_token across messages
2. **Natural Language**: Users can describe blocks in natural language
3. **Progressive Creation**: Dashboard is built incrementally, block by block
4. **Quick Feedback**: Bot provides immediate feedback for each action
5. **Visual Results**: Dashboard URL is shared for immediate viewing

---

## Tips

- Create dashboard first with app_token
- Bot remembers context for 30 minutes
- Add blocks one at a time for better control
- Use specific field names from your Lark Base
- Check dashboard URL to see results immediately
