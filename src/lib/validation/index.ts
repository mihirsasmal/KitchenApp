import { z } from "zod"

export const createAccountValidation = z.object({
    name:z.string().min(2).max(50),
    username: z.string().min(2).max(50),
    password: z.string().min(8,{message:'Password must be at least 8 characters'}),
    email: z.string().email()
  });