/**
 * Lark Dashboard Bot Server
 * HTTP server for handling webhook events from Lark
 */

import express, { Request, Response } from 'express';
import { LarkDashboardAssistant } from './bot-dashboard-assistant';

// Load configuration from environment
const BOT_CONFIG = {
  appId: process.env.LARK_APP_ID || '',
  appSecret: process.env.LARK_APP_SECRET || '',
  verificationToken: process.env.LARK_VERIFICATION_TOKEN || '',
  encryptKey: process.env.LARK_ENCRYPT_KEY,
  region: (process.env.LARK_REGION as 'sg' | 'cn' | 'us') || 'sg',
  port: parseInt(process.env.PORT || '3000', 10),
  logging: process.env.BOT_LOGGING === 'true',
};

// Validate required configuration
if (!BOT_CONFIG.appId || !BOT_CONFIG.appSecret || !BOT_CONFIG.verificationToken) {
  console.error('Error: Missing required environment variables');
  console.error('Required: LARK_APP_ID, LARK_APP_SECRET, LARK_VERIFICATION_TOKEN');
  process.exit(1);
}

// Initialize bot
const bot = new LarkDashboardAssistant(BOT_CONFIG);

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'lark-dashboard-bot',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Webhook endpoint for Lark events
 */
app.post('/webhook', async (req: Request, res: Response) => {
  try {
    const event = req.body;

    // Handle URL verification challenge
    if (event.type === 'url_verification') {
      const { challenge, token } = event;

      // Verify token
      if (!bot.verifyWebhook(token)) {
        return res.status(401).json({ error: 'Invalid verification token' });
      }

      // Respond with challenge
      return res.json({ challenge });
    }

    // Verify token for all other events
    if (!bot.verifyWebhook(event.token)) {
      return res.status(401).json({ error: 'Invalid verification token' });
    }

    // Handle event asynchronously
    bot.handleWebhookEvent(event).catch((error) => {
      console.error('Error handling webhook event:', error);
    });

    // Return 200 immediately (Lark requires quick response)
    res.json({ code: 0 });

  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Root endpoint - show bot info
 */
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Lark Dashboard Assistant Bot',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      webhook: '/webhook',
      health: '/health',
    },
  });
});

// Start server
app.listen(BOT_CONFIG.port, () => {
  console.log(`🤖 Lark Dashboard Bot Server started`);
  console.log(`📍 Port: ${BOT_CONFIG.port}`);
  console.log(`🌏 Region: ${BOT_CONFIG.region}`);
  console.log(`📡 Webhook: http://localhost:${BOT_CONFIG.port}/webhook`);
  console.log(`💚 Health: http://localhost:${BOT_CONFIG.port}/health`);
  if (BOT_CONFIG.logging) {
    console.log(`📝 Logging: enabled`);
  }
  console.log('');
  console.log('Ready to receive events from Lark!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});
