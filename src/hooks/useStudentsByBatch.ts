import { useState, useEffect } from "react";
import { Student } from "@/types/school";
import { StudentService } from "@/services/firestore";

// Hook for students by specific batch
export function useStudentsByBatch(schoolId: string, batchId: string) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId || !batchId) {
      setLoading(false);
      setStudents([]);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = StudentService.onBatchStudentsSnapshot(
      schoolId,
      batchId,
      (data) => {
        setStudents(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [schoolId, batchId]);

  return {
    students,
    loading,
    error,
  };
}
