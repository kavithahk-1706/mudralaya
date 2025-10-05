// Navbar.jsx
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useState, useEffect } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { googleProvider } from '../firebase';
import { BsGoogle } from 'react-icons/bs';

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
          मुद्रालय
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-8">
          <a href="#home" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
            Home
          </a>
          <a href="#whats-included" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
            What's Included
          </a>
          <Link to="/playground" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
            Playground
          </Link>

          {/* Auth Section */}
          {user ? (
            <>
              <Link to="/recordings" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                Recordings
              </Link>
              <div className="flex items-center gap-4">
                <span className="font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">Hi, {user.displayName?.split(' ')[0]}!</span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600/90 to-teal-500/90 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={handleLogin}
              className="px-4 py-2 bg-gradient-to-r from-purple-600/90 to-teal-500/90 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <BsGoogle />
              <span>Login with Google</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}