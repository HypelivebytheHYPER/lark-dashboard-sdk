# Lark Dashboard Assistant Bot - Setup Guide

Complete guide for deploying the Lark Dashboard Assistant Bot that creates dashboards through natural language conversations.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Lark App Setup](#lark-app-setup)
3. [Bot Installation](#bot-installation)
4. [Configuration](#configuration)
5. [Deployment](#deployment)
6. [Testing](#testing)
7. [Usage Examples](#usage-examples)
8. [Troubleshooting](#troubleshooting)
9. [Production Deployment](#production-deployment)

---

## Prerequisites

### Required

- Node.js >= 16.0.0
- npm or yarn
- Lark/Feishu account with admin access
- Public URL for webhook (ngrok, CloudFlare Tunnel, or production server)

### Recommended

- PM2 for process management
- Nginx for reverse proxy
- SSL certificate for HTTPS

---

## Lark App Setup

### Step 1: Create Lark App

1. Go to [Lark Open Platform](https://open.feishu.cn/app) (or https://open.larksuite.com for US)
2. Click **"Create Custom App"**
3. Fill in app details:
   - **App Name**: Lark Dashboard Assistant
   - **App Description**: AI assistant for creating dashboards
   - **Icon**: Upload a bot icon (optional)
4. Click **"Create"**

### Step 2: Get App Credentials

After creating the app, note down these credentials:

```
App ID: cli_xxxxxxxxxxxxx
App Secret: xxxxxxxxxxxxxxxxxxxxx
Verification Token: xxxxxxxxxxxxxxxxxxxxx
Encrypt Key: xxxxxxxxxxxxxxxxxxxxx (optional)
```

**Save these securely - you'll need them for configuration!**

### Step 3: Configure App Permissions

Navigate to **"Permissions & Scopes"** and add these scopes:

#### Required Scopes:

- **Messages** (`im:message`): Send and receive messages
- **Group Messages** (`im:message.group_at_msg`): Receive group @mentions
- **Bitable App** (`bitable:app`): Create and modify dashboards
- **Bitable Read** (`bitable:app:readonly`): Read dashboard data

Click **"Save"** after adding scopes.

### Step 4: Subscribe to Events

Go to **"Event Subscriptions"**:

1. **Enable Events**: Toggle ON
2. **Request URL**: `https://your-domain.com/webhook` (set this after deployment)
3. **Subscribe to Bot Events**:
   - `im.message.receive_v1` - Receive messages

Click **"Save Changes"**

### Step 5: Enable Bot Features

Navigate to **"Bot"** settings:

1. **Enable Bot**: Toggle ON
2. **Bot Name**: Dashboard Assistant
3. **Description**: I help you create dashboards with natural language
4. **Commands** (optional):
   - `/dashboard` - Create a new dashboard
   - `/help` - Show help information

---

## Bot Installation

### Clone or Navigate to SDK Directory

```bash
cd /path/to/lark-dashboard-sdk
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Add Bot Dependencies

The bot requires Express for the HTTP server:

```bash
npm install express
npm install --save-dev @types/express
```

### Build TypeScript

```bash
npm run build
```

---

## Configuration

### Step 1: Create Environment File

Copy the example environment file:

```bash
cp bot/.env.example bot/.env
```

### Step 2: Configure Environment Variables

Edit `bot/.env` with your credentials:

```bash
# Lark App Configuration
LARK_APP_ID=cli_xxxxxxxxxxxxx          # From Step 2
LARK_APP_SECRET=xxxxxxxxxxxxxxxxxxxxx   # From Step 2
LARK_VERIFICATION_TOKEN=xxxxxxxxxxxxxx  # From Step 2
LARK_ENCRYPT_KEY=                       # Optional, from Step 2

# Region (sg for global, cn for China, us for US)
LARK_REGION=sg

# Server Configuration
PORT=3000
NODE_ENV=development

# Logging
BOT_LOGGING=true
LARK_LOGGING=false
```

### Step 3: Verify Configuration

Check that all required variables are set:

```bash
node -e "require('dotenv').config({path:'bot/.env'}); console.log('App ID:', process.env.LARK_APP_ID); console.log('Configured:', process.env.LARK_APP_ID ? '✅' : '❌')"
```

---

## Deployment

### Option 1: Local Development (with ngrok)

#### Install ngrok

```bash
# macOS
brew install ngrok

# Or download from https://ngrok.com
```

#### Start Bot Server

```bash
# Terminal 1: Start bot
npm run bot:start
```

#### Expose with ngrok

```bash
# Terminal 2: Expose webhook
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`) and set it as your webhook URL in Lark Open Platform:

1. Go to **Event Subscriptions**
2. Set **Request URL**: `https://abc123.ngrok.io/webhook`
3. Click **"Save"**

Lark will send a verification request. If successful, you'll see ✅ **"Verified"**.

### Option 2: Cloud Deployment (Production)

#### Deploy to Cloud VM (AWS, GCP, Azure, DigitalOcean)

1. **SSH into your server**:

```bash
ssh user@your-server-ip
```

2. **Install Node.js**:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Clone repository**:

```bash
git clone https://github.com/yourusername/lark-dashboard-sdk.git
cd lark-dashboard-sdk
npm install
npm run build
```

4. **Install PM2**:

```bash
sudo npm install -g pm2
```

5. **Create PM2 ecosystem file** (`bot/ecosystem.config.js`):

```javascript
module.exports = {
  apps: [{
    name: 'lark-dashboard-bot',
    script: './dist/bot/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
```

6. **Start with PM2**:

```bash
cd bot
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Setup Nginx Reverse Proxy

1. **Install Nginx**:

```bash
sudo apt-get install nginx
```

2. **Configure Nginx** (`/etc/nginx/sites-available/lark-bot`):

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

3. **Enable site and restart**:

```bash
sudo ln -s /etc/nginx/sites-available/lark-bot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Setup SSL with Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### Update Webhook URL

Go to Lark Open Platform → Event Subscriptions:
- Set Request URL: `https://your-domain.com/webhook`
- Verify the endpoint

---

## Testing

### Test Health Endpoint

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "lark-dashboard-bot",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### Test Webhook Locally

Send a test event:

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "url_verification",
    "challenge": "test123",
    "token": "your-verification-token"
  }'
```

Expected response:
```json
{
  "challenge": "test123"
}
```

### Test in Lark App

1. Open Lark/Feishu
2. Search for your bot: "Dashboard Assistant"
3. Start a conversation
4. Send: "help"

You should receive a help message with available commands!

---

## Usage Examples

### Example 1: Create a Sales Dashboard

**User:**
```
Create a sales dashboard with app_token: FUVdb7bebaVLeMsKJgJlnsX2gzd
```

**Bot:**
```
⏳ Creating dashboard "sales dashboard"...
✅ Dashboard created successfully!
[View Dashboard]

💡 You can now add blocks to this dashboard:
- "Add a bar chart showing sales by category"
- "Add metrics showing total revenue"
- "Add a grid view of the data"
```

### Example 2: Add a Bar Chart

**User:**
```
Add a bar chart with table_id: tblSalesData, x_axis: Month, y_axis: Revenue
```

**Bot:**
```
⏳ Adding bar chart...
✅ Bar chart added successfully!
```

### Example 3: Add Metrics

**User:**
```
Add sum of Revenue metric with table_id: tblSalesData, field: Revenue
```

**Bot:**
```
⏳ Adding metrics block...
✅ Metrics block added successfully!
```

### Example 4: Multi-turn Conversation

**User:**
```
Create dashboard "Q1 Analytics" with app_token: abc123
```

**Bot:**
```
✅ Dashboard created!
```

**User:**
```
Add a line chart showing revenue over time, table_id: tbl123, x_axis: Date, y_axis: Revenue
```

**Bot:**
```
✅ Line chart added!
```

**User:**
```
Add metrics for total customers, table_id: tbl123, field: CustomerCount, aggregation: count
```

**Bot:**
```
✅ Metrics added!
```

---

## Troubleshooting

### Issue: Bot not receiving messages

**Cause:** Webhook URL not configured or verification failed

**Solution:**
1. Check webhook URL is correct and publicly accessible
2. Verify webhook endpoint returns 200 for verification
3. Check bot has `im:message` permission
4. Ensure event `im.message.receive_v1` is subscribed

**Debug:**
```bash
# Check server logs
pm2 logs lark-dashboard-bot

# Test webhook endpoint
curl https://your-domain.com/webhook
```

### Issue: Token expired or invalid

**Cause:** Tenant access token expired

**Solution:**
Bot automatically refreshes tokens. If issue persists:
1. Verify `LARK_APP_ID` and `LARK_APP_SECRET` are correct
2. Check app hasn't been disabled in Lark Open Platform
3. Restart bot: `pm2 restart lark-dashboard-bot`

### Issue: Dashboard creation fails

**Cause:** Invalid app_token or insufficient permissions

**Solution:**
1. Verify app_token is correct
2. Check bot has `bitable:app` permission
3. Ensure user has access to the base
4. Check base exists and is not archived

### Issue: Context not working across messages

**Cause:** Context expired or server restarted

**Solution:**
Context expires after 30 minutes of inactivity. User needs to provide full information again or recreate dashboard.

### Issue: Rate limiting errors

**Cause:** Too many API requests

**Solution:**
Lark API has rate limits. Implement exponential backoff or reduce request frequency.

---

## Production Deployment

### Security Checklist

- [ ] Use HTTPS for webhook endpoint
- [ ] Enable message encryption (`LARK_ENCRYPT_KEY`)
- [ ] Store credentials in secrets manager (AWS Secrets Manager, HashiCorp Vault)
- [ ] Use environment variables, never commit `.env` to git
- [ ] Implement rate limiting
- [ ] Add request validation and sanitization
- [ ] Enable error monitoring (Sentry, DataDog)

### Monitoring

#### Setup PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 7
```

#### Setup Health Checks

Use a service like UptimeRobot or Pingdom to monitor:
- `https://your-domain.com/health`
- Alert if down for > 2 minutes

#### Logging

Configure structured logging:

```javascript
// Add to server.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### Scaling

For high traffic, run multiple instances:

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'lark-dashboard-bot',
    script: './dist/bot/server.js',
    instances: 4, // Use 4 CPU cores
    exec_mode: 'cluster',
    autorestart: true,
  }],
};
```

### Backup & Recovery

- Store bot configuration in version control
- Backup environment variables
- Document deployment steps
- Keep PM2 dump updated: `pm2 save`

---

## Advanced Features

### Custom Commands

Add custom slash commands in Lark Open Platform:

```
/dashboard create [name] - Create a new dashboard
/dashboard list - List all dashboards
/help - Show help information
```

### Webhooks for Dashboard Updates

Receive notifications when dashboards are updated:

```typescript
// Add to bot-dashboard-assistant.ts
private async sendUpdateNotification(chatId: string, dashboardId: string) {
  await this.sendMessage(
    chatId,
    `📊 Dashboard updated! View changes: ${this.getDashboardURL(dashboardId)}`
  );
}
```

### Analytics Integration

Track bot usage:

```typescript
// Add analytics
import Analytics from 'analytics-node';
const analytics = new Analytics('YOUR_WRITE_KEY');

analytics.track({
  userId: userId,
  event: 'Dashboard Created',
  properties: {
    dashboardName: name,
    blockCount: blocks.length,
  },
});
```

---

## Support

### Documentation

- [Lark Open Platform Docs](https://open.feishu.cn/document)
- [Lark Dashboard SDK Docs](../README.md)
- [MCP Protocol Docs](https://modelcontextprotocol.io)

### Issues

Report issues: https://github.com/hypelab/lark-dashboard-sdk/issues

### Community

Join our Discord: https://discord.gg/lark-dashboard

---

## Changelog

### v1.0.0 (2025-01-15)

- Initial release
- Natural language dashboard creation
- Multi-turn conversation support
- Context memory
- Support for all block types (chart, metrics, view, text)
- Rich card responses
- Error recovery

---

## License

MIT License - see [LICENSE](../LICENSE) file for details.
