import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import { useEffect } from 'react';


const SearchBar = ({ value, onChange, handleSearch }) => {

    const [showHistory, setShowHistory] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);

    const handleSearchClick = () => {

        setShowHistory(false); // Hide search history when search is clicked
        handleSearch(); // Call the handleSearch function

    };

    const getSearchHistory = () => {

        const storedHistory = localStorage.getItem('searchHistory');

        if (storedHistory) {
          setSearchHistory(JSON.parse(storedHistory));
        }
        console.log('Updated history:', searchHistory);

    };

    const dropDown = () => {

        if (searchHistory.length != 0){
            document.getElementById("mainSearch").classList.add("noOutline");
            document.getElementById("mainSearch").classList.remove("searchBorderRadius");
        } else {
            document.getElementById("mainSearch").classList.add("noBoldBorder");
        }
        
        
        
        document.getElementById("mainSearch").classList.add("searchBoxShadow");

    }

    const closeDropDown = () => {


            setTimeout(() => {
                
                document.getElementById("mainSearch").classList.remove("noOutline");
                document.getElementById("mainSearch").classList.add("searchBorderRadius");
                document.getElementById("mainSearch").classList.remove("searchBoxShadow");
                document.getElementById("mainSearch").classList.remove("noBoldBorder");
                getSearchHistory();
                setShowHistory(false);
    
            }, 100);
            
    
 

    }

    const removeFromHistory = (index) => {

        const updatedHistory = [...searchHistory];
        updatedHistory.splice(index, 1);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
        setSearchHistory(updatedHistory);
        
        getSearchHistory();

    };

    useEffect(() => {

        getSearchHistory();

      }, []);


  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50%'}}>

        

        <div className="searchGrid">

            <div className="searchContainer">
                <input
                    id="mainSearch"
                    type="text"
                    className="searchBorderRadius"
                    placeholder="Find a book..."
                    value={value}
                    onChange={onChange}
                    onFocus={() => {setShowHistory(true); getSearchHistory(); dropDown();}} // Show search history on focus
                    onBlur={() => {closeDropDown();}} // Hide search history on blur
                    style={{height: '35px', borderWidth: '1px', paddingLeft: '50px', width: '100%'}}
                />

                <div onClick={handleSearchClick} className="searchCircle">
                    <svg 
                        className="svg" 
                        xmlns="http://www.w3.org/2000/svg" height="17" width="17" viewBox="0 0 512 512">
                        <path fill="#ffffff" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                    </svg>
                </div>
            </div>

            {showHistory && (
                <div className="searchHistory">

                        {searchHistory.slice(0, 5).map((query, index) => (

                            <div className={"flexLeft" + " " + "historyEntry"} key={index}>

                                <FontAwesomeIcon icon={faClockRotateLeft} color='gray' style={{margin: '10px'}}/>

                                <div className="historyEntry">{query}</div>

                                <div className="XHistory" onClick={() => removeFromHistory(index)}>
                                    <FontAwesomeIcon icon={faXmark} color='gray'/>
                                </div>
                                
                            </div>

                         ))} 

                </div>
            )}

        </div>

    </div>
  );
};

export default SearchBar;