import ListView from '@/components/shared/ListView';
import Loader from '@/components/shared/Loader'
import { useGetRecentRecipeMutation } from '@/lib/react-query/queriesAndMutation';
import { Models } from 'appwrite';

const Home = () => {

  const {data:recipes, isPending:isRecipeLoading} = useGetRecentRecipeMutation();
  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='max-w-5xl flex-start flex-col gap-3 justify-start w-full'>
          <h2 className='h3-bold md:h2-bold text-left w-full'> Home</h2>
          {isRecipeLoading && !recipes ?(
            <Loader/>
          ) : (
            <ListView recipes={(recipes as Models.DocumentList<Models.Document>).documents}/>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home