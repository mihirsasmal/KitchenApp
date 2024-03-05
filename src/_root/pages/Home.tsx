import Loader from '@/components/shared/Loader'
import RecipeCard from '@/components/shared/RecipeCard';
import { useGetRecentRecipeMutation } from '@/lib/react-query/queriesAndMutation';
import { IRecipe } from '@/types';
import { Models } from 'appwrite';

const Home = () => {

  const {data:recipes, isPending:isRecipeLoading, isError:isErrorRecipes} = useGetRecentRecipeMutation();
  return (
    <div className='flex flex-1'>
      <div className='flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar-Container'>
        <div className='max-w-screen-sm flex flex-col items-center w-full gap-6 md:gap-9'>
          <h2 className='h3-bold md:h2-bold text-left w-full'> Home Feed</h2>
          {isRecipeLoading && !recipes ?(
            <Loader/>
          ) : (
            <ul className='flex flex-col flex-1 gap-9 w-full'>
              {(recipes as any)?.documents.map((recipe:Models.Document)=>(
                <RecipeCard recipe={recipe} key={recipe.$id}/>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home