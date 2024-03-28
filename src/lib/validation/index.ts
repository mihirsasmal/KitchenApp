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

  const optionSchema = z.object({
    label: z.string(),
    value: z.string(),
    disable: z.boolean().optional(),
  });

  export const recipeSubmitValidation = z.object({
    name:z.string().min(2,{message:'RecipeName must be at least 2 characters'}).max(50),
    language: z.string().min(1,{message:'One Language must be selected'}),
    mealType: z.string().min(1,{message:'One Meal Type must be selected'}),
    cuisineType: z.string().optional(),
    regionOfCuisine: z.string().optional(),
    ingredients: z.array(optionSchema).min(1,{message:'Minimum one ingredient must be selected'}),
    steps: z.string().min(2,{message:'Steps must be at least 2 characters'}),
    file: z.custom<File[]>()
  });
  