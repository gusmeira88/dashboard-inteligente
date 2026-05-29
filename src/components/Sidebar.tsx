import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import Icon from './Icon'

const CHAVE_TEMA = 'cache:theme'

function temaInicial(): 'light' | 'dark' {
    if (typeof document === 'undefined') return 'light'
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function Sidebar() {
    const [tema, setTema] = useState<'light' | 'dark'>(temaInicial)

    useEffect(() => {
        document.documentElement.dataset.theme = tema
        try {
            localStorage.setItem(CHAVE_TEMA, tema)
        } catch {
            return
        }
    }, [tema])

    function alternar() {
        setTema(t => (t === 'dark' ? 'light' : 'dark'))
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="sidebar-brand-logo">DI</div>
                <span>Dashboard Inteligente</span>
            </div>
            <nav className="sidebar-nav">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => `sidebar-link ${isActive ? 'ativo' : ''}`}
                >
                    <Icon name="dashboard" />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink
                    to="/visao-geral"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'ativo' : ''}`}
                >
                    <Icon name="overview" />
                    <span>Visão Geral</span>
                </NavLink>
                <NavLink
                    to="/produtos"
                    className={({ isActive }) => `sidebar-link ${isActive ? 'ativo' : ''}`}
                >
                    <Icon name="package" />
                    <span>Produtos</span>
                </NavLink>
            </nav>
            <button className="theme-toggle" onClick={alternar} aria-label="Alternar tema">
                <Icon name={tema === 'dark' ? 'sun' : 'moon'} size={16} />
                <span>{tema === 'dark' ? 'Tema claro' : 'Tema escuro'}</span>
            </button>
            <div className="sidebar-footer">v1.0</div>
        </aside>
    )
}

export default Sidebar
