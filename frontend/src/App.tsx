import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from './pages/Auth'
import Tasks from './pages/Tasks'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Nav from './components/Nav'
import Footer from './components/Footer'
import TaskDetails from './pages/TaskDetails'
import Teams from "./pages/Teams.tsx";
function App() {
  return (
    <>
      <Nav />
      <main className="flex min-h-0 w-full flex-1 flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/tasks" element={<Navigate to="/teams" replace />} />
          <Route path="/tasks/team/:teamId" element={<Tasks />} />
          <Route path="/tasks/user/:userId" element={<Tasks />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App
