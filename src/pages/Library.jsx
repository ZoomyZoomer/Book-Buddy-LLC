import React, { useState, useEffect, useRef } from 'react'
import '../new_library.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {ReactComponent as ChevDownFilled} from '../n-chev-down-inactive.svg'
import {ReactComponent as Lupa} from '../n-lupa.svg'
import {ReactComponent as RightSquare} from '../n-right-square.svg'
import {ReactComponent as AddCircle} from '../n-add-book-circle.svg'
import {ReactComponent as Trash} from '../n-trash.svg'
import {ReactComponent as Sort} from '../n-sort-vertical.svg'
import {ReactComponent as Clipboard} from '../n-clipboard.svg'
import {ReactComponent as ScrapBook} from '../n-scrapbook.svg'
import {ReactComponent as PieChart} from '../pie-chart.svg'
import {ReactComponent as Alarm} from '../n-alarm.svg'
import {ReactComponent as Add} from '../n-add-circle.svg'
import LibraryBook from '../components/LibraryBook'
import ScrapPatch from '../components/ScrapPatch'
import LineChart from '../components/LineChart'
import EmojiPopup from '../components/EmojiPopup'
import Notifications from '../components/Notifications'
import TicketPortal from '../components/TicketPortal'
import ProfilePage from '../components/ProfilePage'
import LibraryLeftBar from '../components/LibraryLeftBar'


function Library() {

    const [searchBy, setSearchBy] = useState(true);
    const [text, setText] = useState('');
    const [showText, setShowText] = useState(false);
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
    const [eligible, setEligible] = useState(false);
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

    const [patchClicked, setPatchClicked] = useState(false);

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
      [0, {name: 'Happy Time', desc: 'You’ve created your official Book Buddy account!', id: 0, button_desc: 'SMILE :)', img: 'smile-emoji-solo', reward: true, colors: {main: '#918FF3', c_0: '#80D1B4', c_1: '#FFC436', c_2: '#918FF3', c_3: '#FE8BA9', c_4: '#70F9FD'}}],
      [1, {name: 'Gift for U', desc: 'I went shopping and got ya a present :)', id: 1, button_desc: 'OPEN IT', img: 'wink-emoji-solo', reward: true, colors: {main: '#FE8BA9', c_0: '#70F9FD', c_1: '#918FF3', c_2: '#FFC436', c_3: '#FE8BA9', c_4: '#80D1B4'}}],
      [2, {name: 'Reading Rewards', desc: "You're SO cool for finishing that book!", id: 2, button_desc: 'GET REWARD', img: 'cool-emoji-solo', reward: true, colors: {main: '#80D1B4', c_0: '#FFC436', c_1: '#918FF3', c_2: '#70F9FD', c_3: '#FE8BA9', c_4: '#FE8BA9'}}],
    ])

    const notifications = new Map([
      [0]
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
            setEligible(response.data[2]);

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
    const [newNotifs, setNewNotifs] = useState(false);

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

      processPopup(res.data[0]);
      setNewNotifs(res.data[1] - 2 < 0);

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

    const [style, setStyle] = useState({ transform: "perspective(500px) rotateX(0deg) rotateY(0deg) scale(0.8125)" });

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left; // X position relative to the container
      const y = e.clientY - rect.top;  // Y position relative to the container
  
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
  
      // Invert the rotation directions by negating the values
      const rotateX = -((y - centerY) / centerY) * 4; // Max tilt of 10 degrees
      const rotateY = -((centerX - x) / centerX) * 4;
  
      setStyle({
        transform: `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(0.8125)`,
        transition: "transform 0.1s ease-out, background-color 0.3s ease-in-out",
      });
    };

  const handleMouseLeave = () => {
    setStyle({ transform: "perspective(500px) rotateX(0deg) rotateY(0deg) scale(0.8125)", transition: "transform 0.5s ease-out, background-color 0.3s ease-in-out" });
  };

  const [globalNull, setGlobalNull] = useState(false);

  const clickPatch = () => {

      if (patchClicked){
        closePatch();
      } else {
        setPatchClicked(prev => !prev);
        setTimeout(() => {
          setShowText(true);
        }, 450)
      }

  }

  const closePatch = () => {
    document?.getElementsByClassName('n-patch-clicked')[0]?.classList.add('n-patch-close');
    document?.getElementsByClassName('n-patch-clicked-end')[0]?.classList.add('n-patch-close-end');
    document?.getElementsByClassName('n-patch-clicked')[0]?.classList.remove('n-patch-clicked');
    document?.getElementsByClassName('n-patch-clicked-end')[0]?.classList.remove('n-patch-clicked-end');
    setTimeout(() => {
      setShowText(false);
    }, 50)
    setTimeout(() => {
      setPatchClicked(false);
    }, 500)
  }

  const [showNotifications, setShowNotifications] = useState(false);
  const [showTicketPortal, setShowTicketPortal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (

    <div style={{height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>

      {popupInfo && <EmojiPopup popupInfo={popupInfo} setPopupInfo={setPopupInfo} username={userInfo?.username} setFetchPopup={setFetchPopup}/>}
      {showNotifications && <Notifications username={userInfo?.username} setFetchPopup={setFetchPopup} popupInfo={popupInfo} setShowNotifications={setShowNotifications}/>}
      {showTicketPortal && <TicketPortal username={userInfo?.username} setShowTicketPortal={setShowTicketPortal}/>}
      {showProfile && <ProfilePage username={userInfo?.username} setShowProfile={setShowProfile}/>}

    <div className='n-library-bg' style={{filter: (popupInfo || showNotifications || showTicketPortal || showProfile) ? 'brightness(0.3)' : 'none', pointerEvents: (popupInfo || showNotifications || showTicketPortal || showProfile) ? 'none' : 'all'}}>

        <div className='n-library-container'>

          <LibraryLeftBar userInfo={userInfo} setShowTicketPortal={setShowTicketPortal} setShowNotifications={setShowNotifications} setShowProfile={setShowProfile} newNotifs={newNotifs}/>

          <div style={{display: 'flex', flexDirection: 'column', height: '100%', width: '78%'}}>

            <div className='n-library-middle-bar'>

              

              <div className='n-library-middle-navbar' style={{position: 'relative'}}>

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

                {/*<div style={{position: 'absolute', right: '4rem', display: 'flex', justifyContent: 'center'}}>

                  <div style={{position: 'relative'}} className={'n-patch-claimed'} onClick={() => clickPatch()} onMouseLeave={() => closePatch()}>

                    <div className='patch_1-alt' style={{zIndex: '998', animation: 'none', height: '3.4rem', width: '3.4rem', borderWidth: '1px', borderStyle: 'solid'}}>
                      <img src={`/${eligible ? 'gift-inside-icon' : 'present_icon'}.png`} style={{position: 'absolute', height: eligible ? '2.1rem' : '1.8rem', zIndex: '200'}}/>           
                    </div>

                    {eligible && (<div></div>)}

                    {patchClicked && <div className='n-patch-clicked-end' style={{zIndex: '997'}}>
                      {showText && (
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'center', marginRight: '2rem'}}>
                          <div style={{fontWeight: '600', fontSize: '0.8125rem', display: 'flex', width: '100%', justifyContent: 'left'}}>★ Small Present ★</div>
                          <div style={{fontWeight: '400', color: '#808893', fontSize: '0.6rem', marginTop: '0.2rem'}}><strong>Unlock:</strong> Create a reading entry</div>
                        </div>
                      )}
                    </div>}

                  </div>

                </div>*/}
              
              </div>

              <div style={{paddingLeft: '4rem', paddingRight: '4rem', width: '100%', boxSizing: 'border-box', marginTop: '1.3rem', display: 'flex'}}>

                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '30%'}}>

                    <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', position: 'relative'}}>
                      <div style={{display: 'flex', position: 'absolute', top: '0'}}><RightSquare /></div>
                      <div style={{display: 'flex', marginLeft: '1.625rem', color: '#27AE85', fontSize: '1rem', fontWeight: '500', position: 'relative', flexDirection: 'column', justifyContent: 'left'}}>
                        <div>Your Library Collection</div>
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

              <div style={{width: '100%', boxSizing: 'border-box', marginTop: '1rem', display: 'flex', flexDirection: 'column'}}>
                <div className='n-navbar-separator'/>

                <div style={{height: '25.4rem', overflowY: 'auto', width: '100%', overflowX: 'hidden'}} className='n-scroll-content'>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridAutoRows: '12rem', justifyContent: 'left',  alignItems: 'center', boxSizing: 'border-box'}}>
                    {!isAddingBook &&  userCollection.map((book, index) => (
                      <div style={{width: '100%', display: 'flex', justifyContent: 'left', alignItems: 'center', width: '9rem'}}><LibraryBook book={book} globalNull={globalNull} setGlobalNull={setGlobalNull} setUpdatedRating={setUpdatedRating} setFetchPopup={setFetchPopup} setIsDeleting={setIsDeleting} setBookDeleted={setBookDeleted} volumeId={book?.volume_id} isDeleting={isDeleting} index={index} username={userInfo?.username} addingBook={isAddingBook} isPreview={false} setText={setText} setAddingCollection={setAddingCollection} setIsAddingBook={setIsAddingBook} setSearchEntered={setSearchEntered}/></div>
                    ))}
                    {isAddingBook && searchEntered && addingCollection.map((book, index) => (
                      <>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'left', alignItems: 'center', width: '9.5rem'}}><LibraryBook book={book} globalNull={globalNull} setGlobalNull={setGlobalNull} volumeId={book?.volume_id} isDeleting={isDeleting} index={index} username={userInfo?.username} addingBook={isAddingBook} isPreview={false} setText={setText} setAddingCollection={setAddingCollection} setIsAddingBook={setIsAddingBook} setSearchEntered={setSearchEntered}/></div>
                      </>
                    ))}
                    {!isAddingBook && userCollection.length === 0 && (
                      <div className='library-book-container' style={{flexDirection: 'row', ...style}} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={() => setIsAddingBook(true)}>
                        <div className='library-book-circle-gray'>
                          <img src='http://books.google.com/books/publisher/content?id=Z5nYDwAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE71w0_tgIHfDMwhEsvV-pEgZJhDOzyolKwNKjxdBne8QcH_cUZmfHby5Yem38_R8itwP5Oa0wKe2ygqV8APiUmP35Fpb568w3g-eGs5-5rc5zVgNLHRfTotPzpj7QrrfoYrtIp-9&source=gbs_api' className='library-cover'/>
                        </div>
                        <div className='library-book-info'>
                          <div className='library-book-title'>Empty Book Slot</div>
                          <div className='library-book-author' style={{marginTop: '0.2rem'}}>Click to add from a collection of thousands!</div>
                          <div className='n-add-to-library'><div style={{marginRight: '0.4rem', display: 'flex'}}><Add /></div>Click to Add Book</div>
                        </div>
                          <div className='library-vert-bar-container'>
                            <div className='library-vert-bar'>
                                <div className='library-vert-bar-fill'/>
                            </div>
                        </div>
                      </div>
                    )}
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

                      <div className='n-select-filter' style={{padding: '0.45rem 1rem 0.45rem 1rem'}}>
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