import React from 'react'

const WarehouseItemShowcase = ({item}) => {

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
    <div className='warehouse-item2'>
      {item !== 0 && (
        <img src={`/${warehouseMap.get(item)?.display}.png`} style={{height: '3.2em', zIndex: '2'}}/>
      )}
    </div>
  )
}

export default WarehouseItemShowcase