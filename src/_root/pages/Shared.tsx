import Loader from '@/components/shared/Loader';
import { useUserContext } from '@/context/AuthContext';
import { useGetSharedRecipeOfUserMutation } from '@/lib/react-query/queriesAndMutation';
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



const Shared = () => {
  const {user, isLoading, isAuthenticated} = useUserContext();
  const navigate = useNavigate();
  useEffect(()=>{
    if(!isLoading && !isAuthenticated )
    { navigate('/login') }}
  ,[isLoading])
  const {ref, inView} = useInView();
  const tableRecipe:any[]= []; 
 const {data:recipes, fetchNextPage,isFetchingNextPage, hasNextPage} = useGetSharedRecipeOfUserMutation(user.id);
 const [position, setPosition] = useState("Thumbnail View");
 useEffect (()=>{
 if (position === 'Table View' && hasNextPage)
   { fetchNextPage(); }
  else if(inView) fetchNextPage();

},[inView, fetchNextPage, isFetchingNextPage]);
 

 if(!recipes) {

  return(
    <div className='flex-center w-full h-full'>
      <Loader />
    </div>
  )
 }


recipes.pages.flatMap((x)=>tableRecipe.push(...x as any[]) );

  return (

      <div className='home-container'>
        <div className='max-w-5xl flex-start flex-col gap-9 justify-start w-full'>
        <div className='flex items-end justify-end w-full'>
        <h2 className = 'h3-bold md:h2-bold w-full'> Shared Recipes</h2>      
        
            
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
         {recipes.pages.map((item,index)=>(
          position==='Thumbnail View' && ( <ThumbnailView key={`page-${index}`} recipes={item as Models.Document[]} userId={user.id}/>
          ) || position==='List View' && ( <ListView key={`page-${index}`} recipes={item as Models.Document[]} />
          )
        ))}

        {
          !isFetchingNextPage &&  !hasNextPage &&
            position==='Table View' && (
             <TableView  columns ={columns} data={tableRecipe as any} />
            )
        }
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

export default Shared