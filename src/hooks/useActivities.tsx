
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

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
            const transformedActivities: Activity[] = data.map((activity: any) => ({
              id: String(activity.id),
              user_id: activity.user_id,
              activity_type: activity.activity_type,
              title: activity.title,
              credits_used: activity.credits_used,
              score: activity.score,
              metadata: activity.metadata || {},
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
