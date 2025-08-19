import { z } from "zod";

// Student validation schema
export const studentSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
});

// Subject validation schema
export const subjectSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
});

// Default exam validation schema
export const defaultExamSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
});

// Subject exam validation schema
export const examSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
});

export type StudentFormData = z.infer<typeof studentSchema>;
export type SubjectFormData = z.infer<typeof subjectSchema>;
export type DefaultExamFormData = z.infer<typeof defaultExamSchema>;
export type ExamFormData = z.infer<typeof examSchema>;
