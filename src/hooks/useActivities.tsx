
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Activity {
  id: string;
  user_id: string;
  activity_type: string;
  title: string;
  credits_used: number;
  score: number | null;
  metadata: Record<string, any>;
  created_at: string;
}

export const useActivities = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['activities', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Activity[];
    },
    enabled: !!user?.id,
  });
};
