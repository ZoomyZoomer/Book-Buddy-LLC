import React from 'react'
import { ReactComponent as Search } from '../searchglass.svg';
import { ReactComponent as QuestionMark } from '../questionMark.svg';

const BookshelfSearch = ({value, onChange, handleSearch}) => {
  return (
    <div style={{position: 'relative'}}>
        
        <div className="flexMiddle">
            <input
                type="text"
                placeholder="Find a book..."
                className="bookshelfSearch"
                value={value}
                onChange={onChange}
            
            />
            <div className={"flexMiddle" + " " + "infoIcon"}>
                <QuestionMark />
            </div>
        </div>
        <div onClick={handleSearch} className="searchIcon" style={{position: 'absolute', top: '-1px', left: '0'}}>
            <Search />
        </div>

    </div>
  )
}

export default BookshelfSearch