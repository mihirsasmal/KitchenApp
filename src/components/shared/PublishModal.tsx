import { Button } from '../ui/button'
import { useUpdatePublishStatusOfRecipeMutation } from '@/lib/react-query/queriesAndMutation';
import { Models } from 'appwrite';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';

const PublishModal = ({open, onClose, recipe, navigateBack, recipeList}:{open:boolean, onClose:()=>void, recipe?:Models.Document, navigateBack?:boolean, recipeList?:Models.Document[]}) => {
  const navigate = useNavigate();
  const {mutate:updatePublishStatusOfRecipe, isPending:isDeletingRecipe} = useUpdatePublishStatusOfRecipeMutation();
  const handlePublishRecipe = ()=>{ 

    if(recipe && !recipeList)
    recipeList = [recipe];
  recipeList?.map(async (recipeItem)=>{
    updatePublishStatusOfRecipe({recipeId:recipeItem.$id, publish:!recipeItem.Publish});
  });
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
           
            

                  {isDeletingRecipe?
                    ( <div className='text-center w-56 h-56 bg-light-2 dark:bg-dark-3 '>
                    <Loader />
                    </div>):(<div className='text-center w-96'>
            <img 
                  src = '/assets/icons/publish.svg'
                  alt='publish'
                  width = {24}
                  height = {24}
                  />
                  <div className='mx-auto my-4 '>
                    <h3 className='text-lg font-black text-gray-800 dark:text-gray-200'> {recipe?!recipe.Publish?'Publish':'UnPublish':'Publish/UnPublish'} Recipe</h3>
                    <p className='text-sm text-gray-500  dark:text-gray-400'> {recipe?!recipe.Publish?'Are you sure to make this recipe public?': 'Are you sure to remove this recipe from public view?':'Are you sure to change the status of selected Recipes?'}</p>
                  </div>
                  <div className='flex gap-4'>
                    <Button className='bg-blue-500 w-full' onClick = {handlePublishRecipe}>{recipe?!recipe.Publish?'Publish':'UnPublish':'Publish/UnPublsih'}</Button>
                    <Button className='bg-gray-400 w-full' onClick={onClose}>Cancel</Button>
                  </div>
                  
                  </div>)
            }
            </div>
    </div>
  )
}

export default PublishModal