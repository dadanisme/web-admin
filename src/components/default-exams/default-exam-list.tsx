"use client";

import { useState } from "react";
import { Exam } from "@/types/school";
import {
  useDefaultExams,
  useDefaultExamMutations,
} from "@/hooks/useDefaultExams";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DefaultExamForm } from "./default-exam-form";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DefaultExamListProps {
  schoolId: string;
}

export function DefaultExamList({ schoolId }: DefaultExamListProps) {
  const { defaultExams, loading, error } = useDefaultExams(schoolId);
  const { deleteDefaultExam, loading: mutationLoading } =
    useDefaultExamMutations(schoolId);

  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setShowForm(true);
  };

  const handleDeleteClick = (exam: Exam) => {
    setExamToDelete(exam);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!examToDelete) return;

    try {
      setDeletingId(examToDelete.id);
      await deleteDefaultExam(examToDelete.id);
      setShowDeleteDialog(false);
      setExamToDelete(null);
    } catch (error) {
      console.error("Failed to delete default exam:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setExamToDelete(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingExam(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Default Exams</CardTitle>
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
          <CardTitle>Default Exams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">
            Error loading default exams: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Default Exams ({defaultExams.length})</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Default Exam
          </Button>
        </CardHeader>
        <CardContent>
          {defaultExams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No default exams found. Add your first default exam template to
              get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {defaultExams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell>
                      {exam.createdAt?.toDate().toLocaleDateString() ||
                        "Unknown"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(exam)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit default exam</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(exam)}
                              disabled={
                                deletingId === exam.id || mutationLoading
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete default exam</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DefaultExamForm
        open={showForm}
        onOpenChange={handleFormClose}
        schoolId={schoolId}
        exam={editingExam}
        onSuccess={handleFormClose}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Default Exam"
        description={
          examToDelete
            ? `Are you sure you want to delete "${examToDelete.name}"? This action cannot be undone.`
            : ""
        }
        isLoading={!!deletingId}
      />
    </>
  );
}
