/**
 * PM2 Ecosystem Configuration
 * Process management for Lark Dashboard Bot
 *
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 restart lark-dashboard-bot
 *   pm2 logs lark-dashboard-bot
 *   pm2 monit
 */

module.exports = {
  apps: [
    {
      name: 'lark-dashboard-bot',
      script: './dist/bot/server.js',

      // Instances
      instances: 1, // Single instance (use 'max' for cluster mode)
      exec_mode: 'fork', // 'fork' or 'cluster'

      // Auto-restart
      autorestart: true,
      watch: false, // Enable in development: ['./dist']
      max_memory_restart: '500M',

      // Environment
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Logging
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Advanced
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],

  /**
   * Deployment configuration (optional)
   */
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/lark-dashboard-sdk.git',
      path: '/home/ubuntu/lark-dashboard-bot',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': 'echo "Deploying to production..."',
    },
    staging: {
      user: 'ubuntu',
      host: 'staging-server.com',
      ref: 'origin/develop',
      repo: 'git@github.com:yourusername/lark-dashboard-sdk.git',
      path: '/home/ubuntu/lark-dashboard-bot-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js',
    },
  },
};
