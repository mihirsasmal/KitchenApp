import { Models } from 'appwrite';
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import Modal from './Modal';
import ShareModal from './ShareModal';


type RecipeActionProps = {
    recipe:Models.Document;
    userId:string;
    navigateBack?:boolean
}

const RecipeActions = ({recipe, userId, navigateBack}:RecipeActionProps) => {

    const[open, setOpen] = useState(false);
    const[shareOpen, setShareOpen] = useState(false);

    const sharedUser = recipe.share.filter((x:any)=>{const tempSharedUser = JSON.parse(x); if(tempSharedUser.userId=== userId) return x;}).map((x:any)=>JSON.parse(x));
    
  return (
    <div className='flex justify-between items-center z-20'>
        <div className='flex gap-2 mr-5'>
        {(userId ===recipe.creator.$id) ? 
                (
                <div  className ='flex-center'>
                  <Link to={`/update-recipe/${recipe.$id}`}>
                  <img src='/assets/icons/edit.svg' alt='edit' width={20} height={20} />
                </Link>
                <Button
                  onClick = {()=>setOpen(true)}
                  variant = 'ghost'
                  className={`ghost_details-delete_btn ${userId !==recipe.creator.$id && 'hidden'}`}
                >
                  <img 
                  src = '/assets/icons/delete.svg'
                  alt='delete'
                  width = {24}
                  height = {24}
                  />
                  </Button>

                  <Button
                  onClick = {()=>setShareOpen(true)}
                  variant = 'ghost'
                  className={`ghost_details-delete_btn p-0 ${userId !==recipe.creator.$id && 'hidden'}`}
                >
                  <img 
                  src = '/assets/icons/share.svg'
                  alt='share'
                  width = {24}
                  height = {24}
                  />
                  </Button>
                  
                  </div>
            ):((sharedUser.length>0 && sharedUser[0].canEdit)? (<div  className ='flex-center'>
            <Link to={`/update-recipe/${recipe.$id}`}>
            <img src='/assets/icons/edit.svg' alt='edit' width={20} height={20} />
          </Link> </div>):(<></>))}
            
            </div>
            <Modal open={open} onClose={()=>setOpen(false)} recipe={recipe} navigateBack={navigateBack}>                
            </Modal>
            <ShareModal open={shareOpen} onClose={()=>setShareOpen(false)} recipe={recipe as any}></ShareModal>
  </div>
  )
}

export default RecipeActions