import { z } from 'zod'

export const createAccountValidation = z.object({
    name:z.string().min(2).max(50),
    username: z.string().min(2).max(50),
    password: z.string().min(8,{message:'Password must be at least 8 characters'}),
    email: z.string().email()
  });

  export const loginValidation = z.object({
    email: z.string().email(),
    password: z.string()
  });

  export const recipeSubmitValidation = z.object({
    name:z.string().min(2).max(50),
    language: z.string(),
    mealType: z.string(),
    cuisineType: z.string().min(2).max(50),
    regionOfCuisine: z.string().min(2).max(50),
    ingredients: z.string().min(2).max(5000),
    steps: z.string().min(2).max(5000),
    file: z.custom<File[]>()
  });
  