import Loader from '@/components/shared/Loader'
import RecipeCard from '@/components/shared/RecipeCard';
import { useGetRecentRecipeMutation } from '@/lib/react-query/queriesAndMutation';
import { IRecipe } from '@/types';
import { Models } from 'appwrite';

const Home = () => {

  const {data:recipes, isPending:isRecipeLoading, isError:isErrorRecipes} = useGetRecentRecipeMutation();
  return (
    <div className='flex flex-1'>
      <div className='home-Container'>
        <div className='home-posts'>
          <h2 className='h3-bold md:h2-bold text-left w-full'> Home Feed</h2>
          {isRecipeLoading && !recipes ?(
            <Loader/>
          ) : (
            <ul className='flex flex-col flex-1 gap-9 w-full'>
              {(recipes as any)?.documents.map((recipe:Models.Document)=>(
                <RecipeCard recipe={recipe}/>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home