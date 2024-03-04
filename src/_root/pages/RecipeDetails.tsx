import Loader from '@/components/shared/Loader';
import RecipeStats from '@/components/shared/RecipeStats';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useGetRecipeByIdMutation } from '@/lib/react-query/queriesAndMutation'
import { formatDate } from '@/lib/utils';
import React from 'react'
import { Link, useParams } from 'react-router-dom';

const RecipeDetails = () => {
  const {id} = useParams();
  const {user} = useUserContext();
  const {data:recipes, isPending} = useGetRecipeByIdMutation(id ||'');
  const recipe = recipes as any;

  const handleDeleteRecipe =()=>{};
  return (
    <div className='post_details-container'>
      {isPending? <Loader /> :(
        <div className='post_details-info'> 
         <div className = 'flex items-center gap-3'>
                <Link to={`/profile/${recipe.creator.$id}`}>
                    <img 
                    src = {recipe.ImageUrl || 'assets/icons/profile-placeholder.svg'}
                    alt = 'creator'
                className='rounded-full w-12 lg:h-12'
            />
                </Link>
                <div className='flex flex-col'>
                    <p className='base-medium lg:body-bold text-light-1'> {recipe.RecipeName}</p>
                    <div className='flex-center gap-2 text-light-3'>
                    <p className='subtle-semibold lg:small-regular'>by {recipe.creator.name}</p> - 
                        <p className='subtle-semibold lg:small-regular'>{formatDate(recipe.$createdAt)}</p>
                    </div>
                </div>
                {(user.id ===recipe.creator.$id) ? 
                (
                <div  className ='flex-center'><Link to={`/update-recipe/${recipe.$id}`}>
                  <img src='/assets/icons/edit.svg' alt='edit' width={20} height={20} />
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
            ):( <></>)}
            </div>
           <hr className='border w-full border-dark-4/80' />
            <RecipeStats recipe={recipe} userId={user.id}/>
        </div>
      )}
      </div>
  )
}

export default RecipeDetails