import React from 'react'

function RobotChat() {
  return (
    <>
    </>
    /*<div className="ai_container" id="outerDiv" ref={outerDivRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                    <div className="chatbox_container" id="innerDiv" ref={innerDivRef} style={{width: size.width, height: size.height}}>
                        <div id="cb_nb" className="chatbox_navbar" onMouseDown={handleMouseDown}>
                            <div style={{display: 'flex', alignItems: 'center', pointerEvents: 'none'}} draggable={false}>
                                <AIWhite />
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} draggable={false}>
                                ROBOT
                            </div>
                            <div className="chatbox_refresh" draggable={false} onClick={() => {setMessages([]); setCallValue(0)}}>
                                <RefreshIcon />
                            </div>
                            <div className="chatbox_phone" draggable={false} onClick={() => {setMessages((prevMessages) => [...prevMessages, {role: 'ai', content: callValue === 0 ? "...Please don't call me T_T" : callValue === 1 ? "I said don't call me!" : callValue === 2 ? "K, I'll just ignore you": "..."}]); setCallValue((prevCallValue) => prevCallValue + 1)}}>
                                <PhoneIcon />
                            </div>
                        </div>
                        <div className="chatbox_contents">
                            <div className="chat_section">
                            {messages.map((msg, index) => (
                                <ChatMessage key={index} role={msg.role} content={msg.content} />
                            ))}
                            {messages.length === 0 && (
                                 <div className="template_container">
                                 <div className="template" onClick={() => askChatGPT("What are the important takeways?")}>
                                     <div style={{marginBottom: '20px'}}>
                                         <PencilIcon />
                                     </div>
                                     <div style={{marginLeft: '6px'}}>
                                     Important takeaways
                                     </div>
                                 </div>
                                 <div className="template" onClick={() => askChatGPT("What are some character relationships?")}>
                                     <div style={{marginBottom: '20px'}}>
                                         <AttachIcon />
                                     </div>
                                     <div style={{marginLeft: '6px'}}>
                                     Character relationships
                                     </div>
                                 </div>
                                 <div className="template" onClick={() => askChatGPT("What books do you recommend that are similar?")}>
                                     <div style={{marginBottom: '20px'}}>
                                         <SpeechIcon />
                                     </div>
                                     <div style={{marginLeft: '6px'}}>
                                     Recommend books
                                     </div>
                                 </div>
                             </div>
                            )}
                           
                            </div>
                            <div className="message_section">
                                <div className="input_box_container">
                                    <input 
                                        className="input_box"
                                        placeholder='Send a message to AI'
                                        onChange={(e) => setChatValue(e.target.value)}
                                        value={chatValue}
                                    
                                    />
                                    <div className="send_icon" onClick={() => handle_send()}>
                                        <SendIcon />
                                    </div>
                                    
                                </div>
                                <div className="resize-handle" onMouseDown={handleMouseDown}><ResizeIcon /></div>

                            </div>

                        </div>
                    </div>
                </div>*/ 
  )
}

export default RobotChat