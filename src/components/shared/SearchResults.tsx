import { Models } from 'appwrite';
import GridRecipeList from './GridRecipeList';
import Loader from './Loader';
import ThumbnailView from './ThumbnailView';
import ListView from './ListView';
import TableView, { columns } from './TableView';

type SearchResultProps = {
    isSearchFetching:boolean;
    searchedRecipes:Models.Document[];
    position?:string;
    userId?: string;
    userEmail?: string;
}

const SearchResults = ({isSearchFetching, searchedRecipes, position, userId, userEmail}:SearchResultProps) => {

    if(isSearchFetching) return <Loader />
    
    if(searchedRecipes && (searchedRecipes as any).documents.length > 0) {
      
        return ( position==='Thumbnail View' ? ( <ThumbnailView recipes={(searchedRecipes as any).documents} userId={userId as string} userEmail = {userEmail as string}/> )
       : position==='List View' ? ( <ListView recipes= {(searchedRecipes as any).documents} />) : position==='Table View' ?  ( <TableView  columns ={columns} data={(searchedRecipes as any).documents} /> ) :<GridRecipeList recipes = {(searchedRecipes as any).documents} />)
    }
  return (
      
    <p className='text-light-4 mt-10 text-center w-full'>No results found</p>
  )
}

export default SearchResults