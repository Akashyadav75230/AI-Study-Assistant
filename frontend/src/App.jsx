import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Forgot from './pages/Forgot'
import Reset from './pages/Reset'
import Home from './pages/Home'
import FileDetail from './pages/FileDetail'
import Quiz from './pages/Quiz'
import Flashcards from './pages/Flashcards'
import Schedule from './pages/Schedule'
import ForgotEmail from './pages/ForgotEmail'

function useAuth() {
  const token = localStorage.getItem('token')
  return { token, isAuthed: !!token }
}

function Navbar() {
  const { isAuthed } = useAuth()
  const nav = useNavigate()
  function logout() {
    localStorage.removeItem('token')
    nav('/login')
  }
  return (
    <div className="flex items-center justify-between p-3 bg-white shadow">
      <div className="font-bold">AI Study Assistant</div>
      <div className="flex gap-3">
        {isAuthed && <Link className="btn" to="/">Home</Link>}
        {isAuthed && <button className="btn" onClick={logout}>Logout</button>}
      </div>
    </div>
  )
}

function PrivateRoute({ children }) {
  const { isAuthed } = useAuth()
  return isAuthed ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-4">
        <Routes>
          {/* 🧠 Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/forgot-email" element={<ForgotEmail />} />
          <Route path="/reset" element={<Reset />} />

          {/* 🔒 Protected Routes */}
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/file/:id" element={<PrivateRoute><FileDetail /></PrivateRoute>} />
          <Route path="/quiz/:id" element={<PrivateRoute><Quiz /></PrivateRoute>} />
          <Route path="/flashcards/:id" element={<PrivateRoute><Flashcards /></PrivateRoute>} />
          <Route path="/schedule" element={<PrivateRoute><Schedule /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  )
}
