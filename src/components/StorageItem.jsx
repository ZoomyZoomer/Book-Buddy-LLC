import React from 'react'
import { useState, useEffect, useRef } from 'react';
import axios from 'axios'

const StorageItem = ({file, setItem, setShowPickSticker, setEatItem, setShowItemPopup, hidden, index, username, isAddingFile, activeIndex, setReFetchWarehouse, setIsAddingFile, setFolderClosed, playAudioClose, fileWasClaimed, setShowError, errorRef}) => {

    const [renderItem, setRenderItem] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [quantity, setQuantity] = useState('');
    const [text, setText] = useState('ENCRYPTED');
    const [textDesc, setTextDesc] = useState('');
    const [textDesc2, setTextDesc2] = useState('');
    const [isHeld, setIsHeld] = useState(false);
    const [fetchQuant, setFetchQuant] = useState(false);
    const holdTimeoutRef = useRef(null);
    const audioRefCoins = useRef(null);
    const audioRefCoins2 = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            setRenderItem(true);
        }, 40 * index)
    }, [])

    const fetchQuantity = async() => {

        try {

            const res = await axios.get('http://localhost:4000/fetch-quantity', {
                params: {
                    username,
                    file_id: file.id
                }
            })

            setQuantity(res.data);

        } catch(e){
            console.error({error: e});
        }

    }

    useEffect(() => {
        if (username !== undefined){
            fetchQuantity();
        }
    }, [username, file, fetchQuant, fileWasClaimed])

    useEffect(() => {
        let interval;

        if (isHovering) {
            const randomChar = () => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                return chars[Math.floor(Math.random() * chars.length)];
            };

            const animateCipherText = () => {
                const originalText = 'ENCRYPTED';
                const frameRate = 100; // Change characters every 100ms

                interval = setInterval(() => {
                    let newText = '';
                    for (let i = 0; i < originalText.length; i++) {
                        newText += randomChar();
                    }
                    setText(newText);
                }, frameRate);
            };

            animateCipherText();
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [isHovering]);

    useEffect(() => {
        let interval;

        if (isHovering) {
            const randomChar = () => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                return chars[Math.floor(Math.random() * chars.length)];
            };

            const animateCipherText = () => {
                const originalText = 'This is a very long text.';
                const frameRate = 100; // Change characters every 100ms

                interval = setInterval(() => {
                    let newText = '';
                    for (let i = 0; i < originalText.length; i++) {
                        newText += randomChar();
                    }
                    setTextDesc(newText);
                }, frameRate);
            };

            animateCipherText();
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [isHovering]);

    useEffect(() => {
        let interval;

        if (isHovering) {
            const randomChar = () => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                return chars[Math.floor(Math.random() * chars.length)];
            };

            const animateCipherText = () => {
                const originalText = 'This is a text.';
                const frameRate = 100; // Change characters every 100ms

                interval = setInterval(() => {
                    let newText = '';
                    for (let i = 0; i < originalText.length; i++) {
                        newText += randomChar();
                    }
                    setTextDesc2(newText);
                }, frameRate);
            };

            animateCipherText();
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [isHovering]);

    const handleAddedFile = async() => {

        if (file.id === '40') {
            return;
        }

        try {

            await axios.post('http://localhost:4000/add-file', {
                username,
                file_id: file.id,
                index: activeIndex
            })

            setReFetchWarehouse(prev => !prev);
            fetchQuantity();
            setIsHeld(false);
            setIsAddingFile(false);
            setFolderClosed(true);
            playAudioClose();

        } catch(e) {
            if (e.response.status === 400){
                errorRef.current = {title: 'Insufficient quantity', message: 'Not enough files to complete this transaction'}
                setShowError(true);
                setFolderClosed(true);
                playAudioClose();
            } else {
                console.error({error: e});
            }
            
        }

    }

    const handleMouseDown = () => {

        if (!isAddingFile) return;

        setIsHeld(true);

        holdTimeoutRef.current = setTimeout(() => {
            handleAddedFile();
        }, 2000);

        console.log('work');

    }

    const handleClick = () => {


        if (!isAddingFile){

                document.getElementsByClassName('warehouse-item-active')[0]?.classList?.remove('warehouse-item-active');
            

                if (document.getElementById(`${index}99`)?.classList?.contains('valid')){
                    document.getElementById(`${index}99`)?.classList?.remove('valid');
                    document.getElementById(`${index}99`)?.classList?.add('invalid');
                } else {
                    document.getElementsByClassName('valid')[0]?.classList?.add('invalid');
                    document.getElementsByClassName('valid')[0]?.classList?.remove('valid');
                    document.getElementById(`${index}99`)?.classList?.remove('invalid');
                    document.getElementById(`${index}99`)?.classList?.add('valid');

                    setTimeout(() => {
                        document?.getElementById(`${index}21`)?.classList?.add('warehouse-item-active');
                    }, 10)
                }
            }



            

        }
        
    const sellFile = async(quant) => {

        try {

            await axios.post('http://localhost:4000/sell-file', {
                username,
                file,
                quant
            })

            setFetchQuant(prev => !prev);
            playAudioCoins();
            setReFetchWarehouse(prev => !prev);


        } catch(e) {

            if (e.response.status === 400){
                errorRef.current = {title: 'Insufficient quantity', message: 'Not enough files to complete this transaction'};
                setShowError(true);
            } else {
                console.error({error: e});
            }
        
        }

    }

    const playAudioCoins2 = () => {
        audioRefCoins2.current.volume = 0.2;
        audioRefCoins2.current.play();
    };

    const callItem = async() => {

        if (file.id === '0' && file.quantity > 0){
            playAudioCoins2();
            await axios.post('http://localhost:4000/use-coffee', {
                username: username
            })
            setReFetchWarehouse();
        }

        if (file.id === '1' && file.quantity > 0){
            playAudioCoins2();
            await axios.post('http://localhost:4000/set-coupon', {
                username: username
            })
            setReFetchWarehouse();
        }

        if ((file.id === '9' || file.id === '8' || file.id === '7' || file.id === '14') && file.quantity > 0){
            playAudioCoins2();
            setEatItem(true);
            setItem(Number(file.id));
            setShowItemPopup(true);
        }

        if ((file.id === '15') && file.quantity > 0){
            setEatItem(true);
            setItem(Number(file.id));
            setShowPickSticker(true);
        }


    }

    const playAudioCoins = () => {
        audioRefCoins.current.volume = 0.2;
        audioRefCoins.current.play();
    };


  return (
    
    <>
        {renderItem && !hidden && (
            <div id={`${index}21`} className={hidden ? 'storage-item-container' : isAddingFile && file.id === '40' ? 'storage-item-invalid' :  'storage-item-container-seen'} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => {setIsHovering(false); setIsHeld(false); clearTimeout(holdTimeoutRef.current)}} onMouseDown={() => handleMouseDown()} onMouseUp={() => {setIsHeld(false); clearTimeout(holdTimeoutRef.current)}} onClick={() => handleClick()}>
                <div className={quantity < 10 ? 'folder-amount' : 'folder-amount-high'}>{file?.cost ? file.quantity : quantity}</div>
                {isHeld && file.id !== '40' && (
                    <div className='storage-item-fill-abs' />
                )}
                <audio ref={audioRefCoins} src="/coins.wav" />
                <audio ref={audioRefCoins2} src="/coins-sound.ogg" />
                <img src={`/${file?.display ? file?.display : file?.img}.png`} className={hidden ? 'storage-item-hidden' : isHeld && file.id !== '40' ? 'storage-item-seen-fill' : 'storage-item-seen'}/>
 
                    <div id={`${index}99`} className='storage-item-info invalid'>
                        <div className='sii-0' style={{color: `${file?.rarity === 'Common' ? '#7fd394' : file?.rarity === 'Rare' ? '#6488b4' : file?.rarity === 'Epic' ? '#a577c0' : '#454B54'}`}}>
                            <img src={`/${file?.display ? file?.display : file?.img}.png`} style={{height: '1.5rem'}}/>
                            <div style={{marginLeft: '0.2rem', marginRight: '0.2rem'}}>{file?.name ? file.name : file?.item_name}</div>
                            &#183;
                            <div style={{marginLeft: '0.2rem'}}>{file?.rarity ? file.rarity : file?.type}</div>
                        </div>
                        <div className='sii-1'>
                            <div className='sii-quant'>
                                <div>Quantity: </div>
                                &nbsp;
                                <div className='sii-quant-sub'>{file?.cost ? file.quantity : quantity}</div>
                            </div>
                            <div className='sii-value' style={{marginTop: '0.2rem'}}>
                                <div>{`Value (per): `}</div>
                                &nbsp;
                                {(file?.value || file?.cost?.coins || file?.cost?.file) && (
                                    <img src={file?.value ? '/coin.png' : file?.cost?.coins ? '/coin.png' :  file?.cost?.file ? `/${file?.cost?.file}.png` : ''} style={{height: '1rem', marginRight: '0.2rem'}}/>
                                )}
                                <div className='sii-quant-sub'>{file?.value ? file.value : file?.cost?.amount}</div>
                            </div>
                        </div>
                        <div className='sii-sep' />
                        <div className='sii-desc'>{file?.desc}</div>

                        <div className='storage-item-buttons'>
                            {file?.rarity && (
                                <>
                                    <button className='add-file' onClick={() => sellFile(1)}>Sell 1</button>
                                    <button className='add-file' style={{marginLeft: '0.7rem'}} onClick={() => sellFile(10)}>Sell 10</button>
                                </>
                            )}
                            {file?.cost && (
                                <>
                                    <button className={file.id === '2' ? 'add-file-blocked' : 'add-file'} onClick={() => callItem()}>{file.type === 'Loot' ? 'Open' : file.id === '2' ? 'Click on an active file' : 'Use'}</button>
                                </>
                            )}
                            
                        </div>

                    </div>

            </div>
        )}
        {hidden && (
            <div className={hidden ? 'storage-item-container' : 'storage-item-container-seen'}  onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                <img src={`/${file?.display ? file.display : file?.img}.png`} className={hidden ? 'storage-item-hidden' : 'storage-item-seen'}/>
                {isHovering && (
                    <div className='storage-item-info'>
                    <div className='sii-0' style={{color: `${file?.rarity === 'Common' ? '#7fd394' : file?.rarity === 'Rare' ? '#6488b4' : file?.rarity === 'Epic' ? '#a577c0' : '#454B54'}`}}>
                        <img src={`/${file?.display ? file.display : file?.img}.png`} style={{height: '1rem'}}/>
                        <div style={{marginLeft: '0.2rem', marginRight: '0.2rem'}}>
                        <div className="cipher-text">{text}</div>
                        </div>
                        &#183;
                        <div style={{marginLeft: '0.2rem'}}>{file?.rarity ? file.rarity : file?.type}</div>
                    </div>
                    <div className='sii-1'>
                        <div className='sii-quant'>
                            <div>Quantity: </div>
                            &nbsp;
                            <div className='sii-quant-sub'>{0}</div>
                        </div>
                        <div className='sii-value' style={{marginTop: '0.2rem'}}>
                            <div>{`Value (per): `}</div>
                            &nbsp;
                            <img src='/coin.png' style={{height: '1rem', marginRight: '0.2rem'}}/>
                            <div className='sii-quant-sub'>?</div>
                        </div>
                    </div>
                    <div className='sii-sep' />
                    <div className='sii-desc'>{textDesc} <br></br> {textDesc2}</div>
                </div>
                )}
            </div>
        )}
    </>
    
  )
}

export default StorageItem