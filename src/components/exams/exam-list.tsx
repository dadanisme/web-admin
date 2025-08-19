"use client";

import { useState } from "react";
import { Exam } from "@/types/school";
import { useExams, useExamMutations } from "@/hooks/useExams";
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
import { Plus, Edit, Trash2, Copy } from "lucide-react";
import { ExamForm } from "./exam-form";
import { CopyFromDefaultDialog } from "./copy-from-default-dialog";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface ExamListProps {
  schoolId: string;
  subjectId: string;
  subjectName: string;
}

export function ExamList({ schoolId, subjectId, subjectName }: ExamListProps) {
  const { exams, loading, error } = useExams(schoolId, subjectId);
  const { deleteExam, loading: mutationLoading } = useExamMutations(
    schoolId,
    subjectId
  );

  const [showForm, setShowForm] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
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
      await deleteExam(examToDelete.id);
      setShowDeleteDialog(false);
      setExamToDelete(null);
    } catch (error) {
      console.error("Failed to delete exam:", error);
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

  const handleCopyClose = () => {
    setShowCopyDialog(false);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exams for {subjectName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
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
          <CardTitle>Exams for {subjectName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">Error loading exams: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Exams for {subjectName} ({exams.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCopyDialog(true)}>
              <Copy className="h-4 w-4 mr-2" />
              Copy from Default
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Exam
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {exams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No exams found for this subject.
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
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell>
                      {exam.createdAt?.toDate().toLocaleDateString() ||
                        "Unknown"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(exam)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(exam)}
                          disabled={deletingId === exam.id || mutationLoading}
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

      <ExamForm
        open={showForm}
        onOpenChange={handleFormClose}
        schoolId={schoolId}
        subjectId={subjectId}
        exam={editingExam}
        onSuccess={handleFormClose}
      />

      <CopyFromDefaultDialog
        open={showCopyDialog}
        onOpenChange={handleCopyClose}
        schoolId={schoolId}
        subjectId={subjectId}
        onSuccess={handleCopyClose}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Exam"
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
