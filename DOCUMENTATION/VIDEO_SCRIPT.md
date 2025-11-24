# Lark Dashboard SDK - 5-Minute Demo Video Script

## Video Overview
**Duration**: 5 minutes
**Target Audience**: Developers, business analysts, Lark users
**Goal**: Showcase SDK capabilities and encourage adoption

---

## Scene 1: Introduction (0:00 - 0:30)

### Visual
- Show Lark Dashboard SDK logo
- Display code editor with SDK open
- Show final dashboard in background

### Script
"Welcome to the Lark Dashboard SDK - the fastest way to create professional dashboards in Lark.

In just 5 minutes, I'll show you how to:
- Create a dashboard with real data
- Add charts, metrics, and tables
- Use modern 2025 features

Let's get started!"

---

## Scene 2: Setup (0:30 - 1:00)

### Visual
- Terminal showing SDK installation
- Package.json with dependencies
- Environment variable setup

### Script
"First, install the SDK with npm. Just one line:
[SHOW: npm install @hypelab/lark-dashboard-sdk]

Get your API key from Lark's admin console, and you're ready to code.

The SDK works with any Lark Bitable app - no special setup needed."

---

## Scene 3: Creating a Dashboard (1:00 - 2:00)

### Visual
- Code editor showing dashboard creation
- Highlight: LarkDashboardClient initialization
- Show: createDashboard call
- Display: Success message in console

### Script
"Creating a dashboard is simple. First, initialize the client with your API key.

[SHOW CODE]
```typescript
const client = new LarkDashboardClient({
  apiKey: process.env.LARK_API_KEY,
  region: 'sg'
});
```

Then create the dashboard:
[SHOW CODE]
```typescript
const dashboardId = await client.createDashboard({
  name: 'Sales Dashboard 2025',
  appToken: 'YOUR_APP_TOKEN'
});
```

That's it! You now have an empty dashboard ready for content."

---

## Scene 4: Adding Charts (2:00 - 3:30)

### Visual
- Code editor with ChartBlockBuilder
- Show bar chart creation code
- Display: Chart appearing in live dashboard
- Show: Multiple chart types (line, pie)

### Script
"The SDK includes builders for different chart types. Let's add a bar chart:

[SHOW CODE]
```typescript
const chart = ChartBlockBuilder.bar()
  .dataSource('YOUR_APP_TOKEN', 'sales_table')
  .xAxis({ fieldName: 'Month' })
  .yAxis([{
    fieldName: 'Revenue',
    aggregation: AggregationType.SUM
  }])
  .title('Monthly Revenue')
  .colors(['#3b82f6', '#10b981'])
  .build();
```

You can create bar charts, line charts, pie charts, and more.

Add it to your dashboard with:
[SHOW CODE]
```typescript
await client.addBlock('YOUR_APP_TOKEN', dashboardId, chart);
```

The chart appears instantly in your dashboard, pulling live data from your Lark table."

---

## Scene 5: Adding Metrics (3:30 - 4:15)

### Visual
- Code editor showing MetricsBlockBuilder
- Show metric card appearing in dashboard
- Display: Formatted numbers with currency symbol
- Show: Multiple metrics together

### Script
"Add KPI metrics to show important numbers at a glance:

[SHOW CODE]
```typescript
const metric = new MetricsBlockBuilder()
  .dataSource('YOUR_APP_TOKEN', 'sales_table')
  .fieldName('Amount')
  .aggregation(AggregationType.SUM)
  .title('Total Revenue')
  .prefix('$')
  .decimals(0)
  .build();

await client.addBlock('YOUR_APP_TOKEN', dashboardId, metric);
```

Add it to your dashboard - formatted numbers appear instantly.

You can add multiple metrics in seconds."

---

## Scene 6: 2025 Features (4:15 - 4:50)

### Visual
- Show different new chart types:
  - Heatmap with color intensity
  - Waterfall showing changes
  - Gauge showing progress
  - Sankey showing flow
- Show List block with products
- Show Tab pages organizing content

### Script
"The 2025 SDK includes modern chart types:

Heatmaps for visualizing patterns - perfect for time-based data.

Waterfalls for showing cumulative changes - great for financial analysis.

Gauges for tracking progress toward goals.

Sankey diagrams for visualizing flows and journeys.

Plus: List blocks, Tab pages, Calendar and Timeline views - all with the same simple API."

---

## Scene 7: Batch Operations (4:50 - 5:00)

### Visual
- Show array of multiple blocks
- Show batchCreateBlocks call
- Display: Multiple blocks appearing simultaneously

### Script
"Create multiple blocks at once with batch operations - it's faster and cleaner.

[SHOW CODE]
```typescript
const blocks = [
  chart1, metric1, table1,
  chart2, metric2, table2
];

const results = await client.batchCreateBlocks(APP_TOKEN, blocks);
```

All blocks created instantly!

Now you have a professional dashboard with data from your Lark tables."

---

## Scene 8: Closing (4:50 - 5:00)

### Visual
- Show final dashboard with multiple visualizations
- Display: Code repository link
- Show: NPM package page
- Display: Documentation site

### Script
"That's the Lark Dashboard SDK in action!

Create dashboards in minutes, not hours.

Type-safe, modern TypeScript, and production-ready.

Get started today:
- Install: npm install @hypelab/lark-dashboard-sdk
- Docs: https://github.com/hypelab/lark-dashboard-sdk
- Examples: Check out /examples in the repo

Happy dashboard building!"

---

## Scene Breakdown Timeline

| Time | Scene | Elements |
|------|-------|----------|
| 0:00-0:30 | Introduction | Logo, code editor, final dashboard |
| 0:30-1:00 | Setup | npm install, API key, env vars |
| 1:00-2:00 | Creating Dashboard | Code, console output, success message |
| 2:00-3:30 | Adding Charts | ChartBlockBuilder, visual chart, multiple types |
| 3:30-4:15 | Adding Metrics | MetricsBlockBuilder, formatted numbers, KPIs |
| 4:15-4:50 | 2025 Features | Heatmap, waterfall, gauge, sankey, list, tabs |
| 4:50-5:00 | Batch & Closing | Batch operations, final dashboard, links |

---

## Visual Design Guidelines

### Color Scheme
- Primary: #3b82f6 (Blue)
- Secondary: #10b981 (Green)
- Accent: #f59e0b (Orange)
- Background: #1f2937 (Dark Gray)

### Fonts
- Title: Bold, 24pt, White
- Code: Monospace, 14pt, Syntax highlighted
- Narration: Clear, professional voice

### Pacing
- Code appears line-by-line
- Charts animate into place
- Numbers count up when displayed
- Transitions are smooth (0.5s fade)

---

## Key Points to Emphasize

1. **Fast**: Create dashboards in minutes
2. **Easy**: Simple, intuitive API
3. **Powerful**: Multiple chart types and features
4. **Type-Safe**: Full TypeScript support
5. **Modern**: 2025 features included
6. **Production-Ready**: Error handling, retry logic, logging

---

## Call-to-Action

### Primary CTA
"Get started now: `npm install @hypelab/lark-dashboard-sdk`"

### Secondary CTA
"Read the full documentation: [link to docs]"

### Tertiary CTA
"Check out the examples: [link to examples folder]"

---

## Production Notes

### Audio
- Narration: Professional, upbeat tone
- Background music: Subtle, tech-forward
- Sound effects: Minimal (only for chart animations)
- No awkward pauses

### Video Quality
- Resolution: 4K (3840x2160) recommended, 1080p minimum
- Frame rate: 60fps for smooth animations
- Aspect ratio: 16:9
- Subtitles: English + Auto-generated captions

### Editing
- Use screen recording software (OBS, Camtasia)
- Animate code appearance with keyboard simulation
- Animate chart appearance with fade-in effects
- Use zoom on important code sections

### Distribution
- YouTube: Optimize title, description, tags
- Website: Embed video on docs page
- Social Media: Create 30-second teaser clip
- Blog: Link video in release announcement

---

## Extended Version (10 minutes)

For a longer demo, add:

1. **Advanced Features (2 minutes)**
   - Filtering data
   - Batch operations performance
   - Error handling

2. **Real-World Example (3 minutes)**
   - Complete e-commerce dashboard
   - Show all block types
   - Demonstrate interactive features

3. **MCP Integration (2 minutes)**
   - Show Claude Code integration
   - Demo creating dashboard via natural language
   - Show productivity gain

4. **Q&A (2 minutes)**
   - Common questions answered
   - Performance tips
   - Best practices

---

## Social Media Snippets

### Twitter/X
"Create professional Lark dashboards in minutes with the new SDK. Bar charts, metrics, heatmaps, waterfalls, and more. Type-safe TypeScript. Production-ready. Get started: [link]"

### LinkedIn
"Announcing the Lark Dashboard SDK v1.0 - production-ready TypeScript SDK for creating dashboards in Lark/Feishu. Features 8+ chart types, batch operations, MCP integration with Claude Code, and 2025 dashboard capabilities. [Watch our demo]"

### Newsletter
"In this 5-minute video, we show how to create a professional dashboard from scratch using the Lark Dashboard SDK. See how to add charts, metrics, filters, and more. Perfect for developers and business analysts."

---

## Follow-up Content Ideas

1. **Blog Post**: "How to Build a Sales Dashboard in 10 Minutes"
2. **Tutorial Series**: Step-by-step dashboard creation
3. **Live Coding Session**: Building a complete dashboard
4. **FAQ Video**: Common questions answered
5. **Advanced Features**: Filtering, batch operations, permissions
