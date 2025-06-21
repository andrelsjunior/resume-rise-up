
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface UserCredits {
  credits_remaining: number;
  last_updated_at: string | null;
}

export const useCredits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchCredits = useCallback(async () => {
    if (user) {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("credits")
          .select("credits_remaining, last_updated_at")
          .eq("user_id", user.id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setUserCredits({ credits_remaining: 0, last_updated_at: null });
          } else {
            console.error("Error fetching credits:", fetchError);
            setError(fetchError);
            setUserCredits(null);
          }
        } else if (data) {
          setUserCredits(data as UserCredits);
        } else {
          setUserCredits({ credits_remaining: 0, last_updated_at: null });
        }
      } catch (e) {
        console.error("Unexpected error fetching credits:", e);
        setError(e);
        setUserCredits(null);
      } finally {
        setLoading(false);
      }
    } else {
      setUserCredits(null);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const checkCredits = (requiredCredits: number): boolean => {
    if (loading) {
      toast({ title: "Checking credits...", description: "Please wait." });
      return false;
    }
    if (!userCredits) {
      toast({
        title: "Error",
        description: "Could not load credits. Please try again.",
        variant: "destructive",
      });
      return false;
    }

    if (userCredits.credits_remaining < requiredCredits) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${requiredCredits} credits but have only ${userCredits.credits_remaining}.`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const hasCredits = (amount: number): boolean => {
    if (loading || !userCredits) return false;
    return userCredits.credits_remaining >= amount;
  };

  const spendCredits = async (amount: number): Promise<boolean> => {
    if (!user || !userCredits) {
      toast({ title: "Error", description: "User not authenticated or credits not loaded.", variant: "destructive" });
      return false;
    }
    if (!checkCredits(amount)) {
      return false;
    }

    setLoading(true);
    try {
      const { error: rpcError } = await supabase.rpc('spend_user_credits', {
        p_user_id: user.id,
        p_credits_to_spend: amount
      });

      if (rpcError) {
        toast({ title: "Error updating credits", description: rpcError.message, variant: "destructive" });
        setLoading(false);
        return false;
      }

      await fetchCredits();
      toast({ title: "Success", description: `${amount} credits have been deducted.` });
      return true;
    } catch (e: any) {
      toast({ title: "Unexpected error updating credits", description: e.message, variant: "destructive" });
      setLoading(false);
      return false;
    }
  };

  return {
    credits: userCredits?.credits_remaining,
    lastUpdatedAt: userCredits?.last_updated_at,
    isLoading: loading,
    error: error,
    checkCredits,
    hasCredits,
    spendCredits,
    refreshCredits: fetchCredits,
  };
};
