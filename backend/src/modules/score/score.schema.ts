import { z } from 'zod';

export const addScoreSchema = z.object({
  value: z
    .number({ required_error: 'Score value is required' })
    .int('Score must be a whole number')
    .min(1, 'Score must be at least 1')
    .max(45, 'Score cannot exceed 45'),
  date: z.coerce
    .date({ required_error: 'Date is required' })
    .refine((d) => d <= new Date(), { message: 'Date cannot be in the future' }),
});

export const updateScoreSchema = z.object({
  value: z.number().int().min(1).max(45).optional(),
  date: z.coerce.date().refine((d) => d <= new Date(), { message: 'Date cannot be in the future' }).optional(),
}).refine((d) => d.value !== undefined || d.date !== undefined, {
  message: 'Provide at least value or date to update',
});

export type AddScoreInput = z.infer<typeof addScoreSchema>;
export type UpdateScoreInput = z.infer<typeof updateScoreSchema>;
