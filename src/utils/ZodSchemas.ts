import { z } from "zod";

export const FilterSchema = z.object({
  categoryName: z.string().min(1, "Category name cannot be empty").optional(),
  maxBudget: z.coerce
    .number()
    .positive("Budget must be a positive number")
    .optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

export const shippingSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10,15}$/, "Invalid phone number"),
  street: z.string().trim().min(5, "Street address is required"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State/Province is required"),
  postalCode: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9\- ]{4,10}$/, "Invalid postal code"),
  country: z.string().trim().min(2, "Country is required"),
});

export type ShippingValues = z.infer<typeof shippingSchema>;
