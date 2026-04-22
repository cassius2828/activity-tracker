import "./App.css";
import { Routes, Route } from "react-router-dom";
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
      <main className="flex min-h-0 w-full flex-1 flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App
