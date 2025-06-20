import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth"; // Use the real useAuth
import { useCredits } from "./useCredits"; // Use the real useCredits
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

// Updated Profile interface (omitting max_credits for now)
export interface Profile {
  id: string;
  email: string | undefined; // email is from auth.users
  role: string | null; // from profiles table
  full_name: string | null; // from profiles table
  avatar_url: string | null; // from profiles table
  credits: number | null; // from useCredits hook
  created_at: string | undefined; // from auth.users (user registration time)
  updated_at: string | null; // from profiles table (profile last updated)
}

export const useProfile = () => {
  const { user:authUser, loading: authLoading } = useAuth(); // authUser from Supabase Auth
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
        // It's possible a profile row doesn't exist yet if the trigger failed or was not set up.
        if (fetchError.code === 'PGRST116') { // Not found
          console.warn("Profile not found for user:", currentAuthUser.id, "Consider creating one.");
          // Set default/empty profile data or let it be null based on app logic
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
    } else if (!authLoading) { // If auth is done loading and there's no user
      setProfileData(null);
      setLoading(false);
    }
  }, [authUser, authLoading, fetchProfileData]);

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string; /* role changes handled by admin */ }) => {
    if (!authUser) {
      throw new Error("User not authenticated");
    }
    setLoading(true);
    try {
      const { data, error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", authUser.id)
        .select("full_name, avatar_url, role, updated_at") // Ensure we select all fields that make up profileData
        .single();

      if (updateError) {
        throw updateError;
      }
      if (data) {
        setProfileData(data); // Update local state with the new profile data
        // await fetchProfileData(authUser); // Re-fetch is redundant if select returns all needed data
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

  // Combine all data into the Profile object
  const combinedProfile: Profile | null = authUser && profileData !== null ? {
      id: authUser.id,
      email: authUser.email,
      created_at: authUser.created_at,
      ...profileData, // contains full_name, avatar_url, role, updated_at
      credits: credits ?? null, // Use fetched credits, default to null if not available
  } : null;

  return {
    profile: combinedProfile,
    isLoading: authLoading || loading || creditsLoading, // Overall loading state
    error: error || creditsError,
    updateProfile,
    refreshProfile: () => {
        if(authUser) fetchProfileData(authUser);
        refreshCredits();
    }
  };
};
