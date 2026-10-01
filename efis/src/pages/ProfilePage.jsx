import { useState } from 'react'
import { Building2, PencilLine, ShieldCheck, UserRound } from 'lucide-react'
import ProfileField from '../components/ProfileField.jsx'
import ProfileSidebar from '../components/ProfileSidebar.jsx'

function formatDate(value) {
  if (typeof value !== 'string' || !value) return 'Not provided'
  const date = new Date(`${value.slice(0, 10)}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function ProfilePage({ profile, onSignOut }) {
  const [notice, setNotice] = useState('')
  const initials = profile.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <main className="workspace-page">
      <ProfileSidebar profile={profile} initials={initials} onSignOut={onSignOut} />

      <section className="workspace-main">
        <header className="workspace-topbar">
          <span className="breadcrumb">Workspace <span>/</span> Profile</span>
          <div className="topbar-user">
            <span>{profile.name}</span>
            <span className="user-avatar">{initials}</span>
          </div>
        </header>

        <div className="profile-content">
          <div className="profile-heading-row">
            <div>
              <p className="profile-eyebrow">YOUR ACCOUNT</p>
              <h1>Profile</h1>
              <p className="profile-subtitle">Your personal and organization details.</p>
            </div>
            <button
              type="button"
              className="edit-profile-button"
              onClick={() => setNotice('Profile editing will be available when the update endpoint is connected.')}
            >
              <PencilLine size={16} /> <span>Edit profile</span>
            </button>
          </div>

          {notice && <p className="profile-notice" role="status">{notice}</p>}

          <section className="profile-summary" aria-label="Account summary">
            <div className="summary-avatar">{initials}</div>
            <div className="summary-copy">
              <h2>{profile.name}</h2>
              <p>@{profile.username}</p>
            </div>
            <span className="account-status"><span /> Account active</span>
          </section>

          <div className="profile-sections">
            <section className="details-section" aria-labelledby="personal-heading">
              <div className="section-heading">
                <span className="section-icon"><UserRound size={17} /></span>
                <div><h2 id="personal-heading">Personal information</h2><p>Details associated with your account</p></div>
              </div>
              <div className="field-grid">
                <ProfileField label="Full name" value={profile.name} />
                <ProfileField label="Username" value={profile.username} />
                <ProfileField label="Email address" value={profile.email} />
                <ProfileField label="Mission ID" value={profile.missionId} />
              </div>
            </section>

            <section className="details-section" aria-labelledby="organization-heading">
              <div className="section-heading">
                <span className="section-icon orange-icon"><Building2 size={17} /></span>
                <div><h2 id="organization-heading">Organization</h2><p>Company and registration details</p></div>
              </div>
              <div className="field-grid">
                <ProfileField label="Company name" value={profile.company.name} />
                <ProfileField label="Company email" value={profile.company.email} />
                <ProfileField label="Entity type" value={profile.company.entityType} />
                <ProfileField label="Registration date" value={formatDate(profile.company.registrationDate)} />
                <ProfileField label="Approval stage" value={profile.company.approvalStage} />
              </div>
            </section>

            <section className="details-section access-section" aria-labelledby="access-heading">
              <div className="section-heading">
                <span className="section-icon"><ShieldCheck size={17} /></span>
                <div><h2 id="access-heading">Access and roles</h2><p>Permissions assigned to your account</p></div>
              </div>
              <div className="role-list">
                {profile.roles.length
                  ? profile.roles.map((role) => <span className="role-badge" key={role}>{role.replaceAll('_', ' ')}</span>)
                  : <span className="empty-value">No roles assigned</span>}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ProfilePage