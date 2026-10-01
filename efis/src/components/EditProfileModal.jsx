import { useEffect, useId, useState } from 'react'
import { Eye, EyeOff, Plus, X } from 'lucide-react'

function splitName(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return { firstName: '', lastName: '', otherNames: '' }

  return {
    firstName: parts[0],
    lastName: parts.length > 1 ? parts[parts.length - 1] : '',
    otherNames: parts.slice(1, -1).join(' '),
  }
}

function formFromProfile(profile) {
  const fromName = splitName(profile.name)

  return {
    firstName: profile.firstName || fromName.firstName,
    lastName: profile.lastName || fromName.lastName,
    otherNames: profile.otherNames ?? fromName.otherNames,
    email: profile.email || '',
    username: profile.username || '',
    password: '',
    phoneNo: profile.phoneNo || '',
    nationalIDNo: profile.nationalIDNo || '',
    staffID: profile.staffID || '',
    department_id: profile.departmentId === 0 || profile.departmentId ? String(profile.departmentId) : '',
    roleName: Array.isArray(profile.roles) ? [...profile.roles] : [],
    users_id: profile.usersId ?? '',
    active: profile.active !== false,
  }
}

function mergeUpdatedProfile(profile, form) {
  const name = [form.firstName, form.otherNames, form.lastName].filter(Boolean).join(' ')

  return {
    ...profile,
    firstName: form.firstName,
    lastName: form.lastName,
    otherNames: form.otherNames,
    email: form.email,
    username: form.username,
    phoneNo: form.phoneNo,
    nationalIDNo: form.nationalIDNo,
    staffID: form.staffID,
    departmentId: form.department_id === '' ? '' : Number(form.department_id) || form.department_id,
    roles: form.roleName,
    usersId: form.users_id,
    active: form.active,
    name: name || form.username || profile.name,
  }
}

function EditProfileModal({ profile, open, onClose, onUpdated }) {
  const titleId = useId()
  const [form, setForm] = useState(() => formFromProfile(profile))
  const [roleDraft, setRoleDraft] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [notice, setNotice] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return

    setForm(formFromProfile(profile))
    setRoleDraft('')
    setPasswordVisible(false)
    setNotice('')
  }, [open, profile])

  useEffect(() => {
    if (!open) return undefined

    function handleKey(event) {
      if (event.key === 'Escape' && !isSubmitting) onClose()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, isSubmitting, onClose])

  if (!open) return null

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  function addRole(event) {
    event.preventDefault()
    const nextRole = roleDraft.trim()
    if (!nextRole) return
    setForm((current) => (
      current.roleName.includes(nextRole)
        ? current
        : { ...current, roleName: [...current.roleName, nextRole] }
    ))
    setRoleDraft('')
  }

  function removeRole(role) {
    setForm((current) => ({
      ...current,
      roleName: current.roleName.filter((item) => item !== role),
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setNotice('')

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      otherNames: form.otherNames.trim(),
      email: form.email.trim(),
      username: form.username.trim(),
      password: form.password,
      phoneNo: form.phoneNo.trim(),
      nationalIDNo: form.nationalIDNo.trim(),
      staffID: form.staffID.trim(),
      department_id: form.department_id === '' ? '' : Number(form.department_id) || form.department_id,
      roleName: form.roleName,
      users_id: form.users_id === '' ? form.users_id : Number(form.users_id) || form.users_id,
      active: form.active,
    }

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    if (profile.token) {
      headers.Authorization = `Bearer ${profile.token}`
    }

    try {
      const response = await fetch('https://ieics.kephis.org/kephis-api/users/updateUser', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })

      const contentType = response.headers.get('content-type') || ''
      let result = null
      if (contentType.includes('application/json')) {
        try {
          result = await response.json()
        } catch {
          result = null
        }
      } else {
        result = await response.text()
      }

      const message = typeof result === 'string'
        ? result
        : result?.message || result?.error

      if (!response.ok) {
        setNotice(message || 'Profile update failed. Please try again.')
        return
      }

      onUpdated(mergeUpdatedProfile(profile, form))
      onClose()
    } catch (error) {
      setNotice(error instanceof TypeError
        ? 'Unable to reach the profile service. Please try again.'
        : error.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={() => !isSubmitting && onClose()}>
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <p className="profile-eyebrow">YOUR ACCOUNT</p>
            <h2 id={titleId}>Edit profile</h2>
            <p>Update the details associated with this account.</p>
          </div>
          <button type="button" className="modal-close" aria-label="Close" onClick={onClose} disabled={isSubmitting}>
            <X size={18} />
          </button>
        </header>

        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div className="modal-fields">
            <label>
              First name
              <input
                name="firstName"
                value={form.firstName}
                onChange={(event) => updateField('firstName', event.target.value)}
                autoComplete="given-name"
                required
              />
            </label>
            <label>
              Last name
              <input
                name="lastName"
                value={form.lastName}
                onChange={(event) => updateField('lastName', event.target.value)}
                autoComplete="family-name"
                required
              />
            </label>
            <label>
              Other names
              <input
                name="otherNames"
                value={form.otherNames}
                onChange={(event) => updateField('otherNames', event.target.value)}
                autoComplete="additional-name"
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label>
              Username
              <input
                name="username"
                value={form.username}
                onChange={(event) => updateField('username', event.target.value)}
                autoComplete="username"
                required
              />
            </label>
            <label>
              Password
              <span className="modal-password-wrap">
                <input
                  name="password"
                  type={passwordVisible ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  autoComplete="new-password"
                  placeholder="Enter password"
                  required
                />
                <button
                  className="visibility-button"
                  type="button"
                  aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                  aria-pressed={passwordVisible}
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            <label>
              Phone number
              <input
                name="phoneNo"
                value={form.phoneNo}
                onChange={(event) => updateField('phoneNo', event.target.value)}
                autoComplete="tel"
              />
            </label>
            <label>
              National ID
              <input
                name="nationalIDNo"
                value={form.nationalIDNo}
                onChange={(event) => updateField('nationalIDNo', event.target.value)}
              />
            </label>
            <label>
              Staff ID
              <input
                name="staffID"
                value={form.staffID}
                onChange={(event) => updateField('staffID', event.target.value)}
              />
            </label>
            <label>
              Department ID
              <input
                name="department_id"
                value={form.department_id}
                onChange={(event) => updateField('department_id', event.target.value)}
              />
            </label>
          </div>

          <fieldset className="modal-roles">
            <legend>Roles</legend>
            <p>Add every role this account should keep. More than one is allowed.</p>
            <div className="role-list modal-role-list">
              {form.roleName.length
                ? form.roleName.map((role) => (
                  <button
                    type="button"
                    className="role-badge role-badge-action"
                    key={role}
                    onClick={() => removeRole(role)}
                    aria-label={`Remove ${role}`}
                  >
                    {role.replaceAll('_', ' ')}
                    <X size={12} />
                  </button>
                ))
                : <span className="empty-value">No roles assigned</span>}
            </div>
            <div className="role-add-row">
              <input
                value={roleDraft}
                onChange={(event) => setRoleDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') addRole(event)
                }}
                placeholder="Add a role name"
                aria-label="Role name"
              />
              <button type="button" className="edit-profile-button" onClick={addRole}>
                <Plus size={16} /> <span>Add role</span>
              </button>
            </div>
          </fieldset>

          <label className="remember-option modal-active">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => updateField('active', event.target.checked)}
            />
            <span className="checkbox-mark" aria-hidden="true" />
            Account is active
          </label>

          {notice && <p className="profile-notice" role="status">{notice}</p>}

          <div className="modal-actions">
            <button type="button" className="edit-profile-button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button className="submit-button modal-save" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal
