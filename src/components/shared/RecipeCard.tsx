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
    <div className='bg-dark-2 rounded-3xl border border-dark-4 p-5 lg:p-7 w-full max-w-screen-sm;'>
        <div className = 'flex flex-col gap-5 justify-between items-center'>
            <div className = 'flex items-center gap-3'>
                <Link to={`/recipe/${recipe.$id}`}>
                    <img 
                    src = {recipe.ImageUrl || 'assets/icons/profile-placeholder.svg'}
                    alt = 'Recipe Image'
                className='aspect-auto w-32 lg:h-32'
            />
                </Link>
                <Link to={`/recipe/${recipe.$id}`}>
                <div className='flex-col gap-5'>
                    <p className='base-medium lg:body-bold text-light-1'> {recipe.RecipeName}</p>
                    <div className='flex-center gap-2 text-light-3'>
                    <p className='subtle-semibold lg:small-regular'>by {recipe.creator.name} </p> - 
                        <p className='subtle-semibold lg:small-regular'>{formatDate(recipe.$createdAt)}</p>
                    </div>
                </div>
                </Link>
                {<RecipeActions recipe = {recipe} userId = {user.id}/>}
            </div>
           
            <RecipeStats recipe={recipe} userId={user.id}/>
    
            
            </div>
            </div>
  )
}

export default RecipeCard