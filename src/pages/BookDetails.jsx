import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import {ReactComponent as EditIcon} from '../edit-icon.svg'
import {ReactComponent as BookmarkAddIcon} from '../bookmark-icon.svg'
import {ReactComponent as ArrowRight} from '../ArrowRight.svg'
import {ReactComponent as Refresh} from '../refresh-icon.svg'
import {ReactComponent as StarsNew} from '../star_icon_new.svg'
import {ReactComponent as LeftChevron} from '../left-chevron.svg'
import {ReactComponent as RightChevron} from '../right-chevron.svg'
import {ReactComponent as BookLogo} from '../book_logo.svg'
import AIChat from '../components/AIChat'
import Spinner from '../components/Spinner'
import RatingStatic from '../components/RatingStatic'
import '../BookDetails.css'
import DonutChart from '../components/DonutChart'
import TimelineItem from '../components/TimelineItem'
import PreviewPopup from '../components/PreviewPopup'
import MilestonePopup from '../components/MilestonePopup'
import ItemRewardPopup from '../components/ItemRewardPopup'
import ItemInfo from '../components/ItemInfo'
import EntryTimelinePopup from '../components/EntryTimelinePopup'
import BookInfoPopup from '../components/BookInfoPopup'
import BookRecommendation from '../components/BookRecommendation'

const BookDetails = () => {

  const { volume_id, tab_name } = useParams();
  const [username, setUsername] = useState(null);
  const [rating, setRating] = useState(0);
  const [bookData, setBookData] = useState(null);
  const [infoLoading, setInfoLoading] = useState(true);
  const [description, setDescription] = useState([]);
  const [pages, setPages] = useState([]);
  const [pageValue, setPageValue] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [entryData, setEntryData] = useState([null, null, null, null, null, null]);
  const [tiers, setTiers] = useState([]);
  const [currTier, setCurrTier] = useState('');
  const [reFetchData, setReFetchData] = useState(false);
  const hasFetchedProfile = useRef(false);
  const hasFetchedData = useRef(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [entryArrayLength, setEntryArrayLength] = useState(0);
  const [ratingList, setRatingList] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendations4, setRecommendations4] = useState([]);
  const [recommendations2, setRecommendations2] = useState([]);
  const [openAIChat, setOpenAIChat] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const fetchedRecommendations = useRef(false);


  // Different popups
  const [previewPopup, setPreviewPopup] = useState(false);
  const [milestonePopup, setMilestonePopup] = useState(false);
  const [itemRewardPopup, setItemRewardPopup] = useState(false);
  const [bookInfoPopup, setBookInfoPopup] = useState(false);

  const navigate = useNavigate('/');

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function splitParagraph(paragraph) {
    // Function to remove HTML tags
    function removeHtmlTags(str) {
        return str.replace(/<\/?[^>]+(>|$)/g, "");
    }

    // Remove HTML tags from the paragraph
    const cleanParagraph = removeHtmlTags(paragraph);

    // Split the clean paragraph into sentences using a regular expression
    const sentences = cleanParagraph.match(/[^\.!\?]+[\.!\?]['"]?\s*/g);

    if (!sentences) {
        return [cleanParagraph];
    }

    // Get the first two sentences
    const firstTwoSentences = sentences.slice(0, 2).join(" ");
    
    // Get all sentences except the first two and the last two
    const middleSentences = sentences.slice(2, -2).join(" ");
    
    // Get the last two sentences
    const lastTwoSentences = sentences.slice(-2).join(" ");
    
    return [firstTwoSentences, middleSentences, lastTwoSentences];
}

  const fillTierLine = (percent) =>{

    try {

      if (percent >= 1){

        document.getElementsByClassName('milestone-line-0')[0].style.backgroundColor = '#06AB78'
        setTimeout(() => {
          document.getElementsByClassName('use-line')[0].style.width = '100%';
          setTimeout(() => {
            document.getElementsByClassName('milestone-line-1')[0].style.backgroundColor = '#06AB78'
          }, 488)
        }, 1)
        
      }
      else if (percent >= .75){

        document.getElementsByClassName('milestone-line-0')[0].style.backgroundColor = '#06AB78'
        setTimeout(() => {
          document.getElementsByClassName('use-line')[0].style.width = '63%';
        }, 299)
        
        
      }
      else if (percent >= 0.50){

        document.getElementsByClassName('milestone-line-0')[0].style.backgroundColor = '#06AB78'
        setTimeout(() => {
          document.getElementsByClassName('use-line')[0].style.width = '38%';
        }, 299)
        
      } 
      else if (percent >= 0.25){
        document.getElementsByClassName('milestone-line-0')[0].style.backgroundColor = '#06AB78'
      }
  } catch(e) {

  }


  }

  const getRecommendations = async(data) => {

    if (!fetchedRecommendations.current){

    fetchedRecommendations.current = true;

    const categories = data.volumeInfo.categories[0];
    const authors = data.volumeInfo.authors[0];

    let allRecommendations = [];
        let startIndex = 0;

        while (allRecommendations.length < 4) {
          const similarResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${authors}+${categories}&startIndex=${startIndex}&maxResults=10&key=AIzaSyDdENboInmtpWIgPanFmuOOl4WtDzQZYyQ`, { withCredentials: false });

          const filteredRecommendations = similarResponse.data.items.filter(book => 
            book.id !== volume_id && 
            book.volumeInfo.imageLinks?.smallThumbnail &&
            book.volumeInfo.averageRating &&
            book.volumeInfo?.authors &&
            book.volumeInfo?.categories
          );
          allRecommendations = [...allRecommendations, ...filteredRecommendations];
          startIndex += 10;
          
          if (similarResponse.data.items.length < 10) {
            break; // If fewer than 10 results are returned, stop fetching
          }
        }

        setRecommendations(allRecommendations.slice(0, 3));
        setRecommendations4(allRecommendations.slice(0, 4));
        setRecommendations2(allRecommendations.slice(0, 2));

    }

  }

  const getTiers = async(username) => {

    try {

      const res = await axios.get('http://localhost:4000/fetch-tiers', {
        params: {
          username,
          tab_name,
          volume_id
        }
      })

      setTiers(res.data);
      setTimeout(() => {
        setInfoLoading(false);
        getPages(username);
      }, 600)
      

    } catch(e) {
      console.error({error: e});
    }

  }

  const fillRatingBars = (ratingsArray) => {

    try {
      document.getElementsByClassName('rating-graph-full_1')[0].style.width = `${ratingsArray[1] / ratingsArray[0] * 100}%`;
      document.getElementsByClassName('rating-graph-full_2')[0].style.width = `${ratingsArray[2] / ratingsArray[0] * 100}%`;
      document.getElementsByClassName('rating-graph-full_3')[0].style.width = `${ratingsArray[3] / ratingsArray[0] * 100}%`;
      document.getElementsByClassName('rating-graph-full_4')[0].style.width = `${ratingsArray[4] / ratingsArray[0] * 100}%`;
      document.getElementsByClassName('rating-graph-full_5')[0].style.width = `${ratingsArray[5] / ratingsArray[0] * 100}%`;
    } catch(e) {

    }

    

  }

  const fetchRatingList = async() => {

    try {

      const res = await axios.get('http://localhost:4000/fetch-ratings', {
        params: {
          volume_id
        }
      })

      setRatingList(res.data);
      fillRatingBars(res.data)

    } catch(e) {
      console.error({error: e});
    }

  }


  const get_book_data = async(user) => {
    try {
        const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${volume_id}?key=AIzaSyDdENboInmtpWIgPanFmuOOl4WtDzQZYyQ`, { withCredentials: false });
        setBookData(res.data);
        setDescription(splitParagraph(res.data.volumeInfo?.description));
        getRecommendations(res.data);
        getRating(user);
        fetchData(user);
        getTiers(user);
        fetchRatingList();
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

  const getPages = async(username) => {

    const res = await axios.get('http://localhost:4000/getPages', {
        params: {
            volume_id,
            tab_name,
            username
        }
    })
  
      setPages([res.data[0], res.data[1]]);

      handleChange(res.data[0], res.data[1]);

      fillTierLine(res.data[0] / res.data[1]);
  
  }

  const fetchData = async(username) => {

    try {

      const res = await axios.get('http://localhost:4000/fetch-entries-array', {
        params: {
            username,
            tab_name,
            volume_id,
            index: pageNumber,
            numEntries: windowWidth >= 767 ? 6 : windowWidth >= 451 ? 4 : 3
        }
      })

      setEntryData(res.data);

      const res2 = await axios.get('http://localhost:4000/fetch-entries-array-length', {
        params:{
          username,
          tab_name,
          volume_id
        }
      })

      setEntryArrayLength(res2.data);
      

    } catch(e) {
      console.error(e);
    }
    


  

  }

  // Fetch the user profile (username)
  useEffect(() => {

    const fetchProfile = async () => {
      if (!hasFetchedProfile.current) {
        hasFetchedProfile.current = true;
          try {
              const response = await axios.get('http://localhost:4000/profile', {
              withCredentials: true,
              });
              
              setUsername(response.data.user.username);
              get_book_data(response.data.user.username);
              


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

  }, [previewPopup, pageNumber])

  function getFormattedDate() {
    const date = new Date();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const getOrdinalSuffix = (day) => {
        if (day > 3 && day < 21) return 'th'; // covers 11th to 13th
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
}

const handleChange = (e, total) => {

  setPageValue(e);
  setPercentage(e / total);

  const value = (e / total) * 100;

  try {
    if (value <= 50){
      document.getElementsByClassName('enter-entry-input-fill')[0].style.width = `${1 + value}%`;
    } else {
      document.getElementsByClassName('enter-entry-input-fill')[0].style.width = `${value}%`;
    }
  } catch(e) {

  }

  

}

const clickTier = async(tier) => {

  if ((pages[0] / pages[1] >= tier / 4.0) && tiers[tier-1] === false){

    await axios.post('http://localhost:4000/process-claim', {
      username,
      volume_id,
      tab_name,
      tier
    })

    const res = await axios.get('http://localhost:4000/fetch-tiers', {
      params: {
        username,
        tab_name,
        volume_id
      }
    })

    setTiers(res.data);

    setCurrTier(tier);

    setItemRewardPopup(true);

}

}

useEffect(() => {
  const handleClick = (event) => {
    
    if (event.button === 0) {

        if (event.target.id !== 'info-button' && event.target.id !== 'info-button-detailed'){

          if (!event.target.classList.contains('timeline-item-icon') && !event.target.classList.contains('timeline-item')){
            document.getElementsByClassName('timeline-item-active')[0]?.classList?.remove('timeline-item-active');
          }
    
          document.getElementsByClassName('timeline-item-info-active')[0]?.classList?.remove('timeline-item-info-active');

        } else if (event.target.id === 'info-button'){
          setTimeout(() => {
            document.getElementsByClassName('timeline-item-info-active')[0]?.classList?.remove('timeline-item-info-active');
          }, 15)
        }

    }

  };


  document.addEventListener('click', handleClick);

  // Cleanup the event listener on component unmount
  return () => {
    document.removeEventListener('click', handleClick);
  };
}, []);

function getFirstTwoSentences(paragraph) {
  // Split the paragraph into sentences
  const sentences = paragraph?.match(/[^\.!\?]+[\.!\?]+/g);
  
  // Check if there are at least two sentences
  if (sentences && sentences.length >= 3) {
      // Join the first two sentences and return
      return sentences[0] + '' + sentences[1] + '' + sentences[2];
  }
  
  // If there are fewer than two sentences, return the paragraph as is
  return paragraph;
}

useEffect(() => {
  const popup = document.querySelector('.book-details-main-container');
  const handleScroll = () => {
    const navbar = document.querySelector('.book-details-navbar');
    if (popup.scrollTop > 50) {
      navbar.classList.add('book-details-navbar-scrolled');
      navbar.classList.remove('book-details-navbar-default');
    } else {
      navbar.classList.remove('book-details-navbar-scrolled');
      navbar.classList.add('book-details-navbar-default');
    }
  };

  popup.addEventListener('scroll', handleScroll);

  // Cleanup the event listener on component unmount
  return () => {
    popup.removeEventListener('scroll', handleScroll);
  };
}, []);
  return (
    
    <div className='entire-container'>
      {previewPopup && <PreviewPopup hasFetchedProfile={hasFetchedProfile} username={username} volume_id={volume_id} tab_name={tab_name} setPreviewPopup={setPreviewPopup} entryDate={getFormattedDate()} pages_added={pageValue - pages[0]} total_pages_read={pageValue} streak={isNaN(entryData[0]?.streak?.days) ? 0 : entryData[0]?.streak?.days + 1}/>}
      {milestonePopup && <MilestonePopup setMilestonePopup={setMilestonePopup} title={bookData?.volumeInfo?.title} username={username} volume_id={volume_id} tab_name={tab_name}/>}
      {itemRewardPopup && <ItemRewardPopup tier={currTier} setItemRewardPopup={setItemRewardPopup} username={username} volume_id={volume_id} tab_name={tab_name}/>}
      {bookInfoPopup && <BookInfoPopup summary={splitParagraph(bookData?.volumeInfo.description)} setBookInfoPopup={setBookInfoPopup} bookData={bookData}/>}
    <div className={previewPopup || milestonePopup || itemRewardPopup || bookInfoPopup ? 'book-details-main-container' + ' ' + 'popup-filter' : 'book-details-main-container'}>
      
    
      {(!openAIChat || isMinimized) && !infoLoading && (
        <div className='ai-chat' onClick={() => {setOpenAIChat(true); setIsMinimized(false)}}>
          <div className='ai-chat-icon-closed-container'>
            <img className="ai-chat-icon-closed" src="/planet_icon.png"/>
          </div>
        </div>
      )}

      {openAIChat && (
        <div className='ai-chat'><AIChat setOpenAIChat={setOpenAIChat} setIsMinimized={setIsMinimized} isMinimized={isMinimized} title={bookData?.volumeInfo.title}/></div>
      )}
      
      
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
          <div className='navbar-item' onClick={() => navigate('/rewards')}>
            Rewards
          </div>
          <div className='navbar-item' onClick={() => navigate('/storage')}>
            Storage
          </div>
        </div>
      </section>

      <section className='book-details-main-section'>



        {infoLoading && (<div className='spinner-box'><Spinner /></div>)}

       
<div className='book-details-left'>

          <div className='left-container-1'>
              <div className='general-flex'>

                <div className='info-cover-container' style={{marginRight: `${windowWidth >= 914 ? '3rem' : '0rem'}`}}>
                  {windowWidth >= 914 ? (<img id='info-cover' src={bookData?.volumeInfo?.imageLinks?.large !== undefined ? bookData?.volumeInfo?.imageLinks?.large : 
                    'http://books.google.com/books/publisher/content?id=Z5nYDwAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE71w0_tgIHfDMwhEsvV-pEgZJhDOzyolKwNKjxdBne8QcH_cUZmfHby5Yem38_R8itwP5Oa0wKe2ygqV8APiUmP35Fpb568w3g-eGs5-5rc5zVgNLHRfTotPzpj7QrrfoYrtIp-9&source=gbs_api'
                  } className="info-cover"/>) : ''}
                  
                  {windowWidth >= 914 ? (<div className='info-cover-blur'>
                    <img src={bookData?.volumeInfo?.imageLinks?.large} className="info-cover"/>
                  </div>) : ''}
                  
                </div>

                <div className='info-grid'>
                  <div className='info-grid-flex-temp'>
                    {windowWidth < 914 ? (<img id='info-cover' src={bookData?.volumeInfo?.imageLinks?.large} className="info-cover-temp"/>) : ''}
                    <div className='info-grid-temp'>
                      <div className="info_top_title">{bookData?.volumeInfo?.title}</div>
                      <div className="info_top_author">{bookData?.volumeInfo?.authors[0]}</div>
                      <div className='info-top-subinfo'>Published on {bookData?.volumeInfo?.publishedDate} &#183; By {bookData?.volumeInfo?.publisher}</div>
                    </div>
                  </div>
                  <div className="info-bar" />
                  <div className='reading-stats-container'>
                    <div className="reading-overview">
                      Reading Overview
                    </div>

                    <div className="reading-overview-flex">
                      <div className="reading-overview-grid">
                        <div className='reading-overview-header'>
                          STARTED
                        </div>
                        <div className='reading-overview-data'>
                          May 15
                        </div>
                      </div>

                      <div className='center-bar'/>

                      <div className="reading-overview-grid">
                        <div className='reading-overview-header'>
                          FINISHED
                        </div>
                        <div className='reading-overview-data'>
                            Not Yet
                        </div>
                      </div>

                      <div className='center-bar'/>

                      <div className="reading-overview-grid">
                        <div className='reading-overview-header'>
                          {`READ (APROX.)`}
                        </div>
                        <div className='reading-overview-data'>
                            30 Hrs
                        </div>
                      </div>

                      <div className='center-bar'/>

                      <div className="reading-overview-grid">
                        <div className='reading-overview-header'>
                          STATUS
                        </div>
                        <div className='reading-overview-data'>
                            Reading
                        </div>
                      </div>

                    </div>

                  </div>

                  <div className="overview-buttons-container">

                      <button className='edit-overview'>
                        <div style={{marginRight: '0.5rem', display: 'flex'}}>
                          <EditIcon />
                        </div>
                        <div>
                          Take Notes
                        </div>
                      </button>

                      <button className='view-info' onClick={() => setBookInfoPopup(true)}>
                        View Info
                      </button>

                      <div className='bookmark-icon'>
                        <div>
                          <BookmarkAddIcon />
                        </div>
                        <div>
                          {windowWidth >= 576 ? 'Add to Favorites' : ''}
                        </div>
                        
                      </div>

                  </div>

                </div>

              </div>
          </div>

        <div className='left-container-flex'>
          <div className='left-container-holder'>

          <div className='left-container-4'>
          <div style={{display: 'flex', justifyContent: 'left', alignItems: 'left'}}>
            <div className='rate-and-remark'>Ratings</div>
          </div>
          <div className='remark-desc'>A global and BookBuddy distribution</div>
            <div className='ratings-remarks-container'>
                <div className='rating-container'>
                    <div className='rating'>
                      {`${rating}.0`}
                    </div>
                    <div className='ratings-static'>
                      <RatingStatic tabName={tab_name} volumeId={volume_id} rating={rating} />
                    </div>
                    <div className='average-rating'>Against a Global {bookData?.volumeInfo?.averageRating} avg</div>
                </div>

              <div className='rating-graph'>

                  <div className='rating-graph-flex'>
                    <div className='rating-number'>5</div>
                    <div className='rating-graph-empty'>
                      <div className='rating-graph-full_5'/>
                    </div>
                  </div>

                  <div className='rating-graph-flex'>
                    <div className='rating-number'>4</div>
                    <div className='rating-graph-empty'>
                      <div className='rating-graph-full_4'/>
                    </div>
                  </div>

                  <div className='rating-graph-flex'>
                    <div className='rating-number'>3</div>
                    <div className='rating-graph-empty'>
                      <div className='rating-graph-full_3'/>
                    </div>
                  </div>

                  <div className='rating-graph-flex'>
                    <div className='rating-number'>2</div>
                    <div className='rating-graph-empty'>
                      <div className='rating-graph-full_2'/>
                    </div>
                  </div>

                  <div className='rating-graph-flex'>
                    <div className='rating-number'>1</div>
                    <div className='rating-graph-empty'>
                      <div className='rating-graph-full_1'/>
                    </div>
                  </div>

                  <div className='rating-graph-sub'>Based off of {ratingList[0]} {ratingList[0] > 1 ? 'reviews' : 'review'} on BookBuddy</div>

              </div>

            </div>
          </div>

          <div className='left-container-2'>

            <div>
              <div className='summary'>
                Summary 
              </div>
              <div className='arrow-right' onClick={() => setBookInfoPopup(true)}>
                <ArrowRight />
              </div>
            </div>

            <div className='summary-text'>
                <div className='summary-0'>
                  {description[0]}
                </div>
                <br></br>
                <div className='summary-1'>
                  {getFirstTwoSentences(description[1])}
                </div>
            </div>

          </div>

          </div>

          <div className='recommended-books-container'>
            <div className='rec-books-arrow'>
              <div className='summary'>Recommendations</div>
            </div>
            <div className='rec-books-cont'>
            {windowWidth <= 767 && windowWidth >= 451 ? 

              recommendations4.map((res, index) => (
                <BookRecommendation book={res}/>
              )) :

              windowWidth <= 451 ? 

              recommendations2.map((res, index) => (
                <BookRecommendation book={res}/>
              )) :

              recommendations.map((res, index) => (
                <BookRecommendation book={res}/>
              ))

            }
            </div>
            
            
          </div>

        </div>

        </div>

        <div className='book-details-right'>

            <div className='bmar-flex'>
              <div><StarsNew /></div>
              <div className='bmar-grid'>
                <div className='bmar'>Book Management and Rewards</div>
                <div style={{color: '#6d6f75'}}>Claim tier rewards or submit page entries</div>
              </div>
            </div>

        <div className='top-right-flex'>
            <div className='tiers-container' onClick={(e) => {e.target.id !== 'tier-item' ? setMilestonePopup(true) : setMilestonePopup(false)}}>

            <div className='enter-entry-title'>
              <div style={{display: 'flex', marginLeft: '1rem'}}>
                Reading Milestone
              </div>
            </div>

            <div className='enter-entry-subtitle' style={{display: 'flex', marginLeft: '1rem'}}>{Math.floor(percentage * 4)} out of 4 rewards</div>

            <div className='milestone-line-container'>

              <div className='milestone-line'>
                <div className='milestone-line-0'/>
                <div className='milestone-line-1'/>

                <div className='sub-line-container'>

                  <div className='milestone-sub-line'>

                    <div className='use-line'/>

                      <div className='milestone-items-container'>
                        <div className='tier-item-grid'>
                          <img id='tier-item' src='/mail_icon.png' className={`tier1-item ${tiers[0] === false && percentage >= 0.25 && (pages[0] / pages[1] >= 0.25) ? 'item-bounce' : ''}`} onClick={() => clickTier(1)}/>
                          <div className={`tier-text ${percentage >= 0.25 && (pages[0] / pages[1] >= 0.25) ? 'tier-text-green' : ''}`}>
                            <div>
                              25% Read
                            </div>
                            <div className='tier-level-text'>
                              Tier I
                            </div>
                          </div>
                        </div>
                        <div className='tier-item-grid'>
                          <img id='tier-item' src='/package_icon.png' className={`tier2-item ${tiers[1] === false && percentage >= 0.5 && (pages[0] / pages[1] >= 0.5) ? 'item-bounce' : ''}`} onClick={() => clickTier(2)}/>
                          <div className={`tier-text ${percentage >= 0.5 && (pages[0] / pages[1] >= 0.5) ? 'tier-text-green' : ''}`}>
                            <div>
                              50% Read
                            </div>
                            <div className='tier-level-text'>
                              Tier II
                            </div>
                          </div>
                        </div>
                        <div className='tier-item-grid'>
                          <img id='tier-item' src='/crate_drop.png' className={`tier3-item ${tiers[2] === false && percentage >= 0.75 && (pages[0] / pages[1] >= 0.75) ? 'item-bounce' : ''}`} onClick={() => clickTier(3)}/>
                          <div className={`tier-text ${percentage >= 0.75 && (pages[0] / pages[1] >= 0.75) ? 'tier-text-green' : ''}`}>
                            <div>
                              75% Read
                            </div>
                            <div className='tier-level-text'>
                              Tier III
                            </div>
                          </div>
                        </div>
                        <div className='tier-item-grid'>
                          <img id='tier-item' src='/present_icon.png' className={`tier4-item ${tiers[3] === false && percentage >= 1 && (pages[0] / pages[1] >= 1) ? 'item-bounce' : ''}`} onClick={() => clickTier(4)}/>
                          <div className={`tier-text ${percentage >= 1 && (pages[0] / pages[1] >= 1) ? 'tier-text-green' : ''}`}>
                            <div>
                              100% Read
                            </div>
                            <div className='tier-level-text'>
                              Tier IV
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>

            </div>
          </div>
          <div className='top-right-flex'>

            <div className='enter-entry-container'>
            

              <div className='enter-entry-grid'>

                <div className='ee-g'>
                  <div className='ee-t'>Record Page Entry</div>
                  <div className='ee-st'>Pages read today</div>
                </div>

              <div className='griddyxD'>
                <div className='enter-entry-flex'>
                    <div className='curr-pages-text'>{pageValue}</div>
                    <div className='out-of-pages-text'>of {pages[1]} pages</div>
                </div>
                {windowWidth < 576 ? (<div className='phone-completed'>{`${Math.floor(percentage * 100)}% Completed`}</div>) : <></>}
              </div>
                <div className='enter-entry-input'>
                    <input 
                      type="range" 
                      min="0" 
                      max={pages[1]} 
                      value={pageValue}
                      className="enter-entry-slider" 
                      id="myRange" 
                      onChange={(e) => handleChange(e.target.value, pages[1])}
                    />
                    <div className='enter-entry-input-fill'/>
                </div>
                <div className='preview-entry'>
                  <button className='preview-entry-button' onClick={() => setPreviewPopup(true)}>Preview Entry</button>
                  <button className='refresh-entry-button' onClick={() => handleChange(pages[0], pages[1])}><Refresh /></button>
                </div>
              </div>
            </div>

            {windowWidth >= 576 ? (
              <div className='donut-chart-container'>
              <div className='donut-container'>
                <DonutChart value={Math.floor(percentage * 100)} />
                <div className='donut-chart-percentage'>
                  <div>{`${Math.floor(percentage * 100)}%`}</div>
                  <div className='percent-completed'>Completed</div>
              </div>
              </div>

            </div>
            ) : <></>}
            

          </div>

          <div className='top-right-flex'>

          <div className='entry-timeline-container'>
            
          <div className='ee-g'>
                  <div className='ee-t'>Reading Timeline</div>
                  <div className='ee-st'>From most recent</div>
                </div>
            
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
              <div className='chevron' onClick={() => {hasFetchedProfile.current = false; pageNumber - 1 >= 0 ? setPageNumber(prev => prev - 1) : setPageNumber(prev => prev)}}>
                <LeftChevron />
              </div>
              <div className='item-entries-grid'>
                {entryData.map((entry, index) => (
                  <TimelineItem icon={entry?.icon} entry={entry} index={index} username={username} tab_name={tab_name} volume_id={volume_id} fetchData={fetchData} getPages={getPages} numEntries={windowWidth >= 767 ? 6 : windowWidth >= 451 ? 4 : 3}/>
                ))}
              </div>
              <div className='chevron' onClick={() => {hasFetchedProfile.current = false; pageNumber + 1 < entryArrayLength ? setPageNumber(prev => prev + 1) : setPageNumber(prev => prev)}}>
                <RightChevron />
              </div>
            </div>
            
          </div>
          
          </div>

        </div>

      </section>

    </div>
  </div>
  )
}

export default BookDetails