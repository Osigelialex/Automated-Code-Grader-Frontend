import { z } from "zod";

export const ChangePasswordFormSchema = z.object({
  password: z.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z\d!@#$%^&*(),.?\":{}|<>]{8,}$/, {
    message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
