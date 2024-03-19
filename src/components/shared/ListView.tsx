import RecipeCard from './RecipeCard'
import { Models } from 'appwrite'

const ListView = ({recipes}:{recipes:Models.Document[]}) => {
  return (
    <ul className='sm:w-full flex-start flex-col gap-9 w-full'>
              {recipes.map((recipe:Models.Document)=>(
                <RecipeCard recipe={recipe} key={recipe.$id}/>
              ))}
            </ul>
  )
}

export default ListView