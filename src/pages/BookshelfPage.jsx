import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import '../bookshelf_styles.css';
import '../customize_styles.css';
import {ReactComponent as Search} from '../search.svg'
import {ReactComponent as BookLogo} from '../book_logo.svg'
import {ReactComponent as QuestionMark} from '../questionMark.svg'
import {ReactComponent as AddBook} from '../addBook.svg'
import {ReactComponent as Sort} from '../sort.svg'
import {ReactComponent as Triangle} from '../triangle-down.svg'
import {ReactComponent as Checkmark} from '../checky.svg'
import {ReactComponent as Close} from '../close_icon.svg'
import {ReactComponent as Plus} from '../add-book-plus.svg'
import {ReactComponent as Reading} from '../reading_large.svg'
import {ReactComponent as ReadingActive} from '../reading_large_active.svg'
import {ReactComponent as Completed} from '../completed_large.svg'
import {ReactComponent as CompletedActive} from '../completed_large_active.svg'
import {ReactComponent as TriangleDown} from '../triangle-down.svg'
import {ReactComponent as Refresh} from '../refresh-quote.svg'
import {ReactComponent as Favorite} from '../heart-circle-large.svg'
import {ReactComponent as FavoriteActive} from '../heart-circle-active.svg'
import {ReactComponent as Swap} from '../swap.svg'
import LineGraph from '../components/LineGraph';
import DonutChart_small from '../components/DonutChart_small';
import FolderTab from '../components/FolderTab';
import BookItem from '../components/BookItem';
import axios from 'axios';
import Customize from '../components/Customize';
import StartCollection from '../components/StartCollection';
import CustomizePopup from '../components/CustomizePopup';
import BookItemAdd from '../components/BookItemAdd';


const BookshelfPage = ({key, remountComponent}) => {

  const [activeTab, setActiveTab] = useState(0);
  const [userCollection, setUserCollection] = useState([]);
  const [searchCollection, setSearchCollection] = useState([])
  const [userInfo, setUserInfo] = useState({});
  const [isProfileFetched, setIsProfileFetched] = useState(false);
  const [tab, setTab] = useState(null);
  const [dropdownID, setDropdownID] = useState('');
  const change = useRef(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [booksBySearch, setBooksBySearch] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopup, setIsPopup] = useState(false);   
  const [invalidQueries, setInvalidQueries] = useState(false);
  const [isSearchingTitle, setIsSearchingTitle] = useState(true);
  const [dropDownItem, setDropDownItem] = useState('Last read');
  const [showDropDown, setShowDropDown] = useState(false);
  const [searchQueryL, setSearchQueryL] = useState(0);
  const [favoriteChanged, setFavoriteChanged] = useState(false);
  const [tabChanged, setTabChanged] = useState(false);

  const [readingHover, setReadingHover] = useState(false);
  const [completedHover, setCompletedHover] = useState(false);
  const [favoriteHover, setFavoriteHover] = useState(false);

  const [remount, setRemount] = useState(false);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [currentReading, setCurrentReading] = useState(false);

  const [activeReading, setActiveReading] = useState(false);
const [activeCompleted, setActiveCompleted] = useState(false);
const [activeFavorite, setActiveFavorite] = useState(false);

  const searchRef = useRef(false);
  const customizeRef = useRef({});
  
  let mutex = 0;
  
  const navigate = useNavigate('/');

  const temp = "Favorites";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:4000/profile', {
          withCredentials: true,
        });
        setUserInfo(response.data.user);
        setIsProfileFetched(true); // Set the state to true after fetching the profile
      } catch (error) {
        // Check if error response status is 401
        if (error.response && error.response.status === 401) {
          // Navigate to the sign-in page
          navigate('/signin');
        } else {
          // Handle other errors
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfile();
  }, []);

  const [updateRating, setUpdateRating] = useState(false);

  useEffect(() => {
    if (isProfileFetched && userInfo) { // Ensure userInfo is not null
      const fetchCollection = async () => {
        try {
          const response = await axios.get('http://localhost:4000/getBooksBySearch', {
            params: {
              username: userInfo.username,
              tab_name: tab,
              title: isSearchingTitle ? 'title' : 'author',
              search_query: searchQuery,
              filter: 'Last read'
            },
          });
          setUserCollection(response.data);
          console.log(response.data);

        } catch (e) {
          console.error({ error: e });
        }
      };

      fetchCollection();
    }
  }, [isProfileFetched, tab, updateRating]);

  const [quote, setQuote] = useState('');

  const fetchQuote = async(title) => {

    try {

      const res = await axios.post('http://localhost:4000/openai-quote', {
        question: `What is a signficant quote from the book ${title}?`,
        title
    })

    setQuote(res.data);

    } catch(e) {
      console.log({error: e});
    }

  }


  const handleLeftClick = (e) => {

    if (e.button === 0){
      
 

        const openOptions = document.getElementsByClassName('book_options_open');
        const zIndex = document.getElementsByClassName('z-index');
        

        if (change.current == true){
          setTimeout(() => {
            openOptions[0]?.classList?.remove('book_options_open');
            const openDropdown = document.getElementsByClassName('book_options_dropdown_active');
            openDropdown[0]?.classList?.add('book_options_dropdown_unactive');
            openDropdown[0]?.classList?.remove('book_options_dropdown_active');
            zIndex[0]?.classList.remove("z-index");
            setActiveDropdown(false);
            change.current = false;
          }, 200);
        }

        if (openOptions.length != 0){
          change.current = true;
        }


    }

  }

  const [isEnter, setIsEnter] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (isAddingBook) {
                if (searchQuery.trim().length !== 0) {
                    if (isSearchingTitle) {
                      axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${searchQuery}&maxResults=6&key=AIzaSyDdENboInmtpWIgPanFmuOOl4WtDzQZYyQ`, { withCredentials: false })
                            .then(res => {
                                console.log(res.data);
                                setSearchCollection(res.data.items);
                            });
                    } else {
                      axios.get(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${searchQuery}&maxResults=6&key=AIzaSyDdENboInmtpWIgPanFmuOOl4WtDzQZYyQ`, { withCredentials: false })
                            .then(res => {
                                console.log(res.data);
                                setSearchCollection(res.data.items);
                            });
                    }
                } else {
                    setSearchCollection([]);
                }
            }
        }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listener on component unmount
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
}, [isAddingBook, isSearchingTitle, searchQuery]);

  const addBookSearch = (query) => {

      setSearchQuery(query);

  }

  const [bookCount, setBookCount] = useState([0,0,0]);
  const [pageInfo, setPageInfo] = useState([0,0]);

  const countBooks = async() => {


    try {

      const res = await axios.get('http://localhost:4000/getCount', {
        params: {
          username: userInfo.username,
          tab_name: tab
        }
      })

      setBookCount(res.data);

      const res2 = await axios.get('http://localhost:4000/pageInfo', {
        params: {
          username: userInfo.username,
          tab_name: tab
        }
      })

      setPageInfo(res2.data);

    } catch(e){
      console.error({error: e});
    }

  }

  useEffect(() => {

    if (userInfo.username !== undefined && tab !== null){
      countBooks();
    }

  }, [isAddingBook, favoriteChanged, userInfo, tab])

  const callFilter = async(filter, query) => {

    if (!isAddingBook){
      setSearchQuery(query);

      const res = await axios.get('http://localhost:4000/getBooksBySearch', {
        params: {
          username: userInfo.username,
          tab_name: tab,
          title: isSearchingTitle ? 'title' : 'author',
          search_query: query,
          filter
        }
      })

      setUserCollection(res.data);

    }

  }

  const [currReading, setCurrReading] = useState([]);
  const [currReadingColor, setCurrReadingColor] = useState(undefined);
  const [currReadingData, setCurrReadingData] = useState([]);
  const [currReadingTime, setCurrReadingTime] = useState([]);
  const [tabList, setTabList] = useState(['', '', '', '']);
  const currRef = useRef(false);

  const fetchTabNames = async() => {

    try {

      const res = await axios.get('http://localhost:4000/fetchTabs', {
        params: {
          username: userInfo.username
        }
      })

      if (tab === null){
        setTab(res.data[0]);
      }

      setTabList(res.data);
      console.log(res.data);

    } catch(e){
      console.error({error: e});
    }

  }

  useEffect(() => {
    if (userInfo.username !== undefined){
      fetchTabNames();
    }
  }, [userInfo, tabChanged])

  const fetchCurrentlyReading = async() => {

    try {

      const res = await axios.get('http://localhost:4000/getBooksBySearch', {
        params: {
          username: userInfo.username,
          tab_name: tab,
          title: 'none',
          search_query: '',
          filter: 'Last read'
        }
      })

      const filtered = res.data.filter(book => book.pages_read / book.total_pages !== 1);


      if (filtered.length > 0){

        setCurrReading(filtered[0]);
        fetchQuote(filtered[0].title);

        if (!currRef.current){
          currRef.current = true;
          setCurrReadingData([0]);
          setCurrReadingTime([0]);
          
            filtered[0].page_entries.map((entry, index) => {
            setCurrReadingData(prev => [...prev, entry.pages_added]);
            setCurrReadingTime(prev => [...prev, `${entry.date.month} ${entry.date.day}`]);
          })

        }

        
        const res2 = await axios.get('http://localhost:4000/getGenreColor', {
          params: {
            username: userInfo.username,
            genre: filtered[0].genre
          }
        })

        setCurrReadingColor(res2.data.color);

      } else {
        setCurrReadingData([0]);
        setCurrReadingTime([0]);
        setCurrReading({pages_read: 0, total_pages: 1});
      }

      console.log(res.data);


    } catch(e) {
      console.log({error: e});
    }

  }

  

  useEffect(() => {

    document.addEventListener('mousedown', (e) => handleLeftClick(e));

  }, [])

  const [lineGraphData, setLineGraphData] = useState([]);

  const fetchLineGraph = async() => {

    try {

      const res = await axios.get('http://localhost:4000/fetch-library-data', {
        params: {
          username: userInfo.username,
          tab_name: tab
        }
      })

      setLineGraphData(res.data);

    } catch(e){
      console.error({error: e});
    }

  }

  useEffect(() => {

    const handleClick = (event) => {
      if (event.target.id !== 'sort'){
        setTimeout(() => {
          setShowDropDown(false);
        }, 16)
      }
    };

    document.addEventListener('click', handleClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);


  useEffect(() => {
    if (userInfo.username !== undefined){
      currRef.current = false;
      fetchCurrentlyReading();
      fetchLineGraph();
    }
  }, [userInfo, currentReading, tab])


  const [customizePopup, setCustomizePopup] = useState(false);
  const [stickerChanged, setStickerChanged] = useState(false);

  const addBookRef = useRef(false);

  useEffect(() => {
    if (!isAddingBook && userInfo.username !== undefined && !addBookRef.current){
      addBookRef.current = true;
      callFilter('Last read', '');

    }
  }, [isAddingBook])

  function lightenColor(color, percent) {
    // Extract the RGB values
    const num = parseInt(color?.slice(1), 16);
    let r = (num >> 16) + Math.round(255 * percent);
    let g = ((num >> 8) & 0x00FF) + Math.round(255 * percent);
    let b = (num & 0x0000FF) + Math.round(255 * percent);

    // Ensure values are within the 0-255 range
    r = Math.min(255, r);
    g = Math.min(255, g);
    b = Math.min(255, b);

    // Convert back to hex
    const newColor = (r << 16) | (g << 8) | b;
    return `#${newColor.toString(16).padStart(6, '0')}`;
  }


  return (

    <div className='bokshelf-wrapper'>
      {customizePopup && <CustomizePopup customizeRef={customizeRef.current} tab_name={tab} username={userInfo.username} setCustomizePopup={setCustomizePopup} setStickerChanged={setStickerChanged}/>}
      <section className={'book-details-navbar' + " " + "book-details-navbar-default"}>
        <div className='navbar-logo' onClick={() => navigate('/')}>
          <div>
            <BookLogo />
          </div>
          <div className='logo-0'>
            Book
          </div>
          <div className='logo-1'>
            Buddy
          </div>
        </div>
        <div className='navbar-options'>
          <div className='navbar-item' style={{marginLeft: '0.7rem'}} onClick={() => navigate('/bookshelf')}>
            Library
          </div>
          <div className='navbar-item'>
            Rewards
          </div>
          <div className='navbar-item' onClick={() => navigate('/storage')}>
            Storage
          </div>
        </div>
      </section>
    <div className={customizePopup ? "bookshelf_container" + ' ' + 'popup-filter2' : "bookshelf_container"}>
      

      <section id="stats_section" className="stats_section">
        <div className='stats-navbar'></div>
        <div className='stats-container'>

          <div className='stats-sub-container'>
            <div className='current-reading'>
            <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', fontWeight: '600'}}>Book Distribution</div>
            </div>
            <div className='r-c-section'>

              <div className={!activeReading ? 'r-c-box-reading' : 'r-c-box-reading-active'} onMouseEnter={() => setReadingHover(true)} onMouseLeave={() => setReadingHover(false)} onClick={() => {setActiveReading(prev => !prev); setActiveCompleted(false); setActiveFavorite(false); !activeReading ? callFilter('Reading', searchQuery) && setDropDownItem('Reading') : callFilter('Last read', searchQuery) && setDropDownItem('Last read')}}>

                <div className='r-c-0'>
                  {!readingHover && !activeReading ? <Reading /> : <ReadingActive />}
                  <div className='r-c-2'>{bookCount[1]}</div>
                  <div style={{fontSize: '0.625rem'}}>Reading</div>
                </div>

              </div>

              <div className={!activeCompleted ? 'r-c-box-completed' : 'r-c-box-completed-active'} style={{marginLeft: '9%'}} onMouseEnter={() => setCompletedHover(true)} onMouseLeave={() => setCompletedHover(false)} onClick={() => {setActiveCompleted(prev => !prev); setActiveReading(false); setActiveFavorite(false); !activeCompleted ? callFilter('Completed', searchQuery) && setDropDownItem('Completed') : callFilter('Last read', searchQuery) && setDropDownItem('Last read')}}>

                <div className='r-c-0'>{!completedHover && !activeCompleted ? <Completed /> : <CompletedActive />}
                  <div className='r-c-2'>{bookCount[0]}</div>
                  <div style={{fontSize: '0.625rem'}}>Completed</div>
                </div>

              </div>

              <div className={!activeFavorite ? 'r-c-box-planned' : 'r-c-box-favorite-active'} style={{marginLeft: '9%'}} onMouseEnter={() => setFavoriteHover(true)} onMouseLeave={() => setFavoriteHover(false)} onClick={() => {setActiveFavorite(prev => !prev); setActiveReading(false); setActiveCompleted(false); !activeFavorite ? callFilter('Favorites', searchQuery) && setDropDownItem('Favorites') : callFilter('Last read', searchQuery) && setDropDownItem('Last read')}}>

                <div className='r-c-0'>{!favoriteHover && !activeFavorite ? <Favorite /> : <FavoriteActive />}
                  <div className='r-c-2'>{bookCount[2]}</div>
                  <div style={{fontSize: '0.625rem'}}>Favorites</div>
                </div>

              </div>

            </div>

            <div className='current-reading'>
              <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', fontWeight: '600'}}>{currentReading ? 'Currently Reading' : 'Library Overview'} <div className='refresh-quote' style={{display: 'flex', justifyContent: 'left', alignItems: 'center', marginLeft: '2%'}} onClick={() => setCurrentReading(prev => !prev)}><Swap /></div></div>
                <div className='current-reading-box'>
                  <div className='d-chart-cont'>
                    {currentReading ? (
                      <DonutChart_small value={Math.floor(currReading.pages_read / currReading.total_pages* 100)}/>
                    ): (
                      <DonutChart_small value={Math.floor(pageInfo[0] / pageInfo[1] * 100)}/>
                    )}
                    
                    <div className='d-chart-abs'>
                      {currentReading ? (
                        <>
                          <div>{Math.floor(currReading.pages_read / currReading.total_pages* 100)}%</div>
                          <div className='d-chart-tiny'>{`${currReading.pages_read }/${currReading.total_pages}`}</div>
                        </>
                      ): (
                        <>
                          <div>{Math.floor(pageInfo[0] / pageInfo[1] * 100)}%</div>
                          <div className='d-chart-tiny'>{`${pageInfo[0]}/${pageInfo[1]}`}</div>
                        </>
                      )}
                      
                    </div>
                  </div>
                  <div className='current-reading-text'>
                    {currentReading ? (
                      <>
                      <div className='cr-t0'>{currReading?.title}</div>
                      <div className='cr-t1'>{currReading?.author}</div>
                      <div className="genre_tag" style={{marginTop: '0.8rem', backgroundColor: lightenColor(currReadingColor, 0.28)}} >
                        <div className="genre_circle" style={{backgroundColor: currReadingColor}}/>
                        <div className="genre_text" style={{color: currReadingColor}}>
                            {currReading.genre}
                        </div>
                      </div>
                      </>
                    ) : 
                    <>
                    <div className='cr-t0'>Total pages of your Library's books read</div>
                      <div className='cr-t1'>Various authors</div>
                      <div className="genre_tag" style={{marginTop: '0.8rem', backgroundColor: lightenColor(currReadingColor, 0.28)}} >
                        <div className="genre_circle" style={{backgroundColor: currReadingColor}}/>
                        <div className="genre_text" style={{color: currReadingColor}}>
                            Various genres
                        </div>
                      </div>
                    </>}
                    
                  </div>
              </div>
            </div>

            <div className='quote-container'>
              <div className='q-0'>
                <div>Book Quote</div>
                <div className='refresh-quote' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={() => fetchQuote(currReading.title)}><Refresh /></div>
              </div>
              <div className='quote-flex'>
                <div className='quote-bar' style={{backgroundColor: currReadingColor}}/>
                <div className='quote'>{quote}</div>
              </div>
            </div>

          {currReadingData.length > 0 && (
            <div className='line-graph-container' style={{marginTop: '1rem', display: 'flex', justifyContent: 'left', alignItems: 'center', flexDirection: 'column'}}>
              <div className='legend-stats'>{currentReading ? 'Statistics' : 'Library Statistics'}</div>
              {currentReading ? (
                <LineGraph reading_data={currReadingData} time={currReadingTime}/>
              ): (
                <LineGraph reading_data={lineGraphData[1]} time={lineGraphData[0]}/>
              )}
              
              <div className='legend-container'>
                <div className='legend-key'/>
                <div className='legend-title'>{currentReading ? `${currReading.title} pages read` : 'Library total pages read'}</div>
              </div>
            </div>
          )}
            

          </div>

        </div>
      </section>


        <section id="book_section" className="book_section">
        <div className="tab_section">
          <div onClick={() => {mutex = 0; setActiveTab(0); setTab(tabList[0])}}>
            <FolderTab text={tabList[0]} tab_id={0} active={activeTab} username={userInfo.username} setTabChanged={setTabChanged}/>
          </div>
          <div onClick={() => {mutex = 0; setActiveTab(1); setTab(tabList[1])}}>
            <FolderTab text={tabList[1]} tab_id={1} active={activeTab} username={userInfo.username} setTabChanged={setTabChanged}/>
          </div>
          <div onClick={() => {mutex = 0; setActiveTab(2); setTab(tabList[2])}}>
            <FolderTab text={tabList[2]} tab_id={2} active={activeTab} username={userInfo.username} setTabChanged={setTabChanged}/>
          </div>
          <div onClick={() => {mutex = 0; setActiveTab(3); setTab(tabList[3])}}>
            <FolderTab text={tabList[3]} tab_id={3} active={activeTab} username={userInfo.username} setTabChanged={setTabChanged}/>
          </div>
  
        </div>
        <div className="bookshelf_navBar" style={{height: isAddingBook ? '9%' : '8.2%'}}>

        <div className='searchy-container'>
          <div className='bookshelf-add-book' onClick={() => setIsAddingBook(true)}><Plus /></div>
          <div className='other-cont'>
            <input
              className='bookshelf-searchy'
              type="search" 
              onChange={(e) => {setSearchQuery(e.target.value); callFilter(dropDownItem, e.target.value); addBookSearch(e.target.value)}}
              placeholder={isSearchingTitle ? 'Search by title' : 'Search by author'}
              value={searchQuery}
            />
            <div class="theme-switch-container"> 
                <label class="theme-slider" for="checkbox"> 
                    <input type="checkbox" id="checkbox" onChange={() => {searchRef.current = false; setIsSearchingTitle(prev => !prev)}} defaultChecked /> 
                    <div class="round slider"></div> 
                </label> 
            </div>
            {isSearching && <div className='searchy-close' onClick={() => {setSearchQuery('')}}><Close /></div>}
          </div>
            
            
        </div>

        
            <div id='sort' className='sort-container'>
              <div id='sort' className={!showDropDown ? 'sort-box' : 'sort-box-active'} onClick={() => setShowDropDown(true)}>
                <div id='sort' className='sort'>
                  <Sort />
                </div>
                <div id='sort' className='sort-name'>
                  {dropDownItem}
                </div>
                <div id='sort' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <Triangle />
                </div>
              { showDropDown && (
                <div className='sort-dropdown-container'>
                  <div className={dropDownItem === 'Last read' ? 'sort-item-active' : 'sort-item'} onClick={() => {callFilter('Last read', searchQuery); setDropDownItem('Last read')}}>Last read {dropDownItem === 'Last read' ? <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '1rem'}}><Checkmark /></div> : <></>}</div>
                  <div className={dropDownItem === 'Completed' ? 'sort-item-active' : 'sort-item'} onClick={() => {callFilter('Completed', searchQuery); setDropDownItem('Completed')}}>Completed {dropDownItem === 'Completed' ? <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '1rem'}}><Checkmark /></div> : <></>}</div>
                  <div className={dropDownItem === 'Reading' ? 'sort-item-active' : 'sort-item'} onClick={() => {callFilter('Reading', searchQuery); setDropDownItem('Reading')}}>Reading {dropDownItem === 'Reading' ? <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '1rem'}}><Checkmark /></div> : <></>}</div>
                  <div className={dropDownItem === 'Favorites' ? 'sort-item-active' : 'sort-item'} onClick={() => {callFilter('Favorites', searchQuery); setDropDownItem('Favorites')}}>Favorites {dropDownItem === 'Favorites' ? <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '1rem'}}><Checkmark /></div> : <></>}</div>
                </div>
               )}

              </div>
            </div>
           
          

        </div>



        <div id="books_container" className="books_container" style={{paddingTop: isAddingBook ? '6rem' : '1rem'}}>

        {isAddingBook && (
          <div className='curr-adding-container'>
            <div className='curr-adding-flex'>
              <div className='curr-adding'>
                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>Currently adding books to &nbsp; <div className='adding-tab'>{tab}</div></div>
                
                <div className='cr'>You can not customize books in this mode</div>
              </div>
              <button className='cr-2' onClick={() => {setIsAddingBook(false); setSearchCollection([]); setSearchQuery(''); callFilter(dropDownItem, '')}}>Back to Library</button>
            </div>
            
          </div>
        )}
        
        
        {isAddingBook && searchCollection.map((book, index) => (
          <BookItemAdd
            book={book}
            tab_name={tab}
            index={index}
            username={userInfo.username}
            setIsAddingBook={setIsAddingBook}
            addBookRef={addBookRef}
            setSearchCollection={setSearchCollection}
          />
        ))}

        {!isAddingBook && userCollection.length === 0 && searchQuery.length === 0 ? (<StartCollection tab={tab} setIsAddingBook={setIsAddingBook}/>) : <></>}

        {userCollection.length === 0 && searchQuery.length > 0 && searchCollection.length === 0 && !isAddingBook ? (
          <div className="no_books_error">
            <div className="no_books_grid">
              <div className="no_books_header">
                  Oops...
              </div>
              <div className="no_books_subheader">
                No books found.
              </div>
              <div className="no_books_smallheader">
                We couldn't find what you're looking for T_T
              </div>
            </div>
            <img className="kitty_think" src="kitty_think.png" draggable="false"/>
          </div>
        ) : <></>}

        {!isAddingBook && userCollection.map((book, index) => (
          <BookItem 
            book={book}
            index={index}
            volume_id={book.volume_id}
            tab_name={tab}
            setCustomizePopup={setCustomizePopup}
            customizeRef={customizeRef}
            setActiveDropdown={setActiveDropdown}
            activeDropdown={activeDropdown}
            username={userInfo.username}
            searchQuery={searchQuery}
            stickerChanged={stickerChanged}
            remountComponent={remountComponent}
            setFavoriteChanged={setFavoriteChanged}
          />
        ))}
        


        </div>

        </section>

      

    </div>
    </div>
  )
}

export default BookshelfPage