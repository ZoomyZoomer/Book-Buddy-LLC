import React, { useState, useEffect } from 'react'
import {ReactComponent as Close} from '../n-close-goal.svg'
import axios from 'axios'


const LibraryGoal = ({goal}) => {

    return (
        <div className={goal ? 'n-goals-box-active' : 'n-goals-box-inactive'}>

            {goal && (<div className='n-goals-x'><Close /></div>)}
            {goal && (<div className='n-goals-check'></div>)}

            <div className='n-goals-box-top'>
                <div className={goal ? 'n-goals-circle-active' : 'n-goals-circle-inactive'}>
                    <img src={`/${goal ? 'package_icon' : 'no_goal'}.png`} className='n-goals-circle-img'/>
                </div>
                <div className='n-goals-box-info'>
                    <div className={goal ? 'n-goals-box-info-title-active' : 'n-goals-box-info-title-inactive'}>{goal ? goal.goal_name : 'No Goal Set'}</div>
                    {goal && (
                        <>
                            <div className='n-goals-box-info-desc'><strong style={{color: '#454b54'}}>Goal:</strong> 30 minutes</div>
                            <div className='n-goals-box-info-desc'><strong style={{color: '#454b54'}}>Reading Rate:</strong> 225 WPM</div>
                        </>
                    )}
                    {!goal && (
                        <div className='n-goals-box-info-desc-none'>Click to create a goal and earn rewards!</div>
                    )}
                </div>
            </div>
            <div className='n-goals-box-bottom'>
                <div className='n-goals-fill-bar'>
                    {goal && (<div className='n-goals-fill' />)}
                </div>
                <div className={goal ? 'n-goals-quant-active' : 'n-goals-quant-inactive'}>{goal ? `${goal.quantity_achieved}/${goal.quantity_required}` : '??/???'}</div>
            </div>
        </div>
    )
}

export default LibraryGoal