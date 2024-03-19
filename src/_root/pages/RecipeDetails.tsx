import { EditorView } from '@/components/shared/Editor';
import Loader from '@/components/shared/Loader';
import RecipeStats from '@/components/shared/RecipeStats';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useUserContext } from '@/context/AuthContext';
import { useGetRecipeByIdMutation } from '@/lib/react-query/queriesAndMutation'
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const RecipeDetails =  () => {
  const {id} = useParams();
  const {user} = useUserContext();
  const {data:recipes, isPending} = useGetRecipeByIdMutation(id ||'');
  const recipe = recipes as any;
  const handleDeleteRecipe =()=>{};
  const [languageValue, setLanguageValue] = useState('english');
  const [steps, setSteps] = useState(recipe?.Steps);
 const [ingredients, setIngredients] = useState(recipe?.Ingredients);

  return (
    <div className='flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 custom-scrollbar items-center-container'>
      {isPending? <Loader /> :(
        <div className=' bg-dark-2 flex flex-col gap-5 lg:gap-1 flex-1 items-start p-8 rounded-[30px]'> 
         <div className = 'flex flex-col items-center justify-center  w-full'>
         
         <h2 className='h3-bold md:h2-bold text-light-1'> {recipe.RecipeName}</h2>
         </div>
                        
                {(user.id ===recipe.creator.$id) ? 
                (<div className = 'flex  justify-between w-full '> 
                  <p className='subtle-semibold lg:small-regular flex justify-center items-center gap-2 text-light-3'>
                         {formatDate(recipe.$createdAt)}</p>
                <div className='flex items-end justify-end  ml-auto '>
                  <Link to={`/update-recipe/${recipe.$id}`} className='px-4 py-2'>
                  <img src='/assets/icons/edit.svg' alt='edit' width={24} height={24} />
                </Link><Button
                  onClick = {handleDeleteRecipe}
                  variant = 'ghost'
                  className={`ghost_details-delete_btn ${user.id !==recipe.creator.$id && 'hidden'}`}
                >
                  <img 
                  src = '/assets/icons/delete.svg'
                  alt='delete'
                  width = {24}
                  height = {24}
                  />
                  </Button></div>
                  </div>
            ):( <div className = 'flex  justify-between w-full '> 
            <p className='subtle-semibold lg:small-regular flex justify-center items-center mx-auto gap-2 text-light-3'>by {recipe.creator.name} - 
                   {formatDate(recipe.$createdAt)}</p> </div>)}          
            
           <hr className='border w-full border-dark-4/80' />
           <div className = 'flex flex-col items-start justify-start w-full gap-5'> 
           <p className='flex justify-start items-start font-sans text-2xl'>Meal Type </p>
           <p className='px-48 font-thin text-2xl'>{recipe.MealType}</p>
           <div>
           <p className='flex justify-start items-start font-sans text-2xl'>Cuisine </p>
           <p className='px-48 font-thin text-2xl'>{recipe.CuisineType}</p>
            {recipe.CuisineRegion?(<div><p className='flex justify-start items-start font-sans text-2xl'>Cuisine Region </p>
           <p className='px-48 font-thin text-2xl'>{recipe.CuisineRegion}</p></div>):<></>}
            </div>                  
           <div className = 'flex-col items-start justify-start gap-5'> 
           <p className='flex justify-start items-start font-sans text-2xl'>Step Language </p>
           <ToggleGroup
                    type="single"
                    variant="outline"
                    onValueChange={(value) => {
                      if (value) {
                        setLanguageValue(value);
                        if(value==='english')
                        {setIngredients(recipe?.Ingredients);
                        setSteps(recipe?.Steps);}
                        if(value==='odiya')
                        {setIngredients(recipe?.IngredientsOdia)
                          
                          setSteps(recipe?.StepsOdia);}
                         
                      }
                    }}
                    className='lg:px-40 pt-3 px-20'
                  >
                    <ToggleGroupItem
                      value="english"
                      aria-label="Toggle english"
                      className={
                        languageValue === "english"
                          ? "bg-slate-900"
                          : "bg-gray-400"
                      }
                    >
                      English
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="odiya"
                      aria-label="Toggle odiya"
                      className={
                        languageValue === "odiya"
                          ? "bg-slate-900"
                          : "bg-gray-400"
                      }
                    >
                      Odiya
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="kannada"
                      aria-label="Toggle kannada"
                      disabled = {true}
                      className={
                        languageValue === "kannada"
                          ? "bg-slate-900"
                          : "bg-gray-400"
                      }
                    >
                      Kannada
                    </ToggleGroupItem>
                  </ToggleGroup>
          </div>
           
            <p className='flex justify-start items-start font-sans text-2xl'>Ingredients </p>
            <ul className='flex-col px-32'> 
                   {ingredients?.map((x:string)=>{return (<li key={x} className='text-light-2 '><span className='flex gap-5 pt-3'><img src = '/assets/icons/bulletPoint.jpeg' alt='bulletIcon' className='h-10 w-10 rounded-full'/> <span className='pt-1 font-thin text-2xl'>{x}</span></span></li>)})} </ul>
                   </div>
                   <div className = 'flex flex-col items-start justify-start w-full lg:gap-2 md:gap-5 sm:gap-9 gap-9'> 
                   <p className='flex justify-start items-start font-sans text-2xl'>Steps  </p>   
                  {languageValue ==='english' ? <div className='flex lg:px-20 justify-start items-start gap-2 font-thin text-2xl'> <EditorView content={recipe?.Steps}/> </div> : 
                   <div className='flex lg:px-20 justify-start items-start gap-2 font-thin text-2xl'> <EditorView content={recipe?.StepsOdia}/> </div> }
                   </div>
                   {recipe.ImageUrl?<div className='w-fit lg:w-2/4 lg:px-32 md:w-full sm:w-5/6 pb-5'><img src={recipe.ImageUrl} alt = 'image'  /></div> :<></>}
           <hr className='border w-full border-dark-4/80 ' />
            <RecipeStats recipe={recipe} userId={user.id}/>
        </div>
      )}
      </div>
  )
}

export default RecipeDetails