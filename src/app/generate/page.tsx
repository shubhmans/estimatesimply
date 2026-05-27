import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import GenerateClient from './GenerateClient';

export const dynamic = 'force-dynamic';

export default async function GeneratePage() {
  const user = await getCurrentUser();

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col text-slate-100">
      {/* Background glow meshes */}
      <div className="glow-primary -top-40 left-1/4" />
      <div className="glow-secondary bottom-0 -right-40" />

      {/* Header */}
      <Navbar user={user} />

      {/* Main Form Client Component */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <GenerateClient user={user} />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center no-print">
        <span className="text-xs text-slate-500">
          © {new Date().getFullYear()} EstimateSimply. Powered by Gemini 2.0 Flash.
        </span>
      </footer>
    </div>
  );
}
