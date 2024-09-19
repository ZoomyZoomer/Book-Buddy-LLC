import React from 'react'
import SearchBar from './SearchBar'
import { useState } from 'react';
import { ReactComponent as Logo } from '../logo.svg';

function MainContextHeader() {

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {

            if (searchQuery != ''){

            // Retrieve existing search history from local storage
            const existingSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
            
            // Add the new search query to the existing search history
            const updatedSearchHistory = [...existingSearchHistory, searchQuery];
            
            // Limit the search history to the last 5 entries
            const limitedSearchHistory = updatedSearchHistory.slice(-5);
            
            // Store the limited search history in local storage
            localStorage.setItem('searchHistory', JSON.stringify(limitedSearchHistory));

            setSearchQuery('');
            
            // Perform search logic...
            
        }
      };


  return (
    <div className="mainContentContainer">

        <div className="mainContentGrid">
            
            <div className="flexMiddle">
                <div style={{marginRight: '15px'}}>
                    <Logo /> 
                </div>
                <h1 style={{cursor: 'pointer'}}>
                    <green>BOOK</green> BUDDY
                </h1>
            </div>

            <div className="flexMiddle">
                <h4 style={{marginBottom: '0px'}}>
                    “You never really understand a person until you consider things from his point of view... Until you climb inside of his skin and walk around in it.” 
                </h4>
            </div>

            <div className="flexRight">
                <h5 style={{marginTop: '10px'}}>
                    ― Harper Lee, To Kill a Mockingbird
                </h5>
            </div>

            <div className="flexMiddle">
                <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} handleSearch={handleSearch} />
            </div>
            
        </div>
        
    </div>
  )
}

export default MainContextHeader