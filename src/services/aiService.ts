
import OpenAI from 'openai';

export interface AIGenerateRequest {
  fieldName: string;
  currentText: string;
  context?: string;
}

export interface AIGenerateResponse {
  generatedText: string;
}

const openai = new OpenAI();

export const generateWithAI = async (request: AIGenerateRequest): Promise<string> => {
  const { fieldName, currentText, context } = request;

  let prompt = "";
  if (currentText && currentText.trim() !== "") {
    prompt = `Enhance the following text for the field '${fieldName}': ${currentText}.`;
  } else {
    prompt = `Generate a suitable value for the field '${fieldName}'.`;
  }

  if (context) {
    prompt += ` Context: ${context}`;
  }

  console.log("Sending prompt to OpenAI:", prompt);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    console.log("Raw response from OpenAI:", response);

    if (response.choices && response.choices.length > 0 && response.choices[0].message && response.choices[0].message.content) {
      return response.choices[0].message.content.trim();
    } else {
      console.error('Unexpected response structure from OpenAI:', response);
      throw new Error('Falha ao gerar conteúdo com AI: Resposta inesperada da API.');
    }
  } catch (error) {
    console.error('Error generating AI content:', error);
    throw new Error('Falha ao gerar conteúdo com AI. Tente novamente.');
  }
};
