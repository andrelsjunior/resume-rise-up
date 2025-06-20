
import { useState, useEffect } from "react";
import { useAuth } from "./useAuthMock";

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCreditsUsed: number;
  totalRevenue: number;
}

export const useAdminStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Dados simulados de estatísticas admin
      const mockStats: AdminStats = {
        totalUsers: 1250,
        activeUsers: 875,
        totalCreditsUsed: 45000,
        totalRevenue: 4500.00,
      };
      setStats(mockStats);
    }
    setLoading(false);
  }, [user]);

  return {
    data: stats,
    isLoading: loading,
  };
};

export const useAllUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Dados simulados de usuários
      const mockUsers = [
        {
          id: '1',
          email: 'john@example.com',
          role: 'customer',
          credits: 45,
          created_at: new Date(Date.now() - 2592000000).toISOString(), // 30 dias atrás
        },
        {
          id: '2',
          email: 'jane@example.com',
          role: 'customer',
          credits: 0,
          created_at: new Date(Date.now() - 1296000000).toISOString(), // 15 dias atrás
        },
        {
          id: '3',
          email: 'admin@example.com',
          role: 'admin',
          credits: 100,
          created_at: new Date(Date.now() - 5184000000).toISOString(), // 60 dias atrás
        },
      ];
      setUsers(mockUsers);
    }
    setLoading(false);
  }, [user]);

  return {
    data: users,
    isLoading: loading,
  };
};
