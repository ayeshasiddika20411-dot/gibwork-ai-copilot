#!/usr/bin/env node
import { Command } from 'commander';
import pc from 'picocolors';
import fs from 'fs';
import { fetchBounties, getBountyById } from './api/gibwork.js';
import { generateBountySolution } from './ai/drafter.js';

const program = new Command();

program
  .name('gib-copilot')
  .description(pc.cyan('⚡ Gibwork Autonomous AI Bounty Copilot & CLI Tool'))
  .version('1.0.0');

// Command: list bounties
program
  .command('list')
  .description('List all active bounties on Gibwork')
  .option('-c, --category <type>', 'Filter by category (Development, Social Media)')
  .action(async (options) => {
    console.log(pc.bold(pc.cyan('\n🔍 Querying Live Gibwork Bounties...\n')));
    const bounties = await fetchBounties(options.category);

    bounties.forEach((b) => {
      console.log(
        `${pc.bold(pc.white(b.title))} [${pc.green(b.id)}]`
      );
      console.log(
        `  💰 Reward: ${pc.yellow(`$${b.reward} ${b.currency}`)} | 📂 Category: ${pc.magenta(b.category)} | ⏳ ${pc.dim(b.deadline)}`
      );
      console.log(`  👤 Creator: ${b.creator} | 📝 Submissions: ${pc.cyan(b.submissionsCount.toString())}`);
      console.log(pc.dim('  -------------------------------------------------------------'));
    });
    console.log(pc.green(`\n✔ Found ${bounties.length} active bounties. Use 'gib-copilot draft <id>' to generate AI solution!\n`));
  });

// Command: draft solution
program
  .command('draft <id>')
  .description('Generate an AI-powered technical solution and architecture for a bounty')
  .action(async (id) => {
    const bounty = await getBountyById(id);
    if (!bounty) {
      console.log(pc.red(`\n✖ Bounty with ID "${id}" not found. Run 'gib-copilot list' to see valid IDs.\n`));
      return;
    }

    console.log(pc.bold(pc.cyan(`\n🤖 Gemini 3.8 Flash is drafting solution for: "${bounty.title}"...\n`)));
    
    try {
      const solution = await generateBountySolution(bounty);
      const filename = `solution-${bounty.id}.md`;
      fs.writeFileSync(filename, solution);

      console.log(pc.green(`✔ Architecture and PR template successfully generated!`));
      console.log(pc.yellow(`📄 Saved to: ${pc.bold(filename)}\n`));
      console.log(pc.dim('--- Preview of Generated Solution ---'));
      console.log(solution.slice(0, 450) + pc.cyan('\n\n... [Full blueprint saved to file] ...\n'));
    } catch (err: any) {
      console.log(pc.red(`✖ Failed to generate solution: ${err.message}`));
    }
  });

program.parse(process.argv);
