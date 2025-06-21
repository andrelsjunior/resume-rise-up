export interface AIGenerateRequest {
  fieldName: string;
  currentText: string; // Keep as string, can be empty
  context?: string;
}

// AIGenerateResponse can be removed if not used elsewhere, as generateWithAI now directly returns string.
// For now, let's keep it in case other parts of the app expect this type definition.
export interface AIGenerateResponse {
  generatedText: string;
}

export const generateWithAI = async (request: AIGenerateRequest): Promise<string> => {
  try {
    const response = await fetch('/api/ai/generate', { // Assuming backend is on the same origin
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // Ignore if response is not JSON
      }
      const errorMessage = errorData?.error || `Error from server: ${response.status} ${response.statusText}`;
      console.error('Error generating AI content:', errorMessage);
      throw new Error(errorMessage);
    }

    const data: AIGenerateResponse = await response.json();
    if (!data.generatedText) {
      console.error('Error generating AI content: No generatedText in response from backend');
      throw new Error('Failed to generate content: No text received from server.');
    }
    return data.generatedText;

  } catch (error: any) {
    console.error('Error generating AI content:', error.message);
    // Re-throw the error so it can be caught by the calling hook (useAIGenerate)
    // The hook is responsible for user-facing error messages (toasts).
    throw error; // Rethrow the original error or a new one if preferred
  }
};
