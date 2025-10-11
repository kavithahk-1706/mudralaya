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
        
        <Link to="/" className="text-2xl font-bold hover:scale-110 transition-transform duration-200">
          <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
            मुद्रालय
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-8">
          
          <a href="/#home" className="hover:scale-110 transition-transform duration-200">
            <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
              Home
            </span>
          </a>
          <a href="/#whats-included" className="hover:scale-110 transition-transform duration-200">
            <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
              What's Included
            </span>
          </a>
          <Link to="/playground" className="hover:scale-110 duration-200">
            <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
              Playground
            </span>
          </Link>

          {/* Login Button */}
          {user ? (
            <>
            
              <Link to="/recordings" className="hover:scale-110 duration-200 font-medium">
                <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
                  Recordings
                </span>
              </Link>
       
              <div className="flex items-center gap-4">
                <span className="font-semibold">
                  <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
                    <em>Hi, {user.displayName?.split(' ')[0]}!</em>
                  </span>
                </span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600/90 to-teal-500/90 text-white rounded-lg font-semibold hover:scale-110 transition-transform duration-200"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={handleLogin}
              className="px-4 py-2 bg-gradient-to-r border border-none from-purple-600/90 to-teal-500/90 text-white rounded-lg font-semibold shadow-lg hover:scale-110 transition-transform duration-200 flex items-center gap-1"
            >
              <BsGoogle />
              <span>Login with Google</span>
            </button>
          )}
        </div>
        <p className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
              <em>Built by <a href="https://www.linkedin.com/in/kavitha-haima-kidambi-615791353" target="_blank" rel="noopener noreferrer"><span className="font-semibold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">Kavitha Haima Kidambi</span></a></em>
        </p>
      </div>
    </nav>
  );
}