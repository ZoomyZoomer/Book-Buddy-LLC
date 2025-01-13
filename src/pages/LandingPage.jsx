import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import '../landingpage.css'
import '../library.css'
import MarketItemShowcase from '../components/MarketItemShowcase'
import StorageItemShowcase from '../components/StorageItemShowcase';
import {ReactComponent as Arrow} from '../pointer-arrow.svg'
import {ReactComponent as Arrow2} from '../hidden-arrow2.svg'
import {ReactComponent as Plus} from '../right-circle.svg'
import {ReactComponent as Minus} from '../left-circle.svg'
import {ReactComponent as Clock} from '../clock.svg'
import {ReactComponent as ProgressArrow} from '../progress_arrow.svg'
import {ReactComponent as ProgressArrow2} from '../progress_arrow2.svg'
import {ReactComponent as QuestionPlus} from '../library-plus-green.svg'
import {ReactComponent as Instagram} from '../instagram.svg'
import {ReactComponent as LinkedIn} from '../linkedin.svg'
import {ReactComponent as Github} from '../github.svg'
import LibraryBookShowcase from '../components/LibraryBookShowcase';
import WarehouseItemShowcase from '../components/WarehouseItemShowcase';
import QuestItemShowcase from '../components/QuestItemShowcase';
import StickerItemShowcase from '../components/StickerItemShowcase';
import axios from 'axios';

function LandingPage() {

  const [reFetchItem, setReFetchItem] = useState(false);
  const [market, setMarket] = useState(undefined);
  const [largeCt, setLargeCt] = useState(7);
  const [itemsMap, setItemsMap] = useState([]);
  const [myCt, setMyCt] = useState(0);
  const [value, setValue] = useState(0);
  const [entrySent, setEntrySent] = useState(false);
  const [sentVal, setSentVal] = useState(-1);
  const [streakClaimed, setStreakClaimed] = useState(false);
  const [miniFire, setMiniFire] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolled2, setIsScrolled2] = useState(false);
  const [availSpaces, setAvailSpaces] = useState();
  const [stickers, setStickers] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const [question1, setQuestion1] = useState(false);
  const [question2, setQuestion2] = useState(false);
  const [question3, setQuestion3] = useState(false);
  const [question4, setQuestion4] = useState(false);
  const [question5, setQuestion5] = useState(false);
  const [question6, setQuestion6] = useState(false);

  const navigate = useNavigate('/');

  const audioRefTorch = useRef(null);
  const audioRefCheck = useRef(null);
  const [warehouse, setWarehouse] = useState([
    [0, 0, 2, 3],
    [0, 2, 2, 3],
    [2, 3, 3, 2],
    [2, 2, 1, 1],
    [3, 2, 1, 7]
  ]);

  const playAudioRefTorch = () => {
    audioRefTorch.current.volume = 0.1;
    audioRefTorch.current.play();
  };

  const playAudioRefCheck = () => {
    audioRefCheck.current.volume = 0.05;
    audioRefCheck.current.play();
  };

  const marketMapLarge = new Map([
    ['9', {id: '9', item_name: 'Warehouse Package', stock: 5, img: 'package_icon', type: 'Loot', use: 'Open it from your Filing Cabinet for a pleasant surprise', desc: 'A dusty, timeworn box with a label barely legible', cost: {coins: false, dollar: false, file: 'file_5', id: '40', amount: 2, discounted_amount: 1}}],
    ['8', {id: '8', item_name: 'Neatly Wrapped Gift', stock: 3, img: 'present_icon', type: 'Loot', use: 'Open it from your Filing Cabinet for a chance at a sticker', desc: "Oh wow, now that's a neatly wrapped gift!", cost: {coins: false, dollar: false, file: 'file_5', id: '40', amount: 4, discounted_amount: 3}}],
    ['7', {id: '7', item_name: 'Tiny Envelope', stock: 5, img: 'mail_icon', type: 'Loot', use: "Open it from your Filing Cabinet for a *tiny* reward", desc: "It doesn't get more tiny than a tiny envelope", cost: {coins: false, dollar: false, file: 'file_2', id: '20', amount: 2, discounted_amount: 1}}]
  ])

  const marketMapSmall = new Map([
    ['0', {id: '0', item_name: 'Cold Brew', stock: 5, img: 'coffee_cup', type: 'Consumable', use: `Refreshes the top portion of the Rewards Market`, desc: 'It’s a lukewarm coffee at best', cost: {coins: true, dollar: false, file: null, amount: 150, discounted_amount: 100}}],
    ['1', {id: '1', item_name: 'Coupon', stock: 5, img: 'coupon', type: 'Consumable', use: 'Discounts the top portion of the Rewards Market', desc: `Coupons for sale? What's the point!?`, cost: {coins: true, dollar: false, file: null, amount: 200, discounted_amount: 125}}],
    ['2', {id: '2', item_name: 'Jar of Jam', stock: 5, img: 'jam', type: 'Consumable', use: "Instantly completes the 'dusting process' of a file", desc: "Just a jar.. of (probably) strawberry jam", cost: {coins: true, dollar: false, file: null, amount: 300, discounted_amount: 200}}]
  ])

const warehouseMap = new Map([
  [0, {display: undefined, name: 'Cleared Space', type: 'Path'}],
  [1, {display: 'bricks', name: 'Bricks', type: 'Obstruction', cost: 26}],
  [2, {display: 'board', name: 'Boards', type: 'Obstruction', cost: 14}],
  [8, {display: 'present_icon', cost: 0, name: 'Mystery Gift', type: 'Lootable'}],
  [9, {display: 'package_icon', cost: 0, name: 'Package', type: 'Lootable'}],
  [10, {display: 'file_1', id: '0', name: 'File', type: 'File', cost: 0, time: {hours: 1, minutes: 0, seconds: 0}}],
  [11, {display: 'file_4', id: '1', name: 'Stat Sheet', type: 'File', cost: 0, time: {hours: 1, minutes: 30, seconds: 0}}],
  [30, {display: 'file_2', id: '20', name: 'Certificate', type: 'File', cost: 0, time: {hours: 4, minutes: 0, seconds: 0}}],
  [31, {display: 'file_3', id: '21', name: 'Love Letter', type: 'File', cost: 0, time: {hours: 5, minutes: 0, seconds: 0}}],
  [50, {display: 'file_5', id: '40', name: 'Diploma', type: 'File', cost: 0, time: {hours: 12, minutes: 0, seconds: 0}}],
  [51, {display: 'file_5', id: '40', name: 'Diploma', type: 'File', cost: 0, time: {hours: 12, minutes: 0, seconds: 0}}],
])

const stickerMap = [
  {sticker_name: 'dapper-bird', sticker_id: '0', location: 0, sticker_display: 'Dapper Bird', sticker_set: {set: 'Christmas', set_item_id: 0, unique_color_name: 'Winter Mint', border_color: '#94F0E7'}},
  {sticker_name: 'holly', sticker_id: '1', location: 1, sticker_display: 'Holly', sticker_set: {set: 'Christmas', set_item_id: 1, unique_color_name: 'Winter Mint', border_color: '#94F0E7'}},
  {sticker_name: 'eagle', sticker_id: '2', location: 0, sticker_display: 'Eagle', sticker_set: {set: 'Breeze', set_item_id: 0, unique_color_name: 'Chill Green', border_color: 'white'}},
  {sticker_name: 'leaves', sticker_id: '3', location: 2, sticker_display: 'Island Leaves', sticker_set: {set: 'Breeze', set_item_id: 1, unique_color_name: 'Chill Green', border_color: 'white'}},
  {sticker_name: 'nemo', sticker_id: '4', location: 1, sticker_display: 'Nemo', sticker_set: {set: 'Ocean', set_item_id: 0, unique_color_name: 'Sea Blue', border_color: 'white'}},
  {sticker_name: 'crab', sticker_id: '5', location: 0, sticker_display: 'Crab', sticker_set: {set: 'Ocean', set_item_id: 1, unique_color_name: 'Sea Blue', border_color: 'white'}},
  {sticker_name: 'spaceship', sticker_id: '6', location: 1, sticker_display: 'Spaceship', sticker_set: {set: 'Space', set_item_id: 0, unique_color_name: 'Space Dark Blue', border_color: 'white'}},
  {sticker_name: 'planet', sticker_id: '7', location: 0, sticker_display: 'Planet', sticker_set: {set: 'Space', set_item_id: 1, unique_color_name: 'Space Dark Blue', border_color: 'white'}},
  {sticker_name: 'blue-bird', sticker_id: '8', location: 0, sticker_display: 'Blue Bird', sticker_set: {set: 'Nature', set_item_id: 0, unique_color_name: 'Nature Green', border_color: 'white'}},
  {sticker_name: 'caterpillar', sticker_id: '9', location: 1, sticker_display: 'Caterpillar', sticker_set: {set: 'Nature', set_item_id: 1, unique_color_name: 'Nature Green', border_color: 'white'}},
]

  useEffect(() => {

    if (market){
      if (itemsMap.length < 5){
        setItemsMap(prev => [...prev, market]);
      } else {
        setItemsMap(prev => [...prev.slice(0,myCt), market, ...prev.slice(myCt + 1)]);
        if (myCt < 4){
          setMyCt(prev => prev + 1);
        } else {
          setMyCt(0);
        }
        
      }
    }


    const val = Math.floor(Math.random() * 2);

    if (val === 0){
      if (largeCt === 9){
        setMarket(marketMapLarge.get('7'));
        setLargeCt(7);
      } else if (largeCt === 7){
        setMarket(marketMapLarge.get('8'));
        setLargeCt(8);
      } else if (largeCt === 8){
        setMarket(marketMapLarge.get('9'));
        setLargeCt(9);
      }
    } else {
      if (largeCt === 9){
        setMarket(marketMapSmall.get('0'));
        setLargeCt(7);
      } else if (largeCt === 7){
        setMarket(marketMapSmall.get('1'));
        setLargeCt(8);
      } else if (largeCt === 8){
        setMarket(marketMapSmall.get('2'));
        setLargeCt(9);
      }
    }

  }, [reFetchItem])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:4000/profile', {
          withCredentials: true,
        });

        if (response.data.user){
            setLoggedIn(true);
        }
        
      } catch (e) {
        console.log(e);
      }
    };

    fetchProfile();
  }, []);

  const lightTorch = () => {
    if (!streakClaimed){
      setMiniFire(true);
      setStreakClaimed(true);
      playAudioRefTorch();
    }
  }

  const validList = [0,10,11,30,31,50];
  
  function findAvailableSpaces(grid) {
    const availableSpaces = [];
    const directions = [
      [1, 0],   // down
      [-1, 0],  // up
      [0, 1],   // right
      [0, -1]   // left
    ];
  
    function bfs(r, c) {
      const queue = [[r, c]];
  
      while (queue.length > 0) {
        const [currentR, currentC] = queue.shift();
  
        // Check all four directions from the current cell
        for (const [dr, dc] of directions) {
          const nr = currentR + dr;
          const nc = currentC + dc;
  
          // Ensure the neighbor is within bounds
          if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[nr].length) {
            if (grid[nr][nc] !== 0 && grid[nr][nc] !== 3) {
              availableSpaces.push([nr, nc]);
            } else if (grid[nr][nc] === 3) {
              // Turn '3' into '0' and add it to the queue to check its neighbors
              grid[nr][nc] = 0;
              queue.push([nr, nc]);
            }
          }
        }
      }
    }
  
    // Iterate through each cell in the grid
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (validList.includes(grid[r][c])) {
          bfs(r, c);  // Start BFS from each '0' found
        }
      }
    }
  
    setAvailSpaces(availableSpaces)
  }

  useEffect(() => {
    findAvailableSpaces(warehouse);
  }, [warehouse])

  const fillBar = () => {
        
    document.getElementById(`fill${0}`).style.height = `${(value / 242) * 100}%`;
    document.getElementById(`fill${1}`).style.height = `${(value / 242) * 100}%`;
    
  }

  const handleSend = () => {
    if (!entrySent){
      setEntrySent(true);
      setSentVal(value);
      fillBar();
      playAudioRefCheck();
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY; // Gets the vertical scroll position
      const triggerPoint = 300; // You can set your scroll trigger point here
      const triggerPoint2 = 400; // You can set your scroll trigger point here

      if (!isScrolled && scrollPosition >= triggerPoint) {
        setIsScrolled(true); // Update state to true once the scroll reaches the trigger point
      }
      if (!isScrolled2 && scrollPosition >= triggerPoint2) {
        setIsScrolled2(true); // Update state to true once the scroll reaches the trigger point
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [cycleText, setCycleText] = useState('Quest');
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {

      setTimeout(() => {
        const elem = document.getElementsByClassName('cycle-text')[0];
        elem?.classList?.remove('hero-flip-in-anim');
        elem?.classList?.add('hero-flip-out-anim');
        setTimeout(() => {
          setCycleText('Game');
          elem?.classList?.remove('hero-flip-out-anim');
          elem?.classList?.add('hero-flip-in-anim');
          setTimeout(() => {
            elem?.classList?.remove('hero-flip-in-anim');
            elem?.classList?.add('hero-flip-out-anim');
            setTimeout(() => {
              setCycleText('Journey');
              elem?.classList?.remove('hero-flip-out-anim');
              elem?.classList?.add('hero-flip-in-anim');
              setTimeout(() => {
                elem?.classList?.remove('hero-flip-in-anim');
                elem?.classList?.add('hero-flip-out-anim');
                setTimeout(() => {
                  setCycleText('Quest');
                  elem?.classList?.remove('hero-flip-out-anim');
                  elem?.classList?.add('hero-flip-in-anim');
                  setCycleCount(prev => prev + 1);
                }, 680)
              }, 2000)
            }, 680)
          }, 2000)
        }, 680);
      }, 2000)

  }, [cycleCount])

  return (
    <div className='landing-page-bg'>

      <audio ref={audioRefTorch} src="/torch.wav" />
      <audio ref={audioRefCheck} src="/scribble.wav" />

      <div className='landing-page-middle'>

        <div className='hero-section'>

            <div className='hero-grid' style={{position: 'relative'}}>

            <div className='hero-circle-0'/>
            <div className='hero-circle-1'/>
            <div className='hero-circle-2'/>
            <div className='hero-circle-3'/>
                <div className='hero-title'>
                  Make Your Reading Habits Feel More Like a <a className='hero-flip'><span className='cycle-text hero-flip-in-anim'>{cycleText}</span><div className='hero-flip-line'/></a>
                </div>
                <div className='hero-desc'>
                  Make reading feel rewarding with milestones, collectibles, and stickers for your books!
                </div>
                <div className='hero-buttons-container'>
                  <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: 'fit-content'}}>
                      <div style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <div className='create-acc-circle'>
                          <img src='/map.png' style={{height: '60%', zIndex: '50'}} className='heromap'/>
                        </div>
                        <div className='start-your-quest' onClick={() => navigate('/register')}>START YOUR QUEST</div>
                      </div>
                  </div>
                  <div className='hero-have-acc' onClick={() => {!loggedIn ? navigate('/signin') : navigate('/library')}}>
                    I HAVE AN ACCOUNT
                  </div>
                </div>

            </div>

            <div id='itemstuff' className='hero-gridX'>
                <div className='hero-item-container'>
                  <MarketItemShowcase market={market} type={1} coupon={true} setReFetchItem={setReFetchItem}/>
                  <div id='bg0' className='hero-item-bg0'/>
                  <div className='hero-item-bg2'/>
                  <div className='hero-arrow'>
                    <div className='s-text'>Use the slider to buy out all of the stock!</div>
                    <div className='s-arrow'><Arrow /></div>
                  </div>
                </div>
                <div className='lootanditems'>
                  <div className='loot-seg'/>
                  <div className='lai-text' style={{display: 'flex'}}>Loot & Items</div>
                  <div style={{display: 'flex'}}><Arrow2 /></div>
                  <div className='loot-seg'/>
                </div>
                <div className='lootanditems-cont'>
                  {itemsMap.map((item, index) => (
                    <StorageItemShowcase file={item} index={index} myCt={myCt} itemsMap={itemsMap}/>
                  ))}
                  {itemsMap.length === 0 && (
                    <>
                      <StorageItemShowcase file={{img: 'no_file'}}/>
                      <StorageItemShowcase file={{img: 'no_file'}}/>
                      <StorageItemShowcase file={{img: 'no_file'}}/>
                      <StorageItemShowcase file={{img: 'no_file'}}/>
                      <StorageItemShowcase file={{img: 'no_file'}}/>
                    </>
                  )}
                </div>
            </div>

        </div>

        <div className='landing-sec2'>
          <div className='lsb-0'>
            <div className='lsb-0-circle'>
              <img className='lsb-0-img' src='/book_stack.png'/>
            </div>   
          </div>
          <div className='lsb-1'>
            <div className='lsb-1-circle'>
              <img className='lsb-1-img' src='/file_4.png'/>
            </div> 
          </div>
          <div className='lsb-2'>
            <div className='lsb-0-circle'>
              <img className='lsb-0-img' src='/basket2.png' style={{transform: 'rotate(15deg)'}}/>
            </div>
          </div>
          <div className='lsb-3'>
            <div className='lsb-1-circle'>
              <img className='lsb-1-img' src='/coin.png' style={{transform: 'rotate(-15deg)'}}/>
            </div> 
          </div>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: 'fit-content'}}>
            <div className='hero-title2' style={{color: 'white'}}>Reading Trackers Don't Have to be Boring</div>
            {isScrolled && (<div className='hero-title-underline'/>)}
            <div className='hero-sub'>Make the action of tracking your reads interactive and fun!</div>
          </div>
          <div className='landing-sec2-container'>
            <div className='step-box'>
                <div className='step-text'>Step 1</div>
                <div className='step-cont'>
                  <div className='step-cont-top'>
                    <div className='step-circle'>
                      <img src='/step1.png' style={{height: '3.6rem', marginRight: '0.3rem'}} className={isScrolled2 && 'step-img'}/>
                    </div>
                    <div className='step-cont-top-grid'>
                      <div className='scg-0'>Record an entry</div>
                      <div className='scg-1'>Quick and easy</div>
                    </div>
                  </div>
                  <div className='create-entry-xd'>
                    <div className='create-entry-pageNum'>
                        <div>{value}&nbsp;</div>
                        <div style={{display: 'flex', fontSize: '0.8125rem', marginBottom: '0.25rem', color: '#9D9D9D', fontWeight: '400'}}>of {242} pages</div>
                    </div>
                    <div class="create-entry-slider-cont" style={{marginTop: '1rem'}}>
                        <div style={{display: 'flex', width: '80%', alignItems: 'center', justifyContent: 'center'}}>
                            <div style={{display: 'flex'}} onClick={() => value - 1 < 0 ? setValue(0) : setValue(prev => prev - 1)}><Minus /></div>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'fit-content', position: 'relative'}}>
                                <input type="range" min='0' max={242} value={value} onChange={(e) => setValue(Number(e.target.value))} class="create-entry-slider" id="my-Range"/>
                            </div>
                            <div style={{display: 'flex'}} onClick={() => setValue(prev => (prev + 1) > 242 ? 242 : prev + 1)}><Plus /></div>
                        </div>
                    </div>
                </div>
                <button className={!entrySent ? 'landing-button' : 'landing-button-sent'} onClick={() => handleSend()}>{!entrySent ? 'CREATE ENTRY' : 'SUCCESSFULLY SENT'}</button>
                </div>
            </div>
            <div className='land-arr' style={{margin: '0 0.5rem 0 1.4rem'}}>{entrySent ? <ProgressArrow /> : <ProgressArrow2 />}</div>
            <div className='step-box'>
                <div className='step-text'>Step 2</div>
                <div className='step-cont'>
                  <div className='step-cont-top'>
                      <div className='step-circle'>
                        <img src='/step2.png' style={{height: '3.6rem'}} className={isScrolled2 && 'step-img'}/>
                      </div>
                      <div className='step-cont-top-grid'>
                        <div className='scg-0'>Add some stickers</div>
                        <div className='scg-1'>We've chosen some for you</div>
                      </div>
                  </div>
                  <div style={{marginTop: '2rem'}}>
                    <LibraryBookShowcase value={sentVal} explore={false} stickers={stickers}/>
                  </div>
                </div>
            </div>
            <div className='land-arr' style={{margin: '0 0.5rem 0 1.4rem'}}>{entrySent ? <ProgressArrow /> : <ProgressArrow2 />}</div>
            <div className='step-box'>
                <div className='step-text'>Step 3</div>
                <div className='step-cont'>

                <div className='step-cont-top'>
                      <div className='step-circle'>
                        <img src='/fire_icon.png' style={{height: '3.8rem', marginLeft: '0.5rem'}} className={isScrolled2 && 'step-img'}/>
                        {miniFire && (
                          <>
                            <img src='/fire_icon.png' className='minixd0'/>
                            <img src='/fire_icon.png' className='minixd1'/>
                            <img src='/fire_icon.png' className='minixd2'/>
                          </>
                        )}
                      </div>
                      <div className='step-cont-top-grid'>
                        <div className='scg-0'>Light your streak</div>
                        <div className='scg-1'>Requires an entry every day</div>
                      </div>
                </div>

                <div className='landing-streak-cont'>
                    <div className='landing-streak-circle'>
                        <img src={streakClaimed ? '/lighter_on.png' : '/lighter_off.png'} className='landing-ligher'/>
                    </div>
                    <div className='landing-streak-info-grid'>
                      <div className='ff15'>Reading Streak: {streakClaimed ? '1 day' : '0 days'}</div>
                      <div className='ff16'>Make a flame once per day after reading a book and logging it!</div>
                      <button className={streakClaimed || !entrySent ? 'light-fire-null' : 'light-fire'} style={{marginTop: '0.7rem'}} onClick={() => lightTorch()}>{!entrySent ? 'REQUIRES ENTRY' : streakClaimed ? 'STREAK ACTIVE' : 'IGNITE'}</button>
                    </div>
                </div>

                </div>
            </div>
          </div>
        </div>

        <div className='landing-sec3'>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: 'fit-content'}}>
            <div className='hero-title2' style={{marginBottom: '0.7rem'}}>Explore Unique Content</div>
            <div className='hero-sub' style={{color: '#454b54'}}>There’s always something to do!</div>
          </div>

          <div className='explore-container'>
              <div className='landing-warehouse-cont'>
              {warehouse.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                  {row.map((item, itemIndex) => (
                    <WarehouseItemShowcase key={itemIndex} index={[rowIndex, itemIndex]} item={item} availSpaces={availSpaces} setWarehouse={setWarehouse} warehouse={warehouse}/>
                  ))}
                </div>
              ))}
                <div className='warehouse-info-arrow'>
                  <div className='warehouse-arrow-flip'><Arrow /></div>
                  <div>Hold-Click to remove <strong>visible</strong> debris</div>
                </div>
                <div className='warehouse-info-sub'>
                  *Destroy debris to uncover hidden secrets
                </div>
              </div>
              <div className='explore-grid'>
                <div className='explore-0'>Side Quests</div>
                <div className='explore-1'>Tidy Up The Warehouse</div>
                <div className='explore-2'>Clear the debris in the warehouse and make space for your files so they can accrue dust over time. Files are an important currency for purchasing items.
                <div style={{marginTop: '2rem'}}>
                  <button className='landing-button2' onClick={() => navigate('/register')}>Let’s Get To Work </button>
                </div>
                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', marginTop: '1rem'}}>
                  <div className='live-count'/>
                  <div className='live-cleared'><strong>72</strong> tiles cleared by users this week</div>
                </div>
                </div>
                <div className='explore-circle'/>
              </div>
          </div>

          <div className='explore-container2'>
            <div className='explore-grid2'>
            <div className='explore-0'>Daily Tasks</div>
                <div className='explore-1'>Complete Daily Quests</div>
                <div className='explore-2'>Complete 3 quests daily from a random selection of over 20 quests. Completing all 3 quests in a day brings you one step closer to achieving an exclusive quest streak reward.
                <div style={{marginTop: '2rem'}}>
                  <button className='landing-button2' onClick={() => navigate('/register')}>Let’s Get Questing</button>
                </div>
                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', marginTop: '1rem'}}>
                  <div className='live-count'/>
                  <div className='live-cleared'><strong>104</strong> quests completed by users this week</div>
                </div>
            </div>
            <div className='explore-circle2'/>
          </div>
          <div className='landing-quest-container'>
            <div style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem'}}>
                <div className='landing-quest-header0'>
                  <div>Book Quests</div>
                  <div className='lqh-0'>New rewards every day!</div>
                </div>
                <div className='landing-quest-header1'>
                  <div className='landing-time-remaining-abs'>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.2rem'}}><Clock /></div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>6 hours</div>
                  </div>
                </div>
            </div>
            <QuestItemShowcase index={0} quest={{title: 'A New Day', quest: 'Read 50 pages', quantity_required: 50}}/>
            <QuestItemShowcase index={1} quest={{title: 'Merchant', quest: 'Buy something from the Market', quantity_required: 1}}/>
            <QuestItemShowcase index={2} quest={{title: 'Something New', quest: 'Add a book to your library', quantity_required: 1}}/>
          
            <div className='landing-quest-arrow'>
              <div>Claim your completed quests!</div>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '0.5rem'}}><Arrow /></div>
            </div>     
                    
          </div>

          </div>

          <div className='explore-container'>
            <div className='landing-sticker-container'>
              <LibraryBookShowcase value={sentVal} explore={true} stickers={stickers}/>
              <div className='lootanditems'>
                  <div className='loot-seg2'/>
                  <div style={{display: 'flex'}}>Sticker Collection</div>
                  <div style={{display: 'flex'}}><Arrow2 /></div>
                  <div className='loot-seg2'/>
              </div>
              <div className='landing-sticker-item-container'>
                {stickerMap.map((sticker) => (
                  <StickerItemShowcase sticker={sticker} stickers={stickers} setStickers={setStickers}/>
                ))}
              </div>
              <div className='warehouse-info-sub'>
                  *Grayed out stickers indicate conflicting position
              </div>
            </div>
            <div className='explore-grid'>
            <div className='explore-0'>Decorations</div>
                <div className='explore-1'>Decorate Your Books</div>
                <div className='explore-2'>Unlock stickers from packages, random drops, or market purchases to decorate your books with! Currently there are 6 sticker sets available, with each set containing 2 unique matching stickers.
                <div style={{marginTop: '2rem'}}>
                  <button className='landing-button2' onClick={() => navigate('/register')}>Let’s Decorate</button>
                </div>
                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', marginTop: '1rem'}}>
                  <div className='live-count'/>
                  <div className='live-cleared'><strong>14</strong> stickers unlocked by users this week</div>
                </div>
            </div>
            <div className='explore-circle'/>
          </div>
          </div>

        </div>

        <div className='landing-sec3'>
          < div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: 'fit-content'}}>
            <div className='hero-title2' style={{marginBottom: '5rem'}}>Have A Question? FAQ</div>
          </div>
          <div className='questions-container'>
                <div className='questions-seg'/>
                <div className='questions-question'>
                  What is Book Buddy?
                  <div className='question-dropdown' onClick={() => setQuestion1(prev => !prev)}><QuestionPlus /></div>
                </div>
                {question1 && (
                  <div className='answer'>
                    Book Buddy is a game-ified reading tracking application designed to make the numbing task of logging your reads to be fun and interactive!
                  </div>
                )}
                <div className='questions-seg'/>
                <div className='questions-question'>
                  Are there social features?
                  <div className='question-dropdown' onClick={() => setQuestion2(prev => !prev)}><QuestionPlus /></div>
                </div>
                {question2 && (
                  <div className='answer'>
                    We currently do not have social features implemented as this is an early release; however, plans are in the making for social features such as:
                    Profles, Reading Leaderboards, Discussion Forums, etc.
                  </div>
                )}
                <div className='questions-seg'/>
                <div className='questions-question'>
                  What if I can’t find a specific book?
                  <div className='question-dropdown' onClick={() => setQuestion3(prev => !prev)}><QuestionPlus /></div>
                </div>
                {question3 && (
                  <div className='answer'>
                    In the scenario in which you're unable to locate your desired book within the database we use, please reach out to us &#40;email below&#41;
                    and we will manually add your desired book to your collection. If doing so, please specify the book ISBN.
                  </div>
                )}
                <div className='questions-seg'/>
                <div className='questions-question'>
                  What do I do if I encounter a bug or glitch?
                  <div className='question-dropdown' onClick={() => setQuestion4(prev => !prev)}><QuestionPlus /></div>
                </div>
                {question4 && (
                  <div className='answer'>
                    It's likely you may encounter an inconsistency on Book Buddy due to oversight; In such a scenario please write to us &#40;email below&#41;
                    and we will resolve the issue promptly.. you may receive a complimentary reward as well!
                  </div>
                )}
                <div className='questions-seg'/>
                <div className='questions-question'>
                  How often will this be updated?
                  <div className='question-dropdown' onClick={() => setQuestion5(prev => !prev)}><QuestionPlus /></div>
                </div>
                {question5 && (
                  <div className='answer'>
                    Book Buddy will recieve updates weekly to resolve minor bugs, as well as updates tri-weekly consisting of additional content to our service.
                    Implementing a dev log will be part of one of these updates :&#41;
                  </div>
                )}
                <div className='questions-seg'/>
                <div className='questions-question'>
                  Can I request a feature to be added?
                  <div className='question-dropdown' onClick={() => setQuestion6(prev => !prev)}><QuestionPlus /></div>
                </div>
                {question6 && (
                  <div className='answer'>
                    Yes, you may request features by emailing us &#40;email below&#41; and you'll shortly hear back from us on whether we'll include it in our 
                    tri-weekly update schedule.
                  </div>
                )}
                <div className='questions-seg'/>
          </div>
        </div>

        <div className='landing-sec3' style={{marginTop: '6rem'}}>
          <div className='landing-contact-container'>
              <div className='contact-circle'>
                <img src='/email_open.png' style={{height: '4rem'}}/>
              </div>
              <div className='contact-0'>Still Have Questions?</div>
              <div className='contact-1'>If you have questions not covered by the FAQ or you have feature requests, contact <a>bookbuddysupport@gmail.com</a> or click the button below!</div>
              <div style={{display: 'flex', justifyContent: 'center', alignContent: 'center', width: '100%', marginTop: '1.5rem'}}><button className='landing-button2'><a style={{textDecoration: 'none', color: 'inherit'}} href="mailto:bookbuddysupport@gmail.com">CONTACT US</a></button></div>
          </div>
        </div>

        <div className='questions-seg' style={{marginTop: '6rem'}}/>
        <div className='footer-grid'>
                <div className='fg0'>Book Buddy LLC · 2024</div>
                <div className='fg1'>
                  <div style={{marginRight: '0.3rem'}}>Designed by <strong>Kamil Wisniewski</strong> </div>
                  <div className='footer-icon'><a style={{display: 'flex'}} href='https://www.instagram.com/kamil.zoom'><Instagram /></a></div>
                  <div className='footer-icon'><a style={{display: 'flex'}} href='https://www.linkedin.com/in/kamil-wisniewski-460b07235/'><LinkedIn /></a></div>
                  <div className='footer-icon'><a style={{display: 'flex'}} href='https://github.com/ZoomyZoomer'><Github /></a></div>
                </div>
        </div>

      </div>

    </div>
  )
}

export default LandingPage