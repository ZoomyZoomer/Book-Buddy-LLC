import React, { useState, useRef, useEffect } from 'react'
import {ReactComponent as Error} from '../unreachable.svg'
import {ReactComponent as Check} from '../reachable.svg'
import {ReactComponent as Clock} from '../clock.svg'
import axios from 'axios'

const WarehouseItem = ({item, setEatItem, index, availSpaces, username, setReFetchWarehouse, setIsAddingFile, isAddingFile, setActiveIndex, setShowItemPopup, setItem, setFileWasClaimed, setShowError, errorRef}) => {

    const [fileTime, setFileTime] = useState(null);
    const [timeDifference, setTimeDifference] = useState([0,0,0]);
    const [itemFinished, setItemFinished] = useState(false);
    const [claimingItem, setClaimingItem] = useState(false);

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

    const audioRefJar = useRef(null);
    const playAudioRefJar = () => {
        audioRefJar.current.volume = 0.2;
        audioRefJar.current.play();
    };

    const audioRefDestroy = useRef(null);
    const playAudioRefDestroy = () => {
        audioRefDestroy.current.volume = 0.07;
        audioRefDestroy.current.play();
    };

    
    const removeItem = async() => {

        try {

            await axios.post('http://localhost:4000/remove-obstruction', {
                username,
                index,
                payment_required: warehouseMap.get(item).cost
            })

            playAudioRefDestroy();

            setClaimingItem(false);

            setReFetchWarehouse(prev => !prev);

        } catch(e){
            if (e.response.status === 400){
                errorRef.current = {title: 'Insufficient coins', message: 'Not enough coins to remove the obstruction'};
                setShowError(true);
            } else {
                console.error({error: e});
            }
            
        }

    }

    const [isJam, setIsJam] = useState(0);
    const [fetchJamy, setFetchJamy] = useState(false);

    const fetchJam = async() => {

        try {

            const res = await axios.get('http://localhost:4000/fetch-jam', {
                params: {
                    username
                }
            })

            setIsJam(res.data);

        } catch(e) {
            console.error({error: e});
        }

    }

    useEffect(() => {
        if (username){
            fetchJam();
        }
    }, [username, fetchJamy])

    const JamIt = async() => {


        if (isJam > 0){

            await axios.post('http://localhost:4000/use-jam', {
                username,
                index
            })

            playAudioRefJar();
            setFetchJamy(prev => !prev);
            fetchFileTime();

        }


    }

    const handleClick = () => {


        if (!isAddingFile){

            if ((item === 8 || item === 9) && availSpaces.some(arr => arr.length === index.length && arr.every((value, ind) => value === index[ind]))){
                setItem(item);
                setEatItem(false);
                removeItem();
                playAudioRefPop();
                setShowItemPopup(true);
            } else {
                setActiveIndex(index);

                document.getElementsByClassName('warehouse-item-active')[0]?.classList?.remove('warehouse-item-active');
            

                if (document.getElementById(`${index[0]}${index[1]}`)?.classList?.contains('valid')){
                    document.getElementById(`${index[0]}${index[1]}`)?.classList?.remove('valid');
                    document.getElementById(`${index[0]}${index[1]}`)?.classList?.add('invalid');
                } else {
                    document.getElementsByClassName('valid')[0]?.classList?.add('invalid');
                    document.getElementsByClassName('valid')[0]?.classList?.remove('valid');
                    document.getElementById(`${index[0]}${index[1]}`)?.classList?.remove('invalid');
                    document.getElementById(`${index[0]}${index[1]}`)?.classList?.add('valid');
                    item === 9 && playAudioBox0();
                    item === 8 && playAudioBox0();
                    setTimeout(() => {
                        document?.getElementById(`${index[0]}${index[1]}2`)?.classList?.add('warehouse-item-active');
                    }, 10)
                }
            }



            

        }
        

    }

    const fetchFileTime = async() => {

        try {

            const res = await axios.get('http://localhost:4000/fetch-file-time', {
                params: {
                    username,
                    index: index
                }
            })

            setFileTime(res.data);

        } catch(e){
            console.error({error: e});
        }

    }

    let notFiles = [0,1,2,3,8,9];

    useEffect(() => {
        if (username){
            if (!notFiles.includes(item)){
                fetchFileTime();
            }
        }
    }, [username, item])

    useEffect(() => {
        if (fileTime && !itemFinished){

            setTimeout(() => {

                try {
                    let firstDate = new Date(fileTime);
                    let secondDate = new Date(); // This is the current date and time

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

                    setTimeDifference([warehouseMap.get(item)?.time?.hours - hours - 1, 60 - minutes - 1, 60 - seconds]);
                    document.getElementById(`${index[0]}${index[1]}Abs`).style.width = `${(((hours * 3600 + minutes * 60 + seconds)/(warehouseMap.get(item)?.time?.hours * 3600 + warehouseMap.get(item)?.time?.minutes * 60 + warehouseMap.get(item)?.time?.seconds)) * 100) >= 100 ? 100 : (((hours * 3600 + minutes * 60 + seconds)/(warehouseMap.get(item)?.time?.hours * 3600 + warehouseMap.get(item)?.time?.minutes * 60 + warehouseMap.get(item)?.time?.seconds)) * 100)}%`;
                    if ((hours * 3600 + minutes * 60 + seconds) >= (warehouseMap.get(item)?.time?.hours * 3600 + warehouseMap.get(item)?.time?.minutes * 60 + warehouseMap.get(item)?.time?.seconds)){
                        setItemFinished(true);
                    }
                } catch(e) {
                    
                }

            }, 1000)

        }
    }, [fileTime, timeDifference])

    const claimFile = async() => {

        if (itemFinished){

            setClaimingItem(true);
            playAudioRefPop();

            try {

                await axios.post('http://localhost:4000/claim-file', {
                    username,
                    index,
                    new_file: warehouseMap.get(item + 20)
                })

                setReFetchWarehouse(prev => !prev);
                setFileWasClaimed(prev => !prev);
                setTimeout(() => {
                    setItemFinished(false);
                }, 300)

            } catch(e){
                console.error({error: e});
            }

        }

    }

    const audioRefBox0 = useRef(null);
    const audioRefPop = useRef(null);

    const playAudioBox0 = () => {
        audioRefBox0.current.volume = 0.1;
        audioRefBox0.current.play();
    };

    const playAudioRefPop = () => {
        audioRefPop.current.volume = 0.1;
        audioRefPop.current.play();
    };


  return (
        <div id={`${index[0]}${index[1]}2`} className={(itemFinished && claimingItem) ?  'claim-warehouse-file claim-pop' : (availSpaces.some(arr => arr.length === index.length && arr.every((value, ind) => value === index[ind])) && (item === 9 || item === 8) ) ? 'claim-warehouse-box claim-pop' : item !== 0 && notFiles.includes(item) ? 'warehouse-item-locked' : itemFinished ? 'claim-warehouse-file' : !notFiles.includes(item) ? 'warehouse-item-file-active' : 'warehouse-item'} onClick={() => handleClick()}>


                <>
                    <audio ref={audioRefBox0} src="/box-click.wav" />
                    <audio ref={audioRefPop} src="/pop.mp3" />
                </>

            <audio ref={audioRefJar} src="/jar-sound.wav" />
            <audio ref={audioRefDestroy} src="/destroy.wav" />
            

            {!notFiles.includes(item) && (
                <div id={`${index[0]}${index[1]}Abs`} className='warehouse-item-file-active-abs'/>
            )}

            {item !== 0 && item !== 3 ? (
                <img src={`/${warehouseMap.get(itemFinished ? item + 20 : item)?.display}.png`} style={{height: '2.6rem', zIndex: '2'}} className={itemFinished ? 'claim-warehouse-file-dance' : (item === 9 || item == 8) && availSpaces.some(arr => arr.length === index.length && arr.every((value, ind) => value === index[ind])) ? 'claim-available' : ''} onClick={() => claimFile()}/>
            ): <></>}
       
            
            {item !== 3 && !isAddingFile && !itemFinished && (
                <div id={`${index[0]}${index[1]}`} className='warehouse-item-info invalid'>

                    <>
                    <div className='warehouse-item-info-flex'>
                    {item !== 0 && item !== 3 ? (
                        <img src={`/${warehouseMap.get(item)?.display}.png`} style={{height: '1.2rem', marginTop: item === 1 ? '-0.3rem' : '0rem'}}/>
                    ): <></>}
                        <div style={{marginLeft: item !== 3 & item !== 0 ? '0.3rem' : '0rem', marginRight: '0.3rem'}}>{warehouseMap.get(item)?.name}</div>
                        &#183;
                        <div style={{marginLeft: '0.3rem'}}>{warehouseMap.get(item)?.type}</div>
                    </div>
                    <div className='warehouse-sep' />
                    <div className='sii-1'>

                    {item !== 0 && notFiles.includes(item) && (
                        <div className='sii-quant' style={{fontSize: '0.8125rem'}}>
                            <div>Reachable: </div>
                                &nbsp;
                            <div className='sii-quant-sub'>{ availSpaces.some(arr => arr.length === index.length && arr.every((value, ind) => value === index[ind])) ? 
                                <Check /> : 
                                <Error />
                                }</div>
                        </div>
                    )}

                    {!notFiles.includes(item) && (
                        <div>
                        <div className='sii-quant' style={{fontSize: '0.8125rem'}}>
                            <div style={{display: 'flex'}}><Clock /> <div style={{marginLeft: '0.2rem'}}>Time Remaining: </div></div>
                                &nbsp;
                            <div className='sii-quant-sub'>
                                {`${timeDifference[0]}:${timeDifference[1]?.toString().padStart(2, '0')}:${timeDifference[2]?.toString().padStart(2, '0')}`}
                            </div>
                        </div>
                    </div>
                    )}
                        
                    {item === 0 && (
                        <div>
                            <div className='sii-quant' style={{fontSize: '0.8125rem'}}>
                                <div style={{display: 'flex'}}><div>Status: </div></div>
                                    &nbsp;
                                <div className='sii-quant-sub'>
                                    Unoccupied
                                </div>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '0.5rem'}}>
                                <button className='add-file' onClick={() => {setIsAddingFile(true); setTimeout(() =>{document?.getElementById(`${index[0]}${index[1]}2`)?.classList?.add('warehouse-item-active-adding')}, 100)}}>Place a file</button>
                            </div>
                        </div>
                    )}

                    {!notFiles.includes(item) && (
                        <div>
                            <div className='sii-quant' style={{fontSize: '0.8125rem', marginTop: '0.2rem'}}>
                                <div style={{display: 'flex'}}><div>Status: </div></div>
                                    &nbsp;
                                <div className='sii-quant-sub'>
                                    Collecting dust
                                </div>
                            </div>
                        </div>
                    )}

                    {!notFiles.includes(item) && (
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '0.625rem'}}>
                            <button className={isJam > 0 ? 'add-file' : 'add-file-blocked'} onClick={() => JamIt()}>Use Jam <img src='/jam.png' style={{height: '1rem', marginLeft: '0.4rem'}}/></button>
                        </div>
                    )}



                    {warehouseMap.get(item)?.type === 'Obstruction' && (
                        <div className='sii-value' style={{marginTop: '0.2rem', fontSize: '0.8125rem'}}>
                            <div>Cost to remove: </div>
                            &nbsp;
                            <img src='/coin.png' style={{height: '1rem', marginRight: '0.2rem'}}/>
                            <div className='sii-quant-sub'>{warehouseMap.get(item)?.cost}</div>
                        </div>
                    )}

                    {warehouseMap.get(item)?.type === 'Obstruction' && availSpaces.some(arr => arr.length === index.length && arr.every((value, ind) => value === index[ind])) && (
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '0.5rem'}}>
                            <button className='remove-obstruction' onClick={() => removeItem()}>Remove</button>
                        </div>
                    )}
                        

                    </div>
                </>
 
            </div>
            )}
                
            
                
          
            
        </div>
  )
}

export default WarehouseItem