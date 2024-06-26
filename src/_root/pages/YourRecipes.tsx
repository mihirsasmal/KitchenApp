import Loader from '@/components/shared/Loader';
import { useUserContext } from '@/context/AuthContext';
import { useGetRecipeByUserMutation, useSearchUsersRecipeMutation } from '@/lib/react-query/queriesAndMutation';
import { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import TableView,{ columns} from '@/components/shared/TableView';
import ThumbnailView from '@/components/shared/ThumbnailView';
import ListView from '@/components/shared/ListView';
import { Models } from 'appwrite';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import SearchResults from '@/components/shared/SearchResults';



const YourRecipes = () => {
  const {user, isLoading, isAuthenticated} = useUserContext();
  const navigate = useNavigate();
  useEffect(()=>{
    if(!isLoading && !isAuthenticated )
    { navigate('/login') }}
  ,[isLoading])
  const {ref, inView} = useInView();
  const tableRecipe:any[]= []; 
 const {data:recipes, fetchNextPage,isFetchingNextPage, hasNextPage} = useGetRecipeByUserMutation(user.id);
 const [position, setPosition] = useState("Thumbnail View");
 useEffect (()=>{
 if (position === 'Table View' && hasNextPage)
   { fetchNextPage(); }
  else if(inView) fetchNextPage();

},[inView, fetchNextPage, isFetchingNextPage]);
 

const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
 const {data:searchedRecipes, isFetching:isSearchFetching} = useSearchUsersRecipeMutation(user?.id, debouncedValue);
 
 if(!recipes) {

  return(
    <div className='flex-center w-full h-full'>
      <Loader />
    </div>
  )
 }

 const shouldShowSearchResults = searchValue !=='';
  const shouldShowRecipes = !shouldShowSearchResults && (recipes as any).pages.every((item:any)=> item.length === 0)

recipes.pages.flatMap((x)=>tableRecipe.push(...x as any[]) );

  return (

      <div className='home-container'>
        <div className='max-w-5xl flex-start flex-col gap-9 justify-start w-full'>
        <div className='flex items-end justify-end gap-5 w-full'>
        <h2 className = 'h3-bold md:h2-bold w-full'> Your Recipes</h2>      
        <div className='flex gap-1 px-4 w-full rounded-lg dark:bg-dark-4 bg-light-3'>
          <img 
           src = '/assets/icons/search.svg'
            width ={24}
            height = {24}
            alt = 'search' />
            <input 
            type = 'text'
            placeholder='Search by Recipe Name or Ingredients'
            className='explore-search w-full'
            value = {searchValue}
            onChange = {(e)=>setSearchValue(e.target.value)}/>
          </div>
          
            
            <DropdownMenu>
     <DropdownMenuTrigger asChild>
       <Button className='gap-2 '><p className = 'small-medium md:base-medium dark:text-light-2 text-dark-4'>{position}</p>
           <img 
           src = 'assets/icons/filter.svg'
           width={20}
           height = {20}
           alt= 'filter'
            /></Button>
     </DropdownMenuTrigger>
     <DropdownMenuContent className="w-56  dark:text-light-2 text-dark-4 bg-light-3 dark:bg-dark-2">
       <DropdownMenuLabel>View</DropdownMenuLabel>
       <DropdownMenuSeparator />
       <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
         <DropdownMenuRadioItem value="List View">List</DropdownMenuRadioItem>
         <DropdownMenuRadioItem value="Thumbnail View">Thumbnail</DropdownMenuRadioItem>
         <DropdownMenuRadioItem value="Table View">Table</DropdownMenuRadioItem> 
       </DropdownMenuRadioGroup>
     </DropdownMenuContent>
   </DropdownMenu>
   </div>
   {shouldShowSearchResults?(
              <SearchResults 
              isSearchFetching = {isSearchFetching}
              searchedRecipes = {searchedRecipes as any}
              position ={position}
              userId={user.id}
              />
            ) : shouldShowRecipes? (
              <p className='dark:text-light-4 text-light-5 mt-10 text-center w-full'> End of Recipes</p>
            ) : position!=='Table View'?
         (recipes.pages.map((item,index)=>(
          position==='Thumbnail View' && ( <ThumbnailView key={`page-${index}`} recipes={item as Models.Document[]} userId={user.id} userEmail = {user.email} />
          ) || position==='List View' && ( <ListView key={`page-${index}`} recipes={item as Models.Document[]} />
          )
        ))) :

        (
          !isFetchingNextPage &&  !hasNextPage &&
            position==='Table View' && (
             <TableView  columns ={columns} data={tableRecipe as any} />
            )
        )}
          { isFetchingNextPage?<div ref = {ref} className = 'mt-10'> 
                  Loading... <Loader />
                  </div>: hasNextPage ? (
                  <div ref = {ref} className = 'mt-10'> 
                  <Loader />
                  </div>
                ): position !=='Table View' && <div className = 'mt-10'> 
                <p className='dark:text-light-4 text-light-5 mt-10 text-center w-full'> No more Recipes to Load</p>
                </div>}

          </div>
          </div>



  )
}

export default YourRecipes