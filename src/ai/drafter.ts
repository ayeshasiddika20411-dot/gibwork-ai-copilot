import 'dotenv/config';
import { Bounty } from '../api/gibwork.js';

export async function generateBountySolution(bounty: Bounty): Promise<string> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is missing in .env file');
  }

  const prompt = `You are an elite Web3 AI Architect and Solana Developer.
Analyze this Gibwork bounty and generate a complete, high-scoring technical implementation blueprint.

Bounty Details:
- Title: ${bounty.title}
- Reward: ${bounty.reward} ${bounty.currency}
- Category: ${bounty.category}
- Scope & Requirements:
${bounty.requirements.map(r => `  * ${r}`).join('\n')}

Output a professional, production-ready specification formatted in clean Markdown with:
1. Executive Summary & Architecture
2. Tech Stack Selection (why it fits)
3. Step-by-step Development Action Plan
4. Code Snippets / Core Logic Implementation
5. Submission Checklist & PR Description template`;

  // Models list with fallback to prevent 503 transient errors
  const models = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];
  let lastError = '';

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 1500, temperature: 0.7 }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        }

        // If 503 or transient, wait 1.5s before retry
        if (res.status === 503 || res.status === 429) {
          lastError = `Status ${res.status}: Google AI server busy on ${model}`;
          await new Promise((r) => setTimeout(r, 1500));
        } else {
          lastError = `API error: ${res.status} ${res.statusText}`;
          break; // Try next model
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }
  }

  throw new Error(`Failed across all models. Last error: ${lastError}`);
}
