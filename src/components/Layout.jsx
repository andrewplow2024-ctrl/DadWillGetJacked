import { Outlet, NavLink } from 'react-router-dom';
import { Home, Dumbbell, History, BarChart2 } from 'lucide-react';

export default function Layout() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: 'var(--bg-primary)'
        }}>
            <main style={{ flex: 1, overflowY: 'auto', padding: '1rem', paddingBottom: '5rem' }}>
                <Outlet />
            </main>

            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '4rem',
                backgroundColor: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                zIndex: 100,
                maxWidth: '600px',
                margin: '0 auto' // Center on desktop
            }}>
                <NavItem to="/" icon={<Home size={24} />} label="Home" />
                <NavItem to="/workout" icon={<Dumbbell size={24} />} label="Workout" />
                <NavItem to="/history" icon={<History size={24} />} label="History" />
                <NavItem to="/analytics" icon={<BarChart2 size={24} />} label="Stats" />
            </nav>
        </div>
    );
}

function NavItem({ to, icon, label }) {
    return (
        <NavLink
            to={to}
            style={({ isActive }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textDecoration: 'none',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                gap: '0.25rem'
            })}
        >
            {icon}
            <span>{label}</span>
        </NavLink>
    );
}
