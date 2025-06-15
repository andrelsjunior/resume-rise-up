
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

export const useCredits = () => {
  const { data: profile } = useProfile();
  const { toast } = useToast();

  const checkCredits = (requiredCredits: number): boolean => {
    if (!profile) {
      toast({
        title: "Error",
        description: "Profile not loaded. Please try again.",
        variant: "destructive",
      });
      return false;
    }

    if (profile.credits < requiredCredits) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${requiredCredits} credits but only have ${profile.credits}. Please contact support to add more credits.`,
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
