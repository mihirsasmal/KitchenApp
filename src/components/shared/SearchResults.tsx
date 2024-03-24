import { Models } from 'appwrite';
import GridRecipeList from './GridRecipeList';
import Loader from './Loader';
type SearchResultProps = {
    isSearchFetching:boolean;
    searchedRecipes:Models.Document[]
}

const SearchResults = ({isSearchFetching, searchedRecipes}:SearchResultProps) => {

    if(isSearchFetching) return <Loader />

    if(searchedRecipes && (searchedRecipes as any).documents.length > 0) {

        return (<GridRecipeList recipes = {(searchedRecipes as any).documents} />)
    }
  return (
      
    <p className='text-light-4 mt-10 text-center w-full'>No results found</p>
  )
}

export default SearchResults