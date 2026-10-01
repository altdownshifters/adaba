import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import './App.css'

function App() {
  const [profile, setProfile] = useState(null)

  return (
    <Routes>
      <Route path="/" element={<LoginPage onAuthenticated={setProfile} />} />
      <Route
        path="/profile"
        element={profile
          ? <ProfilePage profile={profile} onSignOut={() => setProfile(null)} onProfileUpdated={setProfile} />
          : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App