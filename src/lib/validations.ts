import { z } from "zod";

// Student validation schema
export const studentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
});

// Subject validation schema
export const subjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
});

export type StudentFormData = z.infer<typeof studentSchema>;
export type SubjectFormData = z.infer<typeof subjectSchema>;