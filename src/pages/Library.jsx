import React, { useState, useEffect, useRef } from 'react'
import {ReactComponent as Sort} from '../library-sort.svg'
import {ReactComponent as Arrow} from '../library-arrow.svg'
import {ReactComponent as Refresh} from '../library-refresh.svg'
import {ReactComponent as Bookmark} from '../library-bookmark.svg'
import {ReactComponent as Reading} from '../library-reading.svg'
import {ReactComponent as Favorite} from '../library-heart.svg'
import {ReactComponent as Plus} from '../library-plus.svg'
import {ReactComponent as Expand} from '../library-expand.svg'
import {ReactComponent as Settings} from '../library-settings.svg'
import {ReactComponent as Arrow2} from '../pointer-arrow.svg'
import {ReactComponent as ArrowRight} from '../arrow_right.svg'
import '../library.css'
import LibraryBook from '../components/LibraryBook'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import GoalSectionItem from '../components/GoalSectionItem'
import BookBuddyNavbar from '../components/BookBuddyNavbar'

function Library() {

    const [searchBy, setSearchBy] = useState(false);
    const [text, setText] = useState('');
    const [showDropDown, setShowDropDown] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isAddingBook, setIsAddingBook] = useState(false);
    const [userCollection, setUserCollection] = useState([]);
    const [addingCollection, setAddingCollection] = useState([]);
    const [dropFilter, setDropFilter] = useState('Last Read');
    const [updatedRating, setUpdatedRating] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [reFetchStickers, setReFetchStickers] = useState(false);
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

      const fetchCollection = async () => {
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
          setUserCollection(response.data);

        } catch (e) {
          console.error({ error: e });
        }
      };

      useEffect(() => {
        if (userInfo?.username) { // Ensure userInfo is not null
          fetchCollection();
        }
      }, [userInfo, text, updatedRating, dropFilter]);

    useEffect(() => {
        const handleClick = (event) => {
          // Check if the click was a left-click (event.button === 0)
          if ((event.button === 0) && (event.target.id !== 'library-sort')) {
            
            setTimeout(() => {
                setShowDropDown(false);
            }, 15)
            // You can handle the click event here
          }
        };
    
        // Add the event listener to the document
        document.addEventListener('click', handleClick);
    
        // Cleanup the event listener on component unmount
        return () => {
          document.removeEventListener('click', handleClick);
        };
    }, []);

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
        if ((event.key === 'Enter') && (isAddingBook)) {
          callBooksApi();
        }
    };

    useEffect(() => {
        if (!isAddingBook){
            setText('');
        }
    }, [isAddingBook])

    const [recentEntries, setRecentEntries] = useState([]);
    const [ind, setInd] = useState(0);
    const [maxLen, setMaxLen] = useState(0);
    const [reFetchEntries, setReFetchEntries] = useState(false);
    const [streakInfo, setStreakInfo] = useState(undefined);

    const fetchAllEntries = async() => {

      try {

        const res = await axios.get('/api/fetch-all-entries', {
          params: {
            username: userInfo.username,
            index: ind
          }
        })

        setRecentEntries(res.data[0]);
        setMaxLen(res.data[1]);
        setStreakInfo(res.data[2]);


      } catch(e) {

      }

    }

    useEffect(() => {
      if (userInfo?.username){
        fetchAllEntries();
      }
    }, [userInfo, ind, reFetchEntries])

    const [torch, setTorch] = useState(0);
    const audioRefTorch = useRef(null);
    const [miniFire, setMiniFire] = useState(false);

    const playAudioRefTorch = () => {
      audioRefTorch.current.volume = 0.1;
      audioRefTorch.current.play();
    };

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

    useEffect(() => {
      if (userInfo){
        fetchCurrency();
      }
    }, [userInfo])



  return (
    <div className='library-container'>


        <div style={{width: '72%', marginBottom: '1rem'}}>
          <BookBuddyNavbar tab={0} currency={currency}/>
        </div>
      
        <div className='library-box'>
          
          <audio ref={audioRefTorch} src="/torch.wav" />

 

            
              <div className='goals-section'>
   
              
                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '90%'}}>
                  <div className='goal-table-main'>
                    <div className='reading-goal-table-title'>
                          <div style={{fontSize: '1.2rem', color: '#06AB78'}}>Recent Reading Entries</div>
                    </div>
                    <div style={{fontSize: '0.8125em', color: '#9D9D9D'}}>Claim a random file for each entry!</div>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '1rem'}}>
                    <div className='goal-arrow' style={{transform: 'scaleX(-1)'}} onClick={() => setInd(prev => (ind - 4) + 1 < 0 ? 0 : prev -4)}><ArrowRight /></div>
                    <div>{(ind / 4) + 1}/{Math.ceil(maxLen / 4) < 1 ? 1 : Math.ceil(maxLen / 4)}</div>
                    <div className='goal-arrow' onClick={() => setInd(prev => (ind + 4) >= maxLen ? prev : prev + 4)}><ArrowRight /></div>
                  </div>
                </div>
             
                
                
                  <div className='goals-section-container'>

                  <div className='recent-entries-container'>

                      <div className='goal-sec-grid0'>

                        <div className='goal-sec-flex'>
                          {recentEntries.map((entry, index) => (
                            <GoalSectionItem entry={entry} index={index} username={userInfo?.username} setReFetchEntries={setReFetchEntries}/>
                          ))}
                        </div>

                    </div>

                  </div>

                </div>
               
              
              
                  <div className='streak-sec-box'>

                  <div className='streak-sec-container'>
                    
                    <div className='streak-box-omega'>

                      <div className='streak-fire-circle'>
                        <img src={`/${streakInfo?.is_claimed ? 'lighter_on' : 'lighter_off'}.png`} className='fire-icon'/>
                      </div>

                      <div className='streak-fire-info'>
                          <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                            <div className='rs-0'>Reading streak:&nbsp;</div>
                            <div className='rs-1'>{streakInfo ? streakInfo.streak : 0} days</div>
                          </div>
                          <div className='rs-2'>{`Create a reading entry once a day to maintain your streak! (Rewards coming soon)`}</div>
                      </div>

                    </div>

                    <div className='streak-btnxD'>
                      <div className='prog-0'>{`Progress Today (${streakInfo ? (streakInfo.is_claimed ? 1 : 0) : 0}/1)`}</div>
                      <div style={{width: '65%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '10'}}>
                        <button className={streakInfo?.is_claimed ? 'light-fire-null' : !streakInfo?.today ? 'light-fire-null' : 'light-fire'} onClick={() => lightTorch()}>{streakInfo?.is_claimed ? 'STREAK ACTIVE' : !streakInfo?.today ? 'REQUIRES ENTRY' : 'IGNITE'}</button>
                        {miniFire && (
                          <>
                            <img src='/fire_icon.png' className='mini-fire0'/>
                            <img src='/fire_icon.png' className='mini-fire1'/>
                            <img src='/fire_icon.png' className='mini-fire2'/>
                          </>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
               

              </div>
            

            <div className='library-section'>

                <div className='library-banner'>

                    {isAddingBook && (
                        <div className='adding-book-banner'>
                            <button className='abb-1' onClick={() => setIsAddingBook(false)}>Cancel</button>
                            <div className='adding-book-banner-info'>
                                <div className='abb-xd'>You are currently adding books</div>
                                <div className='abb-0'>Click enter to confirm search</div>
                            </div>
                        </div>
                    )}

                    <div className='library-input-container'>

                        <input 
                            className='library-input'
                            placeholder={`Search By ${searchBy ? 'Author' : 'Title'}`}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />

                        <div class="theme-switch-container"> 
                            <label class="theme-slider" for="checkbox"> 
                                <input type="checkbox" onChange={() => setSearchBy(prev => !prev)} id="checkbox" defaultChecked /> 
                                <div class="round slider"></div> 
                            </label> 
                        </div>

                    </div>
                    <div id='library-sort' className='library-sort-container'>
                        <div id='library-sort' className='library-sort' onClick={() => setShowDropDown(prev => !prev)}>
                            <div id='library-sort' style={{marginRight: '0.625rem'}}><Sort /></div> 
                            <div className='drop-filter-text'>
                              {dropFilter} 
                            </div>
                            <Arrow />
                            {showDropDown && (
                                <div className='library-sort-abs'>
                                    <div className='library-sort-tab' onClick={() => setDropFilter('Last Read')}>
                                        <div style={{display: 'flex', marginRight: '0.6rem'}}><Refresh /></div>
                                            Last Read
                                    </div>
                                    <div className='library-sort-tab' onClick={() => setDropFilter('Completed')}>
                                        <div style={{display: 'flex', marginRight: '0.6rem'}}><Bookmark /></div>
                                            Completed
                                    </div>
                                    <div className='library-sort-tab' onClick={() => setDropFilter('Reading')}>
                                        <div style={{display: 'flex', marginRight: '0.6rem'}}><Reading /></div>
                                            Reading
                                    </div>
                                    <div className='library-sort-tab' onClick={() => setDropFilter('Favorites')}>
                                        <div style={{display: 'flex', marginRight: '0.6rem'}}><Favorite /></div>
                                            Favorites
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='library-contents'>
                    <div className={'library-nav'}>
                            <div style={{display: 'flex', width: '90%'}}>
                                <div className='library-contents-left'>
                                    <div>Library</div>
                                    <div className='library-plus' style={{display: 'flex', marginLeft: '0.5rem'}} onClick={() => {setAddingCollection([]); setIsAddingBook(true)}}><Plus /></div>
                                </div>
                                <div className='library-contents-right'>
                                    <div className='library-plus' style={{paddingTop: '0.3rem', paddingBottom: '0.3rem'}} onClick={() => expandLibrary()}><Expand /></div>
                                </div>
                            </div>
                            <div className='library-holding-books'>{!isAddingBook ? `Holding ${userCollection.length} books` : 'Adding Books..'}</div>
                    </div>
                    <div className='library-books-box' ref={divRef} style={{position: 'relative'}}>

                            {userCollection.length > 0 && !isAddingBook && (
                              <div className='library-book-arrow'>
                                <div style={{transform: 'scaleX(-1)'}}><Arrow2 /></div>
                                <div className='hold-click'>Hold-click to mark as Favorite</div>
                                </div>
                            )}
                      
                        <div className='library-grid'>
                            {isAddingBook && addingCollection[0].map((book, index) => (
                                    <LibraryBook book={book?.volumeInfo} index={index} isPreview={false} reFetchStickers={reFetchStickers} volumeId={book.id} addingBook={true} username={userInfo?.username} setIsAddingBook={setIsAddingBook} setUpdatedRating={setUpdatedRating}/>
                                ))
                            }
                            {!isAddingBook && userCollection[0].map((book, index) => (
                                    <LibraryBook book={book} index={index} isPreview={false} reFetchStickers={reFetchStickers} volumeId={book.volume_id} addingBook={false} username={userInfo?.username} setIsAddingBook={setIsAddingBook} setUpdatedRating={setUpdatedRating}/>
                                ))}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>
  )
}

export default Library