import React, { useState, useEffect, useRef } from 'react'
import '../landingpage.css'
import MarketItemShowcase from '../components/MarketItemShowcase'
import StorageItemShowcase from '../components/StorageItemShowcase';
import {ReactComponent as Arrow} from '../pointer-arrow.svg'
import {ReactComponent as Arrow2} from '../hidden-arrow2.svg'
import {ReactComponent as Plus} from '../right-circle.svg'
import {ReactComponent as Minus} from '../left-circle.svg'
import {ReactComponent as ProgressArrow} from '../progress_arrow.svg'
import {ReactComponent as ProgressArrow2} from '../progress_arrow2.svg'
import LibraryBookShowcase from '../components/LibraryBookShowcase';
import WarehouseItemShowcase from '../components/WarehouseItemShowcase';

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
  const audioRefTorch = useRef(null);
  const audioRefCheck = useRef(null);
  const [warehouse, setWarehouse] = useState([
    [0, 0, 2, 3],
    [0, 2, 2, 3],
    [2, 3, 3, 2],
    [2, 2, 1, 1],
    [1, 2, 1, 7]
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

  return (
    <div className='landing-page-bg'>

      <audio ref={audioRefTorch} src="/torch.wav" />
      <audio ref={audioRefCheck} src="/scribble.wav" />

      <div className='landing-page-middle'>

        <div className='hero-section'>

            <div className='hero-grid'>
                <div className='hero-title'>
                  Make Your Reading Habits Feel More Like a <a className='hero-flip'>Quest <div className='hero-flip-line'/></a>
                </div>
                <div className='hero-desc'>
                  Make reading feel rewarding with milestones, collectibles, and stickers for your books!
                </div>
                <div className='hero-buttons-container'>
                  <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', width: 'fit-content'}}>
                      <div style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                      <div className='hero-create-acc-button'></div>
                      <div className='hero-create-acc-text'>START YOUR QUEST</div>
                        <div className='create-acc-circle'>
                          <img src='/map.png' style={{height: '65%', zIndex: '50'}} className='heromap'/>
                        </div>
                      </div>
                  </div>
                  <div className='hero-have-acc'>
                    I HAVE AN ACCOUNT
                  </div>
                </div>

            </div>

            <div className='hero-grid'>
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
                  <div style={{display: 'flex'}}>Loot & Items</div>
                  <div style={{display: 'flex'}}><Arrow2 /></div>
                  <div className='loot-seg'/>
                </div>
                <div className='lootanditems-cont'>
                  {itemsMap.map((item, index) => (
                    <StorageItemShowcase file={item} index={index} myCt={myCt}/>
                  ))}
                  {itemsMap.length === 0 && (
                    <StorageItemShowcase file={{img: 'no_file'}}/>
                  )}
                </div>
            </div>

        </div>

        <div className='landing-sec2'>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: 'fit-content'}}>
            <div className='hero-title2'>Reading Trackers Don't Have to be Boring</div>
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
            <div style={{margin: '0 0.5rem 0 1.4rem'}}>{entrySent ? <ProgressArrow /> : <ProgressArrow2 />}</div>
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
                    <LibraryBookShowcase value={sentVal}/>
                  </div>
                </div>
            </div>
            <div style={{margin: '0 0.5rem 0 1.4rem'}}>{entrySent ? <ProgressArrow /> : <ProgressArrow2 />}</div>
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
            <div className='hero-title2'>Explore Unique Content</div>
            {isScrolled && (<div className='hero-title-underline'/>)}
            <div className='hero-sub'>There’s always something to do!</div>
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
              </div>
              <div className='explore-grid'>
                <div className='explore-0'>Side Quests</div>
                <div className='explore-1'>Tidy Up The Warehouse</div>
                <div className='explore-2'>Clear the debris in the warehouse and make space for your files so they can accrue dust over time. Files are an important currency for purchasing items.
                <div style={{marginTop: '2rem'}}>
                  <button className='landing-button2'>Let’s Get To Work </button>
                </div>
                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', marginTop: '1rem'}}>
                  <div className='live-count'/>
                  <div className='live-cleared'><strong>72</strong> tiles cleared by users this week</div>
                </div>
                </div>
              </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default LandingPage