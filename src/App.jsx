import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import Home from './pages/Home';
import Playground from './pages/Playground';
import Recordings from './pages/Recordings';
import Navbar from './components/NavBar';
import useTonePlayer from './hooks/useTonePlayer';

function App() {
  const [user, setUser] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState("Veena");
  const [basePitchShift, setBasePitchShift]=useState(0);

  const playNote = useTonePlayer(selectedInstrument, 0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  return (
    <BrowserRouter>
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/playground" element={<Playground 
              user={user}
              selectedInstrument={selectedInstrument}
              setSelectedInstrument={setSelectedInstrument}
              basePitchShift={basePitchShift}
              setBasePitchShift={setBasePitchShift}
            />} />
        <Route 
          path="/recordings" 
          element={user ? <Recordings playNote={playNote} /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;