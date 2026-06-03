import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProjectClient from './ProjectClient';

export const dynamic = 'force-dynamic';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/auth?redirect=/projects/${id}`);
  }

  // Fetch project from SQLite
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, user.id)))
    .limit(1);

  if (!project) {
    notFound();
  }

  return (
    <div className="relative min-h-screen theme-bg flex flex-col text-theme-on-background selection:bg-indigo-500/30">
      {/* Glow meshes */}
      <div className="glow-primary -top-40 left-1/4" />
      <div className="glow-secondary bottom-0 -right-40" />

      {/* Header */}
      <Navbar user={user} />

      {/* Dynamic Scope Editor Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 relative z-10">
        <ProjectClient project={project} />
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
