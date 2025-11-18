import z from "zod/mini";

export const FilterSchema = z.object({
  categoryName: z.optional(z.string()),
  maxBudget: z.optional(z.number()),
  priority: z.optional(z.string()),
});
