import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="full-yellow-screen slide-up">
      <div className="split-layout">
        <div className="split-left">
          <h1 className="text-hero mb-4">Task<br/>Void.</h1>
          <p className="text-sub mb-8">
            High-contrast fluidity meets ultimate productivity. Manage your tasks with frictionless speed.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="btn btn-primary" style={{ fontSize: '1.25rem', padding: '1.25rem 2.5rem' }}>ENTER SYSTEM</Link>
          </div>
        </div>
        <div className="split-right">
          <div className="glass-card auth-glass" style={{ textAlign: 'center' }}>
            <h2 className="text-sub mb-4" style={{ color: 'var(--bg-onyx)', fontWeight: 900 }}>Ready to dive in?</h2>
            <p style={{ color: 'var(--bg-onyx)', opacity: 0.8, marginBottom: '2rem' }}>Experience the ultimate frictionless workflow.</p>
            <div className="flex flex-col gap-4">
              <Link to="/login" className="btn btn-primary w-full">Sign In</Link>
              <Link to="/register" className="btn btn-outline w-full">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
