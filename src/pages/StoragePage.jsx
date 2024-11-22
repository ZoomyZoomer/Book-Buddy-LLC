import React, { useState } from 'react'
import '../storage-styles.css'
import StorageItem from '../components/StorageItem';
import axios from 'axios'
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {ReactComponent as Arrow} from '../hidden-arrow.svg'
import {ReactComponent as Lightbulb} from '../lightbulb.svg'
import {ReactComponent as LightbulbWhite} from '../lightbulb-white.svg'
import {ReactComponent as Exit} from '../close_icon.svg'
import StickerItem from '../components/StickerItem';
import WarehouseItem from '../components/WarehouseItem';
import ItemRewardPopupWarehouse from '../components/ItemRewardPopupWarehouse';
import ErrorNotification from '../components/ErrorNotification';
import {ReactComponent as BookLogo} from '../book_logo.svg'
import BookBuddyNavbar from '../components/BookBuddyNavbar';
import PickSticker from '../components/PickSticker';
import StickerCollectionItem from '../components/StickerCollectionItem';

const StoragePage = () => {

    const [folderClosed, setFolderClosed] = useState(true);
    const [ownedFiles, setOwnedFiles] = useState([]);
    const [hiddenFiles, setHiddenFiles] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [userInfo, setUserInfo] = useState(null);
    const [barLeft, setBarLeft] = useState(true);
    const [warehouseGrid, setWarehouseGrid] = useState([]);
    const [availableSpaces, setAvailableSpaces] = useState([]);
    const [isAddingFile, setIsAddingFile] = useState(false);
    const [activeIndex, setActiveIndex] = useState([0,0]);
    const [collectableFolderOpen, setCollectableFolderOpen] = useState(false);
    const [reFetchWarehouse, setReFetchWarehouse] = useState(false);

    const stickerCollections = [
        {collection_name: 'The Underwater Collection', collection_stickers: ['4', '5'], collection_stickers_names: 'Crabby Carl and Fishy Fred', icon: 'n-life-saver'},
        {collection_name: 'The Cool Vibes Collection', collection_stickers: ['2', '3'], collection_stickers_names: 'Eagle Edward and Leafy Larry', icon: 'n-lettuce'},
        {collection_name: 'The Winter Time Collection', collection_stickers: ['0', '1'], collection_stickers_names: 'Holly Hank and Darwin the Dapper Bird', icon: 'n-mountains'},
        {collection_name: 'The Outer Space Collection', collection_stickers: ['6', '7'], collection_stickers_names: 'Planet Phil and Rocket Ricky', icon: 'n-planet'}
    ]

    const scrollRef = useRef(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const [activeDrop, setActiveDrop] = useState(false);
    const [swap, setSwap] = useState(false)

    const audioRefOpen = useRef(null);
    const audioRefClose = useRef(null);

    const validList = [0,10,11,30,31,50];

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

    const fillXpBar = (xp) => {
        document.getElementsByClassName('xp-bar')[0].style.width = `${xp % 100}%`;
    }

    const handleScroll = () => {
        if (scrollRef.current) {
          const { scrollTop } = scrollRef.current;
          setIsScrolled(scrollTop > 0); // Update state if not at the top
        }
      };

    const fetchWarehouseGrid = async() => {

        try {

            const res = await axios.get('/api/fetch-warehouse-grid', {
                params: {
                    username: userInfo.username
                }
            })

            setWarehouseGrid(res.data);
            setAvailableSpaces(findAvailableSpaces(res.data));

        } catch(e){
            console.error({error: e});
        }

    }

    const [currency, setCurrency] = useState([0,0]);

    const fetchCurrency = async() => {

        try {

            const res = await axios.get('/api/fetch-currency', {
                params: {
                    username: userInfo.username
                }
            })

            setCurrency(res.data);
            fillXpBar(res.data[1]);

        } catch(e) {
            console.error({error: e});
        }

    }

    const [items, setItems] = useState([]);

    const fetchCollectables = async() => {

        try {

            const res = await axios.get('/api/fetch-items', {
                params: {
                    username: userInfo.username
                }
            })

            setItems(res.data);

        } catch(e) {
            console.error({error: e});
        }

    }

    const [hiddenItems, setHiddenItems] = useState([]);

    const fetchFiles = async() => {

        try {

            const res = await axios.get('/api/fetch-files', {
                params: {
                    username: userInfo.username
                }
            })
            
            setOwnedFiles(res.data[0]);
            setHiddenFiles(res.data[1]);
            setQuantity(res.data[2]);
            setHiddenItems(res.data[3]);

        } catch(e){
            console.error({error: e});
        }

    }

    const [numLockeds, setNumLockeds] = useState([0, 0, 0, 0]);
    const [lockCount, setLockCount] = useState(0);
    const [stickCount, setStickCount] = useState(0);

const calcLockedNum = (sticks) => {
    const updatedNumLockeds = [...numLockeds]; // Create a local copy of the state
    setLockCount(0);
    setStickCount(0);

    for (let i = 0; i < 4; i++) {
        const count = sticks.filter(sticker =>
            stickerCollections[i].collection_stickers.includes(sticker.sticker_id)
        ).length;

        updatedNumLockeds[i] = count; // Update the specific index
        setStickCount(prev => prev + count);
        if (count > 0){
            setLockCount(prev => prev + 1);
        }
    }

    setNumLockeds(updatedNumLockeds); // Update the state after the loop
    console.log(updatedNumLockeds); // Logs the updated state
};

    const [hiddenStickers0, setHiddenStickers0] = useState([]);
    const [hiddenStickers1, setHiddenStickers1] = useState([]);
    const [ownedStickers0, setOwnedStickers0] = useState([]);
    const [ownedStickers1, setOwnedStickers1] = useState([]);

    const [unlockedStickers, setUnlockedStickers] = useState([]);
    const [lockedStickers, setLockedStickers] = useState([]);

    const fetchStickers = async() => {

        try {

            const res = await axios.get('/api/fetch-stickers', {
                params: {
                    username: userInfo.username
                }
            })

            setOwnedStickers0(res.data[0].slice(0, 9));
            setOwnedStickers1(res.data[0].slice(9));

            setUnlockedStickers(res.data[0]);

            res.data[0].length === 0 ? setBarLeft(false) : setBarLeft(true);

            setHiddenStickers0(res.data[1].slice(0, 9));
            setHiddenStickers1(res.data[1].slice(9));

            setLockedStickers(res.data[1]);

            calcLockedNum(res.data[1]);
            

        } catch(e){
            console.error({error: e});
        }

    }

    useEffect(() => {
        if (userInfo?.username !== undefined){
            fetchFiles();
            fetchStickers();
            fetchCollectables();
        }
      }, [userInfo, reFetchWarehouse])

      const playAudioOpen = () => {
        audioRefOpen.current.volume = 0.2;
        audioRefOpen.current.play();
      };

      const playAudioClose = () => {
        audioRefClose.current.volume = 0.1;
        audioRefClose.current.play();
      };

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
      
        return availableSpaces;
      }


      useEffect(() => {
        if (userInfo?.username !== undefined){
            fetchWarehouseGrid();
            fetchCurrency();
        }
      }, [userInfo, reFetchWarehouse])

      const [showItemPopup, setShowItemPopup] = useState(false);
      const [showError, setShowError] = useState(false);
      const errorRef = useRef(null);

      const [item, setItem] = useState(null);
      const [fileWasClaimed, setFileWasClaimed] = useState(false);

      useEffect(() => {
        fetchFiles();
        console.log('were here');
      }, [showItemPopup])

      const [showXp, setShowXp] = useState(false);
      const [folder0, setFolder0] = useState(false);
      const [folder1, setFolder1] = useState(false);
      const [displayReward, setDisplayReward] = useState(false);
      const [eatItem, setEatItem] = useState(false);
      const [switchTab, setSwitchTab] = useState(false);
      const [activeAchievementTab, setActiveAchievementTab] = useState(0);
      const [showPickSticker, setShowPickSticker] = useState(false);

      const handleSwitchTab = (tab) => {

        try {
  
          if (!switchTab){
            document.getElementsByClassName('achievement-line-active')[0]?.classList?.add('grid-active-anim-right');
          } else if (switchTab) {
            document.getElementsByClassName('achievement-line-active')[0]?.classList?.add('grid-active-anim-left');
          }
  
        } catch(e) {
          
        }
  
        setTimeout(() => {
          setSwitchTab(prev => !prev); 
        }, 698);
  
        
      }

  return (
    <div className='storage-container'>

        {showItemPopup && <ItemRewardPopupWarehouse setShowItemPopup={setShowItemPopup} eatItem={eatItem} value={1} username={userInfo.username} item={item} setReFetch={setReFetchWarehouse} setDisplayReward={setDisplayReward}/>}
        {showError && <ErrorNotification errorRef={errorRef} setShowError={setShowError} />}
        {showPickSticker && <PickSticker setShowPickSticker={setShowPickSticker} value={1} setDisplayReward={setDisplayReward} username={userInfo?.username} setShowItemPopup={setShowItemPopup}/>}

        {isAddingFile && (
            <div className='adding-file-banner'>
                <button className='afb-3' onClick={() => {setIsAddingFile(false); document.getElementsByClassName('warehouse-item-active-adding')[0]?.classList?.remove('warehouse-item-active-adding')}}>Exit</button>
                <div className='afb-1'>
                    <div className='afb-0'>Click and Hold a file from your filing cabinet to add it to your Warehouse</div>
                    <div className='afb-2'> <LightbulbWhite /><div style={{marginLeft: '0.3rem'}}>Files in the warehouse will acrue dust over time, increasing their value</div></div>
                </div>
                <div>
                    
                </div>
            </div>
        )}

        <div className={(displayReward) ? 'rewards-popup-filter' : 'storage-container'}>

        <div className='storage-box'>
 
            <div className='storage-top-flex'>

                <div className='warehouse-container'>

                    <div className='warehouse-box'>

                        <div className='stickers-title'>
                            <div>The Warehouse</div>
                            <div className='ss-0'>Let your files collect some dust, maybe they'll turn useful</div>
                        </div>
                        <div className='warehouse-real'>
                            {warehouseGrid.map((section, sectionIndex) => (
                                <>
                                    {section.map((item, itemIndex) => (
                                        <WarehouseItem item={item} setEatItem={setEatItem} index={[sectionIndex, itemIndex]} availSpaces={availableSpaces} username={userInfo.username} setReFetchWarehouse={setReFetchWarehouse} setIsAddingFile={setIsAddingFile} isAddingFile={isAddingFile} setActiveIndex={setActiveIndex} setShowItemPopup={setShowItemPopup} setItem={setItem} setFileWasClaimed={setFileWasClaimed} setShowError={setShowError} errorRef={errorRef}/>
                                    ))}
                                </>
                            ))}
                        </div>

                    </div>

                </div>

                <div className='cabinet-container'>
                    
                    <div className='cabinet-title'>
                        <div>Sticker Collection Gallery</div>
                        <div className='ct-0'>Click on a collection for details</div>
                        <div className='n-num-stickers-abs'><div style={{display: 'flex', marginRight: '0.3rem'}}><img src='/n_patch.png' style={{height: '0.9rem'}}/></div>{8 - stickCount}/8 Collected</div>
                    </div>

                    <div className='achievement-flex' style={{marginTop: '2rem'}}>
                
                    <div className={!switchTab ? 'achievement-grid-active' : 'achievement-grid-inactive'} onClick={() => {handleSwitchTab(false)}}>
                        <div style={{position: 'relative'}}>
                            {`In Progress (${lockCount})`}
                        </div>
                        <div className={'achievement-line-inactive'}>
                            <div className={!switchTab ? 'achievement-line-active' : ''}/>
                        </div>
                        </div>

                        <div className={switchTab ? 'achievement-grid-active' : 'achievement-grid-inactive'} onClick={() => {handleSwitchTab(true)}}>
                        <div>{`Completed (${4 - lockCount})`}</div>
                        <div className={'achievement-line-inactive'}>
                            <div className={switchTab ? 'achievement-line-active' : ''}/>
                        </div>
                        </div>

                    </div>

                    <div className={isScrolled ? 'n-sticker-collection-grid n-scrolling' : 'n-sticker-collection-grid'} onScroll={handleScroll} ref={scrollRef}>

                        {numLockeds[0] > 0 && !switchTab && (
                            <StickerCollectionItem index={0} unlockedStickers={unlockedStickers} lockedStickers={lockedStickers} username={userInfo?.username} swap={swap} setSwap={setSwap} activeDrop={activeDrop} setActiveDrop={setActiveDrop}/>
                        )}
                        {numLockeds[0] === 0 && switchTab && (
                            <StickerCollectionItem index={0} unlockedStickers={unlockedStickers} lockedStickers={lockedStickers} username={userInfo?.username} swap={swap} setSwap={setSwap} activeDrop={activeDrop} setActiveDrop={setActiveDrop}/>

                        )}
                        {numLockeds[1] > 0 && !switchTab && (
                            <StickerCollectionItem index={1} unlockedStickers={unlockedStickers} lockedStickers={lockedStickers} username={userInfo?.username} swap={swap} setSwap={setSwap} activeDrop={activeDrop} setActiveDrop={setActiveDrop}/>
                        )}
                        {numLockeds[1] === 0 && switchTab && (
                            <StickerCollectionItem index={1} unlockedStickers={unlockedStickers} lockedStickers={lockedStickers} username={userInfo?.username} swap={swap} setSwap={setSwap} activeDrop={activeDrop} setActiveDrop={setActiveDrop}/>
                        )}
                        {numLockeds[2] > 0 && !switchTab && (
                            <StickerCollectionItem index={2} unlockedStickers={unlockedStickers} lockedStickers={lockedStickers} username={userInfo?.username} swap={swap} setSwap={setSwap} activeDrop={activeDrop} setActiveDrop={setActiveDrop}/>
                        )}
                        {numLockeds[2] === 0 && switchTab && (
                            <StickerCollectionItem index={2} unlockedStickers={unlockedStickers} lockedStickers={lockedStickers} username={userInfo?.username} swap={swap} setSwap={setSwap} activeDrop={activeDrop} setActiveDrop={setActiveDrop}/>
                        )}
                        {numLockeds[3] > 0 && !switchTab && (
                            <StickerCollectionItem index={3} unlockedStickers={unlockedStickers} lockedStickers={lockedStickers} username={userInfo?.username} swap={swap} setSwap={setSwap} activeDrop={activeDrop} setActiveDrop={setActiveDrop}/>
                        )}
                        {numLockeds[3] === 0 && switchTab && (
                            <StickerCollectionItem index={3} unlockedStickers={unlockedStickers} lockedStickers={lockedStickers} username={userInfo?.username} swap={swap} setSwap={setSwap} activeDrop={activeDrop} setActiveDrop={setActiveDrop}/>
                        )}


                    </div>

                    
                  

                </div>

            </div>
            <div className='storage-bottom-flex'>
                

                <div className='stickers-container'>
                    <div className='stickers-title'>
                        <div>Stickers</div>
                        <div className='ss-0'>Great to put on your favorite books!</div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '0.625rem'}}>
                        <div className='stickers-flex'>

                                <div className='stickers-grid'  onClick={() => setBarLeft(true)}>
                                    <div style={{color: barLeft ? '#06AB78' : '#D9D9D9', fontWeight: barLeft ? '500' : '400'}}>{`Found (${ownedStickers0.length + ownedStickers1.length})`}</div>
                                </div>
                                <div className='stickers-grid' onClick={() => setBarLeft(false)}>
                                    <div style={{color: !barLeft ? '#06AB78' : '#D9D9D9', fontWeight: !barLeft ? '500' : '400'}}>{`Hidden (${hiddenStickers0.length + hiddenStickers1.length})`}</div>
                                </div>

                        </div>
                        <div className={barLeft ? 'stickers-slider' : 'stickers-slider-right'}>
                                    <div className='stickers-slider-fill'/>
                                </div>
                    </div>

                    
                    <div className='stickers-box'>
                        <div className='owned-stickers-container'>
                            {barLeft && activeAchievementTab == 0 && (
                                ownedStickers0.map((sticker, index) => (
                                    <StickerItem sticker={sticker} hidden={false} username={userInfo.username} isPreview={false}/>
                                ))
                            )}
                            {barLeft && activeAchievementTab == 1 && (
                                ownedStickers1.map((sticker, index) => (
                                    <StickerItem sticker={sticker} hidden={false} username={userInfo.username} isPreview={false}/>
                                ))
                            )}

                            {!barLeft && activeAchievementTab == 0 && (
                                hiddenStickers0.map((sticker, index) => (
                                    <StickerItem sticker={sticker} hidden={true} username={userInfo.username} isPreview={false}/>
                                ))
                            )}
                            {!barLeft && activeAchievementTab == 1 && (
                                hiddenStickers1.map((sticker, index) => (
                                    <StickerItem sticker={sticker} hidden={true} username={userInfo.username} isPreview={false}/>
                                ))
                            )}
                            
                        </div>
                         <div className='lil-flex'>
                            {!barLeft && (
                            hiddenStickers0.length + hiddenStickers1.length > 9 ? (
                                <>
                                <div className={activeAchievementTab === 0 ? 'ach-circle-active' : 'ach-circle-inactive'} onClick={() => setActiveAchievementTab(0)}/>
                                <div className={activeAchievementTab === 1 ? 'ach-circle-active' : 'ach-circle-inactive'} onClick={() => setActiveAchievementTab(1)}/>
                                </>
                            ): <></>
                            )}
                            {barLeft && (
                            ownedStickers0.length + ownedStickers1.length > 9 ? (
                                <>
                                <div className={activeAchievementTab === 0 ? 'ach-circle-active' : 'ach-circle-inactive'} onClick={() => setActiveAchievementTab(0)}/>
                                <div className={activeAchievementTab === 1 ? 'ach-circle-active' : 'ach-circle-inactive'} onClick={() => setActiveAchievementTab(1)}/>
                                </>
                            ): <></>
                            )}
                            
                        </div>
                    </div>

                </div>

            </div>
        </div>
        </div>

    </div>
  )
}

export default StoragePage