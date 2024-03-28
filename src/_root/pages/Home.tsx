import ListView from '@/components/shared/ListView';
import Loader from '@/components/shared/Loader'
import { useGetRecentRecipeMutation } from '@/lib/react-query/queriesAndMutation';
import { Models } from 'appwrite';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const Home = () => {
  const {ref, inView} = useInView();
  const {data:recipes, fetchNextPage,isFetchingNextPage, hasNextPage, isPending:isRecipeLoading} = useGetRecentRecipeMutation();
  useEffect (()=>{
    if(inView) fetchNextPage();
  },[inView, fetchNextPage]);

  if(!recipes) {

    return(
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    )
   }
  
  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='max-w-5xl flex-start flex-col gap-3 justify-start w-full'>
          <h2 className='h3-bold md:h2-bold text-left w-full'> Home</h2>
          {isRecipeLoading && !recipes ?(
            <Loader/>
          ) : (recipes?.pages.map((item,index)=>(
            <ListView key={`page-${index}`} recipes = {item as Models.Document[]}/>
          ))
            )}
            { isFetchingNextPage?<div ref = {ref} className = 'mt-10'> 
                  Loading... <Loader />
                  </div>: hasNextPage ? (
                  <div ref = {ref} className = 'mt-10'> 
                  <Loader />
                  </div>
                ): <div className = 'mt-10'> 
                <p className='dark:text-light-4 text-light-5 mt-10 text-center w-full'> No more Recipes to Load</p>
                </div>}
        </div>
      </div>
    </div>
  )
}

export default Home