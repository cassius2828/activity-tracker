import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import Tasks from './pages/Tasks'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Nav from './components/Nav'
import Footer from './components/Footer'

function App() {

  return (
    <>
      <Nav />
      <main>
        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
  
      </main>
      <Footer />
    </>
  )
}

export default App
