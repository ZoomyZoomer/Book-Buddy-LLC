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
import axios from 'axios'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import StickerItem from '../components/StickerItem'
import LibraryBook from '../components/LibraryBook'

const CreateEntry = () => {

    const [value, setValue] = useState(0);
    const [maxPage, setMaxPage] = useState(0);
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
    const [stickers, setStickers] = useState([]);
    const [reFetchStickers, setReFetchStickers] = useState(false);

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
            const response = await axios.get('http://localhost:4000/profile', {
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

        const res = await axios.get('http://localhost:4000/fetch-stickers', {
            params: {
                username: userInfo?.username
            }
        })

        setStickers(res.data[0]);

    }

    const fetchPages = async() => {

        try {

            const res = await axios.get('http://localhost:4000/getPages', {
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

            const res = await axios.get('http://localhost:4000/getBook', {
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

        const res = await axios.get('http://localhost:4000/fetchActiveStickers', {
            params: {
                username: userInfo?.username,
                volumeId: volume_id
            }
        })

        setActiveStickers(res.data);

    }

    useEffect(() => {
        if (userInfo?.username){
            try {
                fetchActiveStickers();
            } catch(e) {
                
            }
        }
    }, [userInfo, reFetchStickers])

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

            if (isChecked2){

                await axios.post('http://localhost:4000/send-entry', {
                    username: userInfo?.username,
                    tab_name: 'Favorites',
                    volume_id,
                    pages_added: (value - pagesRead),
                    total_pages_read: value,
                    title: book.title
                })

                navigate('/library');

            }

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

    const handleRemove = async() => {

        try {

            await axios.post('http://localhost:4000/deleteBook', {
                username: userInfo?.username,
                volume_id,
                tab_name: 'Favorites'
            })

            navigate('/library');

        } catch(e) {
            console.error({error: e});
        }

    }

  return (
    <div className='create-entry-box'>
        <audio ref={audioRefCheck} src="/checkmark.wav" />


            <div className='create-entry-containerXD'>

                <div className='create-entry-nav'>
                    <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '50%'}}>
                        <div style={{display: 'flex'}} className='create-entry-back' onClick={() => navigate('/library')}>
                            <div style={{display: 'flex', marginRight: '0.2rem'}}><ArrowBack /></div>
                            BACK
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'right', alignItems: 'center', width: '50%'}}>
                        <button className='create-entry-remove' onClick={() => handleRemove()}>REMOVE BOOK</button>
                    </div>
                </div>

                <div style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center'}}>

            <div className='create-entry-section'>
                <div className='create-entry-title'>Create An Entry..</div>
                <div className='create-entry-seg'/>

                <div className='create-entry-sub-title'>
                    Total Pages Completed
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.3rem'}}><Arrow /></div>
                </div>
                <div className='create-entry-slider-container'>
                    <div className='create-entry-pageNum'>
                        <div>{value}&nbsp;</div>
                        <div style={{display: 'flex', fontSize: '0.8125rem', marginBottom: '0.25rem', color: '#9D9D9D', fontWeight: '400'}}>of {maxPage} pages</div>
                    </div>
                    <div class="create-entry-slider-cont">
                        <div style={{display: 'flex', width: '80%', alignItems: 'center', justifyContent: 'center'}}>
                            <div style={{display: 'flex'}} onClick={() => value - 1 < 0 ? setValue(0) : setValue(prev => prev - 1)}><Minus /></div>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'fit-content', position: 'relative'}}>
                                <input type="range" min='0' max={maxPage} value={value} onChange={(e) => setValue(Number(e.target.value))} class="create-entry-slider" id="my-Range"/>
                            </div>
                            <div style={{display: 'flex'}} onClick={() => setValue(prev => (prev + 1) > maxPage ? maxPage : prev + 1)}><Plus /></div>
                        </div>
                    </div>
                </div>

                <div className='create-entry-tick-container'>
                    <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '70%'}}>
                        <div style={{display: 'flex', marginRight: '0.3rem'}}><Clock /></div>
                        Remind me to read again soon
                    </div>
                    <div style={{display: 'flex', justifyContent: 'right', alignItems: 'center', width: '30%'}}>
                        <div className={isChecked ? 'create-entry-checked' : 'create-entry-check'} onMouseEnter={() => setCheckHover(true)} onMouseLeave={() => setCheckHover(false)} onClick={() => {!isChecked && playAudioRefCheck(); callNotif()}}>
                            {checkHover && !isChecked && <Check />}
                            {isChecked && <CheckBig />}
                        </div>
                    </div>
                </div>
                {isChecked && (
                    <div className='create-entry-time-container'>
                        <div>When?</div>
                        <div id='drop' className='create-entry-dropdown' onClick={() => setDropdown(prev => !prev)}>

                            {dropdownItem} 
                            <div style={{display: 'flex', marginLeft: '0.3rem'}}><Arrow2 /></div>
                            
                            {dropdown && (
                                <div className='create-entry-abs'>
                                    {dropdownItem !== `Morning (9AM EST)` && (
                                        <div className='create-entry-abs-item' onClick={() => setDropdownItem(`Morning (9AM EST)`)}>{`Morning (9AM EST)`}</div>
                                    )}
                                    {dropdownItem !== `Afternoon (12PM EST)` && (
                                        <div className='create-entry-abs-item' onClick={() => setDropdownItem(`Afternoon (12PM EST)`)}>{`Afternoon (12PM EST)`}</div>
                                    )}
                                    {dropdownItem !== `Evening (6PM EST)` && (
                                        <div className='create-entry-abs-item' onClick={() => setDropdownItem(`Evening (6PM EST)`)}>{`Evening (6PM EST)`}</div>
                                    )}
                                    {dropdownItem !== `Midnight (12AM EST)` && (
                                        <div className='create-entry-abs-item' onClick={() => setDropdownItem(`Midnight (12AM EST)`)}>{`Midnight (12AM EST)`}</div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                )}

                <div className='create-entry-tick-container' style={{marginTop: '1.6rem'}}>
                    <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: '70%'}}>
                        <div style={{color: '#06AB78'}}>Verify:&nbsp;</div> These pages were read today
                    </div>
                    <div style={{display: 'flex', justifyContent: 'right', alignItems: 'center', width: '30%'}}>
                        <div className={isChecked2 ? 'create-entry-checked' : 'create-entry-check'} onMouseEnter={() => setCheckHover2(true)} onMouseLeave={() => setCheckHover2(false)} onClick={() => {!isChecked2 && playAudioRefCheck(); setIsChecked2(prev => !prev)}}>
                            {checkHover2 && !isChecked2 && <Check />}
                            {isChecked2 && <CheckBig />}
                        </div>
                    </div>
                </div>

                {isChecked2 && (
                    <div className='create-entry-time-container' style={{color: 'gray'}}>
                        * BookBuddy is a game-ified goal setting app for readers, not a database for previous reads
                    </div>
                )}

                <div className='create-entry-button-container'>
                    <button className={isChecked2 ? 'create-entry-button' : 'create-entry-button-void'} onClick={() => sendEntry()} onMouseEnter={() => setNullHover(true)} onMouseLeave={() => setNullHover(false)}>Create Entry</button>
                    {nullHover && !isChecked2 && (<div className='check-error-abs'>* Check off the verification *</div>)}
                </div>

            </div>

            <div className='modify-sticker-section'>
                <div className='modify-sticker'>Manage Stickers</div>
                <div className='create-entry-seg'/>
                <div className='create-entry-sub-title' style={{marginBottom: '0.625rem'}}>Preview</div>
                {book && (
                    <LibraryBook book={book} addingBook={false} isPreview={true} username={userInfo?.username} volumeId={volume_id} index={0} reFetchStickers={reFetchStickers}/>
                )}
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', fontWeight: '400', fontSize: '0.8125rem', marginTop: '2rem', marginBottom: '1rem', color: 'rgb(214, 214, 214)'}}>
                    <div className='line'/>
                    &nbsp;{`Stickers (Click to use)`}&nbsp;
                    <div className='line'/>
                </div>

                <div className='entry-sticker-grid'>
                    {stickers.map((sticker) => (
                        <StickerItem sticker={sticker} hidden={false} volume_id={volume_id} username={userInfo?.username} isPreview={true} activeStickers={activeStickers} setReFetchStickers={setReFetchStickers}/>
                    ))}
                </div>

            </div>

            </div>

        </div>

    </div>
  )
}

export default CreateEntry