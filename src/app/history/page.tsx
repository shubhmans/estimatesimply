import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import HistoryClient from './HistoryClient';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth?redirect=/history');
  }

  // Fetch all projects for this user from oldest to newest or newest to oldest
  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id))
    .orderBy(desc(projects.createdAt));

  return (
    <div className="relative min-h-screen theme-bg flex flex-col text-theme-on-background selection:bg-indigo-500/30">
      {/* Background glow meshes */}
      <div className="glow-primary -top-40 left-1/4" />
      <div className="glow-secondary bottom-0 -right-40" />

      {/* Header */}
      <Navbar user={user} />

      {/* History Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-12 relative z-10">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-theme-on-surface">Proposal History Dashboard</h2>
          <p className="text-sm text-theme-on-surface-variant mt-1">
            Access, view, adjust, and export all past generated estimates and project scopes.
          </p>
        </div>

        <HistoryClient initialProjects={userProjects} />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-theme-border text-center no-print">
        <span className="text-xs text-theme-on-surface-variant">
          © {new Date().getFullYear()} EstimateSimply. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
