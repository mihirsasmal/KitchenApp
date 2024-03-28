import Recipes from '@/components/forms/Recipes'
import Loader from '@/components/shared/Loader';
import { useGetRecipeByIdMutation } from '@/lib/react-query/queriesAndMutation';
import { Models } from 'appwrite';
import { useParams } from 'react-router-dom';

const EditRecipe = () => {
    const {id} = useParams();
   
    const {data:recipe, isPending} = useGetRecipeByIdMutation(id || '');
    
    if(isPending) return <Loader />
  return (
    <div className='flex flex-1'>
        <div className='common-container'>
            <div className='max-w-5xl flex-start gap-3 justify-start w-full'>
                <img
                src='/assets/icons/addRecipe.svg'
                width={36}
                height={36}
                alt='editRecipe'
                />
                <h2 className='h3-bold md:h2-bold text-left w-full'>Edit Recipe</h2>
            </div>
            <Recipes action ='Update' recipe={recipe  as Models.Document}/>
        </div>
        </div>
  )
}

export default EditRecipe