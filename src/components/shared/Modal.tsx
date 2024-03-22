import React from 'react'
import { Button } from '../ui/button'
import { useDeleteRecipeMutation } from '@/lib/react-query/queriesAndMutation';
import { Models } from 'appwrite';
import Loader from './Loader';

const Modal = ({open, onClose, recipe}:{open:boolean, onClose:()=>void, recipe:Models.Document}) => {
  const {mutate:deleteRecipe, isPending:isDeletingRecipe} = useDeleteRecipeMutation();
  const handleDeleteRecipe = ()=>{ 
    deleteRecipe({recipeId:recipe.$id, imageId:recipe.ImageId});
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
                    </div>):(<div className='text-center w-56'>
            <img 
                  src = '/assets/icons/delete.svg'
                  alt='delete'
                  width = {24}
                  height = {24}
                  />
                  <div className='mx-auto my-4 w-48'>
                    <h3 className='text-lg font-black text-gray-800 dark:text-gray-200'> Confirm Delete</h3>
                    <p className='text-sm text-gray-500  dark:text-gray-400'> Are you sure you want to delete this recipe?</p>
                  </div>
                  <div className='flex gap-4'>
                    <Button className='bg-red w-full' onClick = {handleDeleteRecipe}>Delete</Button>
                    <Button className='bg-gray-400 w-full' onClick={onClose}>Cancel</Button>
                  </div>
                  
                  </div>)
            }
            </div>
    </div>
  )
}

export default Modal