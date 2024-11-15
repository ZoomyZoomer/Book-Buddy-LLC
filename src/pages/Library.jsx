import React, { useState, useEffect, useRef } from 'react'
import {ReactComponent as ChevronDown} from '../n-chevron-down.svg'
import {ReactComponent as ChevronDownBlack} from '../n-chevron-down-black.svg'
import {ReactComponent as Close} from '../n-close-filter.svg';
import {ReactComponent as Sort} from '../n-sort.svg'
import {ReactComponent as LastRead} from '../n-last-read.svg';
import {ReactComponent as Favorite} from '../n-favorite.svg';
import {ReactComponent as Completed} from '../n-completed.svg';
import {ReactComponent as Reading} from '../n-reading.svg'
import {ReactComponent as LibraryRight} from '../n-library-right.svg';
import {ReactComponent as Chart} from '../n-chart.svg';
import {ReactComponent as AddBook} from '../n-add-book.svg';
import {ReactComponent as Add} from '../n-add-circle.svg'
import '../library.css'
import LibraryBook from '../components/LibraryBook'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import GoalSectionItem from '../components/GoalSectionItem'
import BookBuddyNavbar from '../components/BookBuddyNavbar'
import LibraryGoal from '../components/LibraryGoal'
import ReadingEntryItem from '../components/ReadingEntryItem'

function Library() {

    const [searchBy, setSearchBy] = useState(false);
    const [text, setText] = useState('');
    const [showDropDown, setShowDropDown] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isAddingBook, setIsAddingBook] = useState(false);
    const [userCollection, setUserCollection] = useState([]);
    const [addingCollection, setAddingCollection] = useState([null, null, null, null]);
    const [dropFilter, setDropFilter] = useState('Last Read');
    const [updatedRating, setUpdatedRating] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [reFetchStickers, setReFetchStickers] = useState(false);
    const bottomRef = useRef(null);
    const divRef = useRef(null);
    const navigate = useNavigate('/');
    const tab = 'Favorites';


    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const response = await axios.get('/api/profile', {
              withCredentials: true,
            });
            setUserInfo(response.data.user);
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

      const [maxBooks, setMaxBooks] = useState(0);

      const fetchCollection = async () => {

        if (!isAddingBook){

          setUserCollection([null, null, null, null]);

          try {
            const response = await axios.get('/api/getBooksBySearch', {
              params: {
                username: userInfo.username,
                tab_name: tab,
                title: searchBy ? 'author' : 'title',
                search_query: text,
                filter: dropFilter
              },
            });

            setReFetchStickers(prev => !prev);
            setUserCollection(response.data[0]);
            setMaxBooks(response.data[1]);

          } catch (e) {
            console.error({ error: e });
          }

        }

      
      };

      const scrollToBottom = () => {
        bottomRef.current.scrollTo({
          top: bottomRef.current.scrollHeight,
          behavior: 'smooth'
        })
      }

      useEffect(() => {
        if (userInfo?.username) { // Ensure userInfo is not null
          fetchCollection();
        }
      }, [userInfo, text, updatedRating, dropFilter, isAddingBook]);


    const [expand, setExpand] = useState(false);
    const [texty, setTexty] = useState(false);

    const expandLibrary = () => {

    try {
      if (!expand){

        setTexty(false);

        const elem = document.getElementsByClassName('goals-section')[0];
        elem?.classList.remove('goals-section');
        elem?.classList.add('goals-section-hide');

        const elem2 = document.getElementsByClassName('library-section')[0];
        elem2?.classList.remove('library-section');
        elem2?.classList.add('library-section-expand');

        setTimeout(() => {
          const elem3 = document.getElementsByClassName('library-grid')[0];
          elem3?.classList.remove('library-grid');
          elem3?.classList.add('library-grid-expand');
        }, 400)

        setTimeout(() => {
          setExpand(prev => !prev);
        }, 699)

      } else {

        setExpand(prev => !prev);

        const elem = document.getElementsByClassName('goals-section-hide')[0];
        elem?.classList.remove('goals-section-hide');
        elem?.classList.add('goals-section');

        const elem2 = document.getElementsByClassName('library-section-expand')[0];
        elem2?.classList.remove('library-section-expand');
        elem2?.classList.add('library-section');

        setTimeout(() => {
          const elem3 = document.getElementsByClassName('library-grid-expand')[0];
          elem3?.classList.remove('library-grid-expand');
          elem3?.classList.add('library-grid');
          setTexty(true);
        }, 400)

      }

    } catch(e) {

    }


    }

    const [torch, setTorch] = useState(0);
    const audioRefTorch = useRef(null);
    const [miniFire, setMiniFire] = useState(false);

    const playAudioRefTorch = () => {
      audioRefTorch.current.volume = 0.1;
      audioRefTorch.current.play();
    };

    const callBooksApi = async() => {

        if (text == '') return;

        if (!searchBy) {
            const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${text}&maxResults=8&key=AIzaSyDdENboInmtpWIgPanFmuOOl4WtDzQZYyQ`, { withCredentials: false });
            setAddingCollection(res.data.items);
        }

        if (searchBy) {
            const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${text}&maxResults=8&key=AIzaSyDdENboInmtpWIgPanFmuOOl4WtDzQZYyQ`, { withCredentials: false });
            setAddingCollection(res.data.items);
        }

    }
    

    const handleKeyDown = (event) => {
        if ((event?.key === 'Enter') && (isAddingBook)) {
          callBooksApi();
        }
    };

    const [streakInfo, setStreakInfo] = useState([false,0, [[], []]]);
    const [streakClicked, setStreakClicked] = useState(false);

    const igniteStreak = async() => {

      try {

        await axios.post('/api/ignite-streak' , {
          username: userInfo.username
        });
        setStreakClicked(prev => !prev)
        playAudioRefTorch();

      } catch(e) {

      }

    }

    const fetchStreak = async() => {

      const res = await axios.get('/api/fetch-ignite-streak', {
        params: {
          username: userInfo.username
        }
      })

      setStreakInfo(res.data);

    }

    useEffect(() => {
      if (userInfo){
        fetchStreak();
      }
  
    }, [userInfo, streakClicked])

    useEffect(() => {
        if (!isAddingBook){
            setText('');
        }
    }, [isAddingBook])

    const [recentEntries, setRecentEntries] = useState([null, null, null]);
    const [ind, setInd] = useState(0);
    const [maxLen, setMaxLen] = useState(0);
    const [reFetchEntries, setReFetchEntries] = useState(false);
    const [threeEntries, setThreeEntries] = useState([null, null, null]);
    const [filter, setFilter] = useState('recent');
    const [filterQuery, setFilterQuery] = useState('');

    const fetchAllEntries = async() => {

      setThreeEntries([null, null, null]);
      setRecentEntries([null, null, null]);

      try {

        const res = await axios.get('/api/fetch-all-entries', {
          params: {
            username: userInfo.username,
            index: ind,
            filter: filter,
            filterQuery
          }
        })

        if (res.data[0].length > 0){
          setRecentEntries(res.data[0]);
        } else {
          setRecentEntries(["entry", "entry", "entry"]);
        }
        
        console.log(res.data[0]);
        setMaxLen(res.data[1]);


      } catch(e) {

      }

    }

    useEffect(() => {
      if (userInfo?.username){
        fetchAllEntries();
      }
    }, [userInfo, reFetchEntries, filter, filterQuery])

    useEffect(() => {
      setUserCollection([null, null, null, null])
    }, [isAddingBook])

    const lightTorch = async() => {

      try {

        await axios.post('/api/ignite-streak', {
          username: userInfo?.username
        })

        setTorch(prev => prev + 1);
        setMiniFire(true);
        playAudioRefTorch();
        setReFetchEntries(prev => !prev);

      } catch(e) {

      }


    }


    const [currency, setCurrency] = useState([0,0,0]);

    const fetchCurrency = async() => {

      try {

        const res = await axios.get('/api/fetch-currency', {
          params: {
            username: userInfo.username
          }
        })

        setCurrency(res.data);

      } catch(e) {
        console.error({error: e});
      }

    }

    const processNewDay = async() => {

      try {

        await axios.post('/api/process-new-day', {
          username: userInfo.username
        })

      } catch(e) {

      }

    }

    useEffect(() => {
      if (userInfo){
        fetchCurrency();
        processNewDay();
      }
    }, [userInfo])

    const [goals, setGoals] = useState([undefined, undefined]);

    const fetchGoals = async() => {

        const res = await axios.get('/api/fetch-goals', {
            params: {
                username: userInfo?.username
            }
        })

        setGoals(res.data);

    }

    useEffect(() => {
        if (userInfo){
            fetchGoals();
        }
    }, [userInfo])

    const sortArray = () => {
      setThreeEntries(recentEntries.slice(ind, parseInt(ind) + 3).slice(0, 3));
    }

    useEffect(() => {
      if (userInfo){
        sortArray();
      }
    }, [ind, recentEntries])


  return (
    <div className='library-container'>

        <audio ref={audioRefTorch} src="scribble.wav" preload="auto" />

      <div className='n-new-nav'>
        <div className='n-new-nav-l'>
        <div className='nn-item' onClick={() => navigate('/library')}><img src='/open_book.png' style={{height: '2.4rem', display: 'flex', marginBottom: '0.3rem'}}/></div>
          <div className='nn-item' onClick={() => navigate('/library')}>LIBRARY</div>
          <div className='nn-item' onClick={() => navigate('/storage')}>STORAGE</div>
          <div className='nn-item' onClick={() => navigate('/rewards')}>REWARDS</div>
        </div>
      </div>

        <div className='library-box'>

          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>

          <div className='n-library-left'>
            <div className='n-library-box-small'>

              <div className='n-streak-container'>
                <div className='n-streak-circle'>
                  <img src={`./${streakInfo[0] ? 'lighter_on' : 'lighter_off'}.png`} className='n-lighter-img'/>
                </div>
                <div className='n-lighter-info'>
                    <div className='n-lighter-title'>Reading Streak: <strong>{streakInfo[1]} days</strong></div>
                    <div>Make a flame everyday after reading a book and logging it!</div>
                    <button className={streakInfo[0] ? 'n-lighter-btn-null' : 'n-lighter-btn'} onClick={() => igniteStreak()}>{streakInfo[0] ? 'STREAK ACTIVE' : 'IGNITE'}</button>
                </div>
              </div>

              <div className='streak-tiny-circle1'/>
              <div className='streak-tiny-circle2'/>

            </div>

            <div className='n-library-box-sep' />

            <div className='n-library-box-med'>

              <div className='filter-list'>
                <div className='filter-num'><div className='filter-num-title'>Filter</div></div>
                <div className='filter-bar'/>
                <div className={filter != 'recent' ? 'filter-item' : 'filter-item-active'} onClick={() => filter !== 'recent' && setFilter('recent')}>Most Recent {filter == 'recent' && <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '-0.1rem'}}><Close /></div>}</div>
                <div className={filter != 'pages' ? 'filter-item' : 'filter-item-active'} onClick={() => filter !== 'pages' ? setFilter('pages') : setFilter('recent')}>Pages Read {filter == 'pages' && <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '-0.1rem'}}><Close /></div>}</div>
                <div className={filter != 'title' ? 'filter-item' : 'filter-item-active'} onClick={() => filter !== 'title' ? setFilter('title') : setFilter('recent')}>Title {filter == 'title' && <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '-0.1rem'}}><Close /></div>}</div>
              </div>

              <input 
                className='filter-search'
                placeholder='Search Entry Title...'
                value={filterQuery}
                onChange={(e) => {setFilterQuery(e.target.value); setInd(0)}}
              />

              <div className='n-reading-entry-box'>

                {threeEntries.map((entry, index) => (
                  <ReadingEntryItem index={index} entry={entry} username={userInfo?.username}/>
                ))}

                <div className='n-entry-dots-box'>
                  {maxLen >= 3 && (<div className={ind !== 0 ? 'n-dot-empty' : 'n-dot-full'} onClick={() => setInd(0)}/>)}
                  {maxLen >= 6 && (<div className={ind !== 3 ? 'n-dot-empty' : 'n-dot-full'} onClick={() => setInd(3)}/>)}
                  {maxLen >= 9 && (<div className={ind !== 6 ? 'n-dot-empty' : 'n-dot-full'} onClick={() => setInd(6)}/>)}
                  {maxLen >= 12 && (<div className={ind !== 9 ? 'n-dot-empty' : 'n-dot-full'} onClick={() => setInd(9)}/>)}
                </div>

              </div>

            </div>

          </div>

          <div className='n-library-sep'/>

          <div className='n-library-right' style={{justifyContent: 'center', alignItems: 'center'}}>
            <div className='n-library-main'>

                <div className='n-library-banner2'>
                  <div className='n-library-input-container'>
                    <input 
                      className='n-library-input'
                      placeholder={!isAddingBook ? `Search Books By ${!searchBy ? 'Title' : 'Author'}...` : `Add Books By ${!searchBy ? 'Title' : 'Author'}...`}
                      onChange={(e) => setText(e.target.value)}
                      value={text}
                      onKeyDown={handleKeyDown}
                    >
                    </input>
                    <div className='n-switch-container'>
                      <label class="switch">
                        <input type="checkbox" />
                        <span class="slider round" onClick={() => setSearchBy(prev => !prev)}/>
                      </label>
                    </div>
                  </div>
                  <div className='n-library-filter-box' onClick={() => setShowDropDown(prev => !prev)}>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>

                          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '0.625rem'}}>
                            <Sort />
                          </div>
                          {dropFilter}
                          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.2rem'}}>
                            <ChevronDownBlack />
                          </div>

                          {showDropDown && (
                          <div className='n-filter-dropdown-box'>

                            {dropFilter !== 'Last Read' && (
                              <div className='n-dropdown-filter-item' onClick={() => setDropFilter('Last Read')}>
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '0.2rem', marginLeft: '0.7rem'}}>
                                  <LastRead /> 
                                </div>
                                Last Read
                              </div>
                            )}

                            {dropFilter !== 'Completed' && (
                              <div className='n-dropdown-filter-item' onClick={() => setDropFilter('Completed')}>
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '0.2rem', marginLeft: '0.7rem'}}>
                                  <Completed /> 
                                </div>
                                Completed
                              </div>
                            )}

                            {dropFilter !== 'Reading' && (
                              <div className='n-dropdown-filter-item' onClick={() => setDropFilter('Reading')}>
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '0.2rem', marginLeft: '0.7rem'}}>
                                  <Reading /> 
                                </div>
                                Reading
                              </div>
                            )}

                            {dropFilter !== 'Favorites' && (
                              <div className='n-dropdown-filter-item' onClick={() => setDropFilter('Favorites')}>
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '0.2rem', marginLeft: '0.7rem'}}>
                                  <Favorite /> 
                                </div>
                                Favorites
                              </div>
                            )}
                              
                          </div>
                        )}

                        </div>

                  </div>
                </div>

                <div className='n-library-books-container' ref={bottomRef}>

                  <div className='n-library-options-nav'>
                        <div className='n-library-options-left'>
                          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'left'}}>
                            <div className='option-library'><div style={{display: 'flex', marginRight: '0.4rem'}}><LibraryRight /></div>{!isAddingBook ? 'Library' : 'Catalog'}</div>
                            <div className='option-showing'>Showing {!isAddingBook ? userCollection.length : (addingCollection[0] == null ? 0 : addingCollection.length)} of {!isAddingBook ? maxBooks : (addingCollection[0] == null ? 0 : addingCollection.length)} books</div>
                          </div>
                        </div>
                        <div className='n-library-options-right'>
                            <div className='option-right-item' onClick={() => {setIsAddingBook(prev => !prev); setAddingCollection([null, null, null, null])}}>{isAddingBook ? 'Return To Library' : 'Add Books'}<div style={{display: 'flex', marginLeft: '0.4rem'}}><AddBook /></div></div>
                            <div className='option-right-item'><Chart /></div>
                        </div>
                  </div>

                  {isAddingBook && text == '' && (
                        <div className='n-adding-info-box'>
                            <div className='library-book-circle-gray'>
                              <img style={{height: '6.5rem', width: '4.2rem', marginTop: '1rem', border: '1px solid #454b54'}} src='http://books.google.com/books/publisher/content?id=Z5nYDwAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE71w0_tgIHfDMwhEsvV-pEgZJhDOzyolKwNKjxdBne8QcH_cUZmfHby5Yem38_R8itwP5Oa0wKe2ygqV8APiUmP35Fpb568w3g-eGs5-5rc5zVgNLHRfTotPzpj7QrrfoYrtIp-9&source=gbs_api'/>
                            </div>
                            <div className='n-library-book-temp-info-grid'>
                              <div className='n-temp-0'> Search the Catalog for the Book of Your Interests Using the Search Bar Above </div>
                              <div className='n-temp-1'>Press ‘Enter’ to confirm your search!</div>
                              <button className='n-temp-2' onClick={() => {setIsAddingBook(false); setAddingCollection([null, null, null, null])}}>Back To My Library</button>
                            </div>
                            <img src='/eagle-i.png' style={{height: '4rem', position: 'absolute', right: '1.4rem', bottom: '1.4rem', transform: 'scaleX(-1)'}}/>
                            <div className='streak-tiny-circle2' style={{backgroundColor: '#D9D9D9'}}/>
                            <div className='streak-tiny-circle1' style={{backgroundColor: '#D9D9D9'}}/>
                        </div>
                    )}

                  <div className='n-library-books-grid'>
                    
                    {(!isAddingBook) && userCollection.map((book, index) => (
                      <LibraryBook book={book} isPreview={false} index={index} addingBook={false} username={userInfo?.username} volumeId={book?.volume_id}/>
                    ))}

                    {(!isAddingBook) && userCollection.length === 0 && (
                      <div className='library-book-container' onClick={() => setIsAddingBook(true)}>

                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>

                          <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                            <div className='library-book-circle'>
                              <div style={{height: 'fit-content', width: 'fit-content', position: 'absolute', top: '4%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <div style={{position: 'relative'}}>
                                  <img src={'http://books.google.com/books/publisher/content?id=Z5nYDwAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE71w0_tgIHfDMwhEsvV-pEgZJhDOzyolKwNKjxdBne8QcH_cUZmfHby5Yem38_R8itwP5Oa0wKe2ygqV8APiUmP35Fpb568w3g-eGs5-5rc5zVgNLHRfTotPzpj7QrrfoYrtIp-9&source=gbs_api'} className='library-cover'/>
                                </div>
                              </div>
                            </div>
                          </div>

                            <div className='library-book-info'>
                              <div className='library-book-title'>Blank Cover</div>
                              <div className='library-book-author'>Click to add your first book from a collection of thousands!</div>
                              <div className='n-add-to-library' onClick={() => setIsAddingBook(true)}><div style={{marginRight: '0.4rem', display: 'flex'}}><Add /></div> Add to Library</div>
                            </div>

                        </div>
                      </div>
                    )}

                    {isAddingBook && text != '' && addingCollection.map((book, index) => (
                      <LibraryBook book={book} isPreview={false} setIsAddingBook={setIsAddingBook} setAddingCollection={setAddingCollection} index={index} addingBook={false} username={userInfo?.username} volumeId={book?.volume_id}/>
                    ))}

                  </div>
                </div>

                <div className='n-library-chevron'>
                  {(userCollection.length > 4 && !isAddingBook) && (
                    <div className='n-library-chevron-circle' onClick={() => scrollToBottom()}>
                      <ChevronDown />
                    </div>
                  )}
                    
                </div>

            </div>

          </div>

          </div>

        </div>

    </div>
  )
}

export default Library