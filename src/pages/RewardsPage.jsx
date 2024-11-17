import React from 'react'
import '../rewardsStyles.css';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {ReactComponent as BookLogo} from '../book_logo.svg'
import {ReactComponent as Clock} from '../clock.svg'
import {ReactComponent as BookSquare} from '../book-square.svg'
import QuestItem from '../components/QuestItem';
import ItemRewardPopupWarehouse from '../components/ItemRewardPopupWarehouse';
import AchievementItem from '../components/AchievementItem';
import ErrorNotification from '../components/ErrorNotification';
import MarketItem from '../components/MarketItem';
import ItemInfoPopup from '../components/ItemInfoPopup';
import { loadStripe } from '@stripe/stripe-js';
import PickSticker from '../components/PickSticker';
import BookBuddyNavbar from '../components/BookBuddyNavbar';

function RewardsPage() {

    const [questList, setQuestList] = useState([null, null, null]);
    const [activeQuestList, setActiveQuestList] = useState([]);
    const [showItemPopup, setShowItemPopup] = useState(false);
    const [showItemPopup2, setShowItemPopup2] = useState(false);
    const [reFetchQuests, setReFetchQuests] = useState(false);
    const [reFetchAchievements, setReFetchAchievements] = useState(false);
    const [timeDifference, setTimeDifference] = useState([null,null,null]);
    const [marketTimeDifference, setMarketTimeDifference] = useState([null, null, null]);
    const [dueTime, setDueTime] = useState(null); 
    const [streak, setStreak] = useState(0);
    const [userInfo, setUserInfo] = useState(null);
    const [reFetchCurrency, setReFetchCurrency] = useState(false);
    const [numCoupons, setNumCoupons] = useState(0);
    const [numCoffees, setNumCoffees] = useState(0);
    const [marketTime, setMarketTime] = useState(null);
    const stripePromise = loadStripe('pk_live_51PqPqkDO7zxNZCMgAn5mPpdIvYGJ1YLFYgZuxga5aeX2cnv4521mBkm0t82ixGJY0RXWpwrwW5WIusIv0hI32kwA00PW61ewFJ');

    const [inProgressAchievements0, setInProgressAchievements0] = useState([null, null, null, null, null, null, null, null, null, null, null, null]);
    const [inProgressAchievements1, setInProgressAchievements1] = useState([]);
    const [activeAchievementTab, setActiveAchievementTab] = useState(0);
    const [switchTab, setSwitchTab] = useState(false);
    const [numToClaim, setNumToClaim] = useState(0);
    const [clientAchievements, setClientAchievements] = useState([]);
    const [completedAchievements0, setCompletedAchievements0] = useState([]);
    const [completedAchievements1, setCompletedAchievements1] = useState([]);

    const navigate = useNavigate('/');

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

      const fetchAchievements = async() => {

        try {
    
          const res = await axios.get('/api/fetch-achievements', {
            params: {
              username: userInfo.username
            }
          })
    
          setInProgressAchievements0(res.data[0].slice(0, 12));
          setInProgressAchievements1(res.data[0].length > 12 ? res.data[0].slice(12) : []);

          setCompletedAchievements0(res.data[2].slice(0, 12));
          setCompletedAchievements1(res.data[2].length > 12 ? res.data[2].slice(12) : []);

          console.log(res.data[0].slice(0, 12));
          console.log(res.data[2].slice(0, 12));

          setClientAchievements(res.data[1]);
          setNumToClaim(res.data[3]);
    
        } catch(e) {
          console.error({error: e});
        }
    
      }

    const handleSwitchTab = (tab) => {

      try {

        if (tab && !switchTab){
          document.getElementsByClassName('achievement-line-active')[0]?.classList?.add('grid-active-anim-right');
        } else if (!tab && switchTab) {
          document.getElementsByClassName('achievement-line-active')[0]?.classList?.add('grid-active-anim-left');
        }

      } catch(e) {
        
      }

      setTimeout(() => {
        setSwitchTab(tab); 
        setActiveAchievementTab(0);
      }, 698);

      

    }

    const updateQuestBlock = async(qList, aqList) => {

      let finishedQuests = [];
      finishedQuests = qList.filter((quest, index) => aqList[index].quantity_achieved >= quest.quantity_required);

      if (finishedQuests.length === 3){

        const res = await axios.post('/api/update-streak', {
          username: userInfo.username
        })

        setStreak(res.data);

      }

    }

    const fillStreakBar = () => {

      if (streak === 0){
        document.getElementById('b1').style.backgroundColor = '#f1f1f1';
        document.getElementById('bl1').style.backgroundColor = '#f1f1f1';
        document.getElementById('b2').style.backgroundColor = '#f1f1f1';
        document.getElementById('bl2').style.backgroundColor = '#f1f1f1';
        document.getElementById('b3').style.backgroundColor = '#f1f1f1';
      }

      if (streak === 1){
        document.getElementById('b1').style.backgroundColor = '#06AB78';
      } 

      if (streak === 2){
        document.getElementById('b1').style.backgroundColor = '#06AB78';
        document.getElementById('bl1').style.backgroundColor = '#06AB78';
        document.getElementById('b2').style.backgroundColor = '#06AB78';
      }

      if (streak >= 3){
        document.getElementById('b1').style.backgroundColor = '#06AB78';
        document.getElementById('bl1').style.backgroundColor = '#06AB78';
        document.getElementById('b2').style.backgroundColor = '#06AB78';
        document.getElementById('bl2').style.backgroundColor = '#06AB78';
        document.getElementById('b3').style.backgroundColor = '#06AB78';
      }

    }

    const fetchQuests = async() => {

      try {

        const res = await axios.get('/api/fetch-quests', {
            params: {
                username: userInfo.username
            }
        })

        setQuestList(res.data[0]);
        setActiveQuestList(res.data[1]);
        setStreak(res.data[2]);
        setDueTime(res.data[3]);

        updateQuestBlock(res.data[0], res.data[1], streak);
        fetchAchievements();


      } catch(e) {
        console.error({error: e});
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
      if (userInfo?.username){
        fetchQuests();
      }
    }, [userInfo, reFetchQuests, reFetchAchievements])

    useEffect(() => {
      if (userInfo?.username){
        fetchAchievements();
      }
    }, [userInfo, reFetchAchievements])

    useEffect(() => {
      fillStreakBar();
    }, [streak])

    useEffect(() => {
      if (userInfo?.username){
        fetchCurrency();
      }
    }, [userInfo, reFetchCurrency, reFetchAchievements])

    const [marketInfo, setMarketInfo] = useState([null, null, false, false]);
    const [reFetchMarket, setReFetchMarket] = useState(false);
    const [numStickers, setNumStickers] = useState(1);

  const fetchMarket = async() => {

    if (userInfo?.username){

      const res = await axios.get('/api/fetch-market', {
        params: {
          username: userInfo.username
        }
      })

      setMarketInfo(res.data);
      setNumCoupons(res.data[3]);
      setNumCoffees(res.data[4]);
      setMarketTime(res.data[5]);
      setNumStickers(res.data[6]);
      
    }

  }

  useEffect(() => {
    if (userInfo?.username){
      fetchMarket();
    }
  }, [userInfo, reFetchMarket, reFetchAchievements])

    useEffect(() => {

          setTimeout(() => {
              let firstDate = new Date();
              let secondDate =  new Date(dueTime); // This is the current date and time

              // Calculate the difference in milliseconds
              let differenceInMs = secondDate - firstDate; // This gives you the difference in milliseconds

              // Convert milliseconds to hours, minutes, and seconds
              let differenceInSeconds = Math.floor(differenceInMs / 1000);
              let differenceInMinutes = Math.floor(differenceInSeconds / 60);
              let differenceInHours = Math.floor(differenceInMinutes / 60);

              let seconds = differenceInSeconds % 60;
              if (seconds === 60){
                  seconds = 0;
              }
              let minutes = differenceInMinutes % 60;
              if (minutes === 60){
                  minutes = 59;
              }
              let hours = differenceInHours;

              setTimeDifference([hours, minutes, seconds]);

              if (hours <= 0 && minutes <= 0 && seconds <= 0){
                fetchQuests();
              }
             

          }, 1000)

  }, [timeDifference])

  useEffect(() => {

    setTimeout(() => {
        let firstDate = new Date();
        let secondDate =  new Date(marketTime); // This is the current date and time

        // Calculate the difference in milliseconds
        let differenceInMs = secondDate - firstDate; // This gives you the difference in milliseconds

        // Convert milliseconds to hours, minutes, and seconds
        let differenceInSeconds = Math.floor(differenceInMs / 1000);
        let differenceInMinutes = Math.floor(differenceInSeconds / 60);
        let differenceInHours = Math.floor(differenceInMinutes / 60);

        let seconds = differenceInSeconds % 60;
        if (seconds === 60){
            seconds = 0;
        }
        let minutes = differenceInMinutes % 60;
        if (minutes === 60){
            minutes = 59;
        }
        let hours = differenceInHours;

        setMarketTimeDifference([hours, minutes, seconds]);

        if (hours <= 0 && minutes <= 0 && seconds <= 0){
          fetchMarket();
        }
       

    }, 1000)

}, [marketTimeDifference])

  const handleClick = async() => {

    if (streak >= 3){

      setShowItemPopup2(true);

      await axios.post('/api/update-streak-reward', {
        username: userInfo.username
      })

      fetchQuests();
      fillStreakBar();

    }

  }

  const audioRefPop = useRef(null);

  const playAudioRefPop = () => {
    audioRefPop.current.volume = 0.1;
    audioRefPop.current.play();
  };

  const [showError, setShowError] = useState(false);
  const errorRef = useRef({});
  const [resetSlide, setResetSlide] = useState(0);
  const [slideNum, setSlideNum] = useState(0);

  useEffect(() => {

    console.log('check');
    setTimeout(() => {
      try{

        document?.getElementById('coupon')?.classList?.remove('market-banner-top');
        document?.getElementById('coupon')?.classList?.add('coupon-move-right');

        setTimeout(() => {
          document?.getElementById('coupon')?.classList?.remove('coupon-move-right');
          document?.getElementById('coupon')?.classList?.add('market-banner-top');

          setTimeout(() => {
            setSlideNum(1);
          }, 70)
          
          setTimeout(() => {
            document?.getElementById('coffee')?.classList?.remove('market-banner-top-coffee');
            document?.getElementById('coffee')?.classList?.add('coffee-move-left');

            setTimeout(() => {
              document?.getElementById('coffee')?.classList?.remove('coffee-move-left');
              document?.getElementById('coffee')?.classList?.add('market-banner-top-coffee');

              setTimeout(() => {
                setSlideNum(0);
                setResetSlide(prev => prev + 1);
              }, 70)
              
            }, 780)

          }, 6000)

        }, 780)

      } catch(e){

      }
    }, 6000)

  }, [resetSlide])

  const [showPopup, setShowPopup] = useState(false);
  const itemInfoRef = useRef({item_name: 'test'});

  const setCoupon = async() => {

    try {

      await axios.post('/api/set-coupon', {
        username: userInfo.username
      })

      fetchMarket();

    } catch(e) {
      if (e?.response?.status === 400){
        errorRef.current = {title: 'Coupon Already Active', message: 'You already have an active coupon'};
        setShowError(true);
      }
      if (e?.response?.status === 409){
        errorRef.current = {title: 'Insufficient Coupons', message: "You don't have any coupons to use"};
        setShowError(true);
      }
      if (e?.response?.status === 500){
        console.error({error: e});
      }
    }

  }

  const setCoffee = async() => {

    try {

      await axios.post('/api/use-coffee', {
        username: userInfo.username
      })

      fetchMarket();

    } catch(e) {
      if (e?.response?.status === 400){
        errorRef.current = {title: 'Insufficient Cold Brew', message: "You don't have cold brew to use"};
        setShowError(true);
      }
      if (e?.response?.status === 500){
        console.error({error: e});
      }
    }

  }

  const location = useLocation();
  const [wasPurchased, setWasPurchased] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {

    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session_id');
    const marketString = params.get('market');
    setValue(params.get('value'));

    if (sessionId && marketString && value && userInfo) {

      axios.get(`/api/verify-payment`, {
        params: {
            session_id: sessionId,
            market: marketString,
            value: value,
            username: userInfo?.username,
        },
    })
    .then(response => {
      if (response.data.paymentSuccess) {
        setWasPurchased(true);
        setShowPopup(true);
      }
    })
    .catch(error => {
        console.error('Error verifying payment:', error);
    });
      
    }

  }, [location, userInfo])



  const [showItemPopup3, setShowItemPopup3] = useState(false);
  const [showItemPopup4, setShowItemPopup4] = useState(false);
  const [displayReward, setDisplayReward] = useState(false);
  const [showPickSticker, setShowPickSticker] = useState(false);
  const [showXp, setShowXp] = useState(false);

  return (
    <div className='rewards-container'>

    <audio ref={audioRefPop} src="/pop.mp3" />

    {showError && <ErrorNotification errorRef={errorRef} setShowError={setShowError} />}

    {showItemPopup && <ItemRewardPopupWarehouse setShowItemPopup={setShowItemPopup} eatItem={false} username={userInfo.username} item={9} setReFetch={setReFetchAchievements} setDisplayReward={setDisplayReward}/>}
    {showItemPopup2 && <ItemRewardPopupWarehouse setShowItemPopup={setShowItemPopup2} eatItem={false} username={userInfo.username} item={8} setReFetch={setReFetchAchievements} setDisplayReward={setDisplayReward}/>}
    {showItemPopup3 && <ItemRewardPopupWarehouse setShowItemPopup={setShowItemPopup3} eatItem={false} value={value} username={userInfo.username} item={14} setReFetch={setReFetchAchievements} setDisplayReward={setDisplayReward}/>}
    {showItemPopup4 && <ItemRewardPopupWarehouse setShowItemPopup={setShowItemPopup4} eatItem={false} value={value} username={userInfo.username} item={15} setReFetch={setReFetchAchievements} setDisplayReward={setDisplayReward}/>}
    {showPickSticker && <PickSticker setShowPickSticker={setShowPickSticker} value={value} setDisplayReward={setDisplayReward} username={userInfo?.username} setShowItemPopup={setShowItemPopup4}/>}
    {(showPopup) && <ItemInfoPopup setShowItemPopup={setShowItemPopup3} setShowPickSticker={setShowPickSticker} setShowPopup={setShowPopup} value={value} market={itemInfoRef.current} wasPurchased={wasPurchased} setWasPurchased={setWasPurchased} username={userInfo?.username}/>}


      <div className={(showPopup || displayReward) ? 'rewards-popup-filter' : 'rewards-container'}>


        <div className='rewards-box'>

        <div className='n-new-nav2' style={{marginBottom: '2rem'}}>
        <div className='n-new-nav-l'>
        <div className='nn-item' onClick={() => navigate('/library')}><img src='/open_book.png' style={{height: '2.4rem', display: 'flex', marginBottom: '0.3rem'}}/></div>
          <div className='nn-item' onClick={() => navigate('/library')}>LIBRARY</div>
          <div className='nn-item' onClick={() => navigate('/storage')}>STORAGE</div>
          <div className='nn-item' onClick={() => navigate('/rewards')}>REWARDS</div>
        </div>
      </div>

            <section className='rewards-shop-container'>

              <div className='rq-title2'>
                <div>Achievements</div>
                <div className='rq-0'>A little something to work towards</div>
              </div>

              <div className='achievement-flex'>
                
                <div className={!switchTab ? 'achievement-grid-active' : 'achievement-grid-inactive'} onClick={() => {handleSwitchTab(false)}}>
                  <div style={{position: 'relative'}}>
                    {`In Progress (${inProgressAchievements0.length + inProgressAchievements1.length})`}
                    {numToClaim > 0? (
                      <div className='toClaim-abs'>{numToClaim}</div>
                    ): <></>}
                  </div>
                  <div className={'achievement-line-inactive'}>
                    <div className={!switchTab ? 'achievement-line-active' : ''}/>
                  </div>
                </div>

                <div className={switchTab ? 'achievement-grid-active' : 'achievement-grid-inactive'} onClick={() => {handleSwitchTab(true)}}>
                  <div>{`Completed (${completedAchievements0.length + completedAchievements1.length})`}</div>
                  <div className={'achievement-line-inactive'}>
                    <div className={switchTab ? 'achievement-line-active' : ''}/>
                  </div>
                </div>

              </div>

              <div className='achievement-box'>
                {!switchTab && (
                  activeAchievementTab === 0 ? inProgressAchievements0.map((achievement, index) => (
                    <AchievementItem achievement={achievement} index={index} clientAchievements={clientAchievements[index]} isCompleted={false} username={userInfo?.username} setReFetchAchievements={setReFetchAchievements} errorRef={errorRef} setShowError={setShowError} playAudioRefPop={playAudioRefPop}/>
                  )): 
                    activeAchievementTab === 1 ? inProgressAchievements1.map((achievement, index) => (
                      <AchievementItem achievement={achievement} index={12 + index} clientAchievements={clientAchievements[12 + index]} isCompleted={false} username={userInfo?.username} setReFetchAchievements={setReFetchAchievements} errorRef={errorRef} setShowError={setShowError} playAudioRefPop={playAudioRefPop}/>
                    )): <></> 
                )}
                {switchTab && (
                  activeAchievementTab === 0 ? completedAchievements0.map((achievement, index) => (
                    <AchievementItem achievement={achievement} index={index} clientAchievements={clientAchievements[999]} isCompleted={true} username={userInfo?.username} setReFetchAchievements={setReFetchAchievements} errorRef={errorRef} setShowError={setShowError} playAudioRefPop={playAudioRefPop}/>
                  )): 
                  activeAchievementTab === 1 ? completedAchievements1.map((achievement, index) => (
                    <AchievementItem achievement={achievement} index={12 + index} clientAchievements={clientAchievements[999]} isCompleted={true} username={userInfo?.username} setReFetchAchievements={setReFetchAchievements} errorRef={errorRef} setShowError={setShowError} playAudioRefPop={playAudioRefPop}/>
                  )): <></>
                )}
                
              </div>

              <div className='achievement-selection-container'>
                {!switchTab && (
                  inProgressAchievements0.length + inProgressAchievements1.length > 12 ? (
                    <>
                      <div className={activeAchievementTab === 0 ? 'ach-circle-active' : 'ach-circle-inactive'} onClick={() => setActiveAchievementTab(0)}/>
                      <div className={activeAchievementTab === 1 ? 'ach-circle-active' : 'ach-circle-inactive'} onClick={() => setActiveAchievementTab(1)}/>
                    </>
                  ): <></>
                )}
                {switchTab && (
                  completedAchievements0.length + completedAchievements1.length > 12 ? (
                    <>
                      <div className={activeAchievementTab === 0 ? 'ach-circle-active' : 'ach-circle-inactive'} onClick={() => setActiveAchievementTab(0)}/>
                      <div className={activeAchievementTab === 1 ? 'ach-circle-active' : 'ach-circle-inactive'} onClick={() => setActiveAchievementTab(1)}/>
                    </>
                  ): <></>
                )}
                
              </div>

            </section>

            <div className='rewards-bottom-flex'>

                <section className='rewards-quests-container'>

                    <div className='rq-title'>
                        <div>Book Quests</div>
                        <div className='rq-0'>New rewards every day!</div>
                        <div className='time-remaining-abs'>
                          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.2rem'}}><Clock /></div>
                          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{((timeDifference[2] < 0) || (timeDifference[2] === null)) ? 'Loading..' : (timeDifference[0] > 1 ? `${timeDifference[0]} hours` : timeDifference[0] === 1 ? `${timeDifference[0]} hour` : timeDifference[1] > 1 ? `${timeDifference[1]} minutes` : timeDifference[1] === 1 ? `${timeDifference[1]} minute` : timeDifference[2] !== 1 ? `${timeDifference[2]} seconds` : `${timeDifference[2]} second`)}</div>
                        </div>
                    </div>

                    {questList.map((quest, index) => (
                      <QuestItem index={index} quest={quest} activeQuest={activeQuestList[index]} setShowItemPopup={setShowItemPopup} username={userInfo?.username} setReFetchQuests={setReFetchQuests}/>
                    ))}

                    <div className='quest-streak-container'>
                        <div className='quest-streak-grid'>
                            <div className='qi-0'>
                                <div>Quest Streak:&nbsp;</div>
                                <div className='qi-2'>{streak !== 1 ? `${streak} days` : `${streak} day`}</div>
                            </div>
                            <div className='qsg-0'>Complete all quests 3 days in a row for a special prize!</div>
                            <div className='quest-streak-flex' style={{marginTop: '1rem'}}>
                                <div id='b1' className='quest-block-0'/>
                                <div id='bl1' className='quest-block-line-0'/>
                                <div id='b2' className='quest-block-0'/>
                                <div id='bl2' className='quest-block-line-0'/>
                                <div id='b3' className='quest-block-0'/>
                            </div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '30%'}}>
                            <div className='quest-streak-item-container' onClick={() => handleClick()}>
                                <img src='/present_icon.png' draggable='false' className={streak >= 3 ? 'quest-streak-item-claim-container quest-img-0' : 'quest-img-0'}/>
                            </div>
                        </div>
                    </div>

                </section>

                <section className='rewards-achievements-container'>

                  <div className='rq-title2'>
                    <div>Rewards Market</div>
                    <div className='rq-0'>Fresh new stock every 6 hours</div>
                    <div className='time-remaining-abs'>
                          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.2rem'}}><Clock /></div>
                          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{((marketTimeDifference[2] < 0) || (marketTimeDifference[2] === null)) ? 'Loading..' : (marketTimeDifference[0] > 1 ? `${marketTimeDifference[0]} hours` : marketTimeDifference[0] === 1 ? `${marketTimeDifference[0]} hour` : marketTimeDifference[1] > 1 ? `${marketTimeDifference[1]} minutes` : marketTimeDifference[1] === 1 ? `${marketTimeDifference[1]} minute` : marketTimeDifference[2] !== 1 ? `${marketTimeDifference[2]} seconds` : `${marketTimeDifference[2]} second`) }</div>
                    </div>
                  </div>

                  <div className='market-section'>

                    <div className='market-section-top'>
                      <div className='market-margin'>
                        <MarketItem type={0} market={marketInfo[0]} coupon={marketInfo[2]} setShowPopup={setShowPopup} itemInfoRef={itemInfoRef} username={userInfo?.username} setReFetchMarket={setReFetchAchievements} errorRef={errorRef} setShowError={setShowError} numStickers={numStickers}/>
                      </div>
                      <div>
                        <MarketItem type={1} market={marketInfo[1]} coupon={marketInfo[2]} setShowPopup={setShowPopup} itemInfoRef={itemInfoRef} username={userInfo?.username} setReFetchMarket={setReFetchAchievements} errorRef={errorRef} setShowError={setShowError} numStickers={numStickers}/>
                      </div>
                    </div>

                    <div className='market-section-bottom'>
                      <div className='market-margin'>
                        <MarketItem type={2} market={{id: '14', item_name: 'Sticker Basket I', type: 'Loot', use: 'Receive a random, non-duplicate sticker', stock: 5, img: 'basket', desc: 'A random sticker fresh off the shelves!', cost: {coins: false, dollar: true, amount: '1.99', discounted_amount: '1.99'}}} coupon={marketInfo[2]} setShowPopup={setShowPopup} itemInfoRef={itemInfoRef} username={userInfo?.username} setReFetchMarket={setReFetchAchievements} errorRef={errorRef} setShowError={setShowError} stripePromise={stripePromise} numStickers={numStickers}/>
                      </div>
                      <div>
                        <MarketItem type={3} market={{id: '15', item_name: 'Sticker Basket II', type: 'Loot', use: 'Choose a sticker from the collection to add to your inventory', stock: 5, img: 'basket2', desc: 'Handpick a sticker to add to your collection', cost: {coins: false, dollar: true, amount: '3.99', discounted_amount: '3.99'}}} coupon={marketInfo[2]} setShowPopup={setShowPopup} itemInfoRef={itemInfoRef} username={userInfo?.username} setReFetchMarket={setReFetchAchievements} errorRef={errorRef} setShowError={setShowError} stripePromise={stripePromise} numStickers={numStickers}/>                      
                      </div>
                    </div>

                  </div>

                  <div className='market-banner'>

                    {slideNum === 0 && (

                        <div id='coupon' className='market-banner-top'>

                        <div className='left-banner'>

                          <div className='market-banner-circle'>
                            <div className='coupon-abs'>
                              <img src='/coupon.png' className='coupon-img'/>
                            </div>
                          </div>

                          <div className='market-banner-text'>
                            <div className='mb-0'>Coupons!!</div>
                            <div className='mb-1'>Apply to receive a discount on your next purchase </div>
                          </div>

                        </div>

                        <div className='right-banner'>

                          <div className='banner-grid'>

                            <div className='banner-use-button-container'>
                              <button className='banner-use-button' onClick={() => setCoupon()}>USE NOW</button>
                            </div>
                            <div className='currently-holding-text'>Currently Holding: {numCoupons}</div>

                          </div>

                        </div>

                        </div>

                    )}
                    

                    {slideNum === 1 && (

                        <div id='coffee' className='market-banner-top-coffee'>

                        <div className='left-banner'>

                          <div className='market-banner-circle'>
                            <div className='coffee-abs'>
                              <img src='/coffee_cup.png' className='coffee-img'/>
                            </div>
                          </div>

                          <div className='market-banner-text'>
                            <div className='mb-0'>Cold Brew</div>
                            <div className='mb-1'>Apply to refresh the market's contents</div>
                          </div>

                        </div>

                        <div className='right-banner'>

                          <div className='banner-grid'>

                            <div className='banner-use-button-container'>
                              <button className='banner-use-button' onClick={() => setCoffee()}>USE NOW</button>
                            </div>
                            <div className='currently-holding-text'>Currently Holding: {numCoffees}</div>

                          </div>

                        </div>

                        </div>

                    )}
                    

                    <div className='market-banner-bottom'>
                        <div className={slideNum === 1 ? 'banner-active' : 'banner-inactive'} onClick={() => setSlideNum(1)}/>
                        <div className={slideNum === 0 ? 'banner-active' : 'banner-inactive'} onClick={() => setSlideNum(0)}/>
                    </div>


                  </div>

                </section>

            </div>

        </div>
        </div>

    </div>
  )
}

export default RewardsPage