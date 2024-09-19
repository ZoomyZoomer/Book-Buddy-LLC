import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import '../timeline.css';
import TimelineBlock from './TimelineBlock';
import axios from 'axios';

const Timeline = ({username, tab_name, volume_id, setFetchEntriesArray, fetchEntriesArray, fetchEntryRef, setShowPopup, popUp, getPages, setViewItem, reFetchEntries, alert}) => {

    const [entryData, setEntryData] = useState([null, null, null, null, null, null]);
    const gotData = useRef(false);

    const fetchEntries = async() => {

        const res = await axios.get('http://localhost:4000/fetch-entries-array', {
            params: {
                username,
                tab_name,
                volume_id
            }
        })


        setEntryData(res.data);

        document?.getElementById('timeline_icon_0')?.classList?.remove('timeline_icon');
        document?.getElementById('timeline_icon_0')?.classList?.add('timeline_icon_no_anim');
        setTimeout(() => {
            document?.getElementById('timeline_icon_0')?.classList?.remove('timeline_icon_no_anim');
            document?.getElementById('timeline_icon_0')?.classList?.add('timeline_icon');
            
        }, 10)
        
    }

    useEffect(() => {

        if (!fetchEntryRef.current){
            fetchEntries();
            fetchEntryRef.current = true;
        }
        

    }, [fetchEntriesArray])

    useEffect(() => {
        fetchEntries();
    }, [reFetchEntries])

    const endPopup = () => {
        
        fetchEntries();
        getPages();
        document?.getElementsByClassName('timeline_block_active')[0]?.classList?.remove('timeline_block_active');
        document?.getElementsByClassName('info_active')[0]?.classList.add('no_opacity');
        document?.getElementsByClassName('info_active')[0]?.classList.remove('info_active');
        document.getElementsByClassName('book_contents_container')[0].classList.remove('open-popup');
        setShowPopup(false);
    
    }

    const removeEntry = async(entryIndex) => {

        popUp.current = {username: username, tab_name: tab_name, volume_id: volume_id, index: entryIndex, endPopup};

        document.getElementsByClassName('book_contents_container')[0].classList.add('open-popup');
        
        setShowPopup(true);

    }

    const endView = () => {

        document?.getElementsByClassName('timeline_block_active')[0]?.classList?.remove('timeline_block_active');
        document?.getElementsByClassName('info_active')[0]?.classList.add('no_opacity');
        document?.getElementsByClassName('info_active')[0]?.classList.remove('info_active');
        document.getElementsByClassName('book_contents_container')[0].classList.remove('open-popup');

        setViewItem(false);

    }

    const viewItem = async(entryIndex) => {

        popUp.current = {username: username, tab_name: tab_name, volume_id: volume_id, index: entryIndex, endView};

        document.getElementsByClassName('book_contents_container')[0].classList.add('open-popup');

        setViewItem(true);

    }

  return (
    <div className="timeline_grid">
        {entryData.map((entry, index) => (
            <TimelineBlock icon={entry?.icon} streak={entry?.streak} date={entry?.date} pages_added={entry?.pages_added} new_page_total={entry?.new_page_total} index={index} setShowPopup={setShowPopup} removeEntry={removeEntry} popUp={popUp} viewItem={viewItem} alert={alert}/>
        ))}
    </div>
  )
}

export default Timeline