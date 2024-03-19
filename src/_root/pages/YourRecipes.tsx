import GridRecipeList from '@/components/shared/GridRecipeList';
import Loader from '@/components/shared/Loader';
import RecipeActions from '@/components/shared/RecipeActions';
import RecipeStats from '@/components/shared/RecipeStats';
import SearchResults from '@/components/shared/SearchResults';
import { useUserContext } from '@/context/AuthContext';
import useDebounce from '@/hooks/useDebounce';
import { useGetRecipeByUserMutation, useGetSavedRecipeByUserMutation, useSearchSavedRecipeMutation } from '@/lib/react-query/queriesAndMutation';
import { formatDate } from '@/lib/utils';
import { useState } from 'react'
import { Link } from 'react-router-dom';
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



const YourRecipes = () => {
  const {user} = useUserContext();
 const {data:recipes, isPending} = useGetRecipeByUserMutation(user.id);
 const [position, setPosition] = useState("Thumbnail View");

 if(isPending) {

  return(
    <div className='flex-center w-full h-full'>
      <Loader />
    </div>
  )
 }

  return (

      <div className='flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar'>
        <div className='max-w-5xl flex-start flex-col gap-9 justify-start w-full'>
        <div className='flex items-end justify-end w-full'>
        <h2 className = 'h3-bold md:h2-bold w-full'> Your Recipes</h2>      
        
            
            <DropdownMenu>
     <DropdownMenuTrigger asChild>
       <Button className='gap-2 '><p className = 'small-medium md:base-medium text-light-2'>{position}</p>
           <img 
           src = 'assets/icons/filter.svg'
           width={20}
           height = {20}
           alt= 'filter'
            /></Button>
     </DropdownMenuTrigger>
     <DropdownMenuContent className="w-56">
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
         {
         position==='Table View' ?(
          <TableView columns ={columns} data={recipes as any} />
         ):( <ThumbnailView recipes={recipes as any} userId={user.id}/>
          )}
          </div>
          </div>



  )
}

export default YourRecipes