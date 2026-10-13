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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1500, temperature: 0.7 }
    })
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No solution generated.';
}
