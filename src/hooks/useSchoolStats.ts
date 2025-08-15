import { useState, useEffect } from "react";
import { SchoolService } from "@/services/firestore";

interface SchoolStats {
  activeTeachers: number;
  pendingInvitations: number;
}

export function useSchoolStats(schoolId: string | undefined) {
  const [stats, setStats] = useState<SchoolStats>({
    activeTeachers: 0,
    pendingInvitations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const [teacherCount, pendingCount] = await Promise.all([
          SchoolService.getTeacherCount(schoolId),
          SchoolService.getPendingCount(schoolId),
        ]);

        setStats({
          activeTeachers: teacherCount,
          pendingInvitations: pendingCount,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch school statistics";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [schoolId]);

  return { stats, loading, error };
}
