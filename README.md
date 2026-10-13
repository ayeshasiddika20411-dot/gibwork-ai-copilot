# ⚡ Gibwork AI Copilot (CLI & MCP Server)

An autonomous developer terminal utility and official Model Context Protocol (MCP) server built for Gibwork. Bridges AI coding assistants with Gibwork bounties, automated workflows, and solution drafting.

---

## 🚀 Key Features

### 1. 🖥️ Interactive Developer CLI (`gib-copilot`)
- Real-Time Bounty Discovery: Query, search, and filter active Gibwork bounties directly from the terminal.
- Category Filtering: Filter by Development, Social Media, and reward tiers.

### 2. 🤖 Gemini 3.8 Flash Solution Drafter
- Generates end-to-end technical blueprints, architecture specifications, and pull request drafts for any selected bounty.
- Exports complete markdown specs directly to disk (e.g., solution-gib-dev-01.md).

### 3. 🔌 Official MCP Server for Cursor & Claude Desktop
- Exposes tools via standard I/O (`list_gibwork_bounties`, `draft_bounty_solution`).
- Allows AI coding agents in Cursor or Claude to autonomously discover bounties and draft code without leaving the editor.

---

## 🛠️ Quickstart & Setup

### Prerequisites
- Node.js >= 18
- Google Gemini API Key

### Installation
```bash
git clone https://github.com/ayeshasiddika20411-dot/gibwork-ai-copilot.git
cd gibwork-ai-copilot
npm install
```

### Environment Configuration
Create a .env file in the root directory:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

---

## 💻 CLI Usage

```bash
# 1. List all active bounties
npm run dev -- list

# 2. Filter bounties by category
npm run dev -- list -c Development

# 3. Generate complete AI solution & PR draft for a bounty
npm run dev -- draft gib-dev-01
```

---

## 🔌 Cursor & Claude Desktop MCP Integration

Add the following to your Cursor MCP settings (`~/.cursor/mcp.json`) or Claude Desktop config:

```json
{
  "mcpServers": {
    "gibwork-copilot": {
      "command": "npx",
      "args": ["tsx", "src/mcp/server.ts"],
      "env": {
        "GOOGLE_GENERATIVE_AI_API_KEY": "your_gemini_api_key_here"
      }
    }
  }
}
```

---

## 👨‍💻 Submission Details
- Hackathon: Gibwork Developer Hackathon ($1,000 USDC Bounty)
- Category: Development (Non-Web App, CLI, MCP Server)
- Author: Md Selim Reza
