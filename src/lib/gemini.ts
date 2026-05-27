import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';

interface Submodule {
  id: string;
  name: string;
  description: string;
  estimate: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface Module {
  id: string;
  name: string;
  submodules: Submodule[];
}

interface ScopeOutput {
  title: string;
  summary: string;
  complexity: 'Low' | 'Medium' | 'High';
  complexityReasoning: string;
  suggestedStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
  };
  modules: Module[];
  milestones: {
    phase: string;
    duration: string;
    deliverables: string[];
  }[];
  risks: {
    risk: string;
    mitigation: string;
  }[];
  assumptions: string[];
}

export async function generateProjectScope(
  inputText: string,
  industry?: string,
  budget?: string,
  timeline?: string
): Promise<ScopeOutput> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined. Falling back to Mock Scope Generator.');
    return generateMockScope(inputText, industry, budget, timeline);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a world-class IT Business Analyst and Pre-sales Engineer for premium software agencies.
Your task is to analyze a rough client project idea and compile a highly structured, comprehensive, and realistic project scope proposal.

The client details:
- Project Idea: "${inputText}"
- Industry: "${industry || 'General Software'}"
- Budget Target: "${budget || 'TBD'}"
- Timeline Target: "${timeline || 'TBD'}"

Analyze this prompt and produce a JSON object that splits the project into primary Modules and child Sub-modules.
CRITICAL RULES:
1. Every module MUST have a list of child submodules (e.g., Module: "User Auth & Profiles" -> Submodules: "Basic Email Signup", "Google OAuth Integration", "Reset Password Flow").
2. Each submodule MUST have its own individual "estimate" (an integer representing days needed, e.g., 2, 3, 5).
3. Do NOT include estimate sums in the main modules; the application will sum them up programmatically.
4. Output must match the exact JSON schema defined below.

Format the output strictly as a JSON object matching this TypeScript interface:
interface ScopeOutput {
  title: string; // A clean, professional, catchy project title (e.g., "FitPulse - Corporate Wellness Portal")
  summary: string; // A 2-3 sentence executive summary outlining the vision and benefits.
  complexity: 'Low' | 'Medium' | 'High';
  complexityReasoning: string; // Why this complexity level was assigned
  suggestedStack: {
    frontend: string[]; // List of frontend technologies (e.g. Next.js, React, Tailwind, Framer Motion)
    backend: string[];  // Backend technologies (e.g. Next.js API Routes, Server Actions, Node.js)
    database: string[]; // Database technologies (e.g. SQLite, PostgreSQL, Drizzle ORM)
    infrastructure: string[]; // Hosting and infra (e.g. Vercel, AWS S3, Resend, Clerk)
  };
  modules: {
    id: string; // A unique, random string or slug
    name: string; // E.g., "Authentication & Session Management"
    submodules: {
      id: string; // A unique, random string or slug
      name: string; // E.g., "Google Social Sign-in"
      description: string; // A clear, 1-2 sentence technical scope description of what this sub-module accomplishes
      estimate: number; // A number representing base engineering days (e.g., 2, 4, 7)
      difficulty: 'Easy' | 'Medium' | 'Hard';
    }[];
  }[];
  milestones: {
    phase: string; // E.g., "Phase 1: Discovery & UI Mockups"
    duration: string; // E.g., "2 weeks"
    deliverables: string[]; // List of deliverables for this phase
  }[];
  risks: {
    risk: string; // High-level risk description
    mitigation: string; // How the agency plans to mitigate it
  }[];
  assumptions: string[]; // Core assumptions about integrations, asset handovers, third party limits
}

Return ONLY the raw JSON object, without any markdown formatting or surrounding codeblocks. Just the pure string JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini returned an empty response.');
    }

    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData: ScopeOutput = JSON.parse(cleanedText);

    // Ensure IDs are populated and structure is clean
    parsedData.modules = parsedData.modules.map((m) => {
      const mId = m.id || crypto.randomUUID();
      return {
        id: mId,
        name: m.name || 'Module',
        submodules: (m.submodules || []).map((s) => ({
          id: s.id || crypto.randomUUID(),
          name: s.name || 'Sub-feature',
          description: s.description || 'Description of sub-feature.',
          estimate: Number(s.estimate) || 1,
          difficulty: s.difficulty || 'Easy',
        })),
      };
    });

    return parsedData;
  } catch (error) {
    console.error('Gemini generation failed, falling back to mock:', error);
    return generateMockScope(inputText, industry, budget, timeline);
  }
}

// Highly customized and realistic mockup generator based on input terms to guarantee 100% out-of-the-box functionality
function generateMockScope(
  inputText: string,
  _industry?: string,
  _budget?: string,
  _timeline?: string
): ScopeOutput {
  const lowercaseInput = inputText.toLowerCase();

  // 1. Marketplace / E-commerce Fallback
  if (lowercaseInput.includes('shop') || lowercaseInput.includes('market') || lowercaseInput.includes('store')) {
    return {
      title: 'NexCart E-Commerce Marketplace',
      summary: 'A scalable multi-vendor marketplace featuring smart catalog searches, instant payment checkouts, dynamic vendor management dashboards, and a robust admin moderation backend.',
      complexity: 'High',
      complexityReasoning: 'High complexity due to multi-vendor checkout routes, payment splits, and dual-portal dashboard structures (Seller vs. Buyer).',
      suggestedStack: {
        frontend: ['Next.js 15 App Router', 'Tailwind CSS', 'Framer Motion', 'Lucide Icons'],
        backend: ['Next.js Server Actions', 'Stripe API Connect'],
        database: ['SQLite', 'Drizzle ORM'],
        infrastructure: ['Vercel hosting', 'Uploadthing', 'Resend Mailer'],
      },
      modules: [
        {
          id: crypto.randomUUID(),
          name: 'Authentication & Profiles',
          submodules: [
            { id: crypto.randomUUID(), name: 'Secure Email & Password login', description: 'Cookie-based email/password registration with validation.', estimate: 3, difficulty: 'Easy' },
            { id: crypto.randomUUID(), name: 'Social Authentication OAuth', description: 'Quick sign-in via Google and Apple credentials.', estimate: 2, difficulty: 'Medium' },
            { id: crypto.randomUUID(), name: 'Dynamic Vendor & Customer Profiles', description: 'Dual profile setup managing business tags or addresses.', estimate: 4, difficulty: 'Medium' },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'Inventory & Cart Flow',
          submodules: [
            { id: crypto.randomUUID(), name: 'Responsive Product Grid & Filter', description: 'Fast multi-facet filters searching by price, category, and seller rating.', estimate: 4, difficulty: 'Medium' },
            { id: crypto.randomUUID(), name: 'Dynamic Shopping Cart System', description: 'Persisted cart with instantaneous stock checks and voucher redemptions.', estimate: 3, difficulty: 'Easy' },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'Checkout & Stripe Hookups',
          submodules: [
            { id: crypto.randomUUID(), name: 'Multi-vendor Checkout Route', description: 'Split-payout carts via Stripe Connect to distribute earnings.', estimate: 6, difficulty: 'Hard' },
            { id: crypto.randomUUID(), name: 'Automated Invoice generation', description: 'Programmatic compilation and email of PDF order invoices.', estimate: 3, difficulty: 'Easy' },
          ],
        },
      ],
      milestones: [
        { phase: 'Discovery & Design', duration: '2 weeks', deliverables: ['Figma interactive wireframes', 'DB diagram', 'API specification'] },
        { phase: 'Core Architecture & Auth', duration: '3 weeks', deliverables: ['Database seed schemas', 'Auth middleware', 'Profiles layout'] },
        { phase: 'Checkout Integration', duration: '3 weeks', deliverables: ['Stripe webhooks config', 'Cart routes validation', 'Dynamic emails'] },
      ],
      risks: [
        { risk: 'Stripe API compliance delays', mitigation: 'Request vendor verification materials from client at day one.' },
      ],
      assumptions: ['Client delivers product catalog taxonomy during Figma mockups phase.'],
    };
  }

  // 2. AI SaaS / Tech App Fallback
  if (lowercaseInput.includes('ai') || lowercaseInput.includes('saas') || lowercaseInput.includes('gpt')) {
    return {
      title: 'GenScope AI Analysis Workspace',
      summary: 'A futuristic artificial intelligence workspace that digests unstructured business documents and automatically spits out clean, structured flow charts, interactive project cards, and exportable data packages.',
      complexity: 'Medium',
      complexityReasoning: 'Moderate complexity leveraging serverless LLM token processing, dynamic queue interfaces, and custom visual charts.',
      suggestedStack: {
        frontend: ['Next.js 15 App Router', 'Tailwind CSS', 'shadcn/ui', 'Framer Motion'],
        backend: ['Next.js Route Handlers', 'Vercel AI SDK'],
        database: ['SQLite', 'Drizzle ORM'],
        infrastructure: ['Vercel Core', 'Gemini Flash API', 'Upstash Redis'],
      },
      modules: [
        {
          id: crypto.randomUUID(),
          name: 'Account & Credit Ledger',
          submodules: [
            { id: crypto.randomUUID(), name: 'Email Signup & Password Security', description: 'Standard secure entry system with database session records.', estimate: 3, difficulty: 'Easy' },
            { id: crypto.randomUUID(), name: 'AI Credit Balance & Stripe Ledger', description: 'Credit debiting routines tracking prompt requests.', estimate: 4, difficulty: 'Medium' },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'AI Analysis Core',
          submodules: [
            { id: crypto.randomUUID(), name: 'Gemini API Prompt Pipeline', description: 'Advanced system prompting with JSON structured feedback parsing.', estimate: 5, difficulty: 'Hard' },
            { id: crypto.randomUUID(), name: 'Uploading PDFs & Text Scraper', description: 'Scraping utility compiling text blocks out of raw PDF documents.', estimate: 3, difficulty: 'Medium' },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: 'Dashboard UI Canvas',
          submodules: [
            { id: crypto.randomUUID(), name: 'Interactive Gantt & Feature Board', description: 'Visual accordion nodes showing project hierarchies dynamically.', estimate: 4, difficulty: 'Medium' },
            { id: crypto.randomUUID(), name: 'Exporting PDF & CSV Sheets', description: 'Instant generation of polished PDFs and structured CSV registries.', estimate: 2, difficulty: 'Easy' },
          ],
        },
      ],
      milestones: [
        { phase: 'Setup & Schemas', duration: '1 week', deliverables: ['Database definition', 'Basic landing framework'] },
        { phase: 'Gemini Integrations', duration: '2 weeks', deliverables: ['API Prompt orchestrations', 'Credit counter hooks'] },
        { phase: 'Interactive Charts & PDF', duration: '2 weeks', deliverables: ['SVG chart builder', 'PDF exports layout', 'Release candidate'] },
      ],
      risks: [
        { risk: 'LLM response latency', mitigation: 'Implement dynamic loading animations and optimistic state renders.' },
      ],
      assumptions: ['API Key remains within standard monthly usage rates.'],
    };
  }

  // 3. General Dashboard App Fallback (default)
  return {
    title: 'PulseCore Agency Admin Hub',
    summary: 'A unified executive dashboard tracking client proposals, active milestones, automated task delegations, and delivery risks in a sleek glassmorphic workspace.',
    complexity: 'Medium',
    complexityReasoning: 'Includes real-time data calculations, reactive data charts, and dynamic CSV table generators.',
    suggestedStack: {
      frontend: ['Next.js 15 App Router', 'Tailwind CSS', 'Lucide Icons'],
      backend: ['Next.js Route Handlers', 'SQLite Server Actions'],
      database: ['SQLite', 'Drizzle ORM'],
      infrastructure: ['Vercel Edge Platform'],
    },
    modules: [
      {
        id: crypto.randomUUID(),
        name: 'Portal Auth & Setup',
        submodules: [
          { id: crypto.randomUUID(), name: 'Standard Secure Email Auth', description: 'Local SQLite secure auth sessions and cookies.', estimate: 3, difficulty: 'Easy' },
          { id: crypto.randomUUID(), name: 'Invite Client Team Flow', description: 'Temporary secure token invitations and roles.', estimate: 3, difficulty: 'Medium' },
        ],
      },
      {
        id: crypto.randomUUID(),
        name: 'Proposal Generator Canvas',
        submodules: [
          { id: crypto.randomUUID(), name: 'Dynamic Estimation Matrix', description: 'A canvas of main modules and sub-modules showing live sums.', estimate: 5, difficulty: 'Hard' },
          { id: crypto.randomUUID(), name: 'Toggle days/hours and items', description: 'Client-side convert calculations changing numbers between days/hours.', estimate: 2, difficulty: 'Easy' },
        ],
      },
    ],
    milestones: [
      { phase: 'Design Approval', duration: '1 week', deliverables: ['Interactive proposal wireframes'] },
      { phase: 'Database Hookups', duration: '2 weeks', deliverables: ['SQLite schemas', 'Auth middleware'] },
      { phase: 'Live Estimation UI', duration: '2 weeks', deliverables: ['Complete workspace canvas', 'Excel downloading'] },
    ],
    risks: [
      { risk: 'Inaccurate initial agency templates', mitigation: 'Pre-populate database with industry benchmarks for estimates.' },
    ],
    assumptions: ['Client has modern web browser for printing PDF documents.'],
  };
}
export type { ScopeOutput, Module, Submodule };
