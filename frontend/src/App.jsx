import React, { useEffect } from 'react'
import {Routes, Route, Navigate} from "react-router-dom"
import HomePage from './page/HomePage'
import LoginPage from './page/LoginPage'
import SignUpPage from './page/SignUpPage'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/useAuthStore'
import { check } from '../../backend/src/controllers/auth.controllers'

function App() {
    const {authUser, isCheckingAuth, checkAuth} = useAuthStore();

    useEffect(()=>{
      checkAuth();
    }, [checkAuth])



  return (
    <div className='flex flex-col justify-start items-center'>
      <Toaster />
      <Routes>
        <Route 
          path='/' 
          element={authUser ? <HomePage/> : <Navigate to='/login'/>}
        />
        <Route 
          path='/login' 
          element={!authUser ? <LoginPage/> : <Navigate to='/'/>}
        />
        <Route 
          path='/signup' 
          element={!authUser ? <SignUpPage/> : <Navigate to='/'/>}
        />
      </Routes>
    </div>
  )
}

export default App