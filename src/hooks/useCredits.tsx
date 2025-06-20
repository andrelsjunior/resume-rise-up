
import { useProfile } from "./useProfileMock";
import { useToast } from "./use-toast";

export const useCredits = () => {
  const { data: profile } = useProfile();
  const { toast } = useToast();

  const checkCredits = (requiredCredits: number): boolean => {
    if (!profile) {
      toast({
        title: "Erro",
        description: "Perfil não carregado. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }

    if (profile.credits < requiredCredits) {
      toast({
        title: "Créditos Insuficientes",
        description: `Você precisa de ${requiredCredits} créditos mas tem apenas ${profile.credits}. Entre em contato com o suporte para adicionar mais créditos.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return {
    profile,
    checkCredits,
    hasCredits: (amount: number) => profile ? profile.credits >= amount : false,
  };
};
