import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Brand from '../components/Brand.jsx'

function normalizeProfile(data) {
  const company = data.company || {}

  return {
    name: data.name || data.username || 'User',
    username: data.username || '',
    email: data.email || '',
    missionId: data.mission_id ?? '',
    roles: Array.isArray(data.roles)
      ? data.roles.map((role) => typeof role === 'string' ? role : role.roleName || role.name).filter(Boolean)
      : [],
    company: {
      name: company.name || '',
      email: company.email || '',
      entityType: company.entityType?.name || '',
      registrationDate: company.registrationDate || '',
      approvalStage: company.approvalStage || '',
    },
  }
}

function LoginPage({ onAuthenticated }) {
  const navigate = useNavigate()
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [notice, setNotice] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setIsSubmitting(true)
    setNotice('')

    try {
      const response = await fetch('https://ieics.kephis.org/kephis-api/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username: formData.get('username'),
          password: formData.get('password'),
          otp: '',
          newPassword: '',
          confirmpass: '',
        }),
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
        setNotice(message || 'Sign-in failed. Check your credentials and try again.')
      } else if (result && typeof result === 'object' && result.username) {
        onAuthenticated(normalizeProfile(result))
        navigate('/profile')
      } else {
        setNotice(message || 'Sign-in succeeded, but profile details were not returned.')
      }
    } catch (error) {
      setNotice(error instanceof TypeError
        ? 'Unable to reach the sign-in service. Please try again.'
        : error.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-heading">
        <header className="site-header">
          <Brand />
        </header>

        <div className="login-content">
          <h1 id="login-heading">Welcome<br />back<span>.</span></h1>
          <p className="intro">Sign in to pick up right where you left off.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <div className="input-wrap">
              <Mail size={18} aria-hidden="true" />
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </div>

            <div className="password-label-row">
              <label htmlFor="password">Password</label>
              <button className="text-button" type="button" onClick={() => setNotice('Password recovery will be available once account services are connected.') }>
                Forgot password?
              </button>
            </div>
            <div className="input-wrap">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                id="password"
                name="password"
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
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
            </div>

            <label className="remember-option">
              <input type="checkbox" name="remember" />
              <span className="checkbox-mark" aria-hidden="true" />
              Keep me signed in
            </label>

            <button className="submit-button" type="submit" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Signing in...' : 'Sign in'}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <p className="form-notice" role="status">{notice}</p>
          </form>
          <p className="signup-note">New to EFIS? <button className="text-button" type="button" onClick={() => setNotice('Ask your workspace administrator for an invitation.')}>Request access</button></p>
        </div>

        <footer className="site-footer">
          <span>© 2026 EFIS</span>
        </footer>
      </section>

      <aside className="visual-panel" aria-label="A greener way to work">
        <div className="visual-shade" />
        <div className="visual-copy">
          <span className="visual-rule" />
          <p>Good things grow<br />with <em>good systems.</em></p>
          <span className="visual-caption">A little more focus. A lot more possibility.</span>
        </div>
      </aside>
    </main>
  )
}

export default LoginPage