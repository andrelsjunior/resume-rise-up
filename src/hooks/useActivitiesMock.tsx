
import { useState, useEffect } from "react";
import { useAuth } from "./useAuthMock";

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

  useEffect(() => {
    if (user) {
      // Dados simulados de atividades
      const mockActivities: Activity[] = [
        {
          id: '1',
          user_id: user.id,
          activity_type: 'cv_generated',
          title: 'Software Engineer CV',
          credits_used: 5,
          score: 85,
          metadata: {},
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
        },
        {
          id: '2',
          user_id: user.id,
          activity_type: 'cover_letter_generated',
          title: 'Google Application Cover Letter',
          credits_used: 3,
          score: null,
          metadata: {},
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
        },
        {
          id: '3',
          user_id: user.id,
          activity_type: 'mock_interview_completed',
          title: 'Frontend Developer Interview',
          credits_used: 10,
          score: 92,
          metadata: {},
          created_at: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
        },
      ];
      setActivities(mockActivities);
    } else {
      setActivities([]);
    }
    setLoading(false);
  }, [user]);

  return {
    data: activities,
    isLoading: loading,
  };
};
