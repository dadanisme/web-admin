import { useState, useEffect } from "react";
import { Batch } from "@/types/school";
import { SchoolService } from "@/services/firestore";

// Hook for managing active batch
export function useActiveBatch(schoolId: string) {
  const [activeBatch, setActiveBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    const fetchActiveBatch = async () => {
      try {
        setLoading(true);
        setError(null);
        const batch = await SchoolService.getActiveBatch(schoolId);
        setActiveBatch(batch);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch active batch";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBatch();
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