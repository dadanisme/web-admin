import { useState, useEffect } from "react";
import { BatchService, StudentService } from "@/services/firestore";

// Hook for batch statistics (admin view)
export function useBatchStats(schoolId: string) {
  const [stats, setStats] = useState({
    totalBatches: 0,
    totalStudents: 0,
    studentsWithoutBatch: 0,
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

        const [
          totalBatches,
          totalStudents,
          studentsWithoutBatch,
        ] = await Promise.all([
          BatchService.getCountBySchool(schoolId),
          StudentService.getCountBySchool(schoolId),
          StudentService.getCountWithoutBatch(schoolId),
        ]);

        setStats({
          totalBatches,
          totalStudents,
          studentsWithoutBatch,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch batch stats";
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
    refetch: () => {
      if (schoolId) {
        setLoading(true);
        Promise.all([
          BatchService.getCountBySchool(schoolId),
          StudentService.getCountBySchool(schoolId),
          StudentService.getCountWithoutBatch(schoolId),
        ])
          .then(([totalBatches, totalStudents, studentsWithoutBatch]) => {
            setStats({
              totalBatches,
              totalStudents,
              studentsWithoutBatch,
            });
          })
          .catch((error) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Failed to fetch batch stats";
            setError(errorMessage);
          })
          .finally(() => setLoading(false));
      }
    },
  };
}

// Hook for specific batch statistics
export function useBatchDetailStats(schoolId: string, batchId: string) {
  const [stats, setStats] = useState({
    studentCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId || !batchId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const studentCount = await StudentService.getCountByBatch(schoolId, batchId);

        setStats({ studentCount });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch batch detail stats";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [schoolId, batchId]);

  return {
    stats,
    loading,
    error,
    refetch: () => {
      if (schoolId && batchId) {
        setLoading(true);
        StudentService.getCountByBatch(schoolId, batchId)
          .then((studentCount) => {
            setStats({ studentCount });
          })
          .catch((error) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Failed to fetch batch detail stats";
            setError(errorMessage);
          })
          .finally(() => setLoading(false));
      }
    },
  };
}