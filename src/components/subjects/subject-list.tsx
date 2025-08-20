"use client";

import { useState } from "react";
import { Subject } from "@/types/school";
import { useSubjects, useSubjectMutations } from "@/hooks/useSubjects";
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
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import Link from "next/link";
import { SubjectForm } from "./subject-form";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { createSubjectExamsPath } from "@/lib/paths";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubjectListProps {
  schoolId: string;
}

export function SubjectList({ schoolId }: SubjectListProps) {
  const { subjects, loading, error } = useSubjects(schoolId);
  const { deleteSubject, loading: mutationLoading } =
    useSubjectMutations(schoolId);

  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleDeleteClick = (subject: Subject) => {
    setSubjectToDelete(subject);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!subjectToDelete) return;

    try {
      setDeletingId(subjectToDelete.id);
      await deleteSubject(subjectToDelete.id);
      setShowDeleteDialog(false);
      setSubjectToDelete(null);
    } catch (error) {
      console.error("Failed to delete subject:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setSubjectToDelete(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSubject(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
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
          <CardTitle>Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">
            Error loading subjects: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subjects ({subjects.length})</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No subjects found. Add your first subject to get started.
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
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">
                      {subject.name}
                    </TableCell>
                    <TableCell>
                      {subject.createdAt?.toDate().toLocaleDateString() ||
                        "Unknown"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button asChild variant="outline" size="sm">
                              <Link href={createSubjectExamsPath(subject.id)}>
                                <BookOpen className="h-4 w-4 mr-2" />
                                Exams
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Manage subject exams</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(subject)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit subject</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(subject)}
                              disabled={
                                deletingId === subject.id || mutationLoading
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete subject</TooltipContent>
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

      <SubjectForm
        open={showForm}
        onOpenChange={handleFormClose}
        schoolId={schoolId}
        subject={editingSubject}
        onSuccess={handleFormClose}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Subject"
        description={
          subjectToDelete
            ? `Are you sure you want to delete "${subjectToDelete.name}"? This action cannot be undone.`
            : ""
        }
        isLoading={!!deletingId}
      />
    </>
  );
}
