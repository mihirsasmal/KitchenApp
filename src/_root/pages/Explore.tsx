import React, { useState } from 'react'

const Explore = () => {
  //const {searchValue, setSearchValue} = useState('');
  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className = 'h3-bold md:h2-bold w-full'> Search Recipes</h2>
        <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-4'>
          <img 
           src = '/assets/icons/search.svg'
            width ={24}
            height = {24}
            alt = 'search' />
            <input 
            type = 'text'
            placeholder='search'
            className='explore-search w-full'
            />
          </div></div>
          <div className='flex-between w-full max-w-5xl mt'></div>
          Explore</div>
  )
}

export default Explore