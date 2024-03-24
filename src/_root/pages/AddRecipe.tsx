import Recipes from '@/components/forms/Recipes'
import { useUserContext } from '@/context/AuthContext';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const AddRecipe = () => {
  const {isAuthenticated} = useUserContext();
  const navigate = useNavigate();
  useEffect(()=>{
    if(!isAuthenticated)
    { navigate('/login') }
  },[])
  
  return (
    <div className='flex flex-1'>
        <div className='common-container'>
            <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
                <img
                src='/assets/icons/addRecipe.svg'
                width={36}
                height={36}
                alt='addRecipe'
                />
                <h2 className='h3-bold md:h2-bold text-left w-full'>Add Recipe</h2>
            </div>
            <Recipes action = 'Create'/>
        </div>
        </div>
  )
}

export default AddRecipe