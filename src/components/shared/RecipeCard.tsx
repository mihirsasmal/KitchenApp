import { useUserContext } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';
import { Models } from 'appwrite';
import { Link } from 'react-router-dom';
import RecipeStats from './RecipeStats';
import RecipeActions from './RecipeActions';

type RecipeCardProps = {
    recipe:Models.Document;
}
const RecipeCard = ({recipe}:RecipeCardProps) => {
const {user} = useUserContext();


  return (
    <div className='dark:bg-dark-2 bg-light-3 rounded-3xl border dark:border-dark-4 border-light-5 p-5 lg:p-7 w-full max-w-screen-sm; gap-9 justify-between items-center'>
        <div className = 'flex  gap-5 '>
            <div className = 'flex  items-center gap-3 w-4/5'>
                <Link to={`/recipe/${recipe.$id}`}>
                    <img 
                    src = {recipe.ImageUrl || 'assets/icons/recipeDefaultImage.jpeg'}
                    alt = 'Recipe Image'
                className='aspect-auto w-32 lg:h-32'
            />
                </Link>
                <Link to={`/recipe/${recipe.$id}`}>
                <div className='flex-col gap-5'>
                    <p className='base-medium lg:body-bold dark:text-light-1 text-dark-3'> {recipe.RecipeName}</p>
                    </div>
                    <div className=' flex gap-2 dark:text-light-6 text-dark-4'>
                    <p className='subtle-semibold lg:small-regular'>by {recipe.creator.name} </p> - 
                        <p className='subtle-semibold lg:small-regular'>{formatDate(recipe.$createdAt)}</p>
                    </div>
                
                </Link>
                
            </div>
           
            {<RecipeActions recipe = {recipe} userId = {user.id}/>}
            
    
            
            </div>
            <RecipeStats recipe={recipe} userId={user.id}/>
            </div>
            
  )
}

export default RecipeCard