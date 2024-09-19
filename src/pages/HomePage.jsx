import React from 'react'
import Navbar from '../components/Navbar'
import MainContextHeader from '../components/MainContextHeader'
import DailyQuests from '../components/DailyQuests'


function HomePage() {



  return (
    <div styles={{height: '100%', width: '100%'}}>
        <Navbar />
        <MainContextHeader />
        <DailyQuests />
    </div>
  )
}

export default HomePage