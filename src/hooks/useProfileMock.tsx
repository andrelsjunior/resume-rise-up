
import { useState, useEffect } from "react";
import { useAuth } from "./useAuthMock";

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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Dados simulados do perfil
      const mockProfile: Profile = {
        id: user.id,
        email: user.email,
        role: 'customer',
        credits: 50,
        max_credits: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProfile(mockProfile);
    } else {
      setProfile(null);
    }
    setLoading(false);
  }, [user]);

  return {
    data: profile,
    isLoading: loading,
  };
};

export const useDeductCredits = () => {
  const { user } = useAuth();
  
  return {
    mutateAsync: async ({ credits }: { credits: number; activityType: string; title: string; metadata?: any }) => {
      console.log(`Mock: Deducting ${credits} credits for user ${user?.email}`);
      return true;
    },
    isPending: false,
  };
};
