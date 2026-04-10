import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '40px' }}>
      <Link 
        to="/" 
        className="glass-panel"
        style={{ 
          textDecoration: 'none', 
          padding: '12px 24px',
          boxShadow: 'none',
          background: location.pathname === '/' ? 'var(--text-main)' : 'var(--glass-bg)',
          color: location.pathname === '/' ? 'var(--bg-gradient)' : 'var(--text-main)',
        }}>
        📖 日記を書く
      </Link>
      <Link 
        to="/arena" 
        className="glass-panel"
        style={{ 
          textDecoration: 'none', 
          padding: '12px 24px', 
          boxShadow: 'none',
          background: location.pathname === '/arena' ? 'var(--text-main)' : 'var(--glass-bg)',
          color: location.pathname === '/arena' ? 'var(--bg-gradient)' : 'var(--text-main)',
        }}>
        ⚔️ バトルアリーナ
      </Link>
    </nav>
  );
};
