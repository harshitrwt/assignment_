import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="auth-wrapper">
      <div className="liquid-section slide-up" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container text-left w-full">
          <h1 className="text-hero mb-4">Task<br/>Manager.</h1>
          <p className="text-sub mb-8" style={{ maxWidth: '600px' }}>
            High-contrast fluidity meets ultimate productivity. Manage your tasks with frictionless speed.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="btn btn-primary" style={{ fontSize: '1.25rem', padding: '1.25rem 2.5rem' }}>ENTER SYSTEM</Link>
            <Link to="/register" className="btn btn-outline" style={{ fontSize: '1.25rem', padding: '1.25rem 2.5rem', color: 'var(--bg-onyx)', borderColor: 'var(--bg-onyx)' }}>CREATE ACCOUNT</Link>
          </div>
        </div>
      </div>
      <div className="void-section flex-1">
        <div className="container">
          <div className="grid-cards mt-4 slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card">
              <h3 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Premium Design</h3>
              <p className="text-body" style={{ color: 'rgba(255,255,255,0.7)' }}>Aggressive saturation meets deep void for maximum contrast and focus.</p>
            </div>
            <div className="glass-card" style={{ animationDelay: '0.4s' }}>
              <h3 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Role Based</h3>
              <p className="text-body" style={{ color: 'rgba(255,255,255,0.7)' }}>Distinct views for Users and Admins. Built securely from the ground up.</p>
            </div>
            <div className="glass-card" style={{ animationDelay: '0.6s' }}>
              <h3 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Blazing Fast</h3>
              <p className="text-body" style={{ color: 'rgba(255,255,255,0.7)' }}>Optimized endpoints ensuring frictionless transactions everywhere.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
