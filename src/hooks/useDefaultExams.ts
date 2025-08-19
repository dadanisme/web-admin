import { useState, useEffect } from "react";
import { Exam } from "@/types/school";
import {
  DefaultExamService,
  CreateDefaultExamData,
} from "@/services/firestore";

// Hook for reading/querying default exams
export function useDefaultExams(schoolId: string) {
  const [defaultExams, setDefaultExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = DefaultExamService.onSchoolDefaultExamsSnapshot(
      schoolId,
      (data) => {
        setDefaultExams(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [schoolId]);

  return {
    defaultExams,
    loading,
    error,
  };
}

// Hook for default exam mutations (create, update, delete)
export function useDefaultExamMutations(schoolId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDefaultExam = async (data: CreateDefaultExamData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await DefaultExamService.create(schoolId, data);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create default exam";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateDefaultExam = async (
    examId: string,
    data: Partial<CreateDefaultExamData>
  ) => {
    try {
      setLoading(true);
      setError(null);
      await DefaultExamService.update(schoolId, examId, data);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update default exam";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteDefaultExam = async (examId: string) => {
    try {
      setLoading(true);
      setError(null);
      await DefaultExamService.delete(schoolId, examId);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete default exam";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createDefaultExam,
    updateDefaultExam,
    deleteDefaultExam,
    loading,
    error,
  };
}

export function useDefaultExam(schoolId: string, examId: string) {
  const [defaultExam, setDefaultExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId || !examId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = DefaultExamService.onDefaultExamSnapshot(
      schoolId,
      examId,
      (data) => {
        setDefaultExam(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [schoolId, examId]);

  return {
    defaultExam,
    loading,
    error,
  };
}
