/**
 * Lark Dashboard Assistant Bot
 * OpenAPI MCP Smart Assistant for intelligent dashboard creation through natural language
 *
 * This bot integrates with Lark messaging API and uses the Dashboard SDK
 * to create dashboards based on natural language user requests.
 */

import axios, { AxiosInstance } from 'axios';
import { LarkDashboardClient } from '../src/client';
import {
  ChartBlockBuilder,
  MetricsBlockBuilder,
  ViewBlockBuilder,
  TextBlockBuilder,
} from '../src/builders';
import { AggregationType, ChartType, ViewType } from '../src/types';

/**
 * Bot configuration interface
 */
interface BotConfig {
  appId: string;
  appSecret: string;
  verificationToken: string;
  encryptKey?: string;
  region?: 'sg' | 'cn' | 'us';
  port?: number;
  logging?: boolean;
}

/**
 * User request intent types
 */
enum IntentType {
  CREATE_DASHBOARD = 'create_dashboard',
  ADD_CHART = 'add_chart',
  ADD_METRICS = 'add_metrics',
  ADD_VIEW = 'add_view',
  ADD_TEXT = 'add_text',
  LIST_DASHBOARDS = 'list_dashboards',
  DELETE_DASHBOARD = 'delete_dashboard',
  HELP = 'help',
  UNKNOWN = 'unknown',
}

/**
 * Parsed user intent
 */
interface ParsedIntent {
  type: IntentType;
  confidence: number;
  entities: {
    dashboardName?: string;
    appToken?: string;
    dashboardId?: string;
    tableId?: string;
    viewId?: string;
    chartType?: string;
    viewType?: string;
    fieldNames?: string[];
    aggregation?: string;
    title?: string;
    metrics?: string;
    content?: string;
  };
  rawText: string;
}

/**
 * Conversation context for multi-turn interactions
 */
interface ConversationContext {
  userId: string;
  sessionId: string;
  lastIntent?: ParsedIntent;
  pendingAction?: {
    type: string;
    data: any;
  };
  currentDashboard?: {
    appToken: string;
    dashboardId: string;
    name: string;
  };
  createdAt: number;
  lastActivity: number;
}

/**
 * Lark Dashboard Assistant Bot
 *
 * Handles natural language requests and creates dashboards using the SDK
 */
export class LarkDashboardAssistant {
  private config: BotConfig;
  private dashboardClient: LarkDashboardClient;
  private httpClient: AxiosInstance;
  private tenantAccessToken: string = '';
  private tokenExpiry: number = 0;
  private contexts: Map<string, ConversationContext> = new Map();

  // Context cleanup interval (30 minutes)
  private readonly CONTEXT_TTL = 30 * 60 * 1000;

  constructor(config: BotConfig) {
    this.config = {
      region: 'sg',
      port: 3000,
      logging: false,
      ...config,
    };

    // Initialize dashboard client
    this.dashboardClient = new LarkDashboardClient({
      apiKey: '', // Will be set via tenant access token
      region: this.config.region!,
      logging: this.config.logging,
    });

    // Initialize HTTP client for Lark API
    const baseURL = this.getBaseURL();
    this.httpClient = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Start context cleanup
    this.startContextCleanup();

    if (this.config.logging) {
      console.log('Lark Dashboard Assistant Bot initialized');
      console.log(`Region: ${this.config.region}`);
      console.log(`Base URL: ${baseURL}`);
    }
  }

  /**
   * Get Lark API base URL based on region
   */
  private getBaseURL(): string {
    const urls = {
      sg: 'https://open.feishu.cn/open-apis',
      cn: 'https://open.feishu.cn/open-apis',
      us: 'https://open.larksuite.com/open-apis',
    };
    return urls[this.config.region!];
  }

  /**
   * Get tenant access token
   */
  private async getTenantAccessToken(): Promise<string> {
    // Check if token is still valid
    if (this.tenantAccessToken && Date.now() < this.tokenExpiry) {
      return this.tenantAccessToken;
    }

    try {
      const response = await this.httpClient.post('/auth/v3/tenant_access_token/internal', {
        app_id: this.config.appId,
        app_secret: this.config.appSecret,
      });

      if (response.data.code === 0) {
        this.tenantAccessToken = response.data.tenant_access_token;
        // Token expires in 2 hours, refresh 5 minutes before
        this.tokenExpiry = Date.now() + (response.data.expire - 300) * 1000;

        if (this.config.logging) {
          console.log('Tenant access token refreshed');
        }

        return this.tenantAccessToken;
      } else {
        throw new Error(`Failed to get tenant access token: ${response.data.msg}`);
      }
    } catch (error: any) {
      console.error('Error getting tenant access token:', error.message);
      throw error;
    }
  }

  /**
   * Send message to user
   */
  private async sendMessage(chatId: string, content: string): Promise<void> {
    const token = await this.getTenantAccessToken();

    try {
      await this.httpClient.post(
        '/im/v1/messages',
        {
          receive_id: chatId,
          msg_type: 'text',
          content: JSON.stringify({ text: content }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            receive_id_type: 'chat_id',
          },
        }
      );

      if (this.config.logging) {
        console.log(`Message sent to ${chatId}`);
      }
    } catch (error: any) {
      console.error('Error sending message:', error.message);
      throw error;
    }
  }

  /**
   * Send rich card message with dashboard link
   */
  private async sendDashboardCard(
    chatId: string,
    dashboardName: string,
    dashboardUrl: string,
    blocks: string[]
  ): Promise<void> {
    const token = await this.getTenantAccessToken();

    const card = {
      header: {
        title: {
          tag: 'plain_text',
          content: '✅ Dashboard Created Successfully',
        },
        template: 'green',
      },
      elements: [
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**${dashboardName}**\n\n[View Dashboard](${dashboardUrl})`,
          },
        },
        {
          tag: 'hr',
        },
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: `**Blocks Created:**\n${blocks.map((b, i) => `${i + 1}. ${b}`).join('\n')}`,
          },
        },
        {
          tag: 'action',
          actions: [
            {
              tag: 'button',
              text: {
                tag: 'plain_text',
                content: 'Open Dashboard',
              },
              type: 'primary',
              url: dashboardUrl,
            },
          ],
        },
      ],
    };

    try {
      await this.httpClient.post(
        '/im/v1/messages',
        {
          receive_id: chatId,
          msg_type: 'interactive',
          content: JSON.stringify(card),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            receive_id_type: 'chat_id',
          },
        }
      );
    } catch (error: any) {
      console.error('Error sending card message:', error.message);
      // Fallback to text message
      await this.sendMessage(
        chatId,
        `✅ Dashboard "${dashboardName}" created!\n\nView it here: ${dashboardUrl}\n\nBlocks: ${blocks.join(', ')}`
      );
    }
  }

  /**
   * Parse user message to extract intent
   */
  private parseIntent(message: string, context?: ConversationContext): ParsedIntent {
    const lowerMessage = message.toLowerCase();
    const entities: ParsedIntent['entities'] = {};

    // Extract app token (pattern: appToken, app_token, or app token followed by alphanumeric)
    const appTokenMatch = message.match(/(?:app[-_\s]?token|base)[:=\s]+([a-zA-Z0-9]+)/i);
    if (appTokenMatch) {
      entities.appToken = appTokenMatch[1];
    } else if (context?.currentDashboard) {
      entities.appToken = context.currentDashboard.appToken;
    }

    // Extract dashboard ID
    const dashboardIdMatch = message.match(/(?:dashboard[-_\s]?id)[:=\s]+([a-zA-Z0-9]+)/i);
    if (dashboardIdMatch) {
      entities.dashboardId = dashboardIdMatch[1];
    } else if (context?.currentDashboard) {
      entities.dashboardId = context.currentDashboard.dashboardId;
    }

    // Extract table ID
    const tableIdMatch = message.match(/(?:table[-_\s]?id)[:=\s]+([a-zA-Z0-9]+)/i);
    if (tableIdMatch) {
      entities.tableId = tableIdMatch[1];
    }

    // Detect intent based on keywords
    if (lowerMessage.includes('create') && (lowerMessage.includes('dashboard') || lowerMessage.includes('new'))) {
      // Extract dashboard name
      const nameMatch = message.match(/(?:called|named|name)[:=\s]+["']?([^"'\n]+)["']?/i) ||
                       message.match(/dashboard["'\s]+([^"'\n]+)/i);
      if (nameMatch) {
        entities.dashboardName = nameMatch[1].trim();
      }

      return {
        type: IntentType.CREATE_DASHBOARD,
        confidence: 0.9,
        entities,
        rawText: message,
      };
    }

    if (lowerMessage.includes('chart') || lowerMessage.includes('graph') || lowerMessage.includes('plot')) {
      // Detect chart type
      const chartTypes: Record<string, string> = {
        bar: 'bar',
        line: 'line',
        pie: 'pie',
        scatter: 'scatter',
        area: 'area',
        column: 'column',
        funnel: 'funnel',
        radar: 'radar',
        table: 'table',
      };

      for (const [key, value] of Object.entries(chartTypes)) {
        if (lowerMessage.includes(key)) {
          entities.chartType = value;
          break;
        }
      }

      // Extract field names for X and Y axes
      const xAxisMatch = message.match(/x[-_\s]?axis[:=\s]+([a-zA-Z0-9_]+)/i);
      const yAxisMatch = message.match(/y[-_\s]?axis[:=\s]+([a-zA-Z0-9_,\s]+)/i);

      if (xAxisMatch) {
        entities.fieldNames = [xAxisMatch[1]];
      }
      if (yAxisMatch) {
        entities.fieldNames = [
          ...(entities.fieldNames || []),
          ...yAxisMatch[1].split(',').map(f => f.trim()),
        ];
      }

      // Extract title
      const titleMatch = message.match(/(?:title|called|named)[:=\s]+["']?([^"'\n]+)["']?/i);
      if (titleMatch) {
        entities.title = titleMatch[1].trim();
      }

      return {
        type: IntentType.ADD_CHART,
        confidence: 0.85,
        entities,
        rawText: message,
      };
    }

    if (lowerMessage.includes('metric') || lowerMessage.includes('kpi') ||
        lowerMessage.includes('sum') || lowerMessage.includes('count') ||
        lowerMessage.includes('average') || lowerMessage.includes('avg')) {

      // Detect aggregation type
      if (lowerMessage.includes('sum')) entities.aggregation = 'SUM';
      else if (lowerMessage.includes('count')) entities.aggregation = 'COUNT';
      else if (lowerMessage.includes('average') || lowerMessage.includes('avg')) entities.aggregation = 'AVG';
      else if (lowerMessage.includes('max')) entities.aggregation = 'MAX';
      else if (lowerMessage.includes('min')) entities.aggregation = 'MIN';

      // Extract field name
      const fieldMatch = message.match(/(?:field|column)[:=\s]+([a-zA-Z0-9_]+)/i);
      if (fieldMatch) {
        entities.fieldNames = [fieldMatch[1]];
      }

      return {
        type: IntentType.ADD_METRICS,
        confidence: 0.8,
        entities,
        rawText: message,
      };
    }

    if (lowerMessage.includes('view') && !lowerMessage.includes('view_id')) {
      // Detect view type
      const viewTypes: Record<string, string> = {
        grid: 'grid',
        table: 'grid',
        kanban: 'kanban',
        gallery: 'gallery',
        gantt: 'gantt',
        form: 'form',
      };

      for (const [key, value] of Object.entries(viewTypes)) {
        if (lowerMessage.includes(key)) {
          entities.viewType = value;
          break;
        }
      }

      return {
        type: IntentType.ADD_VIEW,
        confidence: 0.75,
        entities,
        rawText: message,
      };
    }

    if ((lowerMessage.includes('add') || lowerMessage.includes('create')) &&
        (lowerMessage.includes('text') || lowerMessage.includes('heading') || lowerMessage.includes('title'))) {

      // Extract content
      const contentMatch = message.match(/["']([^"']+)["']/);
      if (contentMatch) {
        entities.content = contentMatch[1];
      }

      return {
        type: IntentType.ADD_TEXT,
        confidence: 0.7,
        entities,
        rawText: message,
      };
    }

    if (lowerMessage.includes('list') && lowerMessage.includes('dashboard')) {
      return {
        type: IntentType.LIST_DASHBOARDS,
        confidence: 0.9,
        entities,
        rawText: message,
      };
    }

    if (lowerMessage.includes('delete') && lowerMessage.includes('dashboard')) {
      return {
        type: IntentType.DELETE_DASHBOARD,
        confidence: 0.85,
        entities,
        rawText: message,
      };
    }

    if (lowerMessage.includes('help') || lowerMessage === '?') {
      return {
        type: IntentType.HELP,
        confidence: 1.0,
        entities,
        rawText: message,
      };
    }

    return {
      type: IntentType.UNKNOWN,
      confidence: 0.0,
      entities,
      rawText: message,
    };
  }

  /**
   * Get or create conversation context
   */
  private getContext(userId: string, sessionId: string): ConversationContext {
    const key = `${userId}-${sessionId}`;
    let context = this.contexts.get(key);

    if (!context) {
      context = {
        userId,
        sessionId,
        createdAt: Date.now(),
        lastActivity: Date.now(),
      };
      this.contexts.set(key, context);
    } else {
      context.lastActivity = Date.now();
    }

    return context;
  }

  /**
   * Update conversation context
   */
  private updateContext(context: ConversationContext, updates: Partial<ConversationContext>): void {
    Object.assign(context, updates);
    context.lastActivity = Date.now();
  }

  /**
   * Clean up old contexts
   */
  private startContextCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, context] of this.contexts.entries()) {
        if (now - context.lastActivity > this.CONTEXT_TTL) {
          this.contexts.delete(key);
          if (this.config.logging) {
            console.log(`Cleaned up context for ${key}`);
          }
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  /**
   * Handle user message
   */
  async handleMessage(userId: string, chatId: string, messageId: string, text: string): Promise<void> {
    if (this.config.logging) {
      console.log(`Message from ${userId}: ${text}`);
    }

    try {
      // Get conversation context
      const context = this.getContext(userId, chatId);

      // Parse user intent
      const intent = this.parseIntent(text, context);

      if (this.config.logging) {
        console.log(`Parsed intent: ${intent.type} (confidence: ${intent.confidence})`);
      }

      // Update context
      this.updateContext(context, { lastIntent: intent });

      // Execute intent
      await this.executeIntent(intent, context, chatId);

    } catch (error: any) {
      console.error('Error handling message:', error);
      await this.sendMessage(chatId, `❌ Error: ${error.message}`);
    }
  }

  /**
   * Execute parsed intent
   */
  private async executeIntent(
    intent: ParsedIntent,
    context: ConversationContext,
    chatId: string
  ): Promise<void> {
    switch (intent.type) {
      case IntentType.CREATE_DASHBOARD:
        await this.handleCreateDashboard(intent, context, chatId);
        break;

      case IntentType.ADD_CHART:
        await this.handleAddChart(intent, context, chatId);
        break;

      case IntentType.ADD_METRICS:
        await this.handleAddMetrics(intent, context, chatId);
        break;

      case IntentType.ADD_VIEW:
        await this.handleAddView(intent, context, chatId);
        break;

      case IntentType.ADD_TEXT:
        await this.handleAddText(intent, context, chatId);
        break;

      case IntentType.LIST_DASHBOARDS:
        await this.handleListDashboards(intent, context, chatId);
        break;

      case IntentType.DELETE_DASHBOARD:
        await this.handleDeleteDashboard(intent, context, chatId);
        break;

      case IntentType.HELP:
        await this.handleHelp(chatId);
        break;

      default:
        await this.sendMessage(
          chatId,
          `I'm not sure what you want me to do. Type "help" to see available commands.`
        );
    }
  }

  /**
   * Handle create dashboard intent
   */
  private async handleCreateDashboard(
    intent: ParsedIntent,
    context: ConversationContext,
    chatId: string
  ): Promise<void> {
    const { dashboardName, appToken } = intent.entities;

    if (!appToken) {
      await this.sendMessage(
        chatId,
        '❓ I need an app token to create the dashboard. Please provide it like:\n"Create dashboard with app_token: YOUR_APP_TOKEN"'
      );
      return;
    }

    if (!dashboardName) {
      await this.sendMessage(
        chatId,
        '❓ What would you like to name this dashboard?'
      );
      this.updateContext(context, {
        pendingAction: {
          type: 'create_dashboard',
          data: { appToken },
        },
      });
      return;
    }

    await this.sendMessage(chatId, `⏳ Creating dashboard "${dashboardName}"...`);

    try {
      // Create dashboard (Note: Actual implementation depends on SDK API)
      // For now, we'll simulate with a text block as placeholder
      const textBlock = TextBlockBuilder.heading(dashboardName).build();
      const response = await this.dashboardClient.createBlock(appToken, textBlock);

      const dashboardId = response.block_id;
      const dashboardUrl = this.getDashboardURL(appToken, dashboardId);

      // Update context with current dashboard
      this.updateContext(context, {
        currentDashboard: {
          appToken,
          dashboardId,
          name: dashboardName,
        },
      });

      await this.sendDashboardCard(
        chatId,
        dashboardName,
        dashboardUrl,
        ['Dashboard header']
      );

      await this.sendMessage(
        chatId,
        `\n💡 You can now add blocks to this dashboard:\n` +
        `- "Add a bar chart showing sales by category"\n` +
        `- "Add metrics showing total revenue"\n` +
        `- "Add a grid view of the data"`
      );

    } catch (error: any) {
      await this.sendMessage(chatId, `❌ Failed to create dashboard: ${error.message}`);
    }
  }

  /**
   * Handle add chart intent
   */
  private async handleAddChart(
    intent: ParsedIntent,
    context: ConversationContext,
    chatId: string
  ): Promise<void> {
    const { appToken, dashboardId, tableId, chartType, fieldNames, title } = intent.entities;

    // Check required parameters
    if (!appToken || !context.currentDashboard) {
      await this.sendMessage(chatId, '❓ Please create a dashboard first.');
      return;
    }

    if (!tableId) {
      await this.sendMessage(chatId, '❓ I need a table ID. Example: "table_id: tblXXXX"');
      return;
    }

    if (!chartType) {
      await this.sendMessage(chatId, '❓ What type of chart? (bar, line, pie, etc.)');
      return;
    }

    if (!fieldNames || fieldNames.length < 2) {
      await this.sendMessage(
        chatId,
        '❓ I need field names for X and Y axes. Example: "x_axis: Date, y_axis: Revenue"'
      );
      return;
    }

    await this.sendMessage(chatId, `⏳ Adding ${chartType} chart...`);

    try {
      const chartTypeMap: Record<string, ChartType> = {
        bar: ChartType.BAR,
        line: ChartType.LINE,
        pie: ChartType.PIE,
        scatter: ChartType.SCATTER,
        area: ChartType.AREA,
        column: ChartType.COLUMN,
      };

      const builder = ChartBlockBuilder
        .create()
        .chartType(chartTypeMap[chartType])
        .dataSource(appToken, tableId)
        .xAxis(fieldNames[0])
        .yAxis([{
          fieldName: fieldNames[1],
          aggregation: AggregationType.SUM,
        }]);

      if (title) {
        builder.title(title);
      }

      const block = builder.build();
      await this.dashboardClient.createBlock(appToken, block);

      await this.sendMessage(
        chatId,
        `✅ ${chartType.charAt(0).toUpperCase() + chartType.slice(1)} chart added successfully!`
      );

    } catch (error: any) {
      await this.sendMessage(chatId, `❌ Failed to add chart: ${error.message}`);
    }
  }

  /**
   * Handle add metrics intent
   */
  private async handleAddMetrics(
    intent: ParsedIntent,
    context: ConversationContext,
    chatId: string
  ): Promise<void> {
    const { appToken, tableId, fieldNames, aggregation } = intent.entities;

    if (!appToken || !context.currentDashboard) {
      await this.sendMessage(chatId, '❓ Please create a dashboard first.');
      return;
    }

    if (!tableId) {
      await this.sendMessage(chatId, '❓ I need a table ID.');
      return;
    }

    if (!fieldNames || fieldNames.length === 0) {
      await this.sendMessage(chatId, '❓ Which field should I aggregate?');
      return;
    }

    if (!aggregation) {
      await this.sendMessage(chatId, '❓ What aggregation? (sum, count, average, max, min)');
      return;
    }

    await this.sendMessage(chatId, '⏳ Adding metrics block...');

    try {
      const aggType = aggregation as AggregationType;

      const block = MetricsBlockBuilder
        .create()
        .dataSource(appToken, tableId)
        .field(fieldNames[0])
        .aggregation(aggType)
        .build();

      await this.dashboardClient.createBlock(appToken, block);

      await this.sendMessage(chatId, '✅ Metrics block added successfully!');

    } catch (error: any) {
      await this.sendMessage(chatId, `❌ Failed to add metrics: ${error.message}`);
    }
  }

  /**
   * Handle add view intent
   */
  private async handleAddView(
    intent: ParsedIntent,
    context: ConversationContext,
    chatId: string
  ): Promise<void> {
    const { appToken, tableId, viewType } = intent.entities;

    if (!appToken || !context.currentDashboard) {
      await this.sendMessage(chatId, '❓ Please create a dashboard first.');
      return;
    }

    if (!tableId) {
      await this.sendMessage(chatId, '❓ I need a table ID.');
      return;
    }

    if (!viewType) {
      await this.sendMessage(chatId, '❓ What type of view? (grid, kanban, gallery, gantt, form)');
      return;
    }

    await this.sendMessage(chatId, `⏳ Adding ${viewType} view...`);

    try {
      const viewTypeMap: Record<string, ViewType> = {
        grid: ViewType.GRID,
        kanban: ViewType.KANBAN,
        gallery: ViewType.GALLERY,
        gantt: ViewType.GANTT,
        form: ViewType.FORM,
      };

      const block = ViewBlockBuilder
        .create()
        .viewType(viewTypeMap[viewType])
        .dataSource(appToken, tableId)
        .build();

      await this.dashboardClient.createBlock(appToken, block);

      await this.sendMessage(chatId, `✅ ${viewType} view added successfully!`);

    } catch (error: any) {
      await this.sendMessage(chatId, `❌ Failed to add view: ${error.message}`);
    }
  }

  /**
   * Handle add text intent
   */
  private async handleAddText(
    intent: ParsedIntent,
    context: ConversationContext,
    chatId: string
  ): Promise<void> {
    const { appToken, content } = intent.entities;

    if (!appToken || !context.currentDashboard) {
      await this.sendMessage(chatId, '❓ Please create a dashboard first.');
      return;
    }

    if (!content) {
      await this.sendMessage(chatId, '❓ What text should I add?');
      return;
    }

    try {
      const isHeading = intent.rawText.toLowerCase().includes('heading') ||
                       intent.rawText.toLowerCase().includes('title');

      const block = isHeading
        ? TextBlockBuilder.heading(content).build()
        : TextBlockBuilder.paragraph(content).build();

      await this.dashboardClient.createBlock(appToken, block);

      await this.sendMessage(chatId, '✅ Text block added successfully!');

    } catch (error: any) {
      await this.sendMessage(chatId, `❌ Failed to add text: ${error.message}`);
    }
  }

  /**
   * Handle list dashboards intent
   */
  private async handleListDashboards(
    intent: ParsedIntent,
    context: ConversationContext,
    chatId: string
  ): Promise<void> {
    const { appToken } = intent.entities;

    if (!appToken) {
      await this.sendMessage(chatId, '❓ I need an app token to list dashboards.');
      return;
    }

    try {
      const blocks = await this.dashboardClient.listBlocks(appToken);

      if (blocks.length === 0) {
        await this.sendMessage(chatId, '📋 No dashboards found in this base.');
        return;
      }

      const message = `📋 Found ${blocks.length} block(s):\n\n` +
        blocks.map((block: any, i: number) =>
          `${i + 1}. ${block.block_type || 'Unknown'} (ID: ${block.block_id})`
        ).join('\n');

      await this.sendMessage(chatId, message);

    } catch (error: any) {
      await this.sendMessage(chatId, `❌ Failed to list dashboards: ${error.message}`);
    }
  }

  /**
   * Handle delete dashboard intent
   */
  private async handleDeleteDashboard(
    intent: ParsedIntent,
    context: ConversationContext,
    chatId: string
  ): Promise<void> {
    const { appToken, dashboardId } = intent.entities;

    if (!appToken || !dashboardId) {
      await this.sendMessage(chatId, '❓ I need both app_token and dashboard_id to delete.');
      return;
    }

    try {
      await this.dashboardClient.deleteBlock(appToken, dashboardId);

      // Clear context if this was the current dashboard
      if (context.currentDashboard?.dashboardId === dashboardId) {
        this.updateContext(context, { currentDashboard: undefined });
      }

      await this.sendMessage(chatId, '✅ Dashboard deleted successfully!');

    } catch (error: any) {
      await this.sendMessage(chatId, `❌ Failed to delete dashboard: ${error.message}`);
    }
  }

  /**
   * Handle help request
   */
  private async handleHelp(chatId: string): Promise<void> {
    const helpMessage = `🤖 **Lark Dashboard Assistant**

I can help you create dashboards using natural language! Here's what I can do:

**Create Dashboard:**
- "Create a sales dashboard with app_token: YOUR_TOKEN"
- "Create dashboard called 'Q1 Analytics' with app_token: abc123"

**Add Chart:**
- "Add a bar chart with table_id: tbl123, x_axis: Category, y_axis: Sales"
- "Add line chart showing revenue over time"

**Add Metrics:**
- "Add sum of Revenue metric with table_id: tbl123, field: Revenue"
- "Add count of customers"

**Add View:**
- "Add grid view with table_id: tbl123"
- "Add kanban view of tasks"

**Add Text:**
- "Add heading 'Sales Overview'"
- "Add text 'This dashboard shows Q1 results'"

**Manage:**
- "List dashboards with app_token: YOUR_TOKEN"
- "Delete dashboard with dashboard_id: blk123"

💡 **Tips:**
- Create a dashboard first, then add blocks to it
- I'll remember your current dashboard in our conversation
- Provide table_id for charts, metrics, and views
- Use clear field names from your Lark Base tables`;

    await this.sendMessage(chatId, helpMessage);
  }

  /**
   * Get dashboard URL
   */
  private getDashboardURL(appToken: string, dashboardId: string): string {
    const baseUrl = this.config.region === 'us'
      ? 'https://larksuite.com'
      : 'https://feishu.cn';

    return `${baseUrl}/base/${appToken}?table=${dashboardId}`;
  }

  /**
   * Handle webhook event
   */
  async handleWebhookEvent(event: any): Promise<void> {
    const { type, event: eventData } = event;

    if (type === 'url_verification') {
      // This is handled at HTTP level
      return;
    }

    if (type === 'event_callback') {
      const { type: eventType } = eventData;

      if (eventType === 'message.receive_v1') {
        const { sender, message } = eventData;
        const { chat_id, message_id, content } = message;
        const userId = sender.sender_id.user_id;

        // Parse message content
        let text = '';
        try {
          const contentObj = JSON.parse(content);
          text = contentObj.text || '';
        } catch {
          text = content;
        }

        // Handle message
        await this.handleMessage(userId, chat_id, message_id, text);
      }
    }
  }

  /**
   * Verify webhook request
   */
  verifyWebhook(token: string): boolean {
    return token === this.config.verificationToken;
  }
}
