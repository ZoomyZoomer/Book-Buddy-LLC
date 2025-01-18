import React from 'react'
import '../createEntry.css'
import axios from 'axios'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import {ReactComponent as Notes} from '../notes.svg'
import {ReactComponent as Book} from '../n-book-circle.svg'
import {ReactComponent as BookWhite} from '../n-book-circle-white.svg'
import {ReactComponent as NoteBook} from '../n-notebook.svg'
import {ReactComponent as NoteBookWhite} from '../n-notebook-white.svg'
import ManageBook from '../components/ManageBook'
import {ReactComponent as LeftArrow} from '../n-left-reg.svg'


const CreateEntry = () => {

    const [value, setValue] = useState(0);
    const [maxPage, setMaxPage] = useState(null);
    const [pagesRead, setPagesRead] = useState(0);
    const [dropdown, setDropdown] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [book, setBook] = useState(null);
    const [stickers, setStickers] = useState([]);
    const [selectedStickers, setSelectedStickers] = useState([]);
    const [reFetchStickers, setReFetchStickers] = useState(false);
    const [optionSelect, setOptionSelect] = useState(true);

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

        setStickers([res.data[0], res.data[1]]);

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

  return (
    <div className='n-book-options-container'>
       
        <div className='n-book-options-box'>

            <div className='n-book-options-left'>
                <div style={{position: 'absolute', display: 'flex', justifyContent: 'left', bottom: '4rem', left: '2rem'}} className='n-back-btn' onClick={() => navigate('/library')}>
                    <div style={{display: 'flex'}}><LeftArrow /></div>
                    <div style={{display: 'flex', color: '#52637D', fontSize: '0.8125rem', marginLeft: '0.4rem'}}>Back to Library</div>
                </div>
                <div style={{display: 'flex', justifyContent: 'left', height: 'fit-content'}}>
                    <div style={{display: 'flex', marginRight: '0.4rem'}}><Notes /></div>
                    <div style={{display: 'flex', position: 'relative', height: 'fit-content'}}>
                        <div className='n-book-options-main-header'>{book?.title ? book.title : 'Loading book...'}</div>
                        <div className='n-book-options-main-abs'>{book?.author}</div>
                    </div>
                </div>
                <div className='n-temp-txt'>
                    <div style={{paddingLeft: '1rem'}}>BOOK INFORMATION</div>
                    <div style={{display: 'flex', justifyContent: 'left', fontSize: '0.8125rem', marginTop: '0.625rem', paddingLeft: '1rem'}}>
                        <div style={{color: '#52637D'}}>Volume ID:&nbsp;</div>
                        <div>{book?.volume_id ? book.volume_id : '...'}</div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'left', fontSize: '0.8125rem', marginTop: '0.3rem', paddingLeft: '1rem'}}>
                        <div style={{color: '#52637D'}}>Title:&nbsp;</div>
                        <div>{book?.title ? book.title : '...'}</div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'left', fontSize: '0.8125rem', marginTop: '0.3rem', paddingLeft: '1rem'}}>
                        <div style={{color: '#52637D'}}>Author:&nbsp;</div>
                        <div>{book?.author ? book.author : '...'}</div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'left', fontSize: '0.8125rem', marginTop: '0.3rem', paddingLeft: '1rem'}}>
                        <div style={{color: '#52637D'}}>Genre:&nbsp;</div>
                        <div>{book?.genre ? book.genre : '...'}</div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'left', fontSize: '0.8125rem', marginTop: '0.3rem', paddingLeft: '1rem'}}>
                        <div style={{color: '#52637D'}}>Page Count:&nbsp;</div>
                        <div>{book?.total_pages ? book.total_pages : '...'}</div>
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'left', marginTop: '4rem'}}>
                    <div className='n-navbar-main-txt' style={{marginBottom: '0.625rem'}}>OPTIONS</div>
                    <div className={optionSelect ? 'n-menu-option-btn-active' : 'n-menu-option-btn'} onClick={() => setOptionSelect(true)}>
                        <div style={{display: 'flex'}}>{optionSelect ? <BookWhite /> : <Book />}</div>
                        <div style={{display: 'flex', marginLeft: '0.4rem'}}>Manage Book</div>
                    </div>
                    <div className={!optionSelect ? 'n-menu-option-btn-active' : 'n-menu-option-btn'} onClick={() => setOptionSelect(false)}>
                        <div style={{display: 'flex'}}>{!optionSelect ? <NoteBookWhite /> : <NoteBook />}</div>
                        <div style={{display: 'flex', marginLeft: '0.4rem'}}>Customize Cover</div>
                    </div>
                </div>
            </div>

            <div className='n-book-options-right'>
                <ManageBook book={book} stickers={stickers} selectedStickers={selectedStickers} setSelectedStickers={setSelectedStickers} username={userInfo?.username}/>
            </div>

        </div>

    </div>
  )
}

export default CreateEntry