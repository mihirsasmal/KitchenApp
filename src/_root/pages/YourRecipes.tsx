import GridRecipeList from '@/components/shared/GridRecipeList';
import Loader from '@/components/shared/Loader';
import SearchResults from '@/components/shared/SearchResults';
import { useUserContext } from '@/context/AuthContext';
import useDebounce from '@/hooks/useDebounce';
import { useGetRecipeByUserMutation, useGetSavedRecipeByUserMutation, useSearchSavedRecipeMutation } from '@/lib/react-query/queriesAndMutation';
import { useState } from 'react'

const YourRecipes = () => {
  const {user} = useUserContext();
 const {data:recipes, isPending} = useGetRecipeByUserMutation(user.id);
  

 if(isPending) {

  return(
    <div className='flex-center w-full h-full'>
      <Loader />
    </div>
  )
 }

  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className = 'h3-bold md:h2-bold w-full'> Your Recipes</h2>
        <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-4'>
          
          </div></div>
          
          <div className='flex flex-wrap gap-9 w-full maz-w-5xl mt-16 mb-7'>
          <GridRecipeList  recipes = {recipes} />
           
          </div>


YourRecipes</div>
  )
}

export default YourRecipes