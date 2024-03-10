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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useState } from "react";
import Select from 'react-select'

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
      language:recipe?recipe?.language:'english',
      mealType: recipe?recipe.MealType:'MainCourse',
      cuisineType: recipe?recipe.CuisineType:"",
      regionOfCuisine: recipe?recipe.CuisineRegion:"",
      ingredients:recipe?recipe.Ingredients:"",
      steps:recipe?recipe.Steps:"",
      file: [],
    },
  });

  const [languageValue, setLanguageValue] = useState(form.getValues().language);
  const [mealTypeValue, setMealTypeValue] = useState(form.getValues().mealType);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof recipeSubmitValidation>) {
    console.log('I am here')
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

    function onError(a:any) {
      console.log(a);
    }

  return (
    <Form {...form}>
      <div className='sm:w-420 flex-center flex-col'>
     
      <form onSubmit={form.handleSubmit(onSubmit,onError)} className="flex flex-col gap-9 w-full max-w-5xl">
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
          render={() => (
            <FormItem>

              <FormLabel>Language</FormLabel>
              <FormControl>

        <ToggleGroup type="single" variant = 'outline'  onValueChange={ (value)=> {if(value){setLanguageValue(value); form.setValue('language',value);}}} >
      <ToggleGroupItem value="english" aria-label="Toggle english" className= {(languageValue==='english')?"bg-slate-900":"bg-gray-400"} >
      
         English
         
      </ToggleGroupItem>
      <ToggleGroupItem value="odiya" aria-label="Toggle odiya" className= {(languageValue==='odiya')?"bg-slate-900":"bg-gray-400"} >
     
         Odiya
         
      </ToggleGroupItem>
      <ToggleGroupItem value="kannada" aria-label="Toggle kannada" className= {(languageValue==='kannada')?"bg-slate-900":"bg-gray-400"} >
      
         Kannada
          
      </ToggleGroupItem>
    </ToggleGroup>
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
          render={() => (
            <FormItem>
              <FormLabel>Meal Type</FormLabel>
              <FormControl>
              <ToggleGroup type="single" variant = 'outline' defaultValue={form.getValues().language} onValueChange={ (value)=> {if(value)setMealTypeValue(value); form.setValue('mealType',value); }} >
      <ToggleGroupItem value="MainCourse" aria-label="Toggle MainCourse" className= {(mealTypeValue==='MainCourse')?"bg-slate-900":"bg-gray-400"} >
      
         Main Course
         
      </ToggleGroupItem>
      <ToggleGroupItem value="Breakfast" aria-label="Toggle Breakfast" className= {(mealTypeValue==='Breakfast')?"bg-slate-900":"bg-gray-400"} >
     
         Breakfast
         
      </ToggleGroupItem>
      <ToggleGroupItem value="Dessert" aria-label="Toggle Dessert" className= {(mealTypeValue==='Dessert')?"bg-slate-900":"bg-gray-400"} >
      
         Dessert
          
      </ToggleGroupItem>
      <ToggleGroupItem value="Snacks" aria-label="Toggle Snacks" className= {(mealTypeValue==='Snacks')?"bg-slate-900":"bg-gray-400"} >
      
         Snacks
          
      </ToggleGroupItem>
    </ToggleGroup>
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


