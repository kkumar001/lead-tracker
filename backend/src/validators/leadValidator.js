import { z } from 'zod';

export const createLeadSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(255, 'Name must be under 255 characters'),

    email: z
        .email('Invalid email address!')
        .trim()
        .max(255, 'Email must be under 255 characters'),

    phone: z
        .string()
        .trim()
        .min(7, 'Phone number is too short')
        .max(20, 'Phone number is too long')
        .regex(/^[0-9+\-\s()]*$/, 'Phone number contains invalid characters'),

    status: z
        .enum(['New', 'Contacted', 'Qualified', 'Lost'])
        .optional(),
});

export const updateStatusSchema = z.object({
    status: z.enum(['New', 'Contacted', 'Qualified', 'Lost'], {
        errorMap: () => ({ message: 'Status must be one of: New, Contacted, Qualified, Lost' }),
    }),
});