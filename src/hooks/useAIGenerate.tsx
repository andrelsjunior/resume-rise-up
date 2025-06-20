
import { useState } from "react";
import { generateWithAI, AIGenerateRequest } from "@/services/aiService";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/useCredits";

export const useAIGenerate = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { checkCredits } = useCredits();

  const generate = async (
    request: AIGenerateRequest,
    onSuccess: (generatedText: string) => void
  ) => {
    if (!checkCredits(1)) {
      return;
    }

    setIsGenerating(true);
    try {
      const generatedText = await generateWithAI(request);
      onSuccess(generatedText);
      toast({
        title: "Conteúdo gerado com sucesso!",
        description: "O texto foi gerado pela AI e aplicado ao campo.",
      });
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: error instanceof Error ? error.message : "Falha ao gerar conteúdo.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generate,
    isGenerating,
  };
};
