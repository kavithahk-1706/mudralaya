import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ref, onValue, remove, update } from 'firebase/database'; 
import { BsPencil } from 'react-icons/bs';
import { db, auth } from '../firebase';
import Navbar from '../components/NavBar';

export default function Recordings({ playNote }) {
  const [recordings, setRecordings] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [editingId, setEditingId] = useState(null); 
  const [newName, setNewName] = useState(''); 
  const startTimeRef = useRef(null);
  const timeoutsRef = useRef([]);
  const navigate = useNavigate();
  const [playingStates, setPlayingStates] = useState({});
  const [elapsedTimes, setElapsedTimes] = useState({});
  const timeoutsRefs = useRef({});
  const startTimesRefs = useRef({});


  useEffect(() => {

    return () => {
     
      Object.values(timeoutsRefs.current).forEach(timeoutArray => {
        if (timeoutArray) {
          timeoutArray.forEach(t => clearTimeout(t));
        }
      });
      timeoutsRefs.current = {};
    };
  }, []);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/');
      return;
    }

    const recordingsRef = ref(db, `recordings/${auth.currentUser.uid}`);
    
    const unsubscribe = onValue(recordingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const recordingsArray = Object.entries(data).map(([id, recording]) => ({
          id,
          ...recording
        }));
        recordingsArray.sort((a, b) => b.timestamp - a.timestamp);
        setRecordings(recordingsArray);
      } else {
        setRecordings([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);


  const playback = (recording) => {
    const { id, notes } = recording;
    if (!notes || notes.length === 0) return;

    const state = playingStates[id] || { isPlaying: false, isPaused: false, elapsed: 0 };
    const { isPlaying, isPaused, elapsed } = state;

    if (!isPlaying) {
      // start
      startTimesRefs.current[id] = performance.now() - elapsed;
      timeoutsRefs.current[id] = [];

      notes.forEach(note => {
        const delay = note.timestamp - elapsed;
        if (delay >= 0) {
          const t = setTimeout(() => playNote(note.swara, note.sthayi, recording.basePitchShift || 0), delay);
          timeoutsRefs.current[id].push(t);
        }
      });

      // reset after last note
      const finalTimeout = setTimeout(() => {
        setPlayingStates(prev => ({ ...prev, [id]: { isPlaying: false, isPaused: false, elapsed: 0 } }));
        timeoutsRefs.current[id] = [];
      }, Math.max(...notes.map(n => n.timestamp)) - elapsed + 100);
      timeoutsRefs.current[id].push(finalTimeout);

      setPlayingStates(prev => ({ ...prev, [id]: { isPlaying: true, isPaused: false, elapsed: 0 } }));

    } else if (!isPaused) {
      // pause
      const now = performance.now();
      const newElapsed = now - startTimesRefs.current[id];
      timeoutsRefs.current[id].forEach(t => clearTimeout(t));
      setPlayingStates(prev => ({ ...prev, [id]: { ...prev[id], isPaused: true, elapsed: newElapsed } }));

    } else {
      // resume
      startTimesRefs.current[id] = performance.now() - elapsed;
      timeoutsRefs.current[id] = [];

      notes.forEach(note => {
        const delay = note.timestamp - elapsed;
        if (delay >= 0) {
          const t = setTimeout(() => playNote(note.swara, note.sthayi, recording.basePitchShift || 0), delay);
          timeoutsRefs.current[id].push(t);
        }
      });

      const finalTimeout = setTimeout(() => {
        setPlayingStates(prev => ({ ...prev, [id]: { isPlaying: false, isPaused: false, elapsed: 0 } }));
        timeoutsRefs.current[id] = [];
      }, Math.max(...notes.map(n => n.timestamp)) - elapsed + 100);
      timeoutsRefs.current[id].push(finalTimeout);

      setPlayingStates(prev => ({ ...prev, [id]: { ...prev[id], isPaused: false } }));
    }
  };


  const renameRecording = async (id) => {
    if (!newName.trim()) {
      alert('name cannot be empty');
      return;
    }

    const recordingRef = ref(db, `recordings/${auth.currentUser.uid}/${id}`);
    await update(recordingRef, { raga: newName });
    setEditingId(null);
    setNewName('');
  };

  const deleteRecording = async (id) => {
    if(!confirm("Delete this recording?")) return;
    // clear all timeouts for this recording
    if (timeoutsRefs.current[id]) {
      timeoutsRefs.current[id].forEach(t => clearTimeout(t));
      timeoutsRefs.current[id] = [];
    }
    
    // clear the playing state
    setPlayingStates(prev => {
      const newStates = { ...prev };
      delete newStates[id];
      return newStates;
    });
    
    const recordingRef = ref(db, `recordings/${auth.currentUser.uid}/${id}`);
    await remove(recordingRef);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-500/90 via-cyan-500/95 to-teal-400/90 p-12 pt-28">
        <div className="max-w-5xl mx-auto bg-white/95 rounded-2xl shadow-2xl p-12">
          
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r p-3 from-purple-600 to-teal-500 bg-clip-text text-transparent">
              Your Recordings
            </h1>
          </div>
          
          {recordings.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              <p className="text-xl mb-2">No recordings yet</p>
              <p>Start recording in the playground to save your sessions.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recordings.map(recording => (
                <div 
                  key={recording.id} 
                  className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {editingId === recording.id ? (
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') renameRecording(recording.id);
                              if (e.key === 'Escape') {
                                setEditingId(null);
                                setNewName('');
                              }
                            }}
                            className="flex-1 px-3 py-1 border border-gray-300 text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                            autoFocus
                          />
                          <button 
                            onClick={() => renameRecording(recording.id)}
                            className="px-5 py-2 bg-gradient-to-r from-purple-600/90 to-blue-500/90 text-white rounded-lg font-semibold hover:shadow-md transition-all duration-200"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => {
                              setEditingId(null);
                              setNewName('');
                            }}
                            className="px-5 py-2 mx-3 bg-gradient-to-r from-purple-600/90 to-blue-500/90 text-white rounded-lg font-semibold hover:shadow-md transition-all duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">
                            {recording.raga}
                          </h3>
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mb-1">
                        {new Date(recording.timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        {recording.notes?.length || 0} notes • {recording.selectedInstrument || 'Unknown instrument'}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingId(recording.id);
                          setNewName(recording.raga);
                        }}
                        className="px-5 py-2 bg-gradient-to-r from-purple-600/90 to-blue-500/90 text-white rounded-lg font-semibold hover:shadow-md transition-all duration-200"
                      >
                        <BsPencil/>
                      </button>

                      <button 
                        onClick={() => playback(recording)}
                        className="px-5 py-2 bg-gradient-to-r from-teal-500/90 to-cyan-500/90 text-white rounded-lg font-semibold hover:shadow-md transition-all duration-200"
                      >
                        {!playingStates[recording.id]?.isPlaying ? "Play" :
                          playingStates[recording.id]?.isPaused ? "Resume" : "Pause"}
                      </button>

                      <button 
                        onClick={() => deleteRecording(recording.id)}
                        className="px-5 py-2 bg-gradient-to-r from-red-500/90 to-red-600/90 text-white rounded-lg font-semibold hover:shadow-md transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-8">
            <Link to="/playground" className="flex justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600/90 to-teal-500/90 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                Go to Playground
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>   
  );
}