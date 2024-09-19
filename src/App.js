import React from 'react'
import {Route, Routes} from "react-router-dom"
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import axios from 'axios'
import ErrorPage from './pages/ErrorPage'
import BookshelfPage from './pages/BookshelfPage'
import AddBook from './pages/AddBook'
import BookDetails from './pages/BookDetails'
import StoragePage from './pages/StoragePage'
import { useState } from 'react'
import RewardsPage from './pages/RewardsPage'
import Library from './pages/Library'
import CreateEntry from './pages/CreateEntry'
import LandingPage from './pages/LandingPage'

axios.defaults.withCredentials = true;


function App() {

  const [key, setKey] = useState(0);
  const remountComponent = () => {
    setKey(prevKey => prevKey + 1);
  };

  return (

    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route index element={<LandingPage />} />
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route path="/library" element={<Library />} />
      <Route path="/add-book/:tabName" element={<AddBook />} />
      <Route path="/book-contents/:tab_name/:volume_id" element={<BookDetails />} />
      <Route path='/create-entry/:volume_id' element={<CreateEntry />}/>
      <Route path='/rewards' element={<RewardsPage />}/>
      <Route path='/storage' element={<StoragePage />} />
      <Route path="/error" element={<ErrorPage />} />
    </Routes>

  )
}

export default App