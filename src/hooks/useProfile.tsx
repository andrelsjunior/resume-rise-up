
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useCredits } from "./useCredits";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  email: string | undefined;
  role: string | null;
  full_name: string | null;
  avatar_url: string | null;
  credits: number | null;
  created_at: string | undefined;
  updated_at: string | null;
}

export const useProfile = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const { credits, isLoading: creditsLoading, error: creditsError, refreshCredits } = useCredits();

  const [profileData, setProfileData] = useState<Omit<Profile, 'credits' | 'email' | 'id' | 'created_at'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchProfileData = useCallback(async (currentAuthUser: User) => {
    if (!currentAuthUser) {
      setProfileData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, role, updated_at")
        .eq("id", currentAuthUser.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          console.warn("Profile not found for user:", currentAuthUser.id);
          setProfileData({ full_name: null, avatar_url: null, role: 'customer', updated_at: null });
        } else {
          console.error("Error fetching profile data:", fetchError);
          setError(fetchError);
          setProfileData(null);
        }
      } else if (data) {
        setProfileData(data);
      }
    } catch (e) {
      console.error("Unexpected error fetching profile data:", e);
      setError(e);
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authUser) {
      fetchProfileData(authUser);
    } else if (!authLoading) {
      setProfileData(null);
      setLoading(false);
    }
  }, [authUser, authLoading, fetchProfileData]);

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    if (!authUser) {
      throw new Error("User not authenticated");
    }
    setLoading(true);
    try {
      const { data, error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", authUser.id)
        .select("full_name, avatar_url, role, updated_at")
        .single();

      if (updateError) {
        throw updateError;
      }
      if (data) {
        setProfileData(data);
      }
      return data;
    } catch (e: any) {
      console.error("Error updating profile:", e);
      setError(e.message || e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const combinedProfile: Profile | null = authUser && profileData !== null ? {
      id: authUser.id,
      email: authUser.email,
      created_at: authUser.created_at,
      ...profileData,
      credits: credits ?? null,
  } : null;

  return {
    profile: combinedProfile,
    isLoading: authLoading || loading || creditsLoading,
    error: error || creditsError,
    updateProfile,
    refreshProfile: () => {
        if(authUser) fetchProfileData(authUser);
        refreshCredits();
    }
  };
};
