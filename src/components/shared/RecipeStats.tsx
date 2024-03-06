import { useUserContext } from '@/context/AuthContext';
import { useDeleteSavedRecipeMutation, useGetCurrentUserMutation, useLikeRecipeMutation, useSaveRecipeMutation } from '@/lib/react-query/queriesAndMutation';
import { checkIsLiked } from '@/lib/utils';
import { Models } from 'appwrite';
import React, { useEffect, useState } from 'react'
import { REPL_MODE_SLOPPY } from 'repl';
import Loader from './Loader';

type RecipeStatProps = {
    recipe:Models.Document;
    userId:string;
}

const RecipeStats = ({recipe, userId}:RecipeStatProps) => {
const likesList = recipe.likes.map((user:Models.Document)=>user.$id)

const[likes, setLikes] = useState(likesList);
const[isSaved, setIsSaved] = useState(false);

    const {mutate:likeRecipe} = useLikeRecipeMutation();
    const {mutate:saveRecipe, isPending:isSavingRecipe} = useSaveRecipeMutation();
    const {mutate:deleteSavedRecipe, isPending:isDeleteSavingRecipe} = useDeleteSavedRecipeMutation();
    const {data:currentUser} = useGetCurrentUserMutation();
    const savedRecipeRecord = currentUser?.saves.find((record:Models.Document) =>record.recipe.$id===recipe.$id);
    useEffect(()=>{
        setIsSaved(!!savedRecipeRecord)
    },[currentUser]);

const handleLikeRecipe = (e:React.MouseEvent)=>{
    e.stopPropagation();
    let newLikes = [...likes];
    if(newLikes.includes(userId))
    {
        newLikes = newLikes.filter((id)=>id!== userId);        
    }
    else {
        newLikes.push(userId);
    }
    setLikes(newLikes);
    likeRecipe({recipeId:recipe.$id,likesArray:newLikes});

}
const handleSaveRecipe = (e:React.MouseEvent)=>{
    e.stopPropagation();    
    

    if(savedRecipeRecord) {
        setIsSaved(false);
        deleteSavedRecipe({saveRecordId:savedRecipeRecord.$id})
    }
    else {
        setIsSaved(true);
    saveRecipe({recipeId:recipe.$id,userId:currentUser?.$id as string});
    }
}

  return (
    <div className='flex justify-between items-center z-20'>
        <div className='flex gap-2 mr-5'>
        <p className='small-medium lg:base-medium'>Likes {likes.length}</p>
            <img 
            src = {`${checkIsLiked(likes,userId)? '/assets/icons/liked.svg':'/assets/icons/like.svg'}`}
            alt='like'
            width={20}
            height={20}
            onClick ={handleLikeRecipe}
            className='cursor-pointer'
            />
            
            </div>
            
            <div className='flex gap-2'>
            <p className='small-medium lg:base-medium'>Save</p>
                {isSavingRecipe || isDeleteSavingRecipe ? <Loader /> :
                <img 
                src ={`${isSaved? '/assets/icons/saved.svg':'/assets/icons/save.svg'}`}
                alt ='save'
                width={20}
            height={20}
            onClick ={handleSaveRecipe}
            className='cursor-pointer'
                />
  }
  </div> 
  </div>
  )
}

export default RecipeStats