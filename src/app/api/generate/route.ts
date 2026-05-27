import { NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import { generateProjectScope } from '@/lib/gemini';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    // 1. Authentication Guard
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in first.' },
        { status: 401 }
      );
    }

    const { inputText, industry, budget, timeline } = await req.json();

    if (!inputText || inputText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Project idea text is required.' },
        { status: 400 }
      );
    }

    // 2. Credit Guard
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!dbUser) {
      return NextResponse.json({ error: 'User record not found.' }, { status: 404 });
    }

    if (dbUser.credits <= 0) {
      return NextResponse.json(
        { error: 'You have run out of generation credits! Contact support to add more.' },
        { status: 403 }
      );
    }

    // 3. Generate Project Scope via AI or Fallback
    const scopeData = await generateProjectScope(inputText, industry, budget, timeline);

    // 4. Decrement credits & Save project to SQLite
    await db
      .update(users)
      .set({ credits: dbUser.credits - 1 })
      .where(eq(users.id, user.id));

    const projectId = crypto.randomUUID();

    await db.insert(projects).values({
      id: projectId,
      userId: user.id,
      title: scopeData.title || 'Untitled Project Scope',
      inputText,
      industry: industry || null,
      budget: budget || null,
      timeline: timeline || null,
      estimateUnit: 'days', // default is 'days'
      generatedScope: JSON.stringify(scopeData),
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      projectId,
      message: 'Scope generated successfully!',
    });
  } catch (error) {
    console.error('Scope generation route error:', error);
    return NextResponse.json(
      { error: 'An error occurred during project analysis.' },
      { status: 500 }
    );
  }
}
