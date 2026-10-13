# Technical Blueprint: `gib-sentinel` (Gibwork Autonomous Agent & MCP Orchestrator)

---

## 1. Executive Summary & Architecture

### 1.1 Executive Summary
**`gib-sentinel`** is a headless developer automation daemon, CLI, and Model Context Protocol (MCP) server that brings autonomous escrow workflows to developers' existing workspaces (terminals, CI/CD pipelines, and AI IDEs like Claude Desktop and Cursor).

Rather than forcing developers into a browser dashboard, `gib-sentinel` automates the entire bounty lifecycle directly from the command line and GitHub workflows:
1. **CI Failure Auto-Escrow:** When a critical integration test fails on a tracked branch, an automated GitHub Action invokes `gib-sentinel` to lock USDC into a Gibwork task escrow and link it to the triage issue.
2. **AI-Driven Local Triage (MCP):** Developers or AI agents (Claude/Cursor) can query, claim, inspect, and submit cryptographic pull request proofs directly over MCP tools.
3. **Automated Merged-PR Payouts:** Upon PR merge, CI triggers payment disbursement on-chain via Gibwork’s protocol without manual human intervention.

### 1.2 System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DEVELOPER / AGENT RUNTIMES                      │
│                                                                        │
│   ┌─────────────────────┐   ┌───────────────────┐   ┌──────────────┐   │
│   │ Cursor / Claude IDE │   │  CI/CD Pipelines  │   │ Terminal CLI │   │
│   │    (via MCP Tool)   │   │  (GitHub Actions) │   │  (gib-cli)   │   │
│   └──────────┬──────────┘   └─────────┬─────────┘   └──────┬───────┘   │
└──────────────┼────────────────────────┼────────────────────┼───────────┘
               │                        │                    │            
               ▼                        ▼                    ▼            
┌────────────────────────────────────────────────────────────────────────┐
│               GIB-SENTINEL CORE ENGINE (Headless Daemon)               │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                        Config & Keyring                        │   │
│   │     - Solana Keypair / KMS    - Gibwork API / RPC Anchors      │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    │                                   │
│   ┌────────────────────────────────┴───────────────────────────────┐   │
│   │                    Gibwork Engine Pipeline                     │   │
│   │     - Task Escrow Factory     - Proof of Merge Validator       │   │
│   │     - Payout Controller       - Metadata IPFS Resolver         │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          SOLANA BLOCKCHAIN                             │
│                                                                        │
│   ┌───────────────────────────┐     ┌──────────────────────────────┐   │
│   │    Gibwork Escrow Program │     │      SPL Token Accounts      │   │
│   │   (On-Chain State/Bounty) │     │         (USDC Vaults)        │   │
│   └───────────────────────────┘     └────────────────────────