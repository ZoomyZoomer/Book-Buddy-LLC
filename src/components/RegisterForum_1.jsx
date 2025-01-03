import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import axios from 'axios'

const RegisterForum_1 = ({email, username, password, setCurrPage, currPage, setMaxPage, maxPage}) => {

    const [invalidCode, setInvalidCode] = useState(false);
    let mutex = false;

    const [inputValues, setInputValues] = useState(['', '', '', '']);
    const inputRefs = useRef([useRef(null), useRef(null), useRef(null), useRef(null)]);

    // Handle typing in the input boxes
    const handleInputChange = (e, index) => {
      
        const newValue = e.target.value.slice(-1); // Only take the last character typed
    
        // Check if the new value is a number
        if (!newValue.match(/^[0-9]$/)) {
          return; // If it's not a number, don't update the value
        }
    
        const newInputValues = [...inputValues];
        newInputValues[index] = newValue;
    
        setInputValues(newInputValues);
    
        // Move focus to the next input box after typing
        if (newValue && index < 3) {
          inputRefs.current[index + 1].current.focus();
        }
      };

      const handleKeyDown = (e, index) => {
    
        if (e.key === 'Backspace') {
          // If the input box is empty and backspace is pressed, move to the previous input box
          if (inputValues[index] === '' && index > 0) {
            inputRefs.current[index - 1].current.focus();
            const newInputValues = [...inputValues];
            newInputValues[index - 1] = ''; // Clear the previous input box
            setInputValues(newInputValues);
          } else if (inputValues[index] !== '') {
            // If the box is not empty, allow the user to delete a character (backspace)
            const newInputValues = [...inputValues];
            newInputValues[index] = ''; // Clear the current input box
            setInputValues(newInputValues);
          }
        }
      };

      const generateCode = async() => {
        
        try {
            
            await axios.post('/api/send-code', {
                email,
                username: email,
                password
            })

        } catch(e) {
            console.error("Code can't be sent");
        }
        

      }

      useEffect(() => {
        if (!mutex){
            mutex = true;
            generateCode();
        }
      }, [])

      const verifyCode = async() => {

        try {
            
            const res = await axios.post('/api/verify-code', {
                email,
                code: Number(inputValues[0] + '' + inputValues[1] + '' + inputValues[2] + '' + inputValues[3])
            })

            if (res.status === 200){
            
                setMaxPage(3);
                setCurrPage(3);
  
            } else {
                setInvalidCode(true);
            }

        } catch(e) {
            console.error("Code can't be verified");
            setInvalidCode(true);
        }

      }

      const handleBack = () => {
        setCurrPage(prev => prev - 1);
      }

  return (
    <>
    
    <div className='n-register-right-content'>
        
            <img src='/bb-logo.png' style={{width: '4rem', marginTop: '4rem'}}/>
            <div className='n-register-top-0'>Verify your email address</div>
            <div className='n-register-top-1'>We’ve sent a code to {email}</div>

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '5rem'}}>

            <div className={!invalidCode ? 'n-register-code-box' : 'n-register-code-box-invalid'}>
                <input
                    key={0}
                    className='n-code-input'
                    ref={inputRefs.current[0]} // Attach the ref to each input box
                    value={inputValues[0]}
                    onChange={(e) => handleInputChange(e, 0)} // Handle typing
                    onKeyDown={(e) => handleKeyDown(e, 0)} // Handle backspace
                    maxLength={1} // Limit each input to 1 character
                />
            </div>
            <div className={!invalidCode ? 'n-register-code-box' : 'n-register-code-box-invalid'}>
                <input
                    key={1}
                    className='n-code-input'
                    ref={inputRefs.current[1]} // Attach the ref to each input box
                    value={inputValues[1]}
                    onChange={(e) => handleInputChange(e, 1)} // Handle typing
                    onKeyDown={(e) => handleKeyDown(e, 1)} // Handle backspace
                    maxLength={1} // Limit each input to 1 character
                />
            </div>
            <div className={!invalidCode ? 'n-register-code-box' : 'n-register-code-box-invalid'}>
                <input
                    key={2}
                    className='n-code-input'
                    ref={inputRefs.current[2]} // Attach the ref to each input box
                    value={inputValues[2]}
                    onChange={(e) => handleInputChange(e, 2)} // Handle typing
                    onKeyDown={(e) => handleKeyDown(e, 2)} // Handle backspace
                    maxLength={1} // Limit each input to 1 character
                />
            </div>
            <div className={!invalidCode ? 'n-register-code-box' : 'n-register-code-box-invalid'}>
                <input
                    key={3}
                    className='n-code-input'
                    ref={inputRefs.current[3]} // Attach the ref to each input box
                    value={inputValues[3]}
                    onChange={(e) => handleInputChange(e, 3)} // Handle typing
                    onKeyDown={(e) => handleKeyDown(e, 3)} // Handle backspace
                    maxLength={1} // Limit each input to 1 character
                />
            </div>

        </div>

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '1rem'}}>
            <div style={{color: '#727E90', fontSize: '0.8rem', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{invalidCode && <div style={{color: '#e96d5c', fontWeight: '600'}}>Invalid code &nbsp;</div>} Didn't get a code?&nbsp;<u style={{cursor: 'pointer'}} onClick={() => {mutex = false; setTimeout(() => {generateCode()},300)}}>Click to resend.</u></div>
        </div>
        <div style={{color: '#06AB78', fontWeight: '600', marginTop: '0.4rem', fontSize: '1rem'}}>{'> Please check your spam folder <'}</div>

        <div style={{marginTop: '2rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <button className='n-go-back-btn' onClick={() => handleBack()}>Go Back</button>
            <button className='n-verify-btn' onClick={() => verifyCode()}>Verify</button>
        </div>

        <div className='n-register-right-progress-flex'>
            <div className='n-progress-active'/>
            <div className='n-progress-active'/>
            <div className='n-progress-inactive'/>
            <div className='n-progress-inactive'/>
        </div>

    </div>

    </>
  )
}

export default RegisterForum_1