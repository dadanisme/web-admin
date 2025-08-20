"use client";

import { Batch } from "@/types/school";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Star, StarOff } from "lucide-react";

interface BatchTableProps {
  batches: Batch[];
  activeBatch: Batch | null;
  onAddBatch: () => void;
  onEditBatch: (batch: Batch) => void;
  onDeleteBatch: (batch: Batch) => void;
  onSetActive: (batchId: string) => void;
  onClearActive: () => void;
  deletingId: string | null;
  mutationLoading: boolean;
}

export function BatchTable({
  batches,
  activeBatch,
  onAddBatch,
  onEditBatch,
  onDeleteBatch,
  onSetActive,
  onClearActive,
  deletingId,
  mutationLoading,
}: BatchTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Batches ({batches.length})</CardTitle>
        <Button onClick={onAddBatch}>
          <Plus className="h-4 w-4 mr-2" />
          Add Batch
        </Button>
      </CardHeader>
      <CardContent>
        {batches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No batches found. Add your first batch to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {activeBatch?.id === batch.id && (
                        <Star className="h-4 w-4 text-accent-foreground fill-current" />
                      )}
                      {batch.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {activeBatch?.id === batch.id ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {batch.createdAt?.toDate().toLocaleDateString() ||
                      "Unknown"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {activeBatch?.id === batch.id ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onClearActive}
                        >
                          <StarOff className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSetActive(batch.id)}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditBatch(batch)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteBatch(batch)}
                        disabled={
                          deletingId === batch.id || mutationLoading
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}