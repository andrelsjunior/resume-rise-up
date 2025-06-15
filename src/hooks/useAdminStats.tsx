
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCreditsUsed: number;
  totalRevenue: number;
}

export const useAdminStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active users (users with credits > 0)
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt('credits', 0);

      // Get total credits used from activities
      const { data: creditsData } = await supabase
        .from('activities')
        .select('credits_used');

      const totalCreditsUsed = creditsData?.reduce((sum, activity) => sum + activity.credits_used, 0) || 0;

      // Mock revenue calculation (credits * price per credit)
      const totalRevenue = totalCreditsUsed * 0.1;

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalCreditsUsed,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
      };
    },
    enabled: !!user?.id,
  });
};

export const useAllUsers = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};
