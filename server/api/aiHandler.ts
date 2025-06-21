import { Request, Response } from 'express'; // Assuming Express types
import OpenAI from 'openai';

// This would be configured when setting up the Express app
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AIGenerateRequestBody {
  fieldName: string;
  currentText?: string; // Make currentText optional as per original frontend AIGenerateRequest
  context?: string;
}

// This function would be the actual handler used by an Express route
export async function handleAIGenerate(req: Request, res: Response) {
  // Initialize OpenAI client here or ensure it's initialized globally/middleware
  // For this subtask, initialize it here to ensure it's part of the code.
  // In a real app, initialize once.
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key not configured.');
    return res.status(500).json({ error: 'AI service not configured.' });
  }
  const openai = new OpenAI(); // Uses OPENAI_API_KEY from env implicitly

  const { fieldName, currentText, context } = req.body as AIGenerateRequestBody;

  if (!fieldName) {
    return res.status(400).json({ error: 'fieldName is required.' });
  }

  // 2. Prompt Management (Simple version)
  let prompt;
  const baseInstruction = "You are an expert assistant helping to fill out professional profiles and documents.";

  switch (fieldName) {
    case 'summary':
      prompt = `${baseInstruction} Generate a professional summary.`;
      if (currentText) prompt += ` Enhance or complete the following summary: "${currentText}".`;
      if (context) prompt += ` Additional context: "${context}".`;
      break;
    case 'skills':
      prompt = `${baseInstruction} List relevant professional skills.`;
      if (currentText) prompt += ` Based on or adding to these skills: "${currentText}".`;
      if (context) prompt += ` Consider this context: "${context}".`;
      break;
    case 'jobDescription':
      prompt = `${baseInstruction} Generate a compelling job description section for a CV.`;
      if (currentText) prompt += ` Enhance or complete this description: "${currentText}".`;
      if (context) prompt += ` Job title or role context: "${context}".`;
      break;
    // Add more cases for other fieldNames as needed
    default:
      prompt = `${baseInstruction} Generate content for the field "${fieldName}".`;
      if (currentText) prompt += ` Based on the current text: "${currentText}".`;
      if (context) prompt += ` Additional context: "${context}".`;
  }

  console.log(`[AI Handler] Sending prompt to OpenAI for field ${fieldName}: ${prompt}`);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 200, // Increased slightly for potentially longer fields
    });

    const generatedText = completion.choices[0]?.message?.content?.trim();

    if (generatedText) {
      console.log(`[AI Handler] Received generated text for ${fieldName}: ${generatedText}`);
      return res.status(200).json({ generatedText });
    } else {
      console.error('[AI Handler] OpenAI response missing generated text for field:', fieldName, completion);
      return res.status(500).json({ error: 'Failed to generate text: No content from AI.' });
    }
  } catch (error: any) {
    console.error('[AI Handler] Error calling OpenAI API for field:', fieldName, error);
    // Check for specific OpenAI error types if desired
    // if (error instanceof OpenAI.APIError) { ... }
    return res.status(500).json({ error: error.message || 'Failed to generate text due to an internal error.' });
  }
}

// Example of how this might be wired in server/index.ts (not part of this subtask's file output)
// import express from 'express';
// import { handleAIGenerate } from './api/aiHandler';
// const app = express();
// app.use(express.json());
// app.post('/api/ai/generate', handleAIGenerate);
// const port = process.env.PORT || 3001;
// app.listen(port, () => console.log(`Server running on port ${port}`));
