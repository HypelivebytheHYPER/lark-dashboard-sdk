#!/usr/bin/env node
/**
 * Lark Dashboard MCP Server
 * Model Context Protocol server for Lark dashboard operations
 *
 * This server exposes Lark dashboard creation and management as MCP tools
 * that can be used by Claude Code and other MCP clients.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { LarkDashboardClient } from './api/client';
import {
  ChartBlockBuilder,
  MetricsBlockBuilder,
  ViewBlockBuilder,
  TextBlockBuilder,
} from './builders';
import {
  ChartType,
  ViewType,
  AggregationType,
  FilterOperator,
  FilterConjunction,
  BlockType,
} from './types';

// Environment configuration
const LARK_API_KEY = process.env.LARK_API_KEY || process.env.LARK_TENANT_ACCESS_TOKEN || '';
const LARK_REGION = (process.env.LARK_REGION as 'sg' | 'cn' | 'us') || 'sg';
const LARK_LOGGING = process.env.LARK_LOGGING === 'true';

// Initialize Lark client
let larkClient: LarkDashboardClient | null = null;

function getLarkClient(): LarkDashboardClient {
  if (!larkClient) {
    if (!LARK_API_KEY) {
      throw new Error('LARK_API_KEY or LARK_TENANT_ACCESS_TOKEN environment variable is required');
    }
    larkClient = new LarkDashboardClient({
      apiKey: LARK_API_KEY,
      region: LARK_REGION,
      logging: LARK_LOGGING,
    });
  }
  return larkClient;
}

// MCP Server
const server = new Server(
  {
    name: 'lark-dashboard-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
const tools: Tool[] = [
  {
    name: 'create_dashboard',
    description: 'Create a new dashboard in a Lark Base. Returns the dashboard ID.',
    inputSchema: {
      type: 'object',
      properties: {
        app_token: {
          type: 'string',
          description: 'Base app token (e.g., "FUVdb7bebaVLeMsKJgJlnsX2gzd")',
        },
        name: {
          type: 'string',
          description: 'Dashboard name',
        },
      },
      required: ['app_token', 'name'],
    },
  },
  {
    name: 'create_chart_block',
    description: 'Create a chart block (bar, line, pie, scatter, area, column, funnel, radar, table) and add it to a dashboard',
    inputSchema: {
      type: 'object',
      properties: {
        app_token: {
          type: 'string',
          description: 'Base app token',
        },
        dashboard_id: {
          type: 'string',
          description: 'Dashboard block ID',
        },
        chart_type: {
          type: 'string',
          enum: ['bar', 'line', 'pie', 'scatter', 'area', 'column', 'funnel', 'radar', 'table'],
          description: 'Type of chart',
        },
        table_id: {
          type: 'string',
          description: 'Source table ID',
        },
        view_id: {
          type: 'string',
          description: 'Optional view ID to filter data',
        },
        x_axis_field: {
          type: 'string',
          description: 'Field name for X axis',
        },
        y_axis_fields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field_name: { type: 'string' },
              aggregation: { type: 'string', enum: Object.values(AggregationType) },
              label: { type: 'string' },
            },
            required: ['field_name'],
          },
          description: 'Y axis configuration (can have multiple)',
        },
        title: {
          type: 'string',
          description: 'Chart title',
        },
        show_legend: {
          type: 'boolean',
          description: 'Show legend',
        },
        colors: {
          type: 'array',
          items: { type: 'string' },
          description: 'Custom colors (hex codes)',
        },
      },
      required: ['app_token', 'dashboard_id', 'chart_type', 'table_id', 'x_axis_field', 'y_axis_fields'],
    },
  },
  {
    name: 'create_metrics_block',
    description: 'Create a metrics/KPI block showing aggregated values',
    inputSchema: {
      type: 'object',
      properties: {
        app_token: {
          type: 'string',
          description: 'Base app token',
        },
        dashboard_id: {
          type: 'string',
          description: 'Dashboard block ID',
        },
        table_id: {
          type: 'string',
          description: 'Source table ID',
        },
        field_name: {
          type: 'string',
          description: 'Field to aggregate',
        },
        aggregation: {
          type: 'string',
          enum: Object.values(AggregationType),
          description: 'Aggregation type',
        },
        title: {
          type: 'string',
          description: 'Metrics title',
        },
        prefix: {
          type: 'string',
          description: 'Prefix (e.g., "$", "€")',
        },
        suffix: {
          type: 'string',
          description: 'Suffix (e.g., "%", "units")',
        },
        decimals: {
          type: 'number',
          description: 'Decimal places',
        },
      },
      required: ['app_token', 'dashboard_id', 'table_id', 'field_name', 'aggregation'],
    },
  },
  {
    name: 'create_view_block',
    description: 'Create a view block (grid, kanban, gallery, gantt, form) showing table data',
    inputSchema: {
      type: 'object',
      properties: {
        app_token: {
          type: 'string',
          description: 'Base app token',
        },
        dashboard_id: {
          type: 'string',
          description: 'Dashboard block ID',
        },
        view_type: {
          type: 'string',
          enum: ['grid', 'kanban', 'gallery', 'gantt', 'form'],
          description: 'View type',
        },
        table_id: {
          type: 'string',
          description: 'Source table ID',
        },
        view_id: {
          type: 'string',
          description: 'Optional specific view ID',
        },
        title: {
          type: 'string',
          description: 'View title',
        },
        show_toolbar: {
          type: 'boolean',
          description: 'Show toolbar',
        },
      },
      required: ['app_token', 'dashboard_id', 'view_type', 'table_id'],
    },
  },
  {
    name: 'create_text_block',
    description: 'Create a text/markdown block with formatted content',
    inputSchema: {
      type: 'object',
      properties: {
        app_token: {
          type: 'string',
          description: 'Base app token',
        },
        dashboard_id: {
          type: 'string',
          description: 'Dashboard block ID',
        },
        content: {
          type: 'string',
          description: 'Text content',
        },
        is_heading: {
          type: 'boolean',
          description: 'Format as heading',
        },
        alignment: {
          type: 'string',
          enum: ['left', 'center', 'right'],
          description: 'Text alignment',
        },
      },
      required: ['app_token', 'dashboard_id', 'content'],
    },
  },
  {
    name: 'list_dashboards',
    description: 'List all dashboards in a base',
    inputSchema: {
      type: 'object',
      properties: {
        app_token: {
          type: 'string',
          description: 'Base app token',
        },
      },
      required: ['app_token'],
    },
  },
  {
    name: 'delete_dashboard',
    description: 'Delete a dashboard from a base',
    inputSchema: {
      type: 'object',
      properties: {
        app_token: {
          type: 'string',
          description: 'Base app token',
        },
        dashboard_id: {
          type: 'string',
          description: 'Dashboard block ID to delete',
        },
      },
      required: ['app_token', 'dashboard_id'],
    },
  },
];

// Handle tool list requests
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const client = getLarkClient();

    // Validate args exists
    if (!args || typeof args !== 'object') {
      throw new Error('Invalid arguments provided');
    }

    switch (name) {
      case 'create_dashboard': {
        const dashboardId = await client.createDashboard({
          name: args.name as string,
          appToken: args.app_token as string,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                dashboard_id: dashboardId,
                message: 'Dashboard created successfully',
              }, null, 2),
            },
          ],
        };
      }

      case 'create_chart_block': {
        const chartTypeMap: Record<string, ChartType> = {
          bar: ChartType.BAR,
          line: ChartType.LINE,
          pie: ChartType.PIE,
          scatter: ChartType.SCATTER,
          area: ChartType.AREA,
          column: ChartType.COLUMN,
          funnel: ChartType.FUNNEL,
          radar: ChartType.RADAR,
          table: ChartType.TABLE,
        };

        const builder = new ChartBlockBuilder()
          .chartType(chartTypeMap[args.chart_type as string])
          .dataSource(args.app_token as string, args.table_id as string, args.view_id as string)
          .xAxis(args.x_axis_field as string);

        if (args.y_axis_fields) {
          const yAxes = (args.y_axis_fields as any[]).map(axis => ({
            fieldName: axis.field_name,
            aggregation: axis.aggregation,
            label: axis.label,
          }));
          builder.yAxis(yAxes);
        }

        if (args.title) builder.title(args.title as string);
        if (args.show_legend !== undefined) builder.showLegend(args.show_legend as boolean);
        if (args.colors) builder.colors(args.colors as string[]);

        const block = builder.build();
        const blockId = await client.addBlock(args.app_token as string, args.dashboard_id as string, block);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                block_id: blockId,
                message: 'Chart block created successfully',
              }, null, 2),
            },
          ],
        };
      }

      case 'create_metrics_block': {
        const builder = new MetricsBlockBuilder()
          .dataSource(args.app_token as string, args.table_id as string)
          .field(args.field_name as string)
          .aggregation(args.aggregation as AggregationType);

        if (args.title) builder.title(args.title as string);
        if (args.prefix) builder.prefix(args.prefix as string);
        if (args.suffix) builder.suffix(args.suffix as string);
        if (args.decimals !== undefined) builder.decimals(args.decimals as number);

        const block = builder.build();
        const blockId = await client.addBlock(args.app_token as string, args.dashboard_id as string, block);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                block_id: blockId,
                message: 'Metrics block created successfully',
              }, null, 2),
            },
          ],
        };
      }

      case 'create_view_block': {
        const viewTypeMap: Record<string, ViewType> = {
          grid: ViewType.GRID,
          kanban: ViewType.KANBAN,
          gallery: ViewType.GALLERY,
          gantt: ViewType.GANTT,
          form: ViewType.FORM,
        };

        const builder = new ViewBlockBuilder()
          .viewType(viewTypeMap[args.view_type as string])
          .dataSource(args.app_token as string, args.table_id as string, args.view_id as string);

        if (args.title) builder.title(args.title as string);
        if (args.show_toolbar !== undefined) builder.showToolbar(args.show_toolbar as boolean);

        const block = builder.build();
        const blockId = await client.addBlock(args.app_token as string, args.dashboard_id as string, block);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                block_id: blockId,
                message: 'View block created successfully',
              }, null, 2),
            },
          ],
        };
      }

      case 'create_text_block': {
        const builder = new TextBlockBuilder();

        if (args.is_heading) {
          builder.heading(args.content as string);
        } else {
          builder.paragraph(args.content as string);
        }

        if (args.alignment) {
          builder.alignment(args.alignment as 'left' | 'center' | 'right');
        }

        const block = builder.build();
        const blockId = await client.addBlock(args.app_token as string, args.dashboard_id as string, block);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                block_id: blockId,
                message: 'Text block created successfully',
              }, null, 2),
            },
          ],
        };
      }

      case 'list_dashboards': {
        const dashboards = await client.listDashboards(args.app_token as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                count: dashboards.length,
                dashboards,
              }, null, 2),
            },
          ],
        };
      }

      case 'delete_dashboard': {
        await client.deleteDashboard(args.app_token as string, args.dashboard_id as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: 'Dashboard deleted successfully',
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Lark Dashboard MCP Server started');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
