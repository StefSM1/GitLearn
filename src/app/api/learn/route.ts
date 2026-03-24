import { NextResponse } from 'next/server';
import { generateAILearningContent } from '@/lib/llm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { repo, readmeContent, keyFiles } = body;

    if (!repo) {
      return NextResponse.json({ error: 'Repo ID is required' }, { status: 400 });
    }

    const systemPrompt = `You are an expert programming instructor. Generate a 5-section FreeCodeCamp-style course based on the provided repository context.
The response MUST be valid JSON matching this schema:
{
  "sections": [
    {
      "title": "string",
      "content": "string (markdown allowed)",
      "codeExamples": ["string (code snippets)"]
    }
  ]
}`;

    const userPrompt = `Repository: ${repo}\n\nREADME:\n${readmeContent || 'Not provided'}\n\nKey Files context:\n${keyFiles || 'Not provided'}`;

    const content = await generateAILearningContent(systemPrompt, userPrompt);
    
    // Attempt to parse JSON to ensure it's valid
    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error('Learn API Route Error:', error);
    return NextResponse.json({ error: 'Failed to generate course' }, { status: 500 });
  }
}
