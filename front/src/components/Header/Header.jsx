import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Header.css'

export function Header() {
  const [now, setNow] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const id = setInterval(() => setNow(formatTime(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="vault-header">
      <div className="vault-header-top">
        <div className="vault-brand-block">
          <h1 className="vault-title">SISTEMA HELTOM//VAULT</h1>
          <p className="vault-status">
            <span className="vault-status-dot" aria-hidden="true" />
            NEURAL LINK ATIVO
          </p>
        </div>
        <div className="vault-meta">
          <span>MONITOR-01</span>
          <span className="vault-clock">{now}</span>
          <span>v4.7.2 — BUILD 0x9F3A</span>
        </div>
      </div>

      <nav className="vault-tabs" aria-label="Seções do vault">
        <NavLink
          to="/"
          className={({ isActive }) => `vault-tab${isActive ? ' is-active' : ''}`}
        >
          HOME
        </NavLink>
        <NavLink
          to="/memorias"
          className={({ isActive }) => `vault-tab${isActive ? ' is-active' : ''}`}
        >
          MEMÓRIAS
        </NavLink>
        <NavLink
          to="/habilidades"
          className={({ isActive }) => `vault-tab${isActive ? ' is-active' : ''}`}
        >
          HABILIDADES
        </NavLink>
        <NavLink
          to="/traumas"
          className={({ isActive }) => `vault-tab${isActive ? ' is-active' : ''}`}
        >
          TRAUMAS
        </NavLink>
      </nav>
    </header>
  )
}

function formatTime(date) {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export default Header
