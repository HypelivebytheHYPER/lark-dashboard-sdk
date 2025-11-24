# Lark Dashboard Assistant Bot - Documentation Index

Complete guide to the OpenAPI MCP smart assistant bot for dashboard creation.

## Quick Navigation

### 🚀 Getting Started

1. **[QUICK_START.md](./QUICK_START.md)** - Get bot running in 15 minutes
   - Create Lark app
   - Configure credentials
   - Deploy locally with ngrok
   - Test your first dashboard

2. **[BOT_SETUP.md](./BOT_SETUP.md)** - Comprehensive setup guide
   - Detailed Lark app configuration
   - OAuth flow
   - Webhook setup
   - Production deployment
   - Monitoring and logging

3. **[README.md](./README.md)** - Bot overview and documentation
   - Architecture
   - Features
   - API reference
   - Development guide

### 🔧 Configuration

1. **[.env.example](./.env.example)** - Environment variables template
   ```bash
   cp .env.example .env
   # Edit with your credentials
   ```

2. **[config/app-config.json](./config/app-config.json)** - Bot configuration
   - App settings
   - Feature flags
   - Permissions
   - Event subscriptions

### 💬 Example Conversations

Learn by example - see how the bot handles real conversations:

1. **[conversation-1-sales-dashboard.md](./examples/conversation-1-sales-dashboard.md)**
   - Basic dashboard creation
   - Adding charts, metrics, views
   - Progressive building workflow

2. **[conversation-2-team-performance.md](./examples/conversation-2-team-performance.md)**
   - Multiple metrics tracking
   - Different chart types
   - Kanban board integration

3. **[conversation-3-error-recovery.md](./examples/conversation-3-error-recovery.md)**
   - Handling missing parameters
   - Invalid input recovery
   - Multi-step clarification
   - Help system usage

4. **[conversation-4-realtime-analytics.md](./examples/conversation-4-realtime-analytics.md)**
   - Real-time monitoring dashboard
   - Time-based filters
   - Multiple KPIs
   - Best practices

5. **[conversation-5-multi-source-dashboard.md](./examples/conversation-5-multi-source-dashboard.md)**
   - Multiple data sources
   - Organized sections
   - Executive summary dashboard

### 🐛 Troubleshooting

**[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions

#### Common Issues:
- [Bot Not Responding](./TROUBLESHOOTING.md#bot-not-responding)
- [Webhook Verification Failed](./TROUBLESHOOTING.md#webhook-verification-failed)
- [Message Parsing Issues](./TROUBLESHOOTING.md#message-parsing-issues)
- [Dashboard Creation Errors](./TROUBLESHOOTING.md#dashboard-creation-errors)
- [Token/Authentication Issues](./TROUBLESHOOTING.md#tokenauthentication-issues)
- [Context Not Working](./TROUBLESHOOTING.md#context-not-working)
- [Performance Issues](./TROUBLESHOOTING.md#performance-issues)
- [Deployment Issues](./TROUBLESHOOTING.md#deployment-issues)

### 📚 Technical Documentation

**[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical deep dive

#### Topics Covered:
- Project structure
- Core components
- Natural language parsing
- Intent recognition system
- Conversation context
- SDK integration
- Deployment options
- Performance metrics
- Security considerations
- Future enhancements

### 🛠️ Deployment

#### Option 1: PM2 (Production)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 monit
```
See: [ecosystem.config.js](./ecosystem.config.js)

#### Option 2: Docker
```bash
docker-compose up -d
docker-compose logs -f
```
See: [docker-compose.yml](./docker-compose.yml) and [Dockerfile](./Dockerfile)

#### Option 3: Systemd
```bash
sudo systemctl start lark-bot
sudo systemctl enable lark-bot
```
See: [BOT_SETUP.md#option-3-systemd-service](./BOT_SETUP.md#option-3-systemd-service)

### 📖 Documentation by Role

#### For Beginners
Start here if you're new to Lark bots:
1. [QUICK_START.md](./QUICK_START.md) - 15-minute setup
2. [conversation-1-sales-dashboard.md](./examples/conversation-1-sales-dashboard.md) - First example
3. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - If issues arise

#### For Developers
Understand the implementation:
1. [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical overview
2. [README.md](./README.md) - API and architecture
3. [bot-dashboard-assistant.ts](./bot-dashboard-assistant.ts) - Source code
4. [server.ts](./server.ts) - HTTP server

#### For DevOps
Deploy and monitor:
1. [BOT_SETUP.md#deployment](./BOT_SETUP.md#deployment) - Deployment guide
2. [ecosystem.config.js](./ecosystem.config.js) - PM2 config
3. [Dockerfile](./Dockerfile) - Docker setup
4. [TROUBLESHOOTING.md#deployment-issues](./TROUBLESHOOTING.md#deployment-issues)

#### For Product Managers
Understand capabilities:
1. [README.md#overview](./README.md#overview) - Bot features
2. [examples/](./examples/) - Usage scenarios
3. [IMPLEMENTATION_SUMMARY.md#key-features-implementation](./IMPLEMENTATION_SUMMARY.md#key-features-implementation)

### 📋 Documentation Checklist

Use this to navigate the setup process:

- [ ] Read [QUICK_START.md](./QUICK_START.md)
- [ ] Create Lark app
- [ ] Copy [.env.example](./.env.example) to `.env`
- [ ] Configure credentials
- [ ] Run `npm install && npm run build`
- [ ] Start bot with `npm run bot:start`
- [ ] Expose with ngrok
- [ ] Configure webhook in Lark
- [ ] Test with "help" command
- [ ] Review [examples/](./examples/) for usage patterns
- [ ] Set up production deployment
- [ ] Configure monitoring

### 🔍 Search by Topic

#### Natural Language Processing
- [Intent Recognition](./README.md#intent-recognition)
- [Entity Extraction](./IMPLEMENTATION_SUMMARY.md#entity-extraction)
- [Parsing Logic](./bot-dashboard-assistant.ts) - `parseIntent()` method

#### Conversation Management
- [Context Management](./README.md#conversation-context)
- [Multi-turn Conversations](./examples/conversation-2-team-performance.md)
- [Context Storage](./IMPLEMENTATION_SUMMARY.md#context-management)

#### Dashboard Creation
- [Creating Dashboards](./examples/conversation-1-sales-dashboard.md)
- [Adding Charts](./examples/conversation-1-sales-dashboard.md#user-message-2)
- [Adding Metrics](./examples/conversation-1-sales-dashboard.md#user-message-3)
- [SDK Integration](./IMPLEMENTATION_SUMMARY.md#dashboard-sdk-integration)

#### Error Handling
- [Error Recovery](./examples/conversation-3-error-recovery.md)
- [Missing Parameters](./TROUBLESHOOTING.md#message-parsing-issues)
- [API Errors](./TROUBLESHOOTING.md#dashboard-creation-errors)

#### Deployment
- [Local Development](./QUICK_START.md#step-6-start-bot-local-testing)
- [PM2 Deployment](./BOT_SETUP.md#option-1-pm2-recommended)
- [Docker Deployment](./BOT_SETUP.md#option-2-cloud-deployment-production)
- [Production Setup](./BOT_SETUP.md#production-deployment)

#### Configuration
- [Environment Variables](./README.md#environment-variables)
- [App Configuration](./README.md#app-configuration)
- [Lark App Setup](./BOT_SETUP.md#lark-app-setup)

### 📊 File Overview

| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| `bot-dashboard-assistant.ts` | Main bot logic | 1,200+ | ✅ Complete |
| `server.ts` | HTTP server | 150 | ✅ Complete |
| `BOT_SETUP.md` | Setup guide | 5,000+ words | ✅ Complete |
| `QUICK_START.md` | Quick start | 1,500+ words | ✅ Complete |
| `TROUBLESHOOTING.md` | Troubleshooting | 3,000+ words | ✅ Complete |
| `README.md` | Main docs | 4,000+ words | ✅ Complete |
| `IMPLEMENTATION_SUMMARY.md` | Technical deep dive | 3,500+ words | ✅ Complete |
| `conversation-*.md` | Examples (5 files) | 2,000+ words each | ✅ Complete |
| `ecosystem.config.js` | PM2 config | 100 | ✅ Complete |
| `Dockerfile` | Docker image | 50 | ✅ Complete |
| `docker-compose.yml` | Docker Compose | 40 | ✅ Complete |

### 🎯 Use Cases

#### Use Case 1: Sales Dashboard
1. Start: [conversation-1-sales-dashboard.md](./examples/conversation-1-sales-dashboard.md)
2. Learn: Chart creation, metrics, views
3. Apply: Create your own sales dashboard

#### Use Case 2: Team Tracking
1. Start: [conversation-2-team-performance.md](./examples/conversation-2-team-performance.md)
2. Learn: Kanban views, multiple metrics
3. Apply: Track team performance

#### Use Case 3: Real-time Monitoring
1. Start: [conversation-4-realtime-analytics.md](./examples/conversation-4-realtime-analytics.md)
2. Learn: Time-based filters, KPIs
3. Apply: Monitor live systems

#### Use Case 4: Executive Reports
1. Start: [conversation-5-multi-source-dashboard.md](./examples/conversation-5-multi-source-dashboard.md)
2. Learn: Multi-source, sections
3. Apply: Create executive dashboards

### 🆘 Getting Help

#### Self-Service
1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for your issue
2. Review relevant [example conversation](./examples/)
3. Read [BOT_SETUP.md](./BOT_SETUP.md) section
4. Enable debug logging (set `BOT_LOGGING=true`)

#### Community Support
- **GitHub Issues**: https://github.com/hypelab/lark-dashboard-sdk/issues
- **Discussions**: https://github.com/hypelab/lark-dashboard-sdk/discussions
- **Lark Docs**: https://open.feishu.cn/document

#### Reporting Issues
Include:
1. Error message (exact text)
2. Bot logs (relevant portions)
3. Steps to reproduce
4. Environment details

### 📝 Contributing

Want to improve the bot? See:
1. [README.md#contributing](./README.md#contributing)
2. [IMPLEMENTATION_SUMMARY.md#extensibility](./IMPLEMENTATION_SUMMARY.md#extensibility)

### 🔗 External Resources

- **Lark Open Platform**: https://open.feishu.cn
- **Lark API Docs**: https://open.feishu.cn/document
- **Dashboard SDK**: [../README.md](../README.md)
- **MCP Protocol**: https://modelcontextprotocol.io
- **Express.js**: https://expressjs.com

### 📱 Quick Commands

```bash
# Development
npm run bot:dev          # Run with ts-node
npm run bot:start        # Run compiled version

# Production
npm run bot:pm2          # Start with PM2
npm run bot:docker       # Start with Docker

# Testing
curl http://localhost:3000/health
curl http://localhost:3000/webhook -X POST -H "Content-Type: application/json" -d @test-event.json

# Monitoring
pm2 logs lark-dashboard-bot
pm2 monit
docker-compose logs -f
```

### 🎓 Learning Path

#### Beginner
1. ⏱️ 15 min: [QUICK_START.md](./QUICK_START.md)
2. ⏱️ 10 min: [conversation-1-sales-dashboard.md](./examples/conversation-1-sales-dashboard.md)
3. ⏱️ 5 min: Test bot with your data

#### Intermediate
1. ⏱️ 30 min: [BOT_SETUP.md](./BOT_SETUP.md)
2. ⏱️ 20 min: [README.md](./README.md)
3. ⏱️ 15 min: Review all [examples/](./examples/)
4. ⏱️ 10 min: Deploy to production

#### Advanced
1. ⏱️ 45 min: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
2. ⏱️ 30 min: Read source code
3. ⏱️ 30 min: Extend with custom intents
4. ⏱️ 20 min: Set up monitoring

**Total Learning Time:**
- Beginner: ~30 minutes
- Intermediate: ~2 hours
- Advanced: ~3 hours

### ✨ Features at a Glance

| Feature | Implemented | Documentation |
|---------|-------------|---------------|
| Natural Language | ✅ | [README.md](./README.md#natural-language-parsing) |
| Multi-turn Context | ✅ | [README.md](./README.md#conversation-context) |
| Error Recovery | ✅ | [conversation-3](./examples/conversation-3-error-recovery.md) |
| Rich Cards | ✅ | [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md#rich-responses) |
| All Block Types | ✅ | [README.md](./README.md#intent-recognition) |
| PM2 Deployment | ✅ | [ecosystem.config.js](./ecosystem.config.js) |
| Docker Support | ✅ | [Dockerfile](./Dockerfile) |
| Health Checks | ✅ | [server.ts](./server.ts) |
| Logging | ✅ | [BOT_SETUP.md](./BOT_SETUP.md#monitoring) |
| Documentation | ✅ | All files in this index |

### 📦 Package Scripts

```json
{
  "bot:start": "node dist/bot/server.js",
  "bot:dev": "ts-node bot/server.ts",
  "bot:pm2": "pm2 start bot/ecosystem.config.js",
  "bot:docker": "docker-compose -f bot/docker-compose.yml up -d"
}
```

### 🎉 Success!

If you've reached this point, you should have:
- ✅ Complete understanding of bot architecture
- ✅ All necessary documentation
- ✅ Multiple deployment options
- ✅ Real conversation examples
- ✅ Troubleshooting resources

**Ready to create dashboards with natural language!**

---

**Last Updated**: 2025-01-15
**Version**: 1.0.0
**License**: MIT
