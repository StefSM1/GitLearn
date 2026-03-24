import { NextResponse } from 'next/server';
import { generateAILearningContent } from '@/lib/llm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { repo, content } = body;

    if (!repo) {
      return NextResponse.json({ error: 'Repo ID is required' }, { status: 400 });
    }

    const systemPrompt = `You are a technical quiz generator. Generate 5-10 multiple choice questions to test understanding of the provided repository context.
The response MUST be valid JSON matching this schema:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": number (0-3),
      "explanation": "string explaining why the answer is correct"
    }
  ]
}`;

    const userPrompt = `Repository: ${repo}\n\nContext:\n${content || 'Analyze the concepts typical to this kind of project.'}`;

    const result = await generateAILearningContent(systemPrompt, userPrompt);
    const parsed = JSON.parse(result);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Quiz API Route Error:', error);
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}
