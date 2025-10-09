import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ref, onValue, remove, update } from 'firebase/database'; 
import { BsPencil } from 'react-icons/bs';
import { db, auth } from '../firebase';
import Navbar from '../components/NavBar';

export default function Recordings({ playNote }) {
  const [recordings, setRecordings] = useState([]);
  const [isPlaying,setIsPlaying]=useState(false);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [editingId, setEditingId] = useState(null); 
  const [newName, setNewName] = useState(''); 
  const startTimeRef = useRef(null);
  const timeoutsRef = useRef([]);
  const navigate = useNavigate();

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

  const playback = (notes) => {
    if (!notes || notes.length === 0) return;

    if (!isPlaying) {
      setIsPlaying(true);
      setIsPaused(false);
      startTimeRef.current = performance.now() - elapsed;
      timeoutsRef.current = [];

      const scheduleNotes = () => {
        const now = performance.now();
        const elapsedTime = now - startTimeRef.current;

        notes.forEach(note => {
          const delay = note.timestamp - elapsedTime;
          if (delay >= 0) {
            const id = setTimeout(() => {
              playNote(note.swara, note.sthayi);
            }, delay);
            timeoutsRef.current.push(id);
          }
        });
      };

      scheduleNotes();
    } else if (!isPaused) {
      // pause
      const now = performance.now();
      setElapsed(now - startTimeRef.current);
      timeoutsRef.current.forEach(id => clearTimeout(id));
      setIsPaused(true);
    } else {
      // resume
      setIsPaused(false);
      startTimeRef.current = performance.now() - elapsed;
      timeoutsRef.current = [];

      notes.forEach(note => {
        const delay = note.timestamp - elapsed;
        if (delay >= 0) {
          const id = setTimeout(() => {
            playNote(note.swara, note.sthayi);
          }, delay);
          timeoutsRef.current.push(id);
        }
      });
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
    if (!confirm('Delete this recording?')) return;
    
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
                        onClick={() => playback(recording.notes)}
                        className="px-5 py-2 bg-gradient-to-r from-teal-500/90 to-cyan-500/90 text-white rounded-lg font-semibold hover:shadow-md transition-all duration-200"
                      >
                        {!isPlaying ? "Play" : isPaused ? "Resume" : "Pause"}
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