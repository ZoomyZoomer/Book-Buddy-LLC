import React from 'react'
import {ReactComponent as ArrowRight} from '../progress_arrow.svg'

const MilestoneInfoSection = ({info}) => {
  return (
    <>

    {info?.tier !== undefined && (
        <>
        <div className='milestone-popup-grid'>
            <div className='milestone-popup-grid'>
              <div className='mp-2'>Tier {info?.tier} Reward - {info?.tier === 1 ? 'Mail' : info?.tier === 2 ? 'Package' : info?.tier === 3 ? 'Supply Drop' : 'Neatly Wrapped Present'}</div>
              <div className='mp-1'>Claimed on {info?.date}</div>
            </div>
            <div className='mp-flex'>
              <img src={`/${info?.tier === 1 ? 'mail_icon' : info?.tier === 2 ? 'package_icon' : info?.tier === 3 ? 'crate_drop' : 'present_icon'}.png`} className='mp-icon'/>
              <div className='mp-arrow'><ArrowRight /></div>
              <div className='mp-cards-container'>
                <div className='mp-card '>
                    <img src='/coin.png' style={{height: '2.6rem'}}/>
                    <div className='show-overview-bot'>{info?.coins} coins</div>
                </div>

                <div className='mp-card' style={{marginLeft: '0.4rem'}}>
                    <img src='/medal.png' style={{height: '2.6rem'}}/>
                    <div className='show-overview-bot'>+{info?.xp} xp</div>
                </div>

                <div class="flip-card">
                  <div class="flip-card-inner">
                    <div class="flip-card-front">
                      <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', height: '100%', marginLeft: '0.5rem'}}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                          <img src={`/${info?.display}.png`} style={{height: '5rem'}}/>
                        </div>
                        <div className='mp-grid' style={{marginLeft: '0.5rem'}}>
                          <div className='idc-21' style={{color: `${info?.loot.rarity === 'Common' ? '#7fd394' : info?.loot.rarity === 'Rare' ? '#6488b4' : '#a577c0'}`}}>{info?.name}</div>
                          <div className='idc-0'>
                            <div className='idc-11'>Rarity:&nbsp; </div>
                            <div className='idc-rarity1' style={{color: `${info?.loot.rarity === 'Common' ? '#7fd394' : info?.loot.rarity === 'Rare' ? '#6488b4' : '#a577c0'}`}}>{info?.loot.rarity}</div>
                          </div>
                          <div className='idc-0' style={{marginTop: '0.2rem'}}>
                            <div className='idc-11'>Value:&nbsp; </div>
                            <div className='idc-rarity1'>
                              <img src='/coin.png' style={{height: '1.2rem', marginRight: '0.2rem'}}/>
                              <div>{info?.loot.value}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flip-card-back">
                      <div className='mp-desc'>
                        {info?.loot.desc}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className='mp-sep2'/>
          </>
    
    )}
    </>
    
  )
}

export default MilestoneInfoSection