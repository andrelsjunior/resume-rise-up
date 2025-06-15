
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Profile {
  id: string;
  email: string | null;
  role: string;
  credits: number;
  max_credits: number;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user?.id,
  });
};

export const useDeductCredits = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      credits,
      activityType,
      title,
      metadata = {}
    }: {
      credits: number;
      activityType: string;
      title: string;
      metadata?: Record<string, any>;
    }) => {
      const { data, error } = await supabase.rpc('deduct_credits', {
        p_user_id: (await supabase.auth.getUser()).data.user?.id,
        p_credits: credits,
        p_activity_type: activityType,
        p_title: title,
        p_metadata: metadata
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        queryClient.invalidateQueries({ queryKey: ['activities'] });
        toast({
          title: "Success",
          description: "Credits deducted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Insufficient credits",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to deduct credits",
        variant: "destructive",
      });
    },
  });
};
