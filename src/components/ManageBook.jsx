import React, { useRef, useState } from 'react'
import LibraryBook from './LibraryBook'
import { useEffect } from 'react'
import {ReactComponent as Lock} from '../n-item-lock.svg'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ManageBook = ({book, stickers, selectedStickers, setSelectedStickers, username}) => {

    const [pageCount, setPageCount] = useState(0);
    const audioRef = useRef();
    const navigate = useNavigate('/');

    const applySticker = async(sticker) => {
        await axios.post('/api/set-active-sticker', {
            username,
            sticker,
            volumeId: book?.volume_id
        })
        
    }

    const handleSticker = (sticker) => {

        let tempInd = selectedStickers.findIndex(
            (stick) => stick.sticker_name === sticker.sticker_name
        );
    
        if (tempInd !== -1) {
            // Sticker is already selected, so remove it
            applySticker(sticker);
            setSelectedStickers((prev) => [
                ...prev.slice(0, tempInd),
                ...prev.slice(tempInd + 1)
            ]);
        } else {
            if (!selectedStickers.some((stick) => stick.location === sticker.location)){
                applySticker(sticker);
                setSelectedStickers((prev) => [...prev, sticker]);
            }
        }
    };

    const logActivity = async() => {
        await axios.post('/api/send-entry', {
            username,
            tab_name: 'Favorites',
            volume_id: book?.volume_id,
            pages_added: pageCount - book?.pages_read,
            total_pages_read: pageCount,
            title: book?.title
        })

        audioRef.current.volume = 0.1;
        audioRef.current.play();

        setTimeout(() => {
            navigate('/library');
        }, 600)

    
    }

    useEffect(() => {
        if (book){
            setPageCount(book?.pages_read);
        }
    }, [book])
    
  return (
    <div style={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'left'}}>

        <audio ref={audioRef} src="/scribble.wav" />

        <div className='n-entry-title'>Manage Book</div>
        <div style={{marginTop: '0.2rem', color: '#9BA4B6', fontSize: '0.8125rem'}}>Track your pages and decorate your cover</div>
        <div className='n-book-preview-bg'>
            <div style={{transform: 'scale(1)'}}><LibraryBook book={book} isPreview={true} activeStickers={selectedStickers}/></div>
            <div style={{position: 'absolute', left: '0.8125rem', bottom: '0.4rem', color: '#9BA4B6', fontSize: '0.7rem'}}>Preview</div>
        </div>
        <div className='n-entry-title' style={{fontSize: '0.8125rem', marginTop: '1.625rem'}}>Sticker Collection</div>
        <div className='n-sticker-container'>
            <div className='n-sticker-grid'>
                {stickers[0]?.map((sticker) => (
                    <div
                        className={
                            selectedStickers.some((stick) => stick.sticker_name === sticker.sticker_name) ?
                            'n-sticker-item-active':
                            (selectedStickers.some((stick) => stick.location === sticker.location)
                                ? 'n-sticker-item-unavail'
                                : 'n-sticker-item')
                        }
                        onClick={() => handleSticker(sticker)}
                    >
                        <img src={`/${sticker?.sticker_name}.png`} style={{ height: '2rem' }} />
                    </div>
                ))}
                {stickers[1]?.map((sticker) => (
                    <div className='n-sticker-item-locked'>
                        <img src={`/${sticker?.sticker_name}.png`} style={{ height: '2rem' }} />
                        <div style={{position: 'absolute', right: '-0.4rem', bottom: '-0.4rem'}}><Lock /></div>
                    </div>
                ))}
                {stickers.length === 0 &&
                    Array.from({ length: 12 }).map((_, index) => (
                        <div key={index} className="n-sticker-item-locked">
                            <div style={{ position: 'absolute', right: '-0.4rem', bottom: '-0.4rem' }}>
                                <Lock />
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
        <div className='n-entry-title' style={{fontSize: '0.8125rem', marginTop: '1.625rem'}}>Reading Log</div>
        <div className='n-sticker-container' style={{paddingTop: '1rem', paddingBottom: '1rem', paddingRight: '3rem', paddingLeft: '3rem'}}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'end', width: '100%', marginBottom: '2rem'}}>
                <div style={{color: '#27AE85', fontSize: '1.4rem', fontWeight: '600', marginBottom: '-0.15rem'}}>{`${pageCount}`}</div>
                <div style={{color: '#52637D', fontSize: '0.9rem', fontWeight: '400', marginLeft: '0.2rem'}}>{`of ${book?.total_pages ? book.total_pages : '...'} pages`}</div>
            </div>
            <div class="n-slidecontainer">
                <input type="range" min='0' max={book?.total_pages} class="n-slider" id="n-myRange" value={pageCount} onChange={(e) => setPageCount(e.target.value)}/>
                <div className='shadow-input'>
                    <div style={{height: '100%', width: '100%', position: 'relative'}}>
                        <div className='shadow-input-fill' style={{width: `${(pageCount / book?.total_pages)*100 < 20 ? (pageCount / book?.total_pages)*100 + 4 : ((pageCount / book?.total_pages)*100 > 96 ? (pageCount / book?.total_pages)*100 - 4 : (pageCount / book?.total_pages)*100)}%`}}/>
                    </div>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '2rem'}}>
                <button className='n-log-activity' onClick={() => logActivity()}>Submit Pages</button>
            </div>
        </div>
    </div>
  )
}

export default ManageBook