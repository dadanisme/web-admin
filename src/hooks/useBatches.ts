import { useState, useEffect } from "react";
import { Batch } from "@/types/school";
import { BatchService, CreateBatchData } from "@/services/firestore";

// Hook for reading/querying batches
export function useBatches(schoolId: string) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = BatchService.onSchoolBatchesSnapshot(
      schoolId,
      (data) => {
        setBatches(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [schoolId]);

  return {
    batches,
    loading,
    error,
  };
}

// Hook for batch mutations (create, update, delete)
export function useBatchMutations(schoolId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBatch = async (data: CreateBatchData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await BatchService.create(schoolId, data);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create batch";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBatch = async (
    batchId: string,
    data: Partial<CreateBatchData>
  ) => {
    try {
      setLoading(true);
      setError(null);
      await BatchService.update(schoolId, batchId, data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update batch";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteBatch = async (batchId: string) => {
    try {
      setLoading(true);
      setError(null);
      await BatchService.delete(schoolId, batchId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete batch";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBatch,
    updateBatch,
    deleteBatch,
    loading,
    error,
  };
}

// Hook for single batch
export function useBatch(schoolId: string, batchId: string) {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!schoolId || !batchId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = BatchService.onBatchSnapshot(
      schoolId,
      batchId,
      (data) => {
        setBatch(data);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [schoolId, batchId]);

  return {
    batch,
    loading,
    error,
  };
}