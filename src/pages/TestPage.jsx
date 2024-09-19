import React from 'react'
import '../teststyles.css'
import { useState } from 'react';
import {ReactComponent as Search} from '../search.svg'
import {ReactComponent as QuestionMark} from '../questionMark.svg'
import {ReactComponent as Sort} from '../sort.svg'

function TestPage() {

    const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bookshelf_container">
      
      <div className="stats_section">
        <div className="stats_navBar">

        </div>
      </div>

      <div className="book_section">
        <div className="bookshelf_navBar">

          <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
            <div className="search_container">
              <input 
                className="searchbar" 
                type="search" 
                onChange={(e) => setSearchQuery(e.target.value)}>
              </input>
              <div className="search_icon">
                <Search />
              </div>
              <div className="questionMark_button">
                <QuestionMark />
              </div>
            </div>
          </div>

          <div className="sort_container">
            <div>
              SORT
            </div>
            <div className="sort_button">
              <Sort />
            </div>
          </div>

        </div>

        <div className="books_container">
          <div style={{height: '100%', backgroundColor: 'blue'}}>
            BASED
          </div>
        </div>

      </div>

    </div>
  )
}

export default TestPage