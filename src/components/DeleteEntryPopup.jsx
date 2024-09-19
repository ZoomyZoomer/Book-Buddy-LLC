import React, { useState } from 'react'
import axios from 'axios'
import { useEffect, useRef } from 'react';
import {ReactComponent as CloseIcon} from '../close_icon.svg'
import '../delete_entry.css';

const DeleteEntryPopup = ({popUp}) => {

    const {username, tab_name, volume_id, index, endPopup} = popUp.current;
    const [data, setData] = useState({});
    const getOnce = useRef(false);
    
    const deleteEntry = async() => {

        await axios.post('http://localhost:4000/remove-entry', {
            username,
            tab_name,
            volume_id,
            index
          })

          endPopup();

    }

    const getEntry = async() => {

        const res = await axios.get('http://localhost:4000/get-entry', {
            params: {
                username,
                tab_name,
                volume_id,
                index
            } 
        })

        setData(res.data);

    }
 
    useEffect(() => {

        if (!getOnce.current){
            getEntry();
            document?.getElementsByClassName('info_active')[0]?.classList.add('no_opacity');
            document?.getElementsByClassName('info_active')[0]?.classList.remove('info_active');
            document?.getElementsByClassName('timeline_block_active')[0]?.classList?.remove('timeline_block_active');
            getOnce.current = true;
        }

    })

  return (
    <div className="popup">
        <div style={{position: 'relative'}}>
            <div className="de-0">Are you sure you want to delete this entry?</div>
            <div className="de-1"> <strong>Note:</strong> You're permitted to delete 2 more entries today </div>
            <div className="de-2">
                <img src={`/${data[0]?.image}.png`} className="de-2-1"/>
                <div className="grid">
                    <div className="de-2-2">You will lose:</div>
                    <div className="de-2-3">- {data[0]?.pagesRead} Pages read today</div>
                    <div className="de-2-3">- {data[0]?.percent}% of reading progress</div>
                    <div className="de-2-3">- <img src={`/${data[0]?.image}.png`} style={{height: '20px', marginRight: '4px'}}/> <div className={data[0]?.rarity === 'Common' ? 'rarity-Common' : data[0]?.rarity === 'Rare' ? 'rarity-Rare' : `rarity-Epic`}>{data[0]?.rarity}</div> &nbsp;{data[0]?.item} item</div>
                </div>
            </div>
            <div className="de-3" onClick={() => deleteEntry()}>Delete</div>
        </div>
        <div className="close" onClick={() => endPopup()}><CloseIcon /></div>
    </div>
  )
}

export default DeleteEntryPopup