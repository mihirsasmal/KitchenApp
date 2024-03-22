import { EditorView } from '@/components/shared/Editor';
import Loader from '@/components/shared/Loader';
import RecipeActions from '@/components/shared/RecipeActions';
import RecipeStats from '@/components/shared/RecipeStats';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useUserContext } from '@/context/AuthContext';
import { useGetRecipeByIdMutation } from '@/lib/react-query/queriesAndMutation'
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetails =  () => {
  const {id} = useParams();
  const {user} = useUserContext();
  const {data:recipes, isPending} = useGetRecipeByIdMutation(id ||'');

  const recipe = recipes as any;

  const [languageValue, setLanguageValue] = useState('english');

 const [ingredients, setIngredients] = useState(recipe?.Ingredients);

  return (
    <div className='flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 custom-scrollbar items-center-container'>
      {isPending? <Loader /> :(
        <div className=' dark:bg-dark-2 bg-light-3 flex flex-col gap-5 lg:gap-1 flex-1 items-start p-8 rounded-[30px]'> 
         <div className = 'flex flex-col items-center justify-center  w-full'>
         
         <h2 className='h3-bold md:h2-bold dark:text-light-1 text-dark-3'> {recipe.RecipeName}</h2>
         </div>
                        
                {(user.id ===recipe.creator.$id) ? 
                (<div className = 'flex  justify-between w-full '> 
                  <p className='subtle-semibold lg:small-regular flex justify-center items-center gap-2 dark:text-light-3 text-dark-4'>
                         {formatDate(recipe.$createdAt)}</p>
                         <RecipeActions recipe = {recipe} userId = {user.id}/>
                  </div>
            ):( <div className = 'flex  justify-between w-full '> 
            <p className='subtle-semibold lg:small-regular flex justify-center items-center mx-auto gap-2 dark:text-light-3 text-dark-4'>by {recipe.creator.name} - 
                   {formatDate(recipe.$createdAt)}</p> </div>)}          
            
           <hr className='border w-full border-dark-4/80' />
           <div className = 'flex flex-col items-start justify-start gap-3'> 
           <div className = 'flex items-start justify-start  '> 
           <p className='flex font-sans text-2xl'>Meal Type </p>
           <p className='px-20 pt-1 flex font-thin text-2xl'>{recipe.MealType}</p>
           </div>
           <div className = 'flex items-start justify-start  '> 
           <p className='flex justify-start items-start font-sans text-2xl'>Cuisine </p>
           <p className='px-28 pt-1 font-thin text-2xl'>{recipe.CuisineType}</p>
           </div>
           <div className = 'flex items-start justify-start  '> 
            {recipe.CuisineRegion?(<div className = 'flex items-start justify-start  '> <p className='flex justify-start items-start font-sans text-2xl'>Cuisine Region </p>
           <p className='px-8 pt-1 font-thin text-2xl'>{recipe.CuisineRegion}</p></div>):<></>}
            </div>                  
           <div className = 'flex-col items-start justify-start gap-5'> 
           <p className='flex justify-start items-start font-sans text-2xl'>Language </p>
           <ToggleGroup
                    type="single"
                    variant="outline"
                    onValueChange={(value) => {
                      if (value) {
                        setLanguageValue(value);
                        if(value==='english')
                        {setIngredients(recipe?.Ingredients);
                        }
                        if(value==='odiya')
                        {setIngredients(recipe?.IngredientsOdia)
                          
                          }
                         
                      }
                    }}
                    className='lg:px-40 pt-3 px-20'
                  >
                    <ToggleGroupItem
                      value="english"
                      aria-label="Toggle english"
                      className={
                        languageValue === "english"
                        ? "dark:bg-slate-900 bg-light-5" 
                        : "dark:bg-gray-400 bg-gray-300 dark:text-slate-500 text-slate-500"
                      }
                    >
                      English
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="odiya"
                      aria-label="Toggle odiya"
                      className={
                        languageValue === "odiya"
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
                        languageValue === "kannada"
                        ? "dark:bg-slate-900 bg-light-5" 
                        : "dark:bg-gray-400 bg-gray-300 dark:text-slate-500 text-slate-500"
                      }
                    >
                      Kannada
                    </ToggleGroupItem>
                  </ToggleGroup>
          </div>
           
            <p className='flex justify-start items-start font-sans text-2xl'>Ingredients </p>
            <ul className='flex-col px-32'> 
                   {ingredients?.map((x:string)=>{return (<li key={x} className='dark:text-light-3 text-dark-1 '><span className='flex gap-5 pt-3'><img src = '/assets/icons/bulletPoint.jpeg' alt='bulletIcon' className='h-10 w-10 rounded-full'/> <span className='pt-1 font-thin text-2xl'>{x}</span></span></li>)})} </ul>
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