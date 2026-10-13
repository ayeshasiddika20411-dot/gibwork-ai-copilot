import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { fetchBounties, getBountyById } from "../api/gibwork.js";
import { generateBountySolution } from "../ai/drafter.js";

const server = new Server(
  {
    name: "gibwork-ai-copilot-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 1. List available tools for Cursor / Claude Desktop
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_gibwork_bounties",
        description: "List all active developer and social bounties on Gibwork",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Optional filter: Development or Social Media",
            },
          },
        },
      },
      {
        name: "draft_bounty_solution",
        description: "Generate a full AI-engineered architectural specification and PR draft for a specific Gibwork bounty",
        inputSchema: {
          type: "object",
          properties: {
            bountyId: {
              type: "string",
              description: "The ID of the bounty (e.g., gib-dev-01)",
            },
          },
          required: ["bountyId"],
        },
      },
    ],
  };
});

// 2. Handle tool execution requests from AI Agents
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "list_gibwork_bounties") {
    const category = typeof args?.category === "string" ? args.category : undefined;
    const bounties = await fetchBounties(category);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(bounties, null, 2),
        },
      ],
    };
  }

  if (name === "draft_bounty_solution") {
    const bountyId = String(args?.bountyId || "");
    const bounty = await getBountyById(bountyId);

    if (!bounty) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Bounty with ID "${bountyId}" was not found.`,
          },
        ],
      };
    }

    const solution = await generateBountySolution(bounty);
    return {
      content: [
        {
          type: "text",
          text: solution,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 Gibwork MCP Server running over standard I/O for Cursor & Claude Desktop.");
}

main().catch((err) => {
  console.error("Fatal MCP Server Error:", err);
  process.exit(1);
});
