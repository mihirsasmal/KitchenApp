import Recipes from '@/components/forms/Recipes'
import React from 'react'

const AddRecipe = () => {
  return (
    <div className='flex flex-1'>
        <div className='common-container'>
            <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
                <img
                src='/assets/icons/add-post.svg'
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