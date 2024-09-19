import React, { useState, useEffect } from 'react'
import {ReactComponent as AiIcon} from '../robot_icon.svg'
import '../chatmessage.css'

const ChatMessage = ({role, content, isEndingResponse, timestamp, index, maxIndex}) => {

    console.log(timestamp);

    const [timeSent, setTimeSent] = useState('');
    
    useEffect(() => {
      const updateTime = () => {
        const now = new Date();
        const secondsPast = Math.floor((now - new Date(timestamp)) / 1000);
  
        if (secondsPast < 60) {
          setTimeSent(`${secondsPast} seconds ago`);
        } else if (secondsPast < 3600) {
          setTimeSent(`${Math.floor(secondsPast / 60)} minute(s) ago`);
        } else if (secondsPast < 86400) {
          setTimeSent(`${Math.floor(secondsPast / 3600)} hours ago`);
        } else {
          setTimeSent(`${Math.floor(secondsPast / 86400)} days ago`);
        }
      };
  
      // Update the time immediately
      updateTime();
  
      // Set an interval to update the time every minute
      const intervalId = setInterval(updateTime, Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000);
  
      // Cleanup the interval on component unmount
      return () => clearInterval(intervalId);
    }, [timestamp]);

    const marginBottom = maxIndex === index ? '40px' : '0px';
  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr', marginBottom}}>
      {index === 0 && (
        <div className="start_chat">
          
        </div>
      )}
      <div className={role === 'ai' ? "content_container_ai" : 'content_container_user'}>
        <div className={role === 'ai' ? `chat_message_container_ai` : `chat_message_container_user`}>
            {content}
            {role === 'ai' && isEndingResponse ? (
              <div className="ai_message_icon">
                <img className="message_icon" src="/planet_icon.png" />
              </div>
            ) : <></>}
            {isEndingResponse && role === 'ai' && (
              <div className="time_sent">
                {timeSent}
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage