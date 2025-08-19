"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Exam } from "@/types/school";
import { useExamMutations } from "@/hooks/useExams";
import { examSchema, type ExamFormData } from "@/lib/validations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ExamFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
  subjectId: string;
  exam?: Exam | null;
  onSuccess: () => void;
}

export function ExamForm({
  open,
  onOpenChange,
  schoolId,
  subjectId,
  exam,
  onSuccess,
}: ExamFormProps) {
  const { createExam, updateExam, loading, error } = useExamMutations(
    schoolId,
    subjectId
  );

  const form = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: "",
    },
  });

  // Reset form when opening/closing or when exam changes
  useEffect(() => {
    if (open) {
      if (exam) {
        form.reset({
          name: exam.name,
        });
      } else {
        form.reset({
          name: "",
        });
      }
    }
  }, [open, exam, form]);

  const onSubmit = async (data: ExamFormData) => {
    try {
      if (exam) {
        await updateExam(exam.id, data);
      } else {
        await createExam(data);
      }
      onSuccess();
      form.reset();
    } catch (error) {
      // Error is handled by the hook
      console.error("Form submission error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{exam ? "Edit Exam" : "Add Exam"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter exam name"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="text-sm text-destructive mt-2">{error}</div>
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : exam ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
