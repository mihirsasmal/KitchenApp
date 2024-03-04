import { Button } from "@/components/ui/button";
import { createAccountValidation, recipeSubmitValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast"
import { useAddRecipeMutation, useCreateUserAccountMutation, useLoginAccountMutation, useUpdateRecipeMutation } from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Models } from "appwrite";
import { userInfo } from "os";

  type RecipeFormProps = {
      recipe?:Models.Document;
     action: 'Create' | 'Update';
  }

const Recipes = ({recipe, action}:RecipeFormProps) => {
  //const isCreatingAccount = false;
  
  const { toast } = useToast();
 const {user} = useUserContext();
 const navigate = useNavigate();
  const {mutateAsync:addRecipe, isPending:isAddingRecipe} = useAddRecipeMutation();

  const {mutateAsync:editRecipe, isPending:isEditingRecipe} = useUpdateRecipeMutation();



  // 1. Define your form.
  const form = useForm<z.infer<typeof recipeSubmitValidation>>({
    resolver: zodResolver(recipeSubmitValidation),
    defaultValues: {
      name: recipe?recipe.RecipeName:"",      
      language:recipe?recipe?.language:"",
      mealType: recipe?recipe.MealType:"",
      cuisineType: recipe?recipe.CuisineType:"",
      regionOfCuisine: recipe?recipe.CuisineRegion:"",
      ingredients:recipe?recipe.Ingredients:"",
      steps:recipe?recipe.Steps:"",
      file: [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof recipeSubmitValidation>) {
if(recipe &&action ==='Update') {
  const updateRecipe = await editRecipe({...values,recipeId:recipe.$id,imageId:recipe?.imageId,imageUrl:recipe?.imageUrl })
  if(!updateRecipe) {
    toast({title: 'Something went wrong, Please try again.'})
  }

  return  navigate(`/recipe/${recipe.$id}`);
}

    const newRecipe = await addRecipe({...values, userId:user.id});

    if(!newRecipe) {
      return toast({
        title: "Recipe Submission failed. Please try again"
      });
    }
      toast({
        title: "Recipe Submitted"
      })
   
      navigate('/');
    }

    

  return (
    <Form {...form}>
      <div className='sm:w-420 flex-center flex-col'>
     
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
      <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type = 'text' className="shad-input" placeholder="Aloo Gobi Curry" {...field} />
              </FormControl>              
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Input type = 'text' className="shad-input" placeholder="English / Odiya" {...field} />
              </FormControl>              
             </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cuisineType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuisine Type</FormLabel>
              <FormControl>
                <Input type ='text' className="shad-input" placeholder="Indian"{...field} />
              </FormControl>              
              </FormItem>
          )}
        />
       <FormField
          control={form.control}
          name="regionOfCuisine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region Of Cuisine</FormLabel>
              <FormControl>
                <Input type = 'text' className="shad-input" placeholder="Bengaluru" {...field} />
              </FormControl>              
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mealType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Type</FormLabel>
              <FormControl>
                <Input type = 'text' className="shad-input" placeholder="Breakfast/ Lunch/ Dinner" {...field} />
              </FormControl>              
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ingredients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredients</FormLabel>
              <FormControl>
                <Input type = 'text' className="shad-input" placeholder="Ingredients" {...field} />
              </FormControl>              
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="steps"
          render={({ field }) => (
            <FormItem>
              <FormLabel className = 'shad-form_label'>Steps</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" placeholder="Steps to prepare" {...field} />
              </FormControl>              
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className = 'shad-form_label'>Add Photos</FormLabel>
              <FormControl>
                <FileUploader 
                fieldChange ={field.onChange}
                mediaUrl={recipe?.ImageUrl} />
              </FormControl>              
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
        <Button type="button" className="shad-button_dark_4">
         Cancel
          </Button>
        <Button type="submit" className="shad-button_primary whitespace-nowrap"
        disabled ={isAddingRecipe|| isEditingRecipe}>
          {isAddingRecipe|| isEditingRecipe && 'Uploading...'} {action} Recipe
          </Button>
          </div>
      </form>
      </div>
    </Form>
  );
};

export default Recipes;


