import React, { useState } from 'react'
import axios from 'axios'
import {ReactComponent as Edit} from '../edit-icon-new.svg'

const FolderTab = ({ text, tab_id, active, username, setTabChanged}) => {

    const [editTab, setEditTab] = useState(false);
    const [desired_name, setDesiredName] = useState(text);

    const editTabName = async() => {

        try {

            await axios.post('http://localhost:4000/editTab', {
                username,
                tab_name: text,
                desired_name
            })

            setTabChanged(prev => !prev);

        } catch(e){
            console.error({error: e});
        }

    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          editTabName();
          setEditTab(false);
        }
      };

  return (
    <div class="folder-tab">
        <div className={tab_id === active ? "triangleActive" : "triangleUnactive"}></div>
        <div className={tab_id === active ? "rectangleActive" : "rectangleUnactive"}>
            <div className="tabLabel" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: "45%", height: '100%', marginTop: '-0.3rem'}}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: "100%", fontWeight: '400'}}>
                    {!editTab ? (
                        text
                    ): (
                        <input 
                         className='center-me'
                         onChange={(e) => setDesiredName(e.target.value)}
                         value={desired_name}
                         onKeyDown={handleKeyDown}
                        />
                    )}
                </div>
                {tab_id === active && !editTab ? (
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={() => setEditTab(true)}>
                        <Edit />
                    </div>
                ): (<></>)}
                
            </div>
        </div>
     </div>
  )
}

export default FolderTab