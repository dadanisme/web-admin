"use client";

import { useState } from "react";
import { Student } from "@/types/school";
import { useStudents, useStudentMutations } from "@/hooks/useStudents";
import { useStudentsByBatch } from "@/hooks/useStudentsByBatch";
import { useBatches } from "@/hooks/useBatches";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Filter } from "lucide-react";
import { StudentForm } from "./student-form";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StudentListProps {
  schoolId: string;
}

export function StudentList({ schoolId }: StudentListProps) {
  const [selectedBatchId, setSelectedBatchId] = useState<string>("all");

  // Get all students or filtered by batch
  const {
    students: allStudents,
    loading: allLoading,
    error: allError,
  } = useStudents(schoolId);
  const {
    students: batchStudents,
    loading: batchLoading,
    error: batchError,
  } = useStudentsByBatch(
    schoolId,
    selectedBatchId === "all" || selectedBatchId === "no-batch"
      ? ""
      : selectedBatchId
  );
  const { batches } = useBatches(schoolId);
  const { deleteStudent, loading: mutationLoading } =
    useStudentMutations(schoolId);

  // Use filtered students based on selection
  let students: Student[];
  let loading: boolean;
  let error: string | null;

  if (selectedBatchId === "all") {
    students = allStudents;
    loading = allLoading;
    error = allError;
  } else if (selectedBatchId === "no-batch") {
    students = allStudents.filter((student) => !student.batchId);
    loading = allLoading;
    error = allError;
  } else {
    students = batchStudents;
    loading = batchLoading;
    error = batchError;
  }

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;

    try {
      setDeletingId(studentToDelete.id);
      await deleteStudent(studentToDelete.id);
      setShowDeleteDialog(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error("Failed to delete student:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setStudentToDelete(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
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
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">
            Error loading students: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle>Students ({students.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedBatchId}
                onValueChange={setSelectedBatchId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="no-batch">No Batch</SelectItem>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No students found. Add your first student to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const studentBatch = student.batchId
                    ? batches.find((b) => b.id === student.batchId)
                    : null;

                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>
                        {studentBatch ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                            {studentBatch.name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                            No Batch
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.createdAt?.toDate().toLocaleDateString() ||
                          "Unknown"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(student)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit student</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteClick(student)}
                                disabled={
                                  deletingId === student.id || mutationLoading
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete student</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <StudentForm
        open={showForm}
        onOpenChange={handleFormClose}
        schoolId={schoolId}
        student={editingStudent}
        onSuccess={handleFormClose}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        description={
          studentToDelete
            ? `Are you sure you want to delete "${studentToDelete.name}"? This action cannot be undone.`
            : ""
        }
        isLoading={!!deletingId}
      />
    </>
  );
}
