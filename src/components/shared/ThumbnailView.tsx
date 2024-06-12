import { formatDate } from '@/lib/utils'
import RecipeActions from './RecipeActions'
import { Link } from 'react-router-dom'
import { Models } from 'appwrite'

const ThumbnailView = ({recipes, userId, userEmail}:{recipes:Models.Document[], userId:string, userEmail:string}) => {
  return (
    <div className='flex flex-wrap gap-9 w-full maz-w-5xl mb-7'>
    <ul className='w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-7 max-w-5xl'>
    {recipes.map((recipe:any)=>(
        <li key = {recipe.$id} className='relative min-w-80 h-80 '> <p className='font-bold dark:text-light-1 text-dark-3'> {recipe.RecipeName}</p>
        <Link to = {`/recipe/${recipe.$id}`} className='grid-post_link'>
        <img src = {recipe.ImageUrl || 'assets/icons/recipeDefaultImageThumbnail.jpeg'} alt='recipe' className= 'h-full w-full object-cover'/>
        </Link>
        <div className='grid-post_user'>
            {(
                <div className='flex items-center justify-start gap-2 flex-1'> 
                <img src = {recipe.creator.ImageUrl} alt = 'creator' className='h-8 w-8 rounded-full'/>
                <p className=' line-clamp-1'> {recipe.creator.name}</p>
                <p className='small-regular'>{formatDate(recipe.$createdAt)}</p>
                </div>
            )}
            {<RecipeActions recipe = {recipe} userId = {userId} userEmail = {userEmail} />}
        </div>
        </li>
    ))}
</ul>

    </div>
    )
}

export default ThumbnailView