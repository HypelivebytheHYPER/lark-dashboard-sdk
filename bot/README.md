# Lark Dashboard Assistant Bot

AI-powered bot for creating Lark/Feishu dashboards through natural language conversations. Built on the Lark Dashboard SDK and Model Context Protocol (MCP).

## Overview

The Lark Dashboard Assistant Bot allows users to create complex dashboards simply by chatting in natural language. No need to understand APIs or SDK syntax - just describe what you want!

### Key Features

- **Natural Language Understanding**: Create dashboards by describing what you want
- **Multi-turn Conversations**: Bot remembers context across messages
- **Intelligent Parsing**: Extracts parameters from conversational text
- **Error Recovery**: Helpful prompts when information is missing
- **Rich Responses**: Interactive cards with dashboard links
- **All Block Types**: Charts, metrics, views, and text blocks
- **Context Memory**: Maintains conversation state for 30 minutes
- **Production Ready**: Docker, PM2, and deployment configs included

## Quick Start

### 1. Prerequisites

```bash
# Node.js 16+
node --version

# npm or yarn
npm --version
```

### 2. Install

```bash
cd lark-dashboard-sdk
npm install
npm run build
```

### 3. Configure

```bash
cd bot
cp .env.example .env
# Edit .env with your Lark app credentials
```

### 4. Run

```bash
# Development
npm run bot:start

# Production (with PM2)
pm2 start ecosystem.config.js
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Lark/Feishu                       │
│              (User sends message)                   │
└────────────────┬────────────────────────────────────┘
                 │ Webhook Event
                 │
┌────────────────▼────────────────────────────────────┐
│              Bot Server (Express)                   │
│  - Receives webhook events                          │
│  - Validates tokens                                 │
│  - Routes to bot handler                            │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│        LarkDashboardAssistant                       │
│  - Parses natural language                          │
│  - Manages conversation context                     │
│  - Extracts intents & entities                      │
│  - Executes dashboard operations                    │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│        LarkDashboardClient (SDK)                    │
│  - Creates dashboards                               │
│  - Adds blocks (charts, metrics, views)             │
│  - Interacts with Lark API                          │
└─────────────────────────────────────────────────────┘
```

## Usage Examples

### Create Dashboard

```
User: Create a sales dashboard with app_token: FUVdb7bebaVLeMsKJgJlnsX2gzd

Bot: ✅ Dashboard Created Successfully
     [View Dashboard]

     💡 You can now add blocks to this dashboard:
     - "Add a bar chart showing sales by category"
     - "Add metrics showing total revenue"
```

### Add Chart

```
User: Add a bar chart with table_id: tblSales, x_axis: Month, y_axis: Revenue

Bot: ⏳ Adding bar chart...
     ✅ Bar chart added successfully!
```

### Add Metrics

```
User: Add sum of Revenue metric with table_id: tblSales, field: Revenue

Bot: ⏳ Adding metrics block...
     ✅ Metrics block added successfully!
```

### Get Help

```
User: help

Bot: 🤖 Lark Dashboard Assistant

     I can help you create dashboards using natural language!

     [Lists all available commands...]
```

See [examples/](./examples/) for complete conversation flows.

## Intent Recognition

The bot understands these intent types:

### CREATE_DASHBOARD
```
"Create a sales dashboard with app_token: abc123"
"Create dashboard called 'Q1 Analytics' with app_token: xyz789"
```

### ADD_CHART
```
"Add a bar chart showing revenue by category"
"Add line chart with table_id: tbl123, x_axis: Date, y_axis: Sales"
```

### ADD_METRICS
```
"Add sum of Revenue metric"
"Add count of customers with table_id: tbl456, field: CustomerID"
```

### ADD_VIEW
```
"Add grid view with table_id: tbl789"
"Add kanban view of tasks"
```

### ADD_TEXT
```
"Add heading 'Sales Overview'"
"Add text 'This dashboard shows Q1 results'"
```

### LIST_DASHBOARDS
```
"List dashboards with app_token: abc123"
"Show me all dashboards"
```

### DELETE_DASHBOARD
```
"Delete dashboard with dashboard_id: blk123"
```

## Natural Language Parsing

The bot extracts these entities from messages:

| Entity | Examples | Patterns |
|--------|----------|----------|
| App Token | `app_token: abc123` | `app[-_\s]?token[:=\s]+([a-zA-Z0-9]+)` |
| Dashboard ID | `dashboard_id: blk456` | `dashboard[-_\s]?id[:=\s]+([a-zA-Z0-9]+)` |
| Table ID | `table_id: tbl789` | `table[-_\s]?id[:=\s]+([a-zA-Z0-9]+)` |
| Chart Type | `bar chart`, `line graph` | Keywords: bar, line, pie, scatter, area, column |
| View Type | `grid view`, `kanban board` | Keywords: grid, kanban, gallery, gantt, form |
| Field Names | `x_axis: Date, y_axis: Revenue` | `x[-_\s]?axis[:=\s]+([a-zA-Z0-9_]+)` |
| Aggregation | `sum`, `count`, `average` | Keywords: sum, count, avg/average, max, min |
| Title | `title: "Sales Report"` | `title[:=\s]+["']?([^"'\n]+)["']?` |

## Conversation Context

The bot maintains conversation state:

```typescript
interface ConversationContext {
  userId: string;
  sessionId: string;
  lastIntent?: ParsedIntent;
  currentDashboard?: {
    appToken: string;
    dashboardId: string;
    name: string;
  };
  createdAt: number;
  lastActivity: number;
}
```

**Context TTL**: 30 minutes of inactivity

### Benefits:
- Users don't need to repeat app_token or dashboard_id
- Bot remembers current dashboard being built
- Enables multi-turn conversations
- Supports progressive dashboard construction

## Configuration

### Environment Variables

```bash
# Required
LARK_APP_ID=cli_xxxxxxxxxxxxx
LARK_APP_SECRET=xxxxxxxxxxxxxxxxxxxxx
LARK_VERIFICATION_TOKEN=xxxxxxxxxxxxxxxxxxxxx

# Optional
LARK_ENCRYPT_KEY=xxxxxxxxxxxxxxxxxxxxx
LARK_REGION=sg  # sg, cn, or us
PORT=3000
NODE_ENV=production
BOT_LOGGING=true
```

### App Configuration

Edit `config/app-config.json`:

```json
{
  "app": {
    "name": "Lark Dashboard Assistant",
    "version": "1.0.0"
  },
  "bot": {
    "context_ttl_minutes": 30,
    "max_contexts": 1000,
    "response_timeout_ms": 5000
  },
  "features": {
    "natural_language_parsing": true,
    "multi_turn_conversation": true,
    "context_memory": true
  }
}
```

## Deployment

### Option 1: PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start bot
pm2 start bot/ecosystem.config.js

# Monitor
pm2 monit

# View logs
pm2 logs lark-dashboard-bot

# Auto-start on reboot
pm2 startup
pm2 save
```

### Option 2: Docker

```bash
# Build image
docker build -f bot/Dockerfile -t lark-dashboard-bot .

# Run container
docker run -d \
  --name lark-dashboard-bot \
  --env-file bot/.env \
  -p 3000:3000 \
  lark-dashboard-bot

# Or use docker-compose
cd bot
docker-compose up -d
```

### Option 3: Systemd Service

```bash
# Create service file
sudo nano /etc/systemd/system/lark-bot.service
```

```ini
[Unit]
Description=Lark Dashboard Bot
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/lark-dashboard-sdk
ExecStart=/usr/bin/node dist/bot/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=lark-bot
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl enable lark-bot
sudo systemctl start lark-bot
sudo systemctl status lark-bot
```

## API Integration

### Webhook Endpoint

**POST** `/webhook`

Receives Lark webhook events.

**Request:**
```json
{
  "type": "event_callback",
  "token": "verification_token",
  "event": {
    "type": "message.receive_v1",
    "sender": {
      "sender_id": { "user_id": "ou_xxxxx" }
    },
    "message": {
      "chat_id": "oc_xxxxx",
      "message_id": "om_xxxxx",
      "content": "{\"text\":\"Create dashboard\"}"
    }
  }
}
```

**Response:**
```json
{
  "code": 0
}
```

### Health Check

**GET** `/health`

Returns server health status.

**Response:**
```json
{
  "status": "ok",
  "service": "lark-dashboard-bot",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
# Test webhook endpoint
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d @test-event.json

# Test health check
curl http://localhost:3000/health
```

### Manual Testing

1. Start bot locally
2. Expose with ngrok: `ngrok http 3000`
3. Set webhook URL in Lark Open Platform
4. Send test messages in Lark

## Monitoring

### PM2 Dashboard

```bash
pm2 monit
```

### Logs

```bash
# All logs
pm2 logs lark-dashboard-bot

# Error logs only
pm2 logs lark-dashboard-bot --err

# Live tail
pm2 logs lark-dashboard-bot --lines 100
```

### Metrics

```bash
pm2 describe lark-dashboard-bot
```

## Troubleshooting

### Bot not responding

1. Check bot is running: `pm2 status`
2. Check logs: `pm2 logs`
3. Verify webhook URL is correct
4. Test health endpoint: `curl http://localhost:3000/health`

### Messages not parsed correctly

1. Check intent parsing logic
2. Add logging: Set `BOT_LOGGING=true`
3. Review parsed intent in logs
4. Adjust regex patterns if needed

### Context not maintained

1. Verify context TTL: Default 30 minutes
2. Check if server restarted (context is in-memory)
3. Consider using Redis for persistent context

### API errors

1. Check app credentials are correct
2. Verify bot has required permissions
3. Check Lark API rate limits
4. Review error messages in logs

## Development

### Project Structure

```
bot/
├── bot-dashboard-assistant.ts   # Main bot logic
├── server.ts                     # Express server
├── config/
│   └── app-config.json          # App configuration
├── examples/                     # Conversation examples
├── ecosystem.config.js           # PM2 config
├── Dockerfile                    # Docker image
├── docker-compose.yml            # Docker Compose
├── .env.example                  # Environment template
├── BOT_SETUP.md                  # Setup guide
└── README.md                     # This file
```

### Adding New Intents

1. Add intent to `IntentType` enum
2. Create parsing logic in `parseIntent()`
3. Add handler method `handleXxx()`
4. Update `executeIntent()` switch statement
5. Add tests and examples

### Extending Parsing

Add custom entity extractors:

```typescript
// In parseIntent()
const customMatch = message.match(/pattern/i);
if (customMatch) {
  entities.customField = customMatch[1];
}
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes and test
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature/my-feature`
6. Create Pull Request

## License

MIT License - see [LICENSE](../LICENSE) for details.

## Support

- Documentation: [BOT_SETUP.md](./BOT_SETUP.md)
- Examples: [examples/](./examples/)
- Issues: https://github.com/hypelab/lark-dashboard-sdk/issues

## Credits

Built with:
- [Lark Open Platform](https://open.feishu.cn)
- [Lark Dashboard SDK](https://github.com/hypelab/lark-dashboard-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Express.js](https://expressjs.com)
- [TypeScript](https://www.typescriptlang.org)
