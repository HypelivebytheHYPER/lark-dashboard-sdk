# Lark Dashboard Bot - Quick Start Guide

Get your Lark Dashboard Assistant Bot running in 15 minutes!

## Step-by-Step Setup

### 1. Create Lark App (5 minutes)

1. Go to https://open.feishu.cn/app (or https://open.larksuite.com for US)
2. Click **"Create Custom App"**
3. Fill in:
   - Name: `Dashboard Assistant`
   - Description: `AI bot for creating dashboards`
4. Click **"Create"**

### 2. Get Credentials (2 minutes)

From your app's page, copy these:

```
App ID: cli_xxxxxxxxxxxxx
App Secret: xxxxxxxxxxxxxxxxxxxxx
Verification Token: xxxxxxxxxxxxxxxxxxxxx
```

### 3. Set Permissions (3 minutes)

Go to **"Permissions & Scopes"** and add:

- ✅ `im:message` - Send and receive messages
- ✅ `im:message.group_at_msg` - Receive group mentions
- ✅ `bitable:app` - Create/edit dashboards
- ✅ `bitable:app:readonly` - Read dashboard data

Click **"Save"**

### 4. Configure Bot (5 minutes)

```bash
# Navigate to bot directory
cd lark-dashboard-sdk/bot

# Copy environment template
cp .env.example .env

# Edit with your credentials
nano .env
```

Paste your credentials:

```bash
LARK_APP_ID=cli_xxxxxxxxxxxxx
LARK_APP_SECRET=xxxxxxxxxxxxxxxxxxxxx
LARK_VERIFICATION_TOKEN=xxxxxxxxxxxxxxxxxxxxx
LARK_REGION=sg
PORT=3000
BOT_LOGGING=true
```

Save and exit (Ctrl+X, Y, Enter)

### 5. Install & Build

```bash
# From project root
npm install
npm run build
```

### 6. Start Bot (Local Testing)

Terminal 1 - Start bot:
```bash
npm run bot:start
```

You should see:
```
🤖 Lark Dashboard Bot Server started
📍 Port: 3000
🌏 Region: sg
📡 Webhook: http://localhost:3000/webhook
💚 Health: http://localhost:3000/health

Ready to receive events from Lark!
```

Terminal 2 - Expose with ngrok:
```bash
# Install ngrok if needed
brew install ngrok  # macOS
# or download from https://ngrok.com

# Expose port 3000
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### 7. Configure Webhook

1. Go back to Lark Open Platform
2. Navigate to **"Event Subscriptions"**
3. Enable Events: Toggle ON
4. Request URL: `https://abc123.ngrok.io/webhook`
5. Click **"Save"**

Lark will verify - you should see ✅ **"Verified"**

### 8. Subscribe to Events

Still in **"Event Subscriptions"**:

1. Click **"Add Event"**
2. Search for: `im.message.receive_v1`
3. Click **"Add"**
4. Click **"Save Changes"**

### 9. Enable Bot

Go to **"Bot"** settings:

1. Enable Bot: Toggle ON
2. Save changes

### 10. Test Your Bot!

1. Open Lark/Feishu app
2. Search for: "Dashboard Assistant"
3. Send message: `help`

You should get a response with all available commands!

## Your First Dashboard

Try this conversation:

```
You: Create a sales dashboard with app_token: YOUR_APP_TOKEN

Bot: ✅ Dashboard Created Successfully
     [View Dashboard]

You: Add a bar chart with table_id: YOUR_TABLE_ID,
     x_axis: Month, y_axis: Revenue

Bot: ✅ Bar chart added successfully!

You: Add sum of Revenue metric with table_id: YOUR_TABLE_ID,
     field: Revenue

Bot: ✅ Metrics block added successfully!
```

Replace:
- `YOUR_APP_TOKEN`: Your Lark Base app token
- `YOUR_TABLE_ID`: Your Lark Base table ID

## Common Issues

### Bot not responding

**Check 1: Is bot running?**
```bash
curl http://localhost:3000/health
```

Should return:
```json
{"status":"ok","service":"lark-dashboard-bot","timestamp":"..."}
```

**Check 2: Is webhook verified?**

Look in Lark Open Platform → Event Subscriptions. Should show ✅ Verified.

**Check 3: Check logs**
```bash
# In terminal running bot, you should see:
Message from ou_xxxxx: help
Parsed intent: help (confidence: 1.0)
Message sent to oc_xxxxx
```

### Ngrok URL changed

Every time you restart ngrok, URL changes. Update webhook URL in Lark Open Platform.

**Pro tip**: Get a static ngrok URL with a paid account, or use a production server.

### Permission errors

Verify bot has these permissions:
- im:message
- im:message.group_at_msg
- bitable:app
- bitable:app:readonly

After adding permissions, **reinstall the bot** to your workspace.

## Production Deployment

### Option 1: Deploy to Cloud VM

```bash
# SSH to your server
ssh user@your-server.com

# Clone repo
git clone https://github.com/yourusername/lark-dashboard-sdk.git
cd lark-dashboard-sdk

# Install dependencies
npm install
npm run build

# Setup environment
cd bot
cp .env.example .env
nano .env  # Add your credentials

# Install PM2
sudo npm install -g pm2

# Start bot
pm2 start ecosystem.config.js

# Setup auto-start
pm2 startup
pm2 save
```

Update webhook URL to `https://your-server.com/webhook`

### Option 2: Deploy with Docker

```bash
# Build and start
cd lark-dashboard-sdk/bot
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop
docker-compose down
```

## Next Steps

- Read [BOT_SETUP.md](./BOT_SETUP.md) for detailed documentation
- Check [examples/](./examples/) for conversation patterns
- Customize bot behavior in `bot-dashboard-assistant.ts`
- Add custom intents and handlers
- Deploy to production

## Getting Help

- **Examples**: See [examples/](./examples/) folder
- **Full Guide**: Read [BOT_SETUP.md](./BOT_SETUP.md)
- **Issues**: https://github.com/hypelab/lark-dashboard-sdk/issues
- **Lark Docs**: https://open.feishu.cn/document

## Summary Checklist

- [x] Created Lark app
- [x] Got app credentials
- [x] Set permissions
- [x] Configured .env file
- [x] Installed dependencies
- [x] Started bot locally
- [x] Exposed with ngrok
- [x] Configured webhook
- [x] Subscribed to events
- [x] Enabled bot
- [x] Tested with "help" command
- [x] Created first dashboard

**Congratulations! Your Lark Dashboard Bot is now live! 🎉**
