import React from 'react'

const StorageItemShowcase = ({file, index, myCt}) => {
  return (
    <div className={index !== myCt ? 'storage-item-showcase' : 'storage-item-curr'} style={{marginLeft: '0.2rem', marginRight: '0.2rem'}}>
        <img src={`/${file?.img}.png`} className='storage-item-seen' style={{height: '2.4rem'}}/>
    </div>
  )
}

export default StorageItemShowcase