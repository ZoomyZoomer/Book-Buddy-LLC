import React, { useState, useEffect, useRef } from 'react'
import '../bookcontents_styles.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RatingStatic from './RatingStatic';
import { useNavigate } from 'react-router-dom';
import {ReactComponent as SendIcon} from '../send_icon.svg'
import {ReactComponent as AIWhite} from '../ai_icon_white.svg'
import {ReactComponent as RefreshIcon} from '../refresh_icon.svg'
import {ReactComponent as PhoneIcon} from '../phone_icon.svg'
import {ReactComponent as ResizeIcon} from '../resize_icon.svg'
import {ReactComponent as PencilIcon} from '../pencil_icon.svg'
import {ReactComponent as SpeechIcon} from '../speech_icon.svg'
import {ReactComponent as AttachIcon} from '../attach_icon.svg'
import ChatMessage from './ChatMessage';
import BookSpecificStats from './BookSpecificStats';
import DeleteEntryPopup from './DeleteEntryPopup';
import ViewItem from './ViewItem';
import Alert from './Alert';

function BookContents() {
    const { volume_id, tab_name } = useParams();
    const [bookData, setBookData] = useState(null);
    const hasFetchedData = useRef(false);
    const [rating, setRating] = useState(0);
    const [userInfo, setUserInfo] = useState({});
    const [infoLoading, setInfoLoading] = useState(true);
    const [chatValue, setChatValue] = useState('');
    const [messages, setMessages] = useState([]);
    const [callValue, setCallValue] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const popUp = useRef({});
    const alert = useRef({});
    const [viewItem, setViewItem] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const [infoDisplay, setInfoDisplay] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [reFetchEntries, setReFetchEntries] = useState(false);
    const navigate = useNavigate('/');

    const get_book_data = async() => {
        try {
            const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${volume_id}`, { withCredentials: false });
            setBookData(res.data);
            console.log(res.data);
            setInfoLoading(false);
        } catch(e) {
            console.error({ error: e });
        }
    }

    const getRating = async(username) => {

        const res = await axios.get('http://localhost:4000/getRating', {
          params: {
            tab_name: tab_name,
            volume_id: volume_id,
            username: username
          }
        })
    
        setRating(res.data);
    
      }
    
    useEffect(() => {
    const fetchProfile = async () => {
        if (!hasFetchedData.current) {
            try {
                const response = await axios.get('http://localhost:4000/profile', {
                withCredentials: true,
                });
                hasFetchedData.current = true;
                setUserInfo(response.data.user);
                get_book_data();
                getRating(response.data.user.username);


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
        }
    };

    fetchProfile();
  }, [volume_id]);

  function stripHTML(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  const handle_send = () => {

    document.getElementById("send_icon").classList.add("send_icon_filled");
    askChatGPT(chatValue);

  }

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: '60%', height: '76%' });
  const innerDivRef = useRef(null);
  const outerDivRef = useRef(null);

  const MIN_WIDTH = 400; // Minimum width in pixels
  const MIN_HEIGHT = 400; // Minimum height in pixels

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('resize-handle')) {
      setIsResizing(true);
    } else {
      setIsDragging(true);
      const innerDiv = innerDivRef.current;
      const offsetX = e.clientX - innerDiv.offsetLeft;
      const offsetY = e.clientY - innerDiv.offsetTop;
      setPosition({ offsetX, offsetY });
      document.getElementById("cb_nb").style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const outerDiv = outerDivRef.current;
      const innerDiv = innerDivRef.current;
      let x = e.clientX - position.offsetX;
      let y = e.clientY - position.offsetY;

      // Ensure the innerDiv stays within the bounds of outerDiv
      x = Math.max(0, Math.min(x, outerDiv.clientWidth - innerDiv.clientWidth));
      y = Math.max(0, Math.min(y, outerDiv.clientHeight - innerDiv.clientHeight));

      innerDiv.style.left = `${x}px`;
      innerDiv.style.top = `${y}px`;
    } else if (isResizing) {
      const outerDiv = outerDivRef.current;
      const innerDiv = innerDivRef.current;
      let newWidth = e.clientX - innerDiv.getBoundingClientRect().left;
      let newHeight = e.clientY - innerDiv.getBoundingClientRect().top;

      // Ensure the innerDiv does not go below the minimum dimensions
      newWidth = Math.max(MIN_WIDTH, Math.min(newWidth, outerDiv.clientWidth - innerDiv.offsetLeft));
      newHeight = Math.max(MIN_HEIGHT, Math.min(newHeight, outerDiv.clientHeight - innerDiv.offsetTop));

      // Convert pixel values to percentages
      const newWidthPercent = (newWidth / outerDiv.clientWidth) * 100;
      const newHeightPercent = (newHeight / outerDiv.clientHeight) * 100;

      setSize({ width: `${newWidthPercent}%`, height: `${newHeightPercent}%` });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    document.getElementById("cb_nb").style.cursor = 'grab';
  };

  async function askChatGPT(question) {

    setMessages((prevMessages) => [...prevMessages, {role: 'user', content: question}]);

    const res = await axios.post('http://localhost:4000/openai-request', {
        question: question,
        title: bookData.volumeInfo.title
    });

    setMessages((prevMessages) => [...prevMessages, {role: 'ai', content: res.data}]);


    document.getElementById("send_icon").classList.remove("send_icon_filled");
    setChatValue('');

  }

  const handleLeftClick = (e) => {
    if (e.button === 0 ){

        document?.getElementsByClassName('timeline_block_active')[0]?.classList?.remove('timeline_block_active');

        if (e.target.id !== 'box'){
            console.log(e.target);
            document?.getElementsByClassName('info_active')[0]?.classList.add('no_opacity');
            document?.getElementsByClassName('info_active')[0]?.classList.remove('info_active');
        } 


    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', (e) => handleLeftClick(e));
  }, [])

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPopupPosition({ x: event.pageX, y: event.pageY}); // Adjust vertical offset as needed
    };
  
    document.addEventListener('mousemove', handleMouseMove);
  
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {

    if (alert.current.message){
        setShowAlert(true);
    }
    
}, [alert.current])
  

    return (
        <div className="entire_container">         
        {showAlert && <Alert alert={alert} setShowAlert={setShowAlert}/>}
        {showPopup && <DeleteEntryPopup popUp={popUp}/>}
        {viewItem && <ViewItem alert={alert} popUp={popUp} setReFetchEntries={setReFetchEntries}/>}
        <div className="book_contents_container">
            {infoLoading && (
                <>
                <div className="loading_bar"><div class="lds-facebook"><div></div><div></div><div></div></div></div>
                </>
            )}
            {!infoLoading && (
            <>

                <div className="book_contents_subcontainer">
                <div className="book_info_container">

                    <div className="info_top_container">
                        <img src={bookData?.volumeInfo?.imageLinks?.smallThumbnail} className="info_cover"/>
                        <div className="info_top_grid">
                            <div className="info_top_title">
                                {bookData?.volumeInfo?.title}
                                <div style={{marginLeft: '140px'}}>
                                    <RatingStatic tabName={tab_name} volumeId={volume_id} rating={rating} />
                                </div>
                            </div>
                            <div className="info_top_author">
                                {bookData?.volumeInfo?.authors[0]}
                            </div>


                            <div className="info_top_divisor"/>


                            <div className="reading_log_text">
                                Reading Log
                            </div>

                            <div className="reading_log_flex">
                                <div className="reading_log_grid">
                                    <div className="reading_log_title">
                                            STARTED
                                    </div>
                                    <div className="reading_log_subtext">
                                        <div className="reading_log_subtext">
                                                May 15
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="reading_log_divisor"/>

                                <div className="reading_log_grid">
                                    <div className="reading_log_title">
                                            FINISHED
                                    </div>
                                    <div className="reading_log_subtext">
                                        <div className="reading_log_subtext">
                                                May 15
                                        </div>
                                    </div>
                                </div>

                                <div className="reading_log_divisor"/>

                                <div className="reading_log_grid">
                                    <div className="reading_log_title">
                                            READ TIME
                                    </div>
                                    <div className="reading_log_subtext">
                                        <div className="reading_log_subtext">
                                                30 hrs
                                        </div>
                                    </div>
                                </div>

                                <div className="reading_log_divisor"/>

                                <div className="reading_log_grid">
                                    <div className="reading_log_title">
                                            STATUS
                                    </div>
                                    <div className="reading_log_subtext">
                                        <div className="reading_log_subtext">
                                                <green>Finished</green>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            
                        </div>
                    </div>
                    <div className="info_bottom_grid">

                        <div className="info_bottom_flex">
                            <div className="info_bottom_flex_left">
                                Number of Pages
                            </div>
                            <div className="info_bottom_flex_right">
                                {bookData?.volumeInfo?.pageCount}
                            </div>
                        </div>

                        <div className="info_bottom_flex">
                            <div className="info_bottom_flex_left">
                                Language
                            </div>
                            <div className="info_bottom_flex_right">
                            {bookData?.volumeInfo?.language === 'en' ? 'English' : bookData?.volumeInfo?.language}
                            </div>
                        </div>

                        <div className="info_bottom_flex">
                            <div className="info_bottom_flex_left">
                                ISBN
                            </div>
                            <div className="info_bottom_flex_right">
                                {bookData?.volumeInfo?.industryIdentifiers[0]?.identifier}
                            </div>
                        </div>

                        <div className="info_bottom_flex">
                            <div className="info_bottom_flex_left">
                                Publisher
                            </div>
                            <div className="info_bottom_flex_right">
                                {bookData?.volumeInfo?.publisher}
                            </div>
                        </div>

                        <div className="info_bottom_flex">
                            <div className="info_bottom_flex_left">
                                Published Date
                            </div>
                            <div className="info_bottom_flex_right">
                                {bookData?.volumeInfo?.publishedDate}
                            </div>
                        </div>

                        <div className="info_bottom_flex">
                            <div className="info_bottom_flex_left">
                                Category(s)
                            </div>
                            <div className="info_bottom_flex_right">
                               {bookData?.volumeInfo?.categories[0]}
                            </div>
                        </div>

                        <div className="info_bottom_flex" style={{margin: '20px 0px 0px 0px'}}>
                            <div className="info_bottom_flex_left">
                                Book Lists
                            </div>
                            <div className="info_bottom_flex_right" onClick={() => navigate(`/bookshelf`)} style={{cursor: 'pointer', color: '#06AB78'}}>
                                {tab_name} / ......
                            </div>
                        </div>

                        <div className="info_bottom_flex_summary" >
                            <div className="info_bottom_flex_left">
                                Summary
                            </div>
                            <div className="summary_text">
                                {stripHTML(bookData?.volumeInfo?.description)}
                            </div>
                        </div>

                    </div>
                </div>

                <BookSpecificStats volume_id={volume_id} tab_name={tab_name} username={userInfo.username} title={bookData.volumeInfo.title} setShowPopup={setShowPopup} popUp={popUp} setViewItem={setViewItem} reFetchEntries={reFetchEntries} alert={alert}/>

                </div>
            </>)}
            
        </div>
        </div>
    )
}

export default BookContents;