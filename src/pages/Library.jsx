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
        if ((event.key === 'Enter') && (isAddingBook)) {
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

    const [recentEntries, setRecentEntries] = useState([]);
    const [ind, setInd] = useState(0);
    const [maxLen, setMaxLen] = useState(0);
    const [reFetchEntries, setReFetchEntries] = useState(false);

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


      } catch(e) {

      }

    }

    useEffect(() => {
      if (userInfo?.username){
        fetchAllEntries();
      }
    }, [userInfo, ind, reFetchEntries])

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



  return (
    <div className='library-container'>

        <audio ref={audioRefTorch} src="scribble.wav" preload="auto" />

        <div className='library-box'>

          <div className='n-library-left'>
            <div className='n-library-box-small'>

              <div className='n-library-banner'>
                <img src='/fire_icon.png' className='n-banner-img'/>
                <div className='n-library-banner-info'>
                  <div className='n-banner-title'>Light your streak</div>
                  <div>Just record an entry daily!</div>
                </div>
              </div>

              <div className='n-streak-container'>
                <div className='n-streak-circle'>
                  <img src={`./${streakInfo[0] ? 'lighter_on' : 'lighter_off'}.png`} className='n-lighter-img'/>
                </div>
                <div className='n-lighter-info'>
                    <div className='n-lighter-title'>Reading Streak: {streakInfo[1]} days</div>
                    <div>Make a flame once per day after reading a book and logging it!</div>
                    <button className={streakInfo[0] ? 'n-lighter-btn-null' : 'n-lighter-btn'} onClick={() => igniteStreak()}>{streakInfo[0] ? 'STREAK ACTIVE' : 'IGNITE'}</button>
                </div>
              </div>

              <div className='n-streak-seg'/>

              <div className='n-streak-check'>

                <div className='n-streak-months'>
                  {streakInfo[2][1].map((month, index) => (
                    <div className='n-month'>{month}</div>
                  ))}
                </div>

                  <div className='calendar-grid'>
                    {streakInfo[2][0].map((week, weekIndex) => (
                      <div key={weekIndex} className="week-row">
                        {week.map((day, dayIndex) => (
                          <>
                            {dayIndex === 1 && weekIndex === 0 && <div className='n-week'>Mon</div>}
                            {dayIndex === 3 && weekIndex === 0 && <div className='n-week'>Wed</div>}
                            {dayIndex === 5 && weekIndex === 0 && <div className='n-week'>Fri</div>}
                            <div key={dayIndex} className={`day-cell ${day === 1 ? 'filled' : (day === 2 || day === 0) ? 'empty' : day === 5 ? 'soon' : day === 3 ? 'empty' : 'missed'}`} />
                          </>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className='calendar-legend'>

                      <div className='legend-text'>Missed</div>
                      <div className='missed' style={{marginLeft: '0.2rem'}}/>

                      <div className='legend-text' style={{marginLeft: '0.625rem'}}>Streak</div>
                      <div className='filled' style={{marginLeft: '0.2rem'}}/>

                  </div>

              </div>

            </div>
            <div className='n-library-box-sep' />
            <div className='n-library-box-small'>

            <div className='n-library-banner'>
                <img src='/flag.png' className='n-banner-img'/>
                <div className='n-library-banner-info'>
                  <div className='n-banner-title'>Achieve Your Goals</div>
                  <div>Set your own goals and get rewarded</div>
                </div>
            </div>

            <div className='n-goals-container'>
                <div className='n-goals-box'>
                    <div className='n-goals-box-top'>
                      <div className='n-goals-circle-active'>
                        <img src='/package_icon.png' className='n-goals-circle-img'/>
                      </div>
                      <div className='n-goals-box-info'>
                        <div className='n-goals-box-info-title-active'>Thursday Reading</div>
                        <div className='n-goals-box-info-desc'><strong style={{color: '#454b54'}}>Goal:</strong> 30 minutes</div>
                        <div className='n-goals-box-info-desc'><strong style={{color: '#454b54'}}>Reading Rate:</strong> 225 WPM</div>
                      </div>
                    </div>
                </div>
            </div>

            </div>
          </div>

          <div className='n-library-sep'/>

          <div className='n-library-right'>

          </div>

        </div>

    </div>
  )
}

export default Library