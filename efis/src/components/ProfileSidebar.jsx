import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Brand from './Brand.jsx'

function ProfileSidebar({ profile, initials, onSignOut }) {
  return (
    <aside className="workspace-sidebar">
      <Brand className="workspace-brand" to="/profile" />

      <p className="sidebar-label">WORKSPACE</p>
      <nav className="workspace-nav" aria-label="Workspace navigation">
        <button type="button" className="workspace-nav-item" disabled>
          <LayoutDashboard size={18} /> <span>Dashboard</span>
        </button>
        <button type="button" className="workspace-nav-item" disabled>
          <ClipboardList size={18} /> <span>Applications</span>
        </button>
        <NavLink to="/profile" className={({ isActive }) => `workspace-nav-item${isActive ? ' active' : ''}`}>
          <UserRound size={18} /> <span>Profile</span>
        </NavLink>
        <button type="button" className="workspace-nav-item" disabled>
          <Settings size={18} /> <span>Settings</span>
        </button>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <span className="user-avatar small-avatar">{initials}</span>
          <span className="sidebar-user-copy"><strong>{profile.name}</strong><small>{profile.username}</small></span>
        </div>
        <button type="button" className="signout-button" onClick={onSignOut}>
          <LogOut size={17} /> <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}

export default ProfileSidebar