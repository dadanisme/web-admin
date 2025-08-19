import { useState, useEffect } from "react";
import { Exam } from "@/types/school";
import { ExamService, CreateExamData } from "@/services/firestore";

// Hook for reading/querying subject exams
export function useExams(schoolId: string, subjectId: string) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId || !subjectId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = ExamService.onSubjectExamsSnapshot(
      schoolId,
      subjectId,
      (data) => {
        setExams(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [schoolId, subjectId]);

  return {
    exams,
    loading,
    error,
  };
}

// Hook for exam mutations (create, update, delete)
export function useExamMutations(schoolId: string, subjectId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createExam = async (data: CreateExamData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ExamService.create(schoolId, subjectId, data);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create exam";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createFromDefault = async (defaultExam: Exam) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ExamService.createFromDefault(
        schoolId,
        subjectId,
        defaultExam
      );
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create exam from default";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateExam = async (examId: string, data: Partial<CreateExamData>) => {
    try {
      setLoading(true);
      setError(null);
      await ExamService.update(schoolId, subjectId, examId, data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update exam";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteExam = async (examId: string) => {
    try {
      setLoading(true);
      setError(null);
      await ExamService.delete(schoolId, subjectId, examId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete exam";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createExam,
    createFromDefault,
    updateExam,
    deleteExam,
    loading,
    error,
  };
}

export function useExam(schoolId: string, subjectId: string, examId: string) {
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId || !subjectId || !examId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = ExamService.onExamSnapshot(
      schoolId,
      subjectId,
      examId,
      (data) => {
        setExam(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [schoolId, subjectId, examId]);

  return {
    exam,
    loading,
    error,
  };
}
