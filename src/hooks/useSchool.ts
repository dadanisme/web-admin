import { useState, useEffect } from "react";
import { School } from "@/types";
import { SchoolService } from "@/services/firestore";

export function useSchool(schoolId: string) {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    const fetchSchool = async () => {
      try {
        setLoading(true);
        setError(null);
        const schoolData = await SchoolService.getById(schoolId);
        setSchool(schoolData);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch school";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [schoolId]);

  return {
    school,
    loading,
    error,
  };
}

export function useSchoolStats(schoolId: string) {
  const [stats, setStats] = useState({
    teacherCount: 0,
    pendingCount: 0,
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

        setStats({ teacherCount, pendingCount });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch school stats";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [schoolId]);

  return {
    stats,
    loading,
    error,
  };
}
