import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useState, useEffect } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { googleProvider } from '../firebase';
import { BsGoogle } from 'react-icons/bs';
import PaletteMenu from './PalettePicker';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('logout failed:', error);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{ background: 'var(--surface)', borderBottom: '1px solid var(--line-soft)' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo/Brand */}
        <Link to="/" className="serif text-2xl font-semibold" style={{ color: 'var(--accent)' }}>
          मुद्रालय
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6 text-sm">
          <a href="/#home" className="link-soft">Home</a>
          <a href="/#whats-included" className="link-soft">What's Included</a>
          <Link to="/playground" className="link-soft">Playground</Link>
          {user && <Link to="/recordings" className="link-soft">Recordings</Link>}

          <PaletteMenu />

          {user ? (
            <div className="flex items-center gap-3">
              <span className="serif italic" style={{ color: 'var(--ink-soft)' }}>
                Hi, {user.displayName?.split(' ')[0]}!
              </span>
              <button onClick={handleLogout} className="btn">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} className="btn">
              <BsGoogle style={{ color: 'var(--accent)' }} />
              <span>Login with Google</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
