import { useState, useEffect } from "react";
import { Batch } from "@/types/school";
import { SchoolService, BatchService } from "@/services/firestore";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/firestore-constants";

// Hook for managing active batch
export function useActiveBatch(schoolId: string) {
  const [activeBatch, setActiveBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId || !db) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Listen to school document for activeBatchId changes
    const schoolDocRef = doc(db, COLLECTIONS.SCHOOLS, schoolId);
    const unsubscribe = onSnapshot(
      schoolDocRef,
      async (schoolDoc) => {
        try {
          if (!schoolDoc.exists()) {
            setActiveBatch(null);
            setLoading(false);
            return;
          }

          const schoolData = schoolDoc.data();
          const activeBatchId = schoolData?.activeBatchId;

          if (!activeBatchId) {
            setActiveBatch(null);
            setLoading(false);
            return;
          }

          // Fetch the active batch details
          const batch = await BatchService.getById(schoolId, activeBatchId);
          setActiveBatch(batch);
          setLoading(false);
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to fetch active batch";
          setError(errorMessage);
          setLoading(false);
        }
      },
      (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to listen to active batch";
        setError(errorMessage);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [schoolId]);

  return {
    activeBatch,
    loading,
    error,
  };
}

// Hook for setting active batch
export function useActiveBatchMutations(schoolId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setActiveBatch = async (batchId: string | null) => {
    try {
      setLoading(true);
      setError(null);
      await SchoolService.setActiveBatch(schoolId, batchId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to set active batch";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearActiveBatch = async () => {
    return setActiveBatch(null);
  };

  return {
    setActiveBatch,
    clearActiveBatch,
    loading,
    error,
  };
}
