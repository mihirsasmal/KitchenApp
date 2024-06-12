import { Models } from 'appwrite';
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import Modal from './Modal';
import ShareModal from './ShareModal';
import PublishModal from './PublishModal';


type RecipeActionProps = {
    recipe:Models.Document;
    userId:string;
    userEmail:string;
    navigateBack?:boolean;
    isVerticalRequired?:boolean;
}

const RecipeActions = ({recipe, userId, userEmail, navigateBack, isVerticalRequired: isSmallDevice}:RecipeActionProps) => {

    const[open, setOpen] = useState(false);
    const[shareOpen, setShareOpen] = useState(false);
    const[publishOpen, setPublishOpen] = useState(false);

    const sharedUser = (JSON.parse(recipe.shared)).filter((x:any)=>{if(x.userId=== userId || x.userId=== userEmail) return x;}).map((x:any)=>x);

  return (
    <div className='flex justify-between items-center z-20'>
        <div className='flex gap-2 mr-5'>
        {(userId ===recipe.creator.$id) ? 
                (
                <div  className ={`flex-center ${isSmallDevice && 'flex-col'} lg:flex-row md:flex-row`}>
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
                  className={`ghost_details-delete_btn p-0 ${isSmallDevice && 'lg:pb-0 pb-3'} ${userId !==recipe.creator.$id && 'hidden'}`}
                >
                  <img 
                  src = '/assets/icons/share.svg'
                  alt='share'
                  width = {24}
                  height = {24}
                  />
                  </Button>

                  <Button
                  onClick = {()=>setPublishOpen(true)}
                  variant = 'ghost'
                  className={`ghost_details-delete_btn px-2 pb-1 ${isSmallDevice && 'lg:pb-1 pb-8'} ${userId !==recipe.creator.$id && 'hidden'}`}
                >
                  <img 
                  src = '/assets/icons/publish.svg'
                  alt='publish'
                  width = {32}
                  height = {32}
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
            <PublishModal open={publishOpen} onClose={()=>setPublishOpen(false)} recipe={recipe as any}></PublishModal>
  </div>
  )
}

export default RecipeActions