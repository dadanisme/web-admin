"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Batch } from "@/types/school";
import { useBatchMutations } from "@/hooks/useBatches";
import { batchSchema, type BatchFormData } from "@/lib/validations";
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

interface BatchFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
  batch?: Batch | null;
  onSuccess: () => void;
}

export function BatchForm({
  open,
  onOpenChange,
  schoolId,
  batch,
  onSuccess,
}: BatchFormProps) {
  const { createBatch, updateBatch, loading, error } =
    useBatchMutations(schoolId);

  const form = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: "",
    },
  });

  // Reset form when opening/closing or when batch changes
  useEffect(() => {
    if (open) {
      if (batch) {
        form.reset({
          name: batch.name,
        });
      } else {
        form.reset({
          name: "",
        });
      }
    }
  }, [open, batch, form]);

  const onSubmit = async (data: BatchFormData) => {
    try {
      if (batch) {
        await updateBatch(batch.id, data);
      } else {
        await createBatch(data);
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
          <DialogTitle>{batch ? "Edit Batch" : "Add Batch"}</DialogTitle>
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
                      placeholder="Enter batch name (e.g., 2024-A, Batch 1)"
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
                {loading ? "Saving..." : batch ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}