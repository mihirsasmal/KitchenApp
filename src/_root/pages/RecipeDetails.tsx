import { EditorView } from '@/components/shared/Editor';
import Loader from '@/components/shared/Loader';
import RecipeStats from '@/components/shared/RecipeStats';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useGetRecipeByIdMutation } from '@/lib/react-query/queriesAndMutation'
import { formatDate } from '@/lib/utils';
import { Link, useParams } from 'react-router-dom';

const RecipeDetails =  () => {
  const {id} = useParams();
  const {user} = useUserContext();
  const {data:recipes, isPending} = useGetRecipeByIdMutation(id ||'');
  const recipe = recipes as any;
  const handleDeleteRecipe =()=>{};
  
 
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
           <div className = 'flex flex-col items-start justify-start w-full '> 
            <p className='flex justify-start items-start font-sans text-2xl'>Ingredients </p>
            <ul className='flex-col px-32'> 
                   {recipe.Ingredients.map((x:string)=>{return (<li className='text-light-2 '><span className='flex gap-5 pt-3'><img src = '/assets/icons/bulletPoint.jpeg' alt='bulletIcon' className='h-10 w-10 rounded-full'/> <span className='pt-1 font-thin text-2xl'>{x}</span></span></li>)})} </ul>
                   </div>
                   <div className = 'flex flex-col items-start justify-start w-full lg:gap-2 md:gap-5 sm:gap-9 gap-9'> 
                   <p className='flex justify-start items-start font-sans text-2xl'>Steps  </p>   
                   
                   <div className='flex lg:px-20 justify-start items-start gap-2 font-thin text-2xl'> <EditorView content={recipe.Steps}/> </div> 
                   </div>
           <hr className='border w-full border-dark-4/80' />
            <RecipeStats recipe={recipe} userId={user.id}/>
        </div>
      )}
      </div>
  )
}

export default RecipeDetails