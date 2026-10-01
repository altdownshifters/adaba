import { Leaf } from 'lucide-react'
import { NavLink } from 'react-router-dom'

function Brand({ to = '/', className = 'brand' }) {
  return (
    <NavLink className={className} to={to} aria-label="EFIS home">
      <span className="brand-mark"><Leaf size={20} strokeWidth={2.2} /></span>
      <span className="brand-name">efis<span>.</span></span>
    </NavLink>
  )
}

export default Brand