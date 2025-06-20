import { useState, useEffect } from "react";
import { useAuth } from "./useAuth"; // Use the real useAuth
import { supabase } from "@/integrations/supabase/client";

// Keep the same Activity interface as the mock for now
export interface Activity {
  id: string; // Or number, if we use bigserial consistently
  user_id: string;
  activity_type: string;
  title: string; // Will come from 'details' jsonb field
  credits_used: number; // Will come from 'details' jsonb field
  score: number | null; // Will come from 'details' jsonb field
  metadata: Record<string, any>; // Will come from 'details' jsonb field
  created_at: string;
}

export const useActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const fetchActivities = async () => {
        setLoading(true);
        setError(null);
        try {
          const { data, error: fetchError } = await supabase
            .from("activities")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (fetchError) {
            console.error("Error fetching activities:", fetchError);
            setError(fetchError);
            setActivities([]);
          } else if (data) {
            // Transform the data from the 'activities' table
            // to match the 'Activity' interface.
            const transformedActivities: Activity[] = data.map((activity: any) => ({
              id: String(activity.id), // Ensure id is string if interface expects string
              user_id: activity.user_id,
              activity_type: activity.activity_type,
              // Extract title, credits_used, score, metadata from the 'details' field
              title: activity.details?.title || 'N/A',
              credits_used: activity.details?.credits_used || 0,
              score: activity.details?.score !== undefined ? activity.details.score : null,
              metadata: activity.details?.metadata || {},
              created_at: activity.created_at,
            }));
            setActivities(transformedActivities);
          }
        } catch (e) {
          console.error("Unexpected error fetching activities:", e);
          setError(e);
          setActivities([]);
        } finally {
          setLoading(false);
        }
      };

      fetchActivities();
    } else {
      // No user, clear activities and set loading to false
      setActivities([]);
      setLoading(false);
    }
  }, [user]);

  return {
    data: activities,
    isLoading: loading,
    error: error,
  };
};
