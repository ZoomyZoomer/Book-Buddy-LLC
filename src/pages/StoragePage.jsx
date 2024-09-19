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

    const audioRefOpen = useRef(null);
    const audioRefClose = useRef(null);

    const validList = [0,10,11,30,31,50];

    const navigate = useNavigate('/');

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

    const fillXpBar = (xp) => {
        document.getElementsByClassName('xp-bar')[0].style.width = `${xp % 100}%`;
    }

    const fetchWarehouseGrid = async() => {

        try {

            const res = await axios.get('http://localhost:4000/fetch-warehouse-grid', {
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

            const res = await axios.get('http://localhost:4000/fetch-currency', {
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

            const res = await axios.get('http://localhost:4000/fetch-items', {
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

            const res = await axios.get('http://localhost:4000/fetch-files', {
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

    const [hiddenStickers0, setHiddenStickers0] = useState([]);
    const [hiddenStickers1, setHiddenStickers1] = useState([]);
    const [ownedStickers0, setOwnedStickers0] = useState([]);
    const [ownedStickers1, setOwnedStickers1] = useState([]);

    const fetchStickers = async() => {

        try {

            const res = await axios.get('http://localhost:4000/fetch-stickers', {
                params: {
                    username: userInfo.username
                }
            })

            setOwnedStickers0(res.data[0].slice(0, 9));
            setOwnedStickers1(res.data[0].slice(9));

            res.data[0].length === 0 ? setBarLeft(false) : setBarLeft(true);

            setHiddenStickers0(res.data[1].slice(0, 9));
            setHiddenStickers1(res.data[1].slice(9));

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
            <BookBuddyNavbar tab={2} currency={currency}/>
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
                        <div>Your Filing Cabinet</div>
                        <div className='ct-0'>For paperwork... yeah</div>
                    </div>

                    <div className='cabinet-contents'>

                        <audio ref={audioRefOpen} src="/open-folder.wav" />
                        <audio ref={audioRefClose} src="/close-folder.wav" />
                        
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

                            {folderClosed && (
                                <div className='folder-box' onClick={() => {playAudioOpen(); setFolder1(false); setFolderClosed(false); setCollectableFolderOpen(false); collectableFolderOpen ? playAudioClose(): setCollectableFolderOpen(false)}} onMouseEnter={() => setFolder0(true)} onMouseLeave={() => setFolder0(false)}>

                                    <div className='folder-amount'>{ownedFiles.length}</div>
                                    {folder0 && <div className='lmao-abs'>Files</div>}

                                    <img src='/folder-closed.png' className='cabinet-folder'/>
                                    <div className='tap-2'>Tap</div>
                                    
                                </div>
                            )}

                            {!folderClosed && (
                                <div className='folder-box' onClick={() => {playAudioClose(); setFolderClosed(true)}}>
                                    <img src='/folder-open.png' className='cabinet-folder-open'/>
                                </div>
                            )}
                            {!collectableFolderOpen && (
                                <div className='folder-box' onClick={() => {!isAddingFile ? playAudioOpen() : setCollectableFolderOpen(false); setFolder0(false); !isAddingFile ? setCollectableFolderOpen(true) : setCollectableFolderOpen(false); setFolderClosed(true); !folderClosed ? playAudioClose(): setFolderClosed(true)}} style={{marginLeft: '0.6rem'}} onMouseEnter={() => setFolder1(true)} onMouseLeave={() => setFolder1(false)}>

                                    <img src='/folder-closed.png' className='cabinet-folder'/>
                                    <div className='folder-amount'>{items.length}</div>
                                    {folder1 && <div className='lmao-abs'>Items</div>}
                                    
                                    <div className='tap-0'>Tap</div>
                                    <div className='tap-1'>Tap</div>
                                    
                                </div>
                            )}

                            {collectableFolderOpen && (
                                <div className='folder-box' onClick={() => {playAudioClose(); setCollectableFolderOpen(false)}} style={{marginLeft: '0.6rem'}}>
                                    <img src='/folder-open.png' className='cabinet-folder-open'/>
                                </div>
                            )}
                        
                        </div>

                        {!folderClosed && (
                            <div className='folder-contents'>
                                {ownedFiles.map((file, index) => (
                                    <StorageItem file={file} setEatItem={setEatItem} setShowItemPopup={setShowItemPopup} setItem={setItem} index={index} hidden={false} username={userInfo.username} isAddingFile={isAddingFile} activeIndex={activeIndex} setReFetchWarehouse={setReFetchWarehouse} setIsAddingFile={setIsAddingFile} setFolderClosed={setFolderClosed} playAudioClose={playAudioClose} fileWasClaimed={fileWasClaimed} setShowError={setShowError} errorRef={errorRef}/>
                                ))}
                            </div>
                        )}

                        {collectableFolderOpen && !isAddingFile && (
                            <div className='folder-contents'>
                                {items.map((item, index) => (
                                    <StorageItem file={item} setShowPickSticker={setShowPickSticker} setEatItem={setEatItem} setShowItemPopup={setShowItemPopup} setItem={setItem} index={index} hidden={false} username={userInfo.username} isAddingFile={isAddingFile} activeIndex={activeIndex} setReFetchWarehouse={setReFetchWarehouse} setIsAddingFile={setIsAddingFile} setFolderClosed={setFolderClosed} playAudioClose={playAudioClose} fileWasClaimed={fileWasClaimed} setShowError={setShowError} errorRef={errorRef}/>
                                ))}
                            </div>
                        )}


                    </div>

                    <div className='cabinet-hidden'>
                        
                        <div className='hidden-title'>
                            <div className='hidden-line'/>
                            <div className='hidden-title-flex'>
                                Encrypted Files & Items
                                <div style={{marginLeft: '0.4rem'}}><Arrow /></div>
                            </div>
                            <div className='hidden-line'/>
                        </div>

                        <div className='hidden-grid'>
                            {hiddenFiles.map((file, index) => (
                                <StorageItem file={file} index={index} hidden={true} username={userInfo.username} isAddingFile={isAddingFile} activeIndex={activeIndex} setReFetchWarehouse={setReFetchWarehouse} setIsAddingFile={setIsAddingFile} setFolderClosed={setFolderClosed} playAudioClose={playAudioClose} fileWasClaimed={fileWasClaimed} setShowError={setShowError} errorRef={errorRef}/>
                            ))}
                            {hiddenItems.map((file, index) => (
                                <StorageItem file={file} index={index} hidden={true} username={userInfo.username} isAddingFile={isAddingFile} activeIndex={activeIndex} setReFetchWarehouse={setReFetchWarehouse} setIsAddingFile={setIsAddingFile} setFolderClosed={setFolderClosed} playAudioClose={playAudioClose} fileWasClaimed={fileWasClaimed} setShowError={setShowError} errorRef={errorRef}/>
                            ))}
                        </div>

                    </div>

                </div>

            </div>
            <div className='storage-bottom-flex'>

                <div className='stickers-container'>

                    <div className='stickers-title'>
                        <div>Stickers</div>
                        <div className='ss-0'>Great to put on your favorite books!</div>
                    </div>
                    <div className='stickers-box'>
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

                    <div className='lightbulb-stickers'>
                        <Lightbulb />
                        <div style={{marginTop: '0.2rem', marginLeft: '0.2rem'}}>You can apply these stickers in the Library tab by selecting Customize in the 3 dots option menu on a book</div>
                    </div>

                </div>

            </div>
        </div>
        </div>

    </div>
  )
}

export default StoragePage