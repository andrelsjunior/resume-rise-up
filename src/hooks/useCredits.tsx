import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth"; // Use the real useAuth
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast"; // Assuming this is a real, working hook

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
          .single(); // Assuming one row per user

        if (fetchError) {
          if (fetchError.code === 'PGRST116') { // PGRST116: "The result contains 0 rows"
            // User might not have a credits row yet, create one? Or assume 0.
            // For now, assume 0 if no row exists.
            setUserCredits({ credits_remaining: 0, last_updated_at: null });
            // Or, you could insert a default row here if appropriate for your app logic:
            // await supabase.from('credits').insert({ user_id: user.id, credits_remaining: 0 });
            // setUserCredits({ credits_remaining: 0, last_updated_at: new Date().toISOString() });
          } else {
            console.error("Error fetching credits:", fetchError);
            setError(fetchError);
            setUserCredits(null);
          }
        } else if (data) {
          setUserCredits(data as UserCredits);
        } else {
          // No data and no error, but also not PGRST116 (should be caught by .single())
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
  }, [user, toast]); // Added toast to dependency array

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const checkCredits = (requiredCredits: number): boolean => {
    if (loading) { // Still loading, can't check yet
        toast({ title: "Verificando créditos...", description: "Por favor, aguarde."});
        return false;
    }
    if (!userCredits) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os créditos. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }

    if (userCredits.credits_remaining < requiredCredits) {
      toast({
        title: "Créditos Insuficientes",
        description: `Você precisa de ${requiredCredits} créditos mas tem apenas ${userCredits.credits_remaining}.`,
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

  // Function to manually spend credits (example, actual spending logic should be secure)
  // This function should ideally call a Supabase edge function or a SECURITY DEFINER postgres function
  // to ensure atomicity and prevent client-side tampering.
  // For now, it's a direct client-side update for demonstration if needed by other parts of the app.
  const spendCredits = async (amount: number): Promise<boolean> => {
    if (!user || !userCredits) {
        toast({ title: "Erro", description: "Usuário não autenticado ou créditos não carregados.", variant: "destructive" });
        return false;
    }
    if (!checkCredits(amount)) { // This will show the toast if not enough credits
        return false;
    }

    setLoading(true); // Indicate loading state during transaction
    const newCreditBalance = userCredits.credits_remaining - amount;
    try {
        // It's better to call an RPC function that handles this atomically and securely
        const { error: rpcError } = await supabase.rpc('spend_user_credits', {
          p_user_id: user.id,
          p_credits_to_spend: amount
        });

        if (rpcError) {
            toast({ title: "Erro ao atualizar créditos", description: rpcError.message, variant: "destructive" });
            setLoading(false);
            return false;
        }

        // Refresh credits from the database to ensure consistency
        await fetchCredits();
        toast({ title: "Sucesso", description: `${amount} créditos foram deduzidos.` });
        return true;
    } catch (e: any) {
        toast({ title: "Erro inesperado ao atualizar créditos", description: e.message, variant: "destructive" });
        setLoading(false);
        return false;
    } finally {
      // setLoading(false); // fetchCredits will set loading to false
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
