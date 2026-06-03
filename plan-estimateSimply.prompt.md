## Plan: Analyze EstimateSimply project

TL;DR: This is a Next.js 16 app using App Router, Tailwind CSS, Drizzle ORM with SQLite via @libsql/client, and Gemini AI integration. It has authentication, credit-based scope generation, project history, and editable scope documents.

Steps
1. Confirm core architecture: Next.js app router with server and client components.
2. Identify auth/data flow: cookie-based sessions stored in SQLite; `getCurrentUser` used server-side for page rendering.
3. Map feature pages: landing page, auth, generate, history, project editor.
4. Note AI layer: `src/lib/gemini.ts` uses Gemini API with fallback mock generator.
5. Note backend APIs: auth login/register/logout, scope generation, project update/delete.

Relevant files
- `package.json` — Next 16, React 19, Drizzle ORM, Gemini client.
- `src/app/page.tsx` — landing UI and auth-aware CTA.
- `src/app/layout.tsx` — global HTML structure and fonts.
- `src/components/Navbar.tsx` — user-aware nav, logout flow.
- `src/lib/auth.ts` — session cookie management and user lookup.
- `src/db/schema.ts` — users, sessions, projects tables.
- `src/app/api/auth/*/route.ts` — auth endpoints.
- `src/app/api/generate/route.ts` — scope generation endpoint.
- `src/app/api/projects/[id]/route.ts` — project save/delete endpoints.
- `src/lib/gemini.ts` — Gemini prompt builder and fallback.
- `src/app/generate/GenerateClient.tsx` — interactive generation form.
- `src/app/history/HistoryClient.tsx` — proposal history list and delete.
- `src/app/projects/[id]/ProjectClient.tsx` — editable proposal canvas and export.

Verification
1. Review user flows through landing → auth → generate → history → project.
2. Check that server components use `getCurrentUser` and client components use fetch actions.
3. Confirm DB schema and session lifecycle match auth/lib and route behavior.

Decisions
- Focus is on understanding architecture, not changing code.
- Will not modify any files until the next step is requested.
