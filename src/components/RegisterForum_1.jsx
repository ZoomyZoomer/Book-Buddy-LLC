import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import axios from 'axios'

const RegisterForum_1 = ({email, username, password, setCurrPage, currPage, setMaxPage, maxPage}) => {

    const [num1, setNum1] = useState(null);
    const [num2, setNum2] = useState(null);
    const [num3, setNum3] = useState(null);
    const [num4, setNum4] = useState(null);

    const [generatedCode, setGeneratedCode] = useState(null);

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
                username,
                password
            })

        } catch(e) {
            console.error("Code can't be sent");
        }
        

      }

      useEffect(() => {
        generateCode();
      }, [])

      const verifyCode = async() => {

        try {
            
            const res = await axios.post('/api/verify-code', {
                email,
                code: Number(inputValues[0] + '' + inputValues[1] + '' + inputValues[2] + '' + inputValues[3])
            })

            if (res.status === 200){
                try {
                    await axios.post('/api/register', {
                        email,
                        username
                    })

                    setMaxPage(Math.max(maxPage, 3));
                    setCurrPage(prev => prev + 1);
                } catch(e){
                    console.error("Failed to create account after verification");
                }
                
            }

        } catch(e) {
            console.error("Code can't be verified");
        }

      }

      const handleBack = () => {

        setMaxPage(3);
        setCurrPage(prev => prev - 1);

      }

  return (
    <>
    
        <div className='n-register-main-text'>
            <div>Now let's verify your email</div>
            <div style={{fontSize: '0.7em', color: '#8B8C8D', fontWeight: '400', marginTop: '0.425rem'}}>We've sent a code to <strong>{email}</strong></div>
            <div style={{fontSize: '0.7em', color: '#8B8C8D', fontWeight: '400', marginTop: '0.1rem'}}>{'> Please check your spam folder <'}</div>
        </div>

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '3rem'}}>

            <div className='n-register-code-box'>
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
            <div className='n-register-code-box'><input className='n-code-input'/>
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
            <div className='n-register-code-box'><input className='n-code-input'/>
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
            <div className='n-register-code-box'><input className='n-code-input'/>
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

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '0.4rem'}}>
            <div style={{color: '#8B8C8D', fontSize: '0.8rem'}}>Didn't get a code? <u style={{cursor: 'pointer'}} onClick={() => generateCode()}>Click to resend.</u></div>
        </div>

        <div style={{marginTop: '2rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <button className='n-go-back-btn' onClick={() => handleBack()}>Go Back</button>
            <button className='n-verify-btn' onClick={() => verifyCode()}>Verify</button>
        </div>

    </>
  )
}

export default RegisterForum_1