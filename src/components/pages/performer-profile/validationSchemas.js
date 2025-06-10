import { z } from "zod";

export const basicInfoSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: z.string().nonempty("Email is required"),
});

export const socialMediaSchema = z.object({
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  video: z.string()
});

export const paymentMethodsSchema = z.object({
  venmo: z.string().optional(),
  paypal: z.string().optional(),
});

export const extraDetailsSchema = z.object({
  gender: z.number().min(0).max(4).optional(),
  additionalInfo: z.string().optional(),
  introCredits: z
    .string()
    .optional()
    .refine((value) => !value || value.length <= 75, {
      message: "Intro credit must be just 75 characters",
    }),
  bio: z
    .string()
    .optional()
    .refine((value) => !value || value.length <= 1000, {
      message: "Bio must be just 1000 characters",
    }),
  notes: z.string().optional(),
});
