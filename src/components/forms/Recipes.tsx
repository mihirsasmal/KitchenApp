import { Button } from "@/components/ui/button";
import { recipeSubmitValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
  useAddRecipeMutation,
  useGetIngredientsMutation,
  useUpdateRecipeMutation,
} from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import FileUploader from "../shared/FileUploader";
import { Models } from "appwrite";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import MultipleSelector, { Option } from "../shared/MultipleSelector";
import Editor from "../shared/Editor";
import { useTheme } from "../shared/ThemeProvider";

type RecipeFormProps = {
  recipe?: Models.Document;
  action: "Create" | "Update";
};

const Recipes = ({ recipe, action }: RecipeFormProps) => {
  
  const { theme } = useTheme()
  const { toast } = useToast();
  const { user } = useUserContext();
    const navigate = useNavigate();
    const [languageValue, setLanguageValue] = useState("english");
      const { mutateAsync: addRecipe, isPending: isAddingRecipe } =
    useAddRecipeMutation();

  const { mutateAsync: editRecipe, isPending: isEditingRecipe } =
    useUpdateRecipeMutation();

  const { data: getIngredients, isPending } = useGetIngredientsMutation(languageValue);

  const ingredientOption = (ingredients: string[]): Option[] => {
    if (!ingredients) return [];

    const allIngredients = (ingredients as any).map((x: string) => {
      if(languageValue==='english') {
        return {label:x.charAt(0).toUpperCase()+x.slice(1), value:x}
      }
      
      return { label: x, value: x };
    });

    return allIngredients;
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof recipeSubmitValidation>>({
    resolver: zodResolver(recipeSubmitValidation),
    defaultValues: {
      name: recipe ? recipe.RecipeName : "",
      language: languageValue,
      mealType: recipe ? recipe.MealType : "MainCourse",
      cuisineType: recipe ? recipe.CuisineType : "",
      regionOfCuisine: recipe ? recipe.CuisineRegion : "",
      ingredients: recipe ? ingredientOption(recipe.Ingredients) : undefined,
      steps: recipe ? recipe.Steps : undefined,
      file: [],
    },
  });


  const [mealTypeValue, setMealTypeValue] = useState(form.getValues().mealType);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof recipeSubmitValidation>) {
    if (recipe && action === "Update") {
      const updateRecipe = await editRecipe({
        ...values,
        ingredients: values.ingredients.map((x) => x.value),
        recipeId: recipe.$id,
        imageId: recipe?.imageId,
        imageUrl: recipe?.imageUrl,
      });
      if (!(updateRecipe as any).$id) {
        return toast({
          title: "Recipe Submission failed. "+(updateRecipe as any).message 
          ,     
            className: 'dark:bg-rose-500 bg-rose-400',
        });
      }
      toast({
        title: "Recipe Submitted",
        className: 'dark:bg-green-500 bg-green-400',
      });

      return navigate(`/recipe/${recipe.$id}`);
    }
 
    const newRecipe = await addRecipe({
      ...values,
      ingredients: values.ingredients.map((x) => x.value),
      userId: user.id,
    });

    if (!(newRecipe as any).$id) {
      return toast({
        title: "Recipe Submission failed. "+(newRecipe as any).message 
        ,     
          className: 'dark:bg-rose-500 bg-rose-400',
      });
    }
    toast({
      title: "Recipe Submitted",
      className: 'dark:bg-green-500 bg-green-400',
    });

    navigate("/");
  }

  function onError(a: any) {
    console.log(a);
  }

  return (
    <Form {...form}>
      <div className="sm:w-full flex-start flex-col">
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="flex flex-col gap-9 w-full max-w-5xl"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    placeholder="Aloo Gobi Curry"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
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
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    onValueChange={(value) => {
                      if (value) {
                        setLanguageValue(value);
                        form.setValue("language", value);
                        
                        if(value==='english')
                        {
                       
                        if(action==="Update") 
                        {form.setValue('ingredients',ingredientOption(recipe?.Ingredients))
                        form.setValue("steps", recipe?.Steps);}
                        
                        }
                        if(value==='odiya')
                        {
                         
                        if(action==="Update") 
                        {form.setValue('ingredients',ingredientOption(recipe?.IngredientsOdia))
                        console.log(recipe?.IngredientsOdia)
                        form.setValue("steps", recipe?.StepsOdia);}
                        
                        }
                      }
                    }}
                  >
                    <ToggleGroupItem
                      value="english"
                      aria-label="Toggle english"
                      className={
                        field.value === "english"
                          ? "dark:bg-slate-900 bg-light-5" 
                          : "dark:bg-gray-400 bg-gray-300 dark:text-slate-500 text-slate-500 "
                      }
                    >
                      English
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="odiya"
                      aria-label="Toggle odiya"
                      className={
                        field.value === "odiya"
                        ? "dark:bg-slate-900 bg-light-5" 
                        : "dark:bg-gray-400 bg-gray-300 dark:text-slate-500 text-slate-500"
                      }
                    >
                      Odiya
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="kannada"
                      aria-label="Toggle kannada"
                      disabled = {true}
                      className={
                        field.value === "kannada"
                        ? "dark:bg-slate-900 bg-light-5" 
                        : "dark:bg-gray-400 bg-gray-300 dark:text-slate-500 text-slate-500"
                      }
                    >
                      Kannada
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormMessage className="shad-form_message" />
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
                  <Input
                    type="text"
                    className="shad-input"
                    placeholder="Indian"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
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
                  <Input
                    type="text"
                    className="shad-input"
                    placeholder="Bengaluru"
                    {...field}
                  />
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
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    defaultValue={form.getValues().language}
                    onValueChange={(value) => {
                      if (value) setMealTypeValue(value);
                      form.setValue("mealType", value);
                    }}
                  >
                    <ToggleGroupItem
                      value="MainCourse"
                      aria-label="Toggle MainCourse"
                      className={
                        mealTypeValue === "MainCourse"
                          ? "dark:bg-slate-900 bg-light-5" 
                          : "dark:bg-gray-400 bg-gray-300 dark:text-slate-500 text-slate-500"
                      }
                    >
                      Main Course
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="Breakfast"
                      aria-label="Toggle Breakfast"
                      className={
                        mealTypeValue === "Breakfast"
                          ?  "dark:bg-slate-900 bg-light-5" 
                          : "dark:bg-gray-400 bg-gray-300 dark:text-slate-500 text-slate-500"
                      }
                    >
                      Breakfast
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="Dessert"
                      aria-label="Toggle Dessert"
                      className={
                        mealTypeValue === "Dessert"
                          ?  "dark:bg-slate-900 bg-light-5" 
                          : "dark:bg-gray-400 bg-gray-300 dark:text-slate-500 text-slate-500"
                      }
                    >
                      Dessert
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="Snacks"
                      aria-label="Toggle Snacks"
                      className={
                        mealTypeValue === "Snacks"
                          ?  "dark:bg-slate-900 bg-light-5" 
                          : "dark:bg-gray-400 bg-gray-300 dark:text-slate-500 text-slate-500"
                      }
                    >
                      Snacks
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormMessage className="shad-form_message" />
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
                  <MultipleSelector
                    value={field.value}
                    onChange={field.onChange}
                    hidePlaceholderWhenSelected
                    options={ingredientOption(getIngredients as string[])}
                    placeholder="Ingredients..."
                    creatable
                    emptyIndicator={isPending?
                      <p className="py-2 text-center text-lg leading-10 text-muted-foreground">Loading...</p>:
                      <p className="text-center text-lg leading-10 text-gray-400 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                    
                    className="shad-input"
                  />                                                                                                                                                                                                                                                                                                                              
                  
                </FormControl>
                
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="steps"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Steps</FormLabel>
                <FormControl>
                  <Editor content={field.value}   onValueChange={(value) => {
                          form.setValue("steps", value);
                    }} isEditorUpdateRequired ={languageValue}  theme={theme} editable ={true}/>
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Add Photos</FormLabel>
                <FormControl>
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={recipe?.ImageUrl}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <div className="flex gap-4 items-center justify-end">
            <Button
              type="button"
              className="shad-button_dark_4"
              onClick={() => {
                navigate("/");
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="shad-button_primary whitespace-nowrap"
              disabled={isAddingRecipe || isEditingRecipe}
            >
              {isAddingRecipe || isEditingRecipe ? "Uploading..." : action}{" "}
              Recipe
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
};

export default Recipes;
