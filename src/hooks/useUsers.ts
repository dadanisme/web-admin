import { useState, useEffect } from "react";
import { User } from "@/types";
import { UserService } from "@/services/firestore";

export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await UserService.getById(userId);
        setUser(userData);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch user";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return {
    user,
    loading,
    error,
  };
}

export function useUserByEmail(email: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await UserService.getByEmail(email);
        setUser(userData);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch user";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [email]);

  return {
    user,
    loading,
    error,
  };
}

export function useSchoolUsers(schoolId: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await UserService.getBySchoolId(schoolId);
        setUsers(userData);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch users";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [schoolId]);

  return {
    users,
    loading,
    error,
  };
}
