import axios from 'axios';

// Generic LLM caller
export async function generateAILearningContent(
  systemPrompt: string, 
  userPrompt: string
): Promise<string> {
  // Use placeholder unless key is provided
  const apiKey = process.env.LLM_API_KEY || 'PLACEHOLDER_KEY';
  const baseURL = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';

  if (apiKey === 'PLACEHOLDER_KEY') {
    console.warn('Using placeholder LLM API key. Returning mocked response for development.');
    return generateMockResponse(systemPrompt);
  }

  try {
    const response = await axios.post(
      `${baseURL}/chat/completions`,
      {
        model: 'gpt-4-turbo-preview', // or appropriate default
        response_format: { type: "json_object" },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('LLM API Error:', error);
    throw new Error('Failed to generate learning content');
  }
}

function generateMockResponse(systemPrompt: string): string {
  // Mock logic based on keywords in system prompt to ensure UI testing works without API keys
  if (systemPrompt.includes('quiz')) {
    return JSON.stringify({
      questions: [
        {
          question: "What is the primary purpose of this repository?",
          options: ["Data fetching", "State management", "UI components", "API routing"],
          correctIndex: 0,
          explanation: "Based on the README, it primarily handles data fetching."
        },
        {
          question: "Which hook is used for side effects?",
          options: ["useState", "useEffect", "useMemo", "useRef"],
          correctIndex: 1,
          explanation: "useEffect is the standard React hook for handling side effects."
        }
      ]
    });
  }
  
  if (systemPrompt.includes('practice')) {
    return JSON.stringify({
      exercises: [
        {
          title: "Implement the Fetcher",
          difficulty: "Easy",
          description: "Write a wrapper around fetch that returns JSON.",
          hints: ["Use async/await", "Don't forget res.json()"],
          solution: "const fetcher = async (url) => { const res = await fetch(url); return res.json(); }"
        }
      ]
    });
  }

  // Default to course content
  return JSON.stringify({
    sections: [
      {
        title: "1. Introduction to the Codebase",
        content: "This repository follows a modern React architecture. It heavily uses functional components and hooks.",
        codeExamples: []
      },
      {
        title: "2. Core Concepts",
        content: "The main concepts include state management via Zustand and efficient rendering using Next.js App Router.",
        codeExamples: ["import { create } from 'zustand';"]
      },
      {
        title: "3. Code Breakdown",
        content: "Let's look at the main entry point and how context flows through the app.",
        codeExamples: []
      },
      {
        title: "4. Advanced Patterns",
        content: "Notice the use of generic types in the utility functions for maximum reusability.",
        codeExamples: ["function wrapper<T>(arg: T): T { return arg; }"]
      },
      {
        title: "5. Real-world Application",
        content: "You can apply these patterns when building your own scalable applications.",
        codeExamples: []
      }
    ]
  });
}
