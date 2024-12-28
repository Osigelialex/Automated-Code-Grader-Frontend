import { z } from 'zod'

export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string()
});
