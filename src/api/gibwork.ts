export interface Bounty {
  id: string;
  title: string;
  reward: number;
  currency: string;
  category: 'Development' | 'Social Media' | 'Design';
  deadline: string;
  submissionsCount: number;
  creator: string;
  description: string;
  requirements: string[];
}

export const GIBWORK_BOUNTIES: Bounty[] = [
  {
    id: "gib-dev-01",
    title: "Gibwork Developer Hackathon Bounty",
    reward: 1000,
    currency: "USDC",
    category: "Development",
    deadline: "17 days",
    submissionsCount: 11,
    creator: "@gibwork",
    description: "Create a new non-web-app use case for Gibwork using the SDK, CLI, or MCP. Focused on developer tooling, automation, and terminal workflows.",
    requirements: [
      "Must use Gibwork SDK, CLI, or MCP as core implementation",
      "Must NOT be a web app or browser dashboard",
      "Solve a real developer or automation problem",
      "Provide open-source repo with README and demo video"
    ]
  },
  {
    id: "gib-ugc-02",
    title: "Create a UGC Video Bounty for Gibwork Mobile App",
    reward: 300,
    currency: "USDC",
    category: "Social Media",
    deadline: "17 days",
    submissionsCount: 16,
    creator: "@gibwork",
    description: "Produce a high-quality user-generated video walkthrough showing how to earn with Gibwork mobile app.",
    requirements: [
      "Original video footage",
      "Clear walkthrough of mobile app features",
      "Posted on X tagging @gib_work"
    ]
  },
  {
    id: "gib-basis-03",
    title: "Share Your Best BASIS Moment",
    reward: 100,
    currency: "USDC",
    category: "Social Media",
    deadline: "14 days",
    submissionsCount: 22,
    creator: "@basis",
    description: "Highlight unique experiences using BASIS features on Solana.",
    requirements: ["Clear visual proof", "X thread format"]
  }
];

export async function fetchBounties(category?: string): Promise<Bounty[]> {
  if (category) {
    return GIBWORK_BOUNTIES.filter(b => b.category.toLowerCase() === category.toLowerCase());
  }
  return GIBWORK_BOUNTIES;
}

export async function getBountyById(id: string): Promise<Bounty | undefined> {
  return GIBWORK_BOUNTIES.find(b => b.id.toLowerCase() === id.toLowerCase());
}
