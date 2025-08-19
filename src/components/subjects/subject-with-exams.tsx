"use client";

import { useState } from "react";
import { Subject } from "@/types/school";
import { useSubjects, useSubjectMutations } from "@/hooks/useSubjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { SubjectForm } from "./subject-form";
import { ExamList } from "@/components/exams/exam-list";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface SubjectWithExamsProps {
  schoolId: string;
}

export function SubjectWithExams({ schoolId }: SubjectWithExamsProps) {
  const { subjects, loading, error } = useSubjects(schoolId);
  const { deleteSubject, loading: mutationLoading } =
    useSubjectMutations(schoolId);

  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(
    new Set()
  );

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
      // Remove from expanded set if it was expanded
      setExpandedSubjects((prev) => {
        const newSet = new Set(prev);
        newSet.delete(subjectToDelete.id);
        return newSet;
      });
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

  const toggleSubjectExpansion = (subjectId: string) => {
    setExpandedSubjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subjectId)) {
        newSet.delete(subjectId);
      } else {
        newSet.add(subjectId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
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
          <CardTitle>Subjects and Exams ({subjects.length} subjects)</CardTitle>
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
            <div className="space-y-4">
              {subjects.map((subject) => {
                const isExpanded = expandedSubjects.has(subject.id);

                return (
                  <Card
                    key={subject.id}
                    className="border-l-4 border-l-primary/20"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleSubjectExpansion(subject.id)}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          <div>
                            <CardTitle className="text-lg">
                              {subject.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              Created:{" "}
                              {subject.createdAt
                                ?.toDate()
                                .toLocaleDateString() || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(subject)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
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
                        </div>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="pt-0">
                        <div className="pl-8">
                          <ExamList
                            schoolId={schoolId}
                            subjectId={subject.id}
                            subjectName={subject.name}
                          />
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
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
            ? `Are you sure you want to delete "${subjectToDelete.name}" and all its exams? This action cannot be undone.`
            : ""
        }
        isLoading={!!deletingId}
      />
    </>
  );
}
