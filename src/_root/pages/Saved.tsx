import GridRecipeList from '@/components/shared/GridRecipeList';
import Loader from '@/components/shared/Loader';
import SearchResults from '@/components/shared/SearchResults';
import { useUserContext } from '@/context/AuthContext';
import useDebounce from '@/hooks/useDebounce';
import { useGetSavedRecipeByUserMutation, useSearchSavedRecipeMutation } from '@/lib/react-query/queriesAndMutation';
import { Models } from 'appwrite';
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

const Saved = () => {
  const {user,isLoading, isAuthenticated} = useUserContext();
  const navigate = useNavigate();
  useEffect(()=>{
    if(!isLoading && !isAuthenticated)
    {navigate('/login') }
  },[isLoading])
  const {ref, inView} = useInView();
 const {data:recipes, fetchNextPage,isFetchingNextPage, hasNextPage} = useGetSavedRecipeByUserMutation(user.id);
 useEffect (()=>{
  if(inView) fetchNextPage();
},[inView, fetchNextPage]);
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
 const {data:searchedRecipes, isFetching:isSearchFetching} = useSearchSavedRecipeMutation(debouncedValue, user.id);

 if(!recipes) {

  return(
    <div className='flex-center w-full h-full'>
      <Loader />
    </div>
  )
 }
  const shouldShowSearchResults = searchValue !=='';
  const shouldShowRecipes = !shouldShowSearchResults && (recipes as any).pages.every((item:any)=> item.length === 0)
  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className = 'h3-bold md:h2-bold w-full'> Search Saved Recipes</h2>
        <div className='flex gap-1 px-4 w-full rounded-lg dark:bg-dark-4 bg-light-3'>
          <img 
           src = '/assets/icons/search.svg'
            width ={24}
            height = {24}
            alt = 'search' />
            <input 
            type = 'text'
            placeholder='search'
            className='explore-search w-full'
            value = {searchValue}
            onChange = {(e)=>setSearchValue(e.target.value)}/>
          </div>
          <hr className='border w-full border-dark-4/80 ' />
          <div className='flex flex-wrap gap-9 w-full maz-w-5xl mt-16 mb-7'>
          <ul className='grid-container'>
            {shouldShowSearchResults?(
              <SearchResults 
              isSearchFetching = {isSearchFetching}
              searchedRecipes = {searchedRecipes as any}
              />
            ) : shouldShowRecipes? (
              <p className='dark:text-light-4 text-light-5 mt-10 text-center w-full'> End of Recipes</p>
            ) : recipes.pages.map((item,index)=>(
              <GridRecipeList key={`page-${index}`} recipes = {item as Models.Document[]} />
            ))}
            </ul>
          </div>
          { isFetchingNextPage?<div ref = {ref} className = 'mt-10'> 
                  Loading... <Loader />
                  </div>: hasNextPage ? (
                  <div ref = {ref} className = 'mt-10'> 
                  <Loader />
                  </div>
                ): !shouldShowSearchResults && (<div className = 'mt-10'> 
                <p className='dark:text-light-4 text-light-5 mt-10 text-center w-full'> No more Recipes to Load</p>
                </div>)}
          </div>
          </div>
  )
}

export default Saved