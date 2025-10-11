import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useState, useEffect } from 'react';
import { BsGoogle } from 'react-icons/bs';

export default function AuthButton() {
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
    <div className="relative z-100 flex justify-end">
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-800 font-medium">{user.displayName}</span>

            <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-purple-600/90 to-pink-500/90 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-purple-700 hover:to-teal-600 transition-all duration-200"
            >
                Logout
            </button>
        </div>
      ) : (

        <button 
        onClick={handleLogin}
        className="px-4 py-2 bg-gradient-to-r border-none from-purple-600/90 to-pink-500/90 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:from-purple-700 hover:to-teal-600 transition-all duration-200 flex items-center gap-2"
        >
        <BsGoogle />
        <span>Login with Google</span>
        </button>        
        
      )}
    </div>
  );
}