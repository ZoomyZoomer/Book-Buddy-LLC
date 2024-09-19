import React from 'react'
import { useState, useRef } from 'react';

const WarehouseItemShowcase = ({item, key, index, availSpaces, setWarehouse, warehouse}) => {

  const [isHeld, setIsHeld] = useState(false);
  const timerRef = useRef(null);

  const modifyEntry = (rowIndex, colIndex, newValue) => {
    // Create a copy of the availableSpaces array
    const updatedSpaces = warehouse.map((row, rIndex) => 
      row.map((value, cIndex) => 
        rIndex === rowIndex && cIndex === colIndex ? newValue : value
      )
    );
    
    // Update the state with the modified array
    setWarehouse(updatedSpaces);
  };

  const handleMouseDown = () => {
    // Start the timer when the mouse is pressed down
    if (item !== 0 && availSpaces?.some(subArr => subArr[0] === index[0] && subArr[1] === index[1])){
      setIsHeld(true);
    }
    timerRef.current = setTimeout(() => {
      setIsHeld(false);
      modifyEntry(index[0], index[1], 0);
      // You can add additional actions here when the div is held for 2 seconds
    }, 1000);
  };

  const handleMouseUp = () => {
    // Clear the timer when the mouse is released
    clearTimeout(timerRef.current);
    setIsHeld(false);
    timerRef.current = null;
  };

  const handleMouseLeave = () => {
    // Clear the timer if the mouse leaves the div
    clearTimeout(timerRef.current);
    setIsHeld(false);
    timerRef.current = null;
  };

  const warehouseMap = new Map([
    [0, {display: undefined, name: 'Cleared Space', type: 'Path'}],
    [1, {display: 'bricks', name: 'Bricks', type: 'Obstruction', cost: 26}],
    [2, {display: 'board', name: 'Boards', type: 'Obstruction', cost: 14}],
    [7, {display: 'sack', cost: 0, name: 'Flour Sack', type: 'Lootable'}],
    [8, {display: 'present_icon', cost: 0, name: 'Mystery Gift', type: 'Lootable'}],
    [9, {display: 'package_icon', cost: 0, name: 'Package', type: 'Lootable'}],
    [10, {display: 'file_1', id: '0', name: 'File', type: 'File', cost: 0, time: {hours: 1, minutes: 0, seconds: 0}}],
    [11, {display: 'file_4', id: '1', name: 'Stat Sheet', type: 'File', cost: 0, time: {hours: 1, minutes: 30, seconds: 0}}],
    [30, {display: 'file_2', id: '20', name: 'Certificate', type: 'File', cost: 0, time: {hours: 4, minutes: 0, seconds: 0}}],
    [31, {display: 'file_3', id: '21', name: 'Love Letter', type: 'File', cost: 0, time: {hours: 5, minutes: 0, seconds: 0}}],
    [50, {display: 'file_5', id: '40', name: 'Diploma', type: 'File', cost: 0, time: {hours: 12, minutes: 0, seconds: 0}}],
    [51, {display: 'file_5', id: '40', name: 'Diploma', type: 'File', cost: 0, time: {hours: 12, minutes: 0, seconds: 0}}],
])

  return (
    <div className={availSpaces?.some(subArr => subArr[0] === index[0] && subArr[1] === index[1]) ? 'warehouse-item2' : item === 0 ? 'warehouse-empty' : 'warehouse-item2-hidden'} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>
      {item !== 0 && item !== 3 && (
        <img src={`/${warehouseMap.get(item)?.display}.png`} style={{height: '3.2em', zIndex: '2'}}/>
      )}
      {isHeld && <div className='avail-active'/>}
    </div>
  )
}

export default WarehouseItemShowcase