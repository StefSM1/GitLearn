import { NextResponse } from 'next/server';
import { generateAILearningContent } from '@/lib/llm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { repo, content } = body;

    if (!repo) {
      return NextResponse.json({ error: 'Repo ID is required' }, { status: 400 });
    }

    const systemPrompt = `You are a technical coding instructor. Generate 5-10 practical coding exercises from easy to hard difficulty, based on the provided repository context.
The response MUST be valid JSON matching this schema:
{
  "exercises": [
    {
      "title": "string",
      "difficulty": "Easy" | "Medium" | "Hard",
      "description": "string (what to build, markdown allowed)",
      "hints": ["string (step by step hints)"],
      "solution": "string (code solution)"
    }
  ]
}`;

    const userPrompt = `Repository: ${repo}\n\nContext:\n${content || 'Analyze standard patterns.'}`;

    const result = await generateAILearningContent(systemPrompt, userPrompt);
    const parsed = JSON.parse(result);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Practice API Route Error:', error);
    return NextResponse.json({ error: 'Failed to generate exercises' }, { status: 500 });
  }
}
