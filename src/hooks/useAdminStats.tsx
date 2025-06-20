import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as AuthUser } from "@supabase/supabase-js"; // Renamed to avoid conflict

// Interface for the main admin statistics
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCreditsUsed: number;
  totalRevenue: number; // Will be 0 for now
}

// Interface for individual user data for the admin list
export interface AdminUserView {
  id: string;
  email: string | undefined;
  role: string | undefined; // From profiles table or auth.users metadata
  credits: number | null; // From credits table
  created_at: string | undefined;
  last_sign_in_at: string | null | undefined;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Call the Supabase functions in parallel
        const [
          totalUsersRes,
          activeUsersRes,
          totalCreditsUsedRes
        ] = await Promise.all([
          supabase.rpc('get_total_users'),
          supabase.rpc('get_active_users_last_30_days'),
          supabase.rpc('get_total_credits_used_from_activities')
        ]);

        // Check for errors in each response
        if (totalUsersRes.error) throw new Error(`Total Users Error: ${totalUsersRes.error.message}`);
        if (activeUsersRes.error) throw new Error(`Active Users Error: ${activeUsersRes.error.message}`);
        if (totalCreditsUsedRes.error) throw new Error(`Total Credits Used Error: ${totalCreditsUsedRes.error.message}`);

        setStats({
          totalUsers: totalUsersRes.data ?? 0,
          activeUsers: activeUsersRes.data ?? 0,
          totalCreditsUsed: totalCreditsUsedRes.data ?? 0,
          totalRevenue: 0, // Hardcoded for now
        });
      } catch (e: any) {
        console.error("Error fetching admin stats:", e);
        setError(e.message || e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    data: stats,
    isLoading: loading,
    error: error,
  };
};

// Hook for fetching all user data for the admin panel
export const useAllUsersForAdmin = () => {
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase
        .rpc('get_all_users_for_admin_view');

      if (rpcError) {
        console.error("Error fetching all users via RPC:", rpcError);
        setError(rpcError);
        setUsers([]);
      } else if (data) {
        // The RPC function returns columns: id, email, created_at, last_sign_in_at, user_role, credits_remaining
        const transformedUsers: AdminUserView[] = data.map((user: any) => ({
          id: user.id,
          email: user.email,
          role: user.user_role, // Directly from RPC result
          credits: user.credits_remaining !== undefined ? user.credits_remaining : null, // Directly from RPC
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
        }));
        setUsers(transformedUsers);
      }
    } catch (e) {
      console.error("Unexpected error fetching all users via RPC:", e);
      setError(e);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return {
    data: users,
    isLoading: loading,
    error: error,
    refresh: fetchAllUsers, // Allow manual refresh
  };
};
