import React from 'react';

const NoMoreRewards = ({ tierInfo }) => {
  // Count the number of 'null' entries in tierInfo
  const nullCount = tierInfo.filter(tier => tier === null).length;

  return (
    <div className='empty-cont'>
        <img src='/empty-box.png' style={{ height: '120px' }} />
        <div className='nmr'>
            Missing {nullCount} rewards
        </div>
    </div>


  );
};

export default NoMoreRewards;