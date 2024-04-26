import { Button } from '../ui/button'
import { useSearchUserMutation, useUpdateSharedUserOfRecipeMutation } from '@/lib/react-query/queriesAndMutation';
import { Models } from 'appwrite';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import MultipleSelector from './MultipleSelector';
import { useState } from 'react';
import { Switch } from "@/components/ui/switch"
import useDebounce from '@/hooks/useDebounce';

const ShareModal = ({open, onClose, recipe, navigateBack, recipeList}:{open:boolean, onClose:()=>void, recipe?:Models.Document, navigateBack?:boolean, recipeList?:Models.Document[]}) => {
  const navigate = useNavigate();
  const {mutate:shareRecipe, isPending:isSharedUserUpdating} = useUpdateSharedUserOfRecipeMutation();

const [allowEdit, setAllowEdit] = useState(false);
const [searchValue, setSearchValue] = useState('');
const debouncedValue = useDebounce(searchValue, 500);

 const {data:searchedUsers, isFetching:isSearchFetching} = useSearchUserMutation(debouncedValue);
 const [selectedUsers, setSelectedUsers] = useState([]);

 const handleShareRecipe = async()=>{ 
  if(recipe && !recipeList)
  recipeList = [recipe];

  await recipeList?.map(async (recipeItem)=>{
  if (selectedUsers.length > 0) {

    let existingSharedUsers: any = [];
    if (recipeItem.share.length > 0) {
      existingSharedUsers = recipeItem?.share.map((x: any) => {
        return JSON.parse(x);
      });
    }

    let filteredExistingUsers: any = [];
    const sharedUsers = selectedUsers.map((x: any) => {
      const filteredUser = existingSharedUsers.filter((item: any) => {
        if (item?.userId === x.value) {
          return item;
        }
      });
      if (filteredUser.length > 0) {
        filteredUser[0].canEdit = allowEdit;
        filteredExistingUsers.push(...filteredUser);
        return JSON.stringify(filteredUser[0]);
      }
      const users = { userId: x.value, canEdit: allowEdit };
      return JSON.stringify(users);
    });

    const commonUsers = existingSharedUsers
      .filter((x: any) => {
        if (
          filteredExistingUsers.filter((item: any) => {
            if (item.userId === x?.userId) return item;
          }).length === 0
        )
          return x;
      })
      .map((x: any) => JSON.stringify(x));


    const updatedRecipe = await shareRecipe({
      recipeId: recipeItem?.$id as string,
      sharedUsers: [...commonUsers, ...sharedUsers],
    });
    return updatedRecipe;
  }
});

  setSelectedUsers([]);
  setAllowEdit(false);
  onClose();
  if(navigateBack) navigate(-1);
}

  return (
    <div
        onClick = {onClose}
        className = {`fixed inset-0 flex justify-center items-center transition-colors ${open ?'visible bg-black/20':'invisible'}`}>
          <div className={`bg-white dark:bg-dark-3 rounded-xl shadow p-6 transition-all ${open ?'scale-100 opacity-100' : 'scale-125 opacity-0'}`}
           onClick={(e)=>e.stopPropagation()}>
            <Button className=' absolute top-2 right-2 p-1 rounded-lg text-gray-400 bg-white dark:bg-dark-3  hover:bg-gray-50 hover:text-gray-600' onClick = {onClose}> X</Button>
           
            

                  {isSharedUserUpdating?
                    ( <div className='text-center w-56 h-56 bg-light-2 dark:bg-dark-3 '>
                    <Loader />
                    </div>):(<div className='w-96'>
            <img 
                  src = '/assets/icons/share.svg'
                  alt='share'
                  width = {24}
                  height = {24}
                  />
                  <div className='mx-auto my-4 w-48'>
                    <h3 className='text-lg font-black text-gray-800 dark:text-gray-200 text-center'> Share Recipe </h3>
                   
                  </div>
                  <div >
                  <p className='text-sm text-gray-500  dark:text-gray-400 justify-start items-start'> Select Users</p>
                  <MultipleSelector
                    onSearch = {async (value) =>{
                      setSearchValue(value);
                      return isSearchFetching?[]:(searchedUsers as  Models.Document[]).map((x)=>{return {label:x.email, value:x.$id}});
                      }}
                      value = {selectedUsers}
                      onChange={(e)=>{setSelectedUsers(e as any)}}
                    placeholder="Enter User Email"                   
                    emptyIndicator={isSearchFetching?
                      <p className="py-2 text-center text-lg leading-10 text-muted-foreground">Loading...</p>:
                      <p className="text-center text-lg leading-10 text-gray-400 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                    badgeClassName="dark:bg-light-4 bg-light-5"
                    className="dark:bg-dark-4 bg-light-3 dark:placeholder:text-light-4 placeholder:text-light-5"
                  />
                  <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm gap-3'>
                    <div className="space-y-0.5">
                      <div className='flex flex-row gap-2'>
                      <p className ='text-sm text-gray-500  dark:text-gray-400 justify-start items-start'>Can Edit</p>
                      <img 
                  src = '/assets/icons/edit.svg'
                  alt='edit'
                  width = {15}
                  height = {15}
                  /></div>
                      <p className=' dark:text-light-4 text-light-5 text-xs'>It will allow the users to modify the Recipe</p>
                    </div>
                    <Switch
                      checked={allowEdit}
                      onCheckedChange={setAllowEdit}
                    />
                  </div>
                  </div>
                  <div className='flex py-2 gap-4'>
                    <Button className='bg-blue-500 w-full' onClick = {async()=>await handleShareRecipe()}>Share</Button>
                    <Button className='bg-gray-400 w-full' onClick={()=>{setSelectedUsers([]);   setAllowEdit(false); onClose();}}>Cancel</Button>
                  </div>
                  
                  </div>)
            }
            </div>
    </div>
  )
}

export default ShareModal