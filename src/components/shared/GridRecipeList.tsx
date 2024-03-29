import { useUserContext } from '@/context/AuthContext'
import { Models } from 'appwrite'
import { Link } from 'react-router-dom'
import RecipeStats from './RecipeStats'

type GridRecipeListProps = {
    recipes:Models.Document[],
    showUser?: boolean,
    showStats?:boolean
}

const GridRecipeList = ({recipes, showUser = true, showStats = true}:GridRecipeListProps) => {
    const {user} = useUserContext();

  return (
      
          recipes.map((recipe)=>(
              <li key = {recipe.$id} className='relative min-w-80 h-80'> {recipe.RecipeName}
              <Link to = {`/recipe/${recipe.$id}`} className='grid-post_link'>
              <img src = {recipe.ImageUrl || 'assets/icons/recipeDefaultImage.jpeg'} alt='recipe' className= 'h-full w-full object-cover'/>
              </Link>
              <div className='grid-post_user'>
                  {showUser && (
                      <div className='flex items-center justify-start gap-2 flex-1'> 
                      <img src = {recipe.creator.ImageUrl} alt = 'creator' className='h-8 w-8 rounded-full'/>
                      <p className=' line-clamp-1'> {recipe.creator.name}</p>
                      </div>
                  )}
                  {showStats && <RecipeStats recipe = {recipe} userId = {user.id}/>}
              </div>
              </li>
          ))
      
    
  )
}

export default GridRecipeList