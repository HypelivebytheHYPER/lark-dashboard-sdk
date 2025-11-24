# Lark Dashboard Bot - Troubleshooting Guide

Common issues and solutions for the Lark Dashboard Assistant Bot.

## Table of Contents

1. [Bot Not Responding](#bot-not-responding)
2. [Webhook Verification Failed](#webhook-verification-failed)
3. [Message Parsing Issues](#message-parsing-issues)
4. [Dashboard Creation Errors](#dashboard-creation-errors)
5. [Token/Authentication Issues](#tokenauthentication-issues)
6. [Context Not Working](#context-not-working)
7. [Performance Issues](#performance-issues)
8. [Deployment Issues](#deployment-issues)

---

## Bot Not Responding

### Symptom
User sends message to bot, but receives no response.

### Diagnosis Steps

#### 1. Check if bot is running
```bash
# Check health endpoint
curl http://localhost:3000/health

# Expected response:
{
  "status": "ok",
  "service": "lark-dashboard-bot",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

#### 2. Check webhook verification
In Lark Open Platform → Event Subscriptions:
- Status should show ✅ **Verified**
- If ❌ **Failed**, check:
  - Webhook URL is publicly accessible
  - Bot is running
  - Verification token matches

#### 3. Check event subscription
In Lark Open Platform → Event Subscriptions:
- Event `im.message.receive_v1` should be subscribed
- If not, add it and save

#### 4. Check bot logs
```bash
# If using PM2
pm2 logs lark-dashboard-bot

# If running directly
# Check terminal output for errors
```

Look for:
```
Message from ou_xxxxx: [user message]
Parsed intent: [intent type] (confidence: [0-1])
Message sent to oc_xxxxx
```

#### 5. Check permissions
Bot needs these scopes:
- `im:message`
- `im:message.group_at_msg`
- `bitable:app`
- `bitable:app:readonly`

After adding permissions, **reinstall bot** to workspace.

### Solutions

**Solution 1: Restart bot**
```bash
# PM2
pm2 restart lark-dashboard-bot

# Docker
docker-compose restart

# Direct
# Stop (Ctrl+C) and restart
npm run bot:start
```

**Solution 2: Re-verify webhook**
1. Update webhook URL in Lark Open Platform
2. Click "Save"
3. Wait for verification

**Solution 3: Check network**
```bash
# Test webhook from external source
curl -X POST https://your-domain.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"url_verification","challenge":"test","token":"your-token"}'
```

---

## Webhook Verification Failed

### Symptom
Lark Open Platform shows ❌ "Verification failed" for webhook URL.

### Common Causes

1. **Bot not running**: Start bot first
2. **Wrong URL**: Check URL is correct and accessible
3. **Firewall blocking**: Port 3000 not accessible
4. **Token mismatch**: Verification token doesn't match
5. **HTTPS required**: Some regions require HTTPS

### Solutions

**Solution 1: Check bot is accessible**
```bash
# From external source (not localhost)
curl https://your-domain.com/health
```

**Solution 2: Use ngrok for testing**
```bash
ngrok http 3000
# Copy HTTPS URL
# Update webhook in Lark
```

**Solution 3: Verify token configuration**
```bash
# Check .env file
cat bot/.env | grep VERIFICATION_TOKEN

# Should match token in Lark Open Platform
```

**Solution 4: Test webhook manually**
```bash
curl -X POST https://your-domain.com/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "url_verification",
    "challenge": "test123",
    "token": "YOUR_VERIFICATION_TOKEN"
  }'

# Expected response:
{"challenge":"test123"}
```

---

## Message Parsing Issues

### Symptom
Bot responds but doesn't understand the message correctly.

### Common Issues

#### Issue 1: Wrong intent detected

**Example:**
```
User: Create dashboard
Bot: I'm not sure what you want me to do.
```

**Cause:** Missing required parameters (app_token)

**Solution:** Provide complete information:
```
User: Create dashboard with app_token: abc123
```

#### Issue 2: Field names not extracted

**Example:**
```
User: Add bar chart
Bot: I need field names for X and Y axes
```

**Solution:** Use explicit format:
```
User: Add bar chart with x_axis: Month, y_axis: Revenue
```

#### Issue 3: Intent confidence too low

**Debug:** Enable logging
```bash
# Set in .env
BOT_LOGGING=true

# Restart bot
pm2 restart lark-dashboard-bot
```

Check logs for:
```
Parsed intent: unknown (confidence: 0.0)
```

**Solution:** Use clearer keywords:
- ✅ "Create dashboard"
- ❌ "Make me a thing"

### Improving Parsing

**Add custom patterns** in `bot-dashboard-assistant.ts`:

```typescript
// In parseIntent()
const customMatch = message.match(/my custom pattern/i);
if (customMatch) {
  return {
    type: IntentType.MY_CUSTOM_INTENT,
    confidence: 0.9,
    entities: { ... },
    rawText: message,
  };
}
```

---

## Dashboard Creation Errors

### Symptom
Bot shows error when creating dashboard or adding blocks.

### Error 1: Invalid app_token

**Error:**
```
❌ Failed to create dashboard: Invalid app_token or access denied
```

**Causes:**
- App token is incorrect
- Bot doesn't have access to the Base
- Base is archived or deleted

**Solutions:**
1. Verify app_token is correct
2. Open Base in Lark, check bot has access
3. Check Base is not archived

### Error 2: Invalid table_id

**Error:**
```
❌ Failed to add chart: Table not found
```

**Causes:**
- Table ID is incorrect
- Table is deleted
- No access to table

**Solutions:**
1. Verify table_id format: `tbl` + alphanumeric
2. Open table in Lark Base
3. Check bot has read access

### Error 3: Field not found

**Error:**
```
❌ Failed to add chart: Field 'Revenue' not found
```

**Causes:**
- Field name typo
- Field doesn't exist in table
- Field name case-sensitive

**Solutions:**
1. Check exact field name in Lark Base
2. Match case exactly
3. Use field IDs instead of names (advanced)

### Error 4: Permission denied

**Error:**
```
❌ Permission denied
```

**Causes:**
- Bot missing `bitable:app` permission
- User doesn't have edit rights
- Base sharing settings restrict bot

**Solutions:**
1. Add `bitable:app` permission in Lark Open Platform
2. Reinstall bot to workspace
3. Check Base sharing settings

---

## Token/Authentication Issues

### Symptom
Token expired or authentication errors.

### Error 1: Tenant access token expired

**Error:**
```
Error getting tenant access token: invalid app_id or app_secret
```

**Solution:**
```bash
# Verify credentials in .env
cat bot/.env | grep LARK_APP

# Should match Lark Open Platform values

# Restart bot
pm2 restart lark-dashboard-bot
```

### Error 2: Token refresh fails

**Symptoms:**
- Bot works for 2 hours then stops
- Authentication errors in logs

**Cause:** Token auto-refresh failing

**Solution:**
Bot automatically refreshes tokens. If failing:
1. Check internet connectivity
2. Verify app credentials
3. Check Lark API status: https://open.feishu.cn/status

### Error 3: Invalid verification token

**Error:**
```
401 Invalid verification token
```

**Solution:**
```bash
# Update .env with correct token
LARK_VERIFICATION_TOKEN=xxxxxxxxxxxxxxxxxxxxx

# Restart
pm2 restart lark-dashboard-bot
```

---

## Context Not Working

### Symptom
Bot doesn't remember previous messages or current dashboard.

### Issue 1: Context expired

**Cause:** Context TTL is 30 minutes

**Solution:** Normal behavior. User needs to provide info again:
```
User: Add chart
Bot: Please create a dashboard first

User: Create dashboard with app_token: abc123
Bot: ✅ Created

User: Add chart with table_id: tbl123, x_axis: X, y_axis: Y
Bot: ✅ Added
```

### Issue 2: Bot restarted

**Cause:** Context stored in memory, lost on restart

**Solution:** Use persistent storage (Redis, database)

**Implementation:**
```typescript
// Install redis
npm install redis

// In bot-dashboard-assistant.ts
import Redis from 'redis';
const redis = Redis.createClient();

// Store context
await redis.set(`context:${userId}`, JSON.stringify(context));

// Retrieve context
const stored = await redis.get(`context:${userId}`);
const context = JSON.parse(stored);
```

### Issue 3: Multiple bot instances

**Cause:** Running multiple instances without shared state

**Solution:** Use centralized context store (Redis, database)

---

## Performance Issues

### Symptom
Bot responds slowly or times out.

### Issue 1: High response time

**Diagnosis:**
```bash
# Check bot logs for timing
pm2 logs lark-dashboard-bot | grep "ms"
```

**Causes:**
- Slow Lark API responses
- Network latency
- Heavy processing

**Solutions:**
1. Add timeout to API calls
2. Use async processing
3. Cache common requests
4. Optimize intent parsing

### Issue 2: Memory leaks

**Symptoms:**
- Memory usage grows over time
- Bot crashes after hours/days

**Diagnosis:**
```bash
pm2 describe lark-dashboard-bot
# Check memory usage
```

**Solution:**
```javascript
// In ecosystem.config.js
module.exports = {
  apps: [{
    name: 'lark-dashboard-bot',
    max_memory_restart: '500M', // Restart at 500MB
  }],
};
```

### Issue 3: Context memory growing

**Solution:** Cleanup old contexts:
```typescript
// Already implemented in bot
// Contexts auto-expire after 30 minutes
// Manual cleanup every 5 minutes
```

---

## Deployment Issues

### Issue 1: PM2 not starting

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Install dependencies
npm install

# Rebuild
npm run build

# Start
pm2 start bot/ecosystem.config.js
```

### Issue 2: Docker build fails

**Error:**
```
Error: Cannot find module
```

**Solution:**
```bash
# Clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Issue 3: Port already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 [PID]

# Or change port in .env
PORT=3001
```

### Issue 4: Nginx reverse proxy issues

**Symptoms:**
- 502 Bad Gateway
- Timeout errors

**Solution:**
Check Nginx config:
```nginx
location /webhook {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_read_timeout 60s;
    proxy_connect_timeout 60s;
}
```

---

## Debug Mode

### Enable Full Logging

```bash
# In .env
BOT_LOGGING=true
LARK_LOGGING=true
NODE_ENV=development

# Restart
pm2 restart lark-dashboard-bot
```

### View Logs in Real-time

```bash
# PM2
pm2 logs lark-dashboard-bot --lines 100

# Docker
docker-compose logs -f lark-bot

# Direct
# Logs appear in terminal
```

### Test Specific Scenarios

```bash
# Test webhook
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d @test-event.json

# Test intent parsing
# Add debug logging in parseIntent()
console.log('Parsing message:', message);
console.log('Detected intent:', intent);
```

---

## Getting More Help

### Resources

- **Documentation**: [BOT_SETUP.md](./BOT_SETUP.md)
- **Examples**: [examples/](./examples/)
- **Lark Docs**: https://open.feishu.cn/document
- **Issues**: https://github.com/hypelab/lark-dashboard-sdk/issues

### Debug Checklist

Before asking for help, check:

- [ ] Bot is running (health check passes)
- [ ] Webhook is verified in Lark Open Platform
- [ ] Events are subscribed (`im.message.receive_v1`)
- [ ] Permissions are granted and bot is reinstalled
- [ ] Environment variables are correct
- [ ] Logs show no errors
- [ ] Test with simple command ("help")

### Reporting Issues

When reporting issues, include:

1. **Error message** (exact text)
2. **Bot logs** (relevant portions)
3. **Steps to reproduce**
4. **Environment** (Node version, OS, deployment method)
5. **Configuration** (sanitized .env)

---

## Common Solutions Summary

| Issue | Quick Fix |
|-------|-----------|
| Bot not responding | Check health, restart bot |
| Webhook failed | Use ngrok, verify token |
| Wrong intent | Provide complete parameters |
| Dashboard error | Verify app_token and table_id |
| Token expired | Check credentials, restart |
| Context lost | Normal after 30min or restart |
| Slow response | Check network, add timeouts |
| Port in use | Change port or kill process |

---

**Still having issues? Open an issue on GitHub with debug information!**
