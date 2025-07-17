import z from "zod";

export const createDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .max(20)
    .min(4),
  slug: z
    .string({ invalid_type_error: "Slug must be a string" })
    .max(20)
    .min(8),
  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .optional(),
  thumbnail: z
    .string({ invalid_type_error: "Thumbnail must be a string" })
    .optional(),
});

export const updateDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .max(20)
    .min(4).optional(),
  slug: z
    .string({ invalid_type_error: "Slug must be a string" })
    .max(20)
    .min(8).optional(),
  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .optional(),
  thumbnail: z
    .string({ invalid_type_error: "Thumbnail must be a string" })
    .optional(),
});
