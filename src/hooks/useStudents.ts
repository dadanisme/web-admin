import { useState, useEffect } from "react";
import { Student } from "@/types/school";
import { StudentService, CreateStudentData } from "@/services/firestore";

// Hook for reading/querying students
export function useStudents(schoolId: string) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = StudentService.onSchoolStudentsSnapshot(
      schoolId,
      (data) => {
        setStudents(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [schoolId]);

  return {
    students,
    loading,
    error,
  };
}

// Hook for student mutations (create, update, delete)
export function useStudentMutations(schoolId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStudent = async (data: CreateStudentData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await StudentService.create(schoolId, data);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create student";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (studentId: string, data: Partial<CreateStudentData>) => {
    try {
      setLoading(true);
      setError(null);
      await StudentService.update(schoolId, studentId, data);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update student";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (studentId: string) => {
    try {
      setLoading(true);
      setError(null);
      await StudentService.delete(schoolId, studentId);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete student";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createStudent,
    updateStudent,
    deleteStudent,
    loading,
    error,
  };
}

export function useStudent(schoolId: string, studentId: string) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId || !studentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = StudentService.onStudentSnapshot(
      schoolId,
      studentId,
      (data) => {
        setStudent(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [schoolId, studentId]);

  return {
    student,
    loading,
    error,
  };
}