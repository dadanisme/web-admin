"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Subject } from "@/types/school";
import { useSubjectMutations } from "@/hooks/useSubjects";
import { subjectSchema, type SubjectFormData } from "@/lib/validations";
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

interface SubjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
  subject?: Subject | null;
  onSuccess: () => void;
}

export function SubjectForm({
  open,
  onOpenChange,
  schoolId,
  subject,
  onSuccess,
}: SubjectFormProps) {
  const { createSubject, updateSubject, loading, error } =
    useSubjectMutations(schoolId);

  const form = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: "",
    },
  });

  // Reset form when opening/closing or when subject changes
  useEffect(() => {
    if (open) {
      if (subject) {
        form.reset({
          name: subject.name,
        });
      } else {
        form.reset({
          name: "",
        });
      }
    }
  }, [open, subject, form]);

  const onSubmit = async (data: SubjectFormData) => {
    try {
      if (subject) {
        await updateSubject(subject.id, data);
      } else {
        await createSubject(data);
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
          <DialogTitle>{subject ? "Edit Subject" : "Add Subject"}</DialogTitle>
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
                      placeholder="Enter subject name"
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
                {loading ? "Saving..." : subject ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
