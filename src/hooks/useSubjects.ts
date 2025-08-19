import { useState, useEffect } from "react";
import { Subject } from "@/types/school";
import { SubjectService, CreateSubjectData } from "@/services/firestore";

// Hook for reading/querying subjects
export function useSubjects(schoolId: string) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = SubjectService.onSchoolSubjectsSnapshot(
      schoolId,
      (data) => {
        setSubjects(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [schoolId]);

  return {
    subjects,
    loading,
    error,
  };
}

// Hook for subject mutations (create, update, delete)
export function useSubjectMutations(schoolId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubject = async (data: CreateSubjectData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await SubjectService.create(schoolId, data);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create subject";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateSubject = async (
    subjectId: string,
    data: Partial<CreateSubjectData>
  ) => {
    try {
      setLoading(true);
      setError(null);
      await SubjectService.update(schoolId, subjectId, data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update subject";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (subjectId: string) => {
    try {
      setLoading(true);
      setError(null);
      await SubjectService.delete(schoolId, subjectId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete subject";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSubject,
    updateSubject,
    deleteSubject,
    loading,
    error,
  };
}

export function useSubject(schoolId: string, subjectId: string) {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId || !subjectId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = SubjectService.onSubjectSnapshot(
      schoolId,
      subjectId,
      (data) => {
        setSubject(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [schoolId, subjectId]);

  return {
    subject,
    loading,
    error,
  };
}
