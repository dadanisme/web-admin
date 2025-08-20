"use client";

import { useState } from "react";
import { Batch } from "@/types/school";
import { useBatches, useBatchMutations } from "@/hooks/useBatches";
import { useActiveBatch, useActiveBatchMutations } from "@/hooks/useActiveBatch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BatchForm } from "./batch-form";
import { BatchTable } from "./batch-table";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface BatchListProps {
  schoolId: string;
}

export function BatchList({ schoolId }: BatchListProps) {
  const { batches, loading, error } = useBatches(schoolId);
  const { activeBatch } = useActiveBatch(schoolId);
  const { setActiveBatch, clearActiveBatch } = useActiveBatchMutations(schoolId);
  const { deleteBatch, loading: mutationLoading } = useBatchMutations(schoolId);

  const [showForm, setShowForm] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<Batch | null>(null);

  const handleEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setShowForm(true);
  };

  const handleDeleteClick = (batch: Batch) => {
    setBatchToDelete(batch);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!batchToDelete) return;

    try {
      setDeletingId(batchToDelete.id);
      await deleteBatch(batchToDelete.id);
      setShowDeleteDialog(false);
      setBatchToDelete(null);
    } catch (error) {
      console.error("Failed to delete batch:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setBatchToDelete(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBatch(null);
  };

  const handleSetActive = async (batchId: string) => {
    try {
      await setActiveBatch(batchId);
    } catch (error) {
      console.error("Failed to set active batch:", error);
    }
  };

  const handleClearActive = async () => {
    try {
      await clearActiveBatch();
    } catch (error) {
      console.error("Failed to clear active batch:", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">
            Error loading batches: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <BatchTable
        batches={batches}
        activeBatch={activeBatch}
        onAddBatch={() => setShowForm(true)}
        onEditBatch={handleEdit}
        onDeleteBatch={handleDeleteClick}
        onSetActive={handleSetActive}
        onClearActive={handleClearActive}
        deletingId={deletingId}
        mutationLoading={mutationLoading}
      />

      <BatchForm
        open={showForm}
        onOpenChange={handleFormClose}
        schoolId={schoolId}
        batch={editingBatch}
        onSuccess={handleFormClose}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Batch"
        description={
          batchToDelete
            ? `Are you sure you want to delete "${batchToDelete.name}"? This action cannot be undone.`
            : ""
        }
        isLoading={!!deletingId}
      />
    </>
  );
}