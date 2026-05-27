import { NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, estimateUnit, generatedScope } = await req.json();

    if (!title || !generatedScope) {
      return NextResponse.json(
        { error: 'Title and generatedScope are required.' },
        { status: 400 }
      );
    }

    // Verify ownership and update
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, user.id)))
      .limit(1);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied.' },
        { status: 404 }
      );
    }

    await db
      .update(projects)
      .set({
        title,
        estimateUnit: estimateUnit || 'days',
        generatedScope: typeof generatedScope === 'string' ? generatedScope : JSON.stringify(generatedScope),
      })
      .where(eq(projects.id, id));

    return NextResponse.json({ success: true, message: 'Project saved successfully!' });
  } catch (error) {
    console.error('Save project error:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving the project.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, user.id)))
      .limit(1);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied.' },
        { status: 404 }
      );
    }

    await db.delete(projects).where(eq(projects.id, id));

    return NextResponse.json({ success: true, message: 'Project deleted successfully!' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the project.' },
      { status: 500 }
    );
  }
}
