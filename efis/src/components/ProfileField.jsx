function ProfileField({ label, value }) {
  return (
    <div className="profile-field">
      <span>{label}</span>
      <strong>{value || 'Not provided'}</strong>
    </div>
  )
}

export default ProfileField