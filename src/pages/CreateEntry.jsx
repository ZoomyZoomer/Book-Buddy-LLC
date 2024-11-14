import React from 'react'
import '../createEntry.css'
import {ReactComponent as Plus} from '../right-circle.svg'
import {ReactComponent as Minus} from '../left-circle.svg'
import {ReactComponent as Clock} from '../clock_green.svg'
import {ReactComponent as Arrow} from '../arr-right.svg'
import {ReactComponent as Arrow2} from '../library-arrow2.svg'
import {ReactComponent as Check} from '../checky.svg'
import {ReactComponent as CheckBig} from '../checky_green.svg'
import {ReactComponent as ArrowBack} from '../entry-back.svg'
import {ReactComponent as Delete} from '../n-delete.svg'
import axios from 'axios'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import StickerItem from '../components/StickerItem'
import LibraryBook from '../components/LibraryBook'
import StickerItemShowcase2 from '../components/StickerItemShowcase2'
import LibraryBookShowcase2 from '../components/LibraryBookShowcase2'

const CreateEntry = () => {

    const [value, setValue] = useState(0);
    const [maxPage, setMaxPage] = useState(null);
    const [pagesRead, setPagesRead] = useState(0);
    const [checkHover, setCheckHover] = useState(false);
    const [checkHover2, setCheckHover2] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(`Morning (9AM EST)`);
    const [nullHover, setNullHover] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [book, setBook] = useState(null);
    const [stickers, setStickers] = useState([null, null, null, null]);
    const [selectedStickers, setSelectedStickers] = useState([]);
    const [reFetchStickers, setReFetchStickers] = useState(false);

    const [sendingEntry, setSendingEntry] = useState(false);
    const [entrySent, setEntrySent] = useState(false);

    const { volume_id } = useParams();
    const navigate = useNavigate('/');

    const audioRefCheck = useRef(null);

    const playAudioRefCheck = () => {
        audioRefCheck.current.volume = 0.2;
        audioRefCheck.current.play();
    };


    useEffect(() => {
        const handleClick = (event) => {
            if (event.target.id !== 'drop'){
                setDropdown(false);
            }
        };

        // Attach the event listener
        document.addEventListener('click', handleClick);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

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

    const fetchStickers = async() => {

        const res = await axios.get('/api/fetch-stickers', {
            params: {
                username: userInfo?.username
            }
        })

        setStickers(res.data[0]);

        const res2 = await axios.get('/api/fetchActiveStickers', {
            params: {
                username: userInfo?.username,
                volumeId: volume_id
            }
        })

        setSelectedStickers([...res2.data.activeStickers]);

    }

    const fetchPages = async() => {

        try {

            const res = await axios.get('/api/getPages', {
                params: {
                    volume_id,
                    tab_name: 'Favorites',
                    username: userInfo?.username
                }
            })

            setPagesRead(res.data[0]);
            setMaxPage(res.data[1]);
            setValue(res.data[0]);


        } catch(e) {
            console.error({error: e});
        }

    }

    const getBook = async() => {

        try {

            const res = await axios.get('/api/getBook', {
                params: {
                    volumeId: volume_id,
                    username: userInfo?.username
                }
            })

            setBook(res.data);

        } catch(e) {
            console.error({error: e});
        }

    }

    const [activeStickers, setActiveStickers] = useState([]);

    const fetchActiveStickers = async() => {

        setActiveStickers(book.active_stickers);

    }

    useEffect(() => {
        if (userInfo?.username && book){
            try {
                fetchActiveStickers();
            } catch(e) {
                
            }
        }
    }, [userInfo, reFetchStickers, book])

    useEffect(() => {
        if (userInfo?.username){
            try {
                fetchPages()
                getBook();
                fetchStickers();
            } catch(e) {

            }
        }
    }, [userInfo, reFetchStickers])


    const sendEntry = async() => {

        try {

            setSendingEntry(true);

            await axios.post('/api/send-entry', {
                    username: userInfo?.username,
                    tab_name: 'Favorites',
                    volume_id,
                    pages_added: (value - pagesRead),
                    total_pages_read: value,
                    title: book.title
            })

            setSendingEntry(false);
            setEntrySent(true);

            playAudioRefCheck();

            setTimeout(() => {
                navigate('/library');
            }, 700)



        } catch(e) {
            console.error({error: e});
        }

    }

    const showNotification = (title, options) => {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, options);
            console.log('Notification created');
    
            notification.onclick = (event) => {
                event.preventDefault();
                window.open('https://www.example.com', '_blank');
            };
        } else {
            console.log('No permission to show notifications.');
        }
    };
    
    const callNotif = async () => {
        setIsChecked(prev => !prev);
    
        // Check if permission is already granted
        if (Notification.permission === 'granted') {
            setTimeout(() => {
                showNotification('Scheduled Reminder', {
                    body: 'This notification was scheduled 5 seconds ago.'
                });
            }, 5000);
        } else if (Notification.permission === 'default') {
            // Request permission if not already granted
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    setTimeout(() => {
                        showNotification('Scheduled Reminder', {
                            body: 'This notification was scheduled 5 seconds ago.'
                        });
                    }, 5000);
                } else {
                    console.log('Notification permission denied.');
                }
            });
        } else {
            console.log('Notification permission denied or blocked.');
        }
    };


    const deleteBook = async() => {

        try {

            await axios.post('/api/deleteBook', {
                username: userInfo?.username,
                volume_id,
                tab_name: 'Favorites'
            })

            navigate('/library');

        } catch(e) {

        }

        

    }

    useEffect(() => {
        document.getElementById('n-entry-s-a').style.width = `${(value / maxPage) * 100}%`;
    }, [value])


  return (
    <div className='n-create-entry-box'>
        <audio ref={audioRefCheck} src="/scribble.wav" />

        <div className='n-create-entry-cont'>

            <div className='n-ce-nav'>
                <div className='n-ce-nav-l'>
                    <div className='okk' onClick={() => navigate('/library')}>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '0.4rem'}}><ArrowBack /></div>
                        SAVE AND RETURN
                    </div>
                </div>
                <div className='n-ce-nav-r'>
                    <div className='okk' onClick={() => deleteBook()}>
                        DELETE BOOK
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.4rem'}}><Delete /></div>
                    </div>
                </div>
                
            </div>

            <div className='n-book-sticker-box'>
                <div className='n-mbs'>Modify Book Stickers</div>
                <div className='n-mbs-l'/>

                <div className='n-mbs-box'>
                    <LibraryBookShowcase2 value={-9} explore={true} stickers={selectedStickers} book={book}/>
                </div>

                <div className='ys-flex'>
                    <div className='ys-bar'/>
                        Your Stickers
                    <div className='ys-bar'/>
                </div>

                <div className='n-stickers-grid'>
                    {stickers.map((sticker, index) => (
                        <StickerItemShowcase2 sticker={sticker} setStickers={setSelectedStickers} stickers={selectedStickers} volume_id={volume_id} username={userInfo?.username}/>
                    ))}
                </div>

            </div>

            <div className='n-book-sticker-box2' style={{marginTop: '1rem'}}>
                <div className='n-mbs'>Create A New Entry
                <div className='n-mbs-l'/>
                </div>
                

                <div className='create-entry-xd' style={{border: '1px solid #DFE1E5', scale: '0.9', marginTop: '1.4rem'}}>
                    <div className='create-entry-pageNum'>
                        {maxPage ? (
                            <>
                                <div>{value}&nbsp;</div>
                                <div style={{display: 'flex', fontSize: '0.8125rem', marginBottom: '0.25rem', color: '#9D9D9D', fontWeight: '400'}}>of {maxPage} pages</div>
                            </>
                        ) : 'Loading..'}
                        
                    </div>
                    <div class="create-entry-slider-cont" style={{marginTop: '1rem'}}>
                        <div style={{display: 'flex', width: '80%', alignItems: 'center', justifyContent: 'center'}}>
                            <div style={{display: 'flex'}} onClick={() => value - 1 < 0 ? setValue(0) : setValue(prev => prev - 1)}><Minus /></div>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'fit-content', position: 'relative'}}>
                                <input type="range" min='0' max={maxPage} value={value} onChange={(e) => setValue(Number(e.target.value))} class="create-entry-slider" id="my-Range"/>
                                <div id='n-entry-s-a' className='n-entry-slider-abs'/>
                                <div className='n-entry-slider-abs-norm'/>
                            </div>
                            <div style={{display: 'flex'}} onClick={() => setValue(prev => (prev + 1) > maxPage ? maxPage : prev + 1)}><Plus /></div>
                        </div>
                    </div>
                </div>

                <button className={!entrySent ? 'n-create-entry' : 'n-create-entry-null'} onClick={() => sendEntry()}>
                    {(!sendingEntry && !entrySent) ? ('CREATE ENTRY') : !entrySent ? <div className='loader-circle-white' style={{scale: '0.4'}}/> : 'ENTRY SENT'}
                    
                </button>

            </div>

        </div>

    </div>
  )
}

export default CreateEntry