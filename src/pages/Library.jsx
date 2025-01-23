import React, { useState, useEffect, useRef } from 'react'
import '../new_library.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {ReactComponent as CheckList} from '../n-checklist.svg'
import {ReactComponent as CheckListFilled} from '../n-checklist-filled.svg'
import {ReactComponent as Chat} from '../n-chat.svg'
import {ReactComponent as ChatFilled} from '../n-chat-filled.svg'
import {ReactComponent as Inbox} from '../n-inbox.svg'
import {ReactComponent as InboxFilled} from '../n-inbox-filled.svg'
import {ReactComponent as Medal} from '../n-medal.svg'
import {ReactComponent as MedalFilled} from '../n-medal-filled.svg'
import {ReactComponent as ChevDown} from '../n-chev-down.svg'
import {ReactComponent as ChevDownFilled} from '../n-chev-down-inactive.svg'
import {ReactComponent as Settings} from '../n-settings.svg'
import {ReactComponent as Logout} from '../n-log-out.svg'
import {ReactComponent as Lupa} from '../n-lupa.svg'
import {ReactComponent as RightSquare} from '../n-right-square.svg'
import {ReactComponent as AddCircle} from '../n-add-book-circle.svg'
import {ReactComponent as Trash} from '../n-trash.svg'
import {ReactComponent as Sort} from '../n-sort-vertical.svg'
import {ReactComponent as Clipboard} from '../n-clipboard.svg'
import {ReactComponent as ScrapBook} from '../n-scrapbook.svg'
import {ReactComponent as PieChart} from '../pie-chart.svg'
import {ReactComponent as Alarm} from '../n-alarm.svg'
import LibraryBook from '../components/LibraryBook'
import ScrapPatch from '../components/ScrapPatch'
import LineChart from '../components/LineChart'
import EmojiPopup from '../components/EmojiPopup'


function Library() {

    const [searchBy, setSearchBy] = useState(true);
    const [text, setText] = useState('');
    const [searchEntered, setSearchEntered] = useState(false);
    const [showDropDown, setShowDropDown] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isAddingBook, setIsAddingBook] = useState(false);
    const [userCollection, setUserCollection] = useState([]);
    const [addingCollection, setAddingCollection] = useState([null, null, null, null]);
    const [dropFilter, setDropFilter] = useState('Recent');
    const [updatedRating, setUpdatedRating] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [reFetchStickers, setReFetchStickers] = useState(false);
    const [noBooksFound, setNoBooksFound] = useState(false);
    const [maxPatch, setMaxPatch] = useState(undefined);
    const [showGraphDropDown, setShowGraphDropDown] = useState(false);
    const [sampleData, setSampleData] = useState([[
      {timeframe: 'Wed', pages: 40}, {timeframe: 'Tue', pages: 30}, {timeframe: 'Mon', pages: 38}, {timeframe: 'Sun', pages: 45}, {timeframe: 'Sat', pages: 67}, {timeframe: 'Fri', pages: 27}, {timeframe: 'Thu', pages: 16}],
       [{timeframe: '1/12', pages: 67}, {timeframe: '1/5', pages: 106}, {timeframe: '12/29', pages: 78}, {timeframe: '12/22', pages: 149}, {timeframe: '12/15', pages: 122}, {timeframe: '12/8', pages: 177}, {timeframe: '12/1', pages: 107}],
      [{timeframe: 'Jan', pages: 467}, {timeframe: 'Dec', pages: 567}, {timeframe: 'Nov', pages: 376}, {timeframe: 'Oct', pages: 452}, {timeframe: 'Sep', pages: 239}, {timeframe: 'Jul', pages: 432}, {timeframe: 'Jun', pages: 129}]])
    const [graphItem, setGraphItem] = useState('Past week');
    const [graphData, setGraphData] = useState(null);
    const [goalsSet, setGoalsSet] = useState([]);
    const bottomRef = useRef(null);
    const divRef = useRef(null);
    const navigate = useNavigate('/');
    const tab = 'Favorites';

    const patchBook = new Map([
      [0, {name: 'Potted Plant', desc: 'Where it starts!', src: 'patch_1', id: 0}],
      [1, {name: 'Pawn', desc: 'Calculated moves', src: 'patch_4', id: 1}],
      [2, {name: '7 Ball', desc: '0 luck, All skill', src: 'patch_5', id: 2}],
      [3, {name: 'Camping Trip', desc: "Cozy stortelling", src: 'patch_6', id: 3}],
      [4, {name: 'Coffee', desc: "Caffeinated reading", src: 'patch_7', id: 4}],
      [5, {name: 'Stopwatch', desc: "All about patience", src: 'patch_8', id: 5}],
      [6, {name: 'Checklist', desc: "Check, check, check!", src: 'patch_9', id: 6}],
    ])

    const emojiPopups = new Map([
      [0, {name: 'Happy Time', desc: 'You’ve created your official Book Buddy account!', id: 0, button_desc: 'SMILE :)', img: 'smile-emoji-solo', reward: false, colors: {main: '#918FF3', c_0: '#80D1B4', c_1: '#FFC436', c_2: '#918FF3', c_3: '#FE8BA9', c_4: '#70F9FD'}}],
      [1, {name: 'Gift for U', desc: 'I went shopping and got ya a present :)', id: 1, button_desc: 'OPEN IT', img: 'wink-emoji-solo', reward: true, colors: {main: '#FE8BA9', c_0: '#70F9FD', c_1: '#918FF3', c_2: '#FFC436', c_3: '#FE8BA9', c_4: '#80D1B4'}}],
      [2, {name: 'Reading Rewards', desc: "You're SO cool for finishing that book!", id: 2, button_desc: 'GET REWARD', img: 'cool-emoji-solo', reward: true, colors: {main: '#80D1B4', c_0: '#FFC436', c_1: '#918FF3', c_2: '#70F9FD', c_3: '#FE8BA9', c_4: '#FE8BA9'}}],
    ])

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
                title: searchBy ? 'title' : 'author',
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

      const [bookDeleted, setBookDeleted] = useState(false);

      useEffect(() => {
        if (userInfo?.username) { // Ensure userInfo is not null
          fetchCollection();
        }
      }, [userInfo, text, updatedRating, dropFilter, isAddingBook, bookDeleted]);

  

    const callBooksApi = async() => {

        if (searchBy) {
            const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${text}&maxResults=8&key=AIzaSyDdENboInmtpWIgPanFmuOOl4WtDzQZYyQ`, { withCredentials: false });
            if (res.data?.items === undefined) {
              setAddingCollection([]);
              setNoBooksFound(true);
          } else {
              setAddingCollection(res.data?.items);
          }
            
        }

        if (!searchBy) {
            const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${text}&maxResults=8&key=AIzaSyDdENboInmtpWIgPanFmuOOl4WtDzQZYyQ`, { withCredentials: false });
            if (res.data?.items === undefined) {
              setAddingCollection([]);
              setNoBooksFound(true);
          } else {
              setAddingCollection(res.data?.items);
          }

        }

    }
    

    const handleKeyDown = (event) => {
      if (event?.key === 'Enter' && isAddingBook) {
        setSearchEntered(true);
        callBooksApi();
      }
    };

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

    const fetchPatch = async() => {

      const res = await axios.get('/api/fetch-patches', {
        params: {
          username: userInfo?.username
        }
      })

      setMaxPatch(res.data);

    }

    const fetchGraphData = async() => {

      const res = await axios.get('/api/fetch-graph-data', {
        params: {
          username: userInfo?.username
        }
      })

      setGraphData([res.data[0], res.data[1], res.data[2]]);
      setGoalsSet(res.data[3])

    }

    const [popupInfo, setPopupInfo] = useState(null);
    const [fetchPopup, setFetchPopup] = useState(false);

    const processPopup = (popupList) => {

      const popup = popupList.find((popup) => popup.show);

      if (popup && (!popupInfo || popup.id !== popupInfo.id)) {
        setPopupInfo(emojiPopups.get(popup.id));
      }

    }


    const fetchEmojiPopups = async() => {

      const res = await axios.get('/api/emojiPopups', {
        params: {
          username: userInfo?.username
        }
      })

      processPopup(res.data);

    }

    useEffect(() => {

      if (userInfo){
        fetchPatch();
        fetchGraphData();
      }

    }, [userInfo])

    useEffect(() => {
      if (userInfo){
        fetchEmojiPopups();
      }
    }, [userInfo, fetchPopup])



  return (

    <div style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>

      {popupInfo && <EmojiPopup popupInfo={popupInfo} setPopupInfo={setPopupInfo} username={userInfo?.username} setFetchPopup={setFetchPopup}/>}

    <div className='n-library-bg' style={{filter: popupInfo ? 'brightness(0.3)' : 'none', pointerEvents: popupInfo? 'none' : 'all'}}>

        <div className='n-library-container'>

          <div className='n-library-left-bar'>

            <div style={{height: '8%', display: 'flex', flexDirection: 'column', justifyContent: 'left', width: '100%'}}>

              <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%', height: '100%'}}>
                <img src='/bb-logo.png' style={{height: '2rem', width: '2rem', cursor: 'pointer'}}/>
                <div className='logo-title' style={{fontSize: '0.9rem'}}>BOOK <strong>BUDDY</strong></div>
              </div>

              <div className='n-navbar-separator'/>

            </div>

            <div className='n-main-menu-sec'>
              <div className='n-navbar-main-txt'>MAIN MENU</div>
              <button className='n-main-menu-btn-active' style={{marginTop: '1rem'}}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><CheckList /></div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.625rem'}}>Library</div>
              </button>
              <button className='n-main-menu-btn'>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><MedalFilled /></div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.625rem'}}>Rewards</div>
              </button>
              <button className='n-main-menu-btn'>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><InboxFilled /></div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.625rem'}}>Storage</div>
              </button>
              <button className='n-main-menu-btn'>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ChatFilled /></div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.625rem'}}>Social</div>
              </button>
            </div>

            

            <div className='n-main-menu-sec' style={{marginTop: '25rem'}}>
              <button className='n-main-menu-btn'>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Settings /></div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.625rem'}}>Settings</div>
              </button>
              <button className='n-main-menu-btn'>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Logout /></div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.625rem'}}>Log out</div>
              </button>
              <div className='n-navbar-separator' style={{marginTop: '1rem'}}/>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', color: '#9BA4B6', fontSize: '0.8125rem', marginTop: '1rem'}}>© 2025 Book Buddy LLC</div>
            </div>

          </div>

          <div style={{display: 'flex', flexDirection: 'column', height: '100%', width: '78%'}}>

            <div className='n-library-middle-bar'>

              

              <div className='n-library-middle-navbar'>

                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '28rem', position: 'relative'}}>
                    <input 
                      className='n-library-middle-input'
                      placeholder={`Search By ${searchBy ? 'Title' : 'Author'}...`}
                      value={text}
                      onChange={(e) => {setText(e.target.value); setSearchEntered(false)}}
                      onKeyDown={handleKeyDown}
                    />
                    <div className='n-lupa'><Lupa /></div>
                    <label class="switch" style={{position: 'absolute', right: '0.4rem', bottom: '63%'}}>
                      <input type="checkbox"/>
                      <span class="slider round" onClick={() => setSearchBy(prev => !prev)}></span>
                    </label>
                </div>
              
              </div>

              <div style={{paddingLeft: '4rem', paddingRight: '4rem', width: '100%', boxSizing: 'border-box', marginTop: '1.625rem', display: 'flex'}}>

                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '30%'}}>

                    <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', position: 'relative'}}>
                      <div style={{display: 'flex', position: 'absolute', top: '0'}}><RightSquare /></div>
                      <div style={{display: 'flex', marginLeft: '1.625rem', color: '#27AE85', fontSize: '1rem', fontWeight: '500', position: 'relative', flexDirection: 'column', justifyContent: 'left'}}>
                        <div>Library Collection</div>
                        <div style={{fontWeight: '400', fontSize: '0.7rem', color: '#808893'}}>Showing {!isAddingBook ? userCollection.length : addingCollection.length} of {!isAddingBook ? maxBooks : addingCollection.length} books</div>
                      </div>
                    </div>

                </div>
                <div style={{display: 'flex', justifyContent: 'right', alignItems: 'center', width: '70%'}}>
                    <button className={!isDeleting ? 'n-small-btn' : 'n-small-btn-null'} onClick={() => !isDeleting && setIsAddingBook(prev => !prev)}>{!isAddingBook ? <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><div style={{display: 'flex', marginRight: '0.4rem'}}><AddCircle /></div>Add Book</div> : 'Return to Library'}</button>
                    <button className={!isAddingBook ? (isDeleting ? 'n-small-btn-delete' : 'n-small-btn') : 'n-small-btn-null'} style={{marginLeft: '0.8125rem'}} onClick={() => !isAddingBook && setIsDeleting(prev => !prev)}>{!isDeleting ? <Trash /> : 'Cancel Deletion'}</button>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.8125rem', position: 'relative'}}>

                      <div className='n-select-filter'>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                          <Sort />
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.4rem'}}>Filter</div>
                      </div>
                      <div className={!isAddingBook ? 'n-select-filter-item' : 'n-select-filter-item-null'} onClick={() => !isAddingBook && setShowDropDown(prev => !prev)} onMouseLeave={() => setShowDropDown(false)}>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{dropFilter}</div>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.7rem', position: 'absolute', right: '1rem'}}><ChevDownFilled /></div>
                        {showDropDown && <div className='n-dropdown-menu'>
                          {dropFilter !== 'Recent' && <div className='n-filter-item' onClick={() => setDropFilter('Recent')}>
                            <div style={{marginLeft: '0.4rem', width: '100%', display: 'flex', justifyContent: 'left'}}>Recent</div>
                          </div>}
                          {dropFilter !== 'Completed' && <div className='n-filter-item' onClick={() => setDropFilter('Completed')}>
                            <div style={{marginLeft: '0.4rem'}}>Completed</div>
                          </div>}
                          {dropFilter !== 'Reading' && <div className='n-filter-item' onClick={() => setDropFilter('Reading')}>
                            <div style={{marginLeft: '0.4rem'}}>Reading</div>
                          </div>}
                          {dropFilter !== 'Favorites' && <div className='n-filter-item'  onClick={() => setDropFilter('Favorites')}>
                            <div style={{marginLeft: '0.4rem'}}>Favorites</div>
                          </div>}
                        </div>}
                      </div>

                  

                    </div>
                </div>

              </div>

              <div style={{paddingLeft: '4rem', paddingRight: '4rem', width: '100%', boxSizing: 'border-box', marginTop: '1rem', display: 'flex', flexDirection: 'column'}}>
                <div className='n-navbar-separator'/>

                <div style={{height: '24rem', overflowY: 'auto', width: '100%', overflowX: 'hidden'}} className='n-scroll-content'>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridAutoRows: '12rem', justifyContent: 'left',  alignItems: 'center', boxSizing: 'border-box', marginLeft: '-1rem'}}>
                    {!isAddingBook &&  userCollection.map((book, index) => (
                      <div style={{width: '100%', display: 'flex', justifyContent: 'left', alignItems: 'center', width: '9rem'}}><LibraryBook book={book} setUpdatedRating={setUpdatedRating} setFetchPopup={setFetchPopup} setIsDeleting={setIsDeleting} setBookDeleted={setBookDeleted} volumeId={book?.volume_id} isDeleting={isDeleting} index={index} username={userInfo?.username} addingBook={isAddingBook} isPreview={false} setText={setText} setAddingCollection={setAddingCollection} setIsAddingBook={setIsAddingBook} setSearchEntered={setSearchEntered}/></div>
                    ))}
                    {isAddingBook && searchEntered && addingCollection.map((book, index) => (
                      <>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'left', alignItems: 'center', width: '9.5rem'}}><LibraryBook book={book} volumeId={book?.volume_id} isDeleting={isDeleting} index={index} username={userInfo?.username} addingBook={isAddingBook} isPreview={false} setText={setText} setAddingCollection={setAddingCollection} setIsAddingBook={setIsAddingBook} setSearchEntered={setSearchEntered}/></div>
                      </>
                    ))}
                  </div>

                  {isAddingBook && !searchEntered && (
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
                      <div className='enter-search-notif'>

                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%'}}>

                          <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>

                            <div style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: 'fit-content'}}>
                              <img src='/patch_9.png' style={{height: '2.6rem', zIndex: '30'}}/>
                              <div style={{position: 'absolute', height: '3rem', width: '3rem', borderRadius: '100%', backgroundColor: '#EAEAEA', zIndex: '4', bottom: '0rem'}}/>
                            </div>

                            <div style={{marginLeft: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'center'}}>
                                <div style={{display: 'flex', justifyContent: 'left', width: '100%'}} className='n-notif-0'>Click ‘Enter’ to Confirm Search</div>
                                <div style={{display: 'flex', justifyContent: 'left', width: '100%'}} className='n-notif-1'>API requests don’t grow on trees! Also, please make sure your search contains at least 5 characters.</div>
                            </div>

                          </div>

                          <div className='n-notif-bar'>
                            <div className='n-notif-fill'/>
                          </div>

                        </div>

                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>

            <div className='n-library-bottom-bar'>

              <div className='n-library-bottom-bar-left'>

                <div className='n-library-chart-section'>

                  <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%', height: 'fit-content', position: 'relative'}}>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><PieChart /></div>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.4rem'}}>READING PROGRESS</div>


                    <div style={{position: 'absolute', right: '0', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

                      <div className='n-select-filter'>
                        <Alarm />
                      </div>

                      <div style={{position: 'relative'}}>
                        <div className='n-chart-date' onClick={() => setShowGraphDropDown(prev => !prev)} onMouseLeave={() => setShowGraphDropDown(false)}>

                            <div style={{marginLeft: '0.4rem'}}>{graphItem}</div>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.8125rem'}}><ChevDownFilled /></div>
                            {showGraphDropDown && 
                              <div className='n-chart-dropdown'>
                                {graphItem !== 'Past week' && <div className='n-chart-item' onClick={() => setGraphItem('Past week')}>
                                  <div style={{marginLeft: '0.7rem'}}>Past week</div>
                                </div>}
                                {graphItem !== 'Past month' && <div className='n-chart-item' onClick={() => setGraphItem('Past month')}>
                                  <div style={{marginLeft: '0.7rem'}}>Past month</div>
                                </div>}
                                {graphItem !== 'Past year' && <div className='n-chart-item' onClick={() => setGraphItem('Past year')}>
                                  <div style={{marginLeft: '0.7rem'}}>Past year</div>
                                </div>}
                              </div>
                            }

                        </div>
                      </div>
                    </div>

                  </div>

                    <div style={{height: '80%', display: 'flex', alignItems: 'center', marginTop: '2rem', position: 'relative'}}>
                      <div style={{height: '100%', width: '100%', position: 'relative', display: 'flex', alignItems: 'center'}}>
                        <LineChart realData={goalsSet?.length > 0 ? (graphData ? graphItem === 'Past week' ? graphData[0] : (graphItem === 'Past month' ? graphData[1] : graphData[2]) : new Array(1)) : (graphItem === 'Past week' ? sampleData[0].reverse() : (graphItem === 'Past month' ? sampleData[1].reverse() : sampleData[2].reverse()))}/>
                        {goalsSet?.length === 0 && <div style={{position: 'absolute', top: '30%', bottom: '0', left: '20%', transform: 'rotate(-20deg)', fontSize: '2rem', opacity: '0.2'}}>SAMPLE DATA</div>}
                      </div>
                      <div style={{display: 'flex', flexDirection: 'column', position: 'absolute', top: '10%', left: '80%'}}>
                          <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                            <div style={{height: '1rem', width: '1rem', backgroundColor: '#27AE85', borderRadius: '0.3rem'}}/>
                            <div style={{marginLeft: '0.4rem', fontSize: '0.8125rem', fontWeight: '500'}}>Pages read</div>
                          </div>
                          <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', marginTop: '0.8125rem'}}>
                            <div style={{height: '1rem', width: '1rem', backgroundColor: '#ADDFC9', borderRadius: '0.3rem'}}/>
                            <div style={{marginLeft: '0.4rem', fontSize: '0.8125rem', fontWeight: '500'}}>Expected</div>
                          </div>
                      </div>
                    </div>

                </div>

                <div className='n-library-chart-info-section' style={{position: 'relative'}}>

                  <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '100%'}}>
                      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Clipboard /></div>
                      <div style={{marginLeft: '0.625rem', fontWeight: '600', fontSize: '1rem'}}>Set reading goals and get <br></br> patches for your profile.</div>
                  </div>

                  <div style={{color: '#808893', fontSize: '0.74rem', lineHeight: '1.2rem', marginTop: '0.7rem'}}>Meet or exceed your reading expectations in streaks of 3 days in a row for a unique patch to display on your profile to the world!</div>

                  <div style={{display: 'flex', justifyContent: 'left', width: '100%', marginTop: '5.2rem'}}>
                    <button className='n-get-started' onClick={() => navigate('/set-goals')}>Get Started</button>
                  </div>

                  <div style={{position: 'absolute', bottom: '17%', right: '24%', transform: 'scale(1.4)'}} className='n-xd'>

                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                        <div className='patch_1' style={{zIndex: '200', animation: 'none'}}>
                            <div className='patch_1_sub' style={{zIndex: '200', animation: 'none'}}>
                                <div style={{backgroundColor: '#E6E6E6', height: '60%', width: '60%', borderRadius: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: '0.4rem', marginLeft: '0.4rem', zIndex: '200'}}>
                                    <img src='/patch_1.png' style={{position: 'absolute', height: '3.2rem', bottom: '4%', transform: 'rotate(15deg)', right: '0%', zIndex: '200'}}/>
                                </div>
                                
                            </div>
                        </div>
                    </div>

                  </div>

                  <div style={{position: 'absolute', bottom: '10%', right: '10%', transform: 'scale(1)'}}>

                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                        <div className='patch_1' style={{zIndex: '200', borderColor: '#454b54'}}>
                            <div className='patch_1_sub' style={{zIndex: '200'}}>
                                <div style={{backgroundColor: '#E6E6E6', height: '60%', width: '60%', borderRadius: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: '0.4rem', marginLeft: '0.4rem', zIndex: '200'}}>
                                    <img src='/patch_1.png' style={{position: 'absolute', height: '3.2rem', bottom: '4%', transform: 'rotate(15deg)', right: '0%', zIndex: '200'}}/>
                                </div>
                                
                            </div>
                        </div>
                        <div className='patch_1_shadow' style={{backgroundColor: '#D0D0D0'}}/>
                    </div>

                  </div>


                </div>

              </div>

              <div className='n-library-bottom-bar-right'>

                <div className="fixed-header">
                  <div style={{fontWeight: '600', fontSize: '0.8125rem', display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.1rem'}}><ScrapBook /></div>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.4rem'}}>SCRAP BOOK</div>
                  </div>
                  <div style={{fontWeight: '400', fontSize: '0.7rem', color: '#808893', marginTop: '0.4rem'}}>Tiny reminders of your success in meeting your weekly reading goals.</div>
                  <div className='n-navbar-separator' style={{marginTop: '0.8125rem'}} />
                </div>

                <div className="scrollable-content">
                  <div className="flex-container">
                      {patchBook && patchBook.size > 0 && Array.from({ length: Math.ceil(patchBook.size / 6) }, (_, gridIndex) => (
                      <div className="n-scrap-book-grid" key={`grid-${gridIndex}`}>
                        {Array.from({ length: Math.min(6, patchBook.size - gridIndex * 6) }, (_, i) => {
                          const patchIndex = gridIndex * 6 + i;
                          const patch = patchBook.get ? patchBook.get(patchIndex) : patchBook[patchIndex];
                          const claimed = patchIndex <= maxPatch;
                          return patch ? <ScrapPatch index={patchIndex} patch={patch} claimed={claimed} /> : null;
                        })}
                      </div>
                    ))}
                  </div>
                </div>

              </div>


            </div>

          </div>

        </div>

    </div>

    </div>
  )
}

export default Library