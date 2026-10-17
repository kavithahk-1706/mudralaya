import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ref, onValue, remove, update } from 'firebase/database';
import { BsPencil, BsPlayFill, BsPauseFill, BsTrash, BsArrowCounterclockwise, BsArrowClockwise } from 'react-icons/bs';
import { db, auth } from '../firebase';
import Navbar from '../components/NavBar';
import useRecordingPlayer, { normalizeNotes, recordingLength } from '../hooks/useRecordingPlayer';

const SKIP_MS = 5000;
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const formatTime = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

// base pitch shift in semitones -> the sa it puts you on, e.g. 2 -> "D4"
const pitchLabel = (shift) => {
  const semis = 4 * 12 + shift;
  return `${NOTE_NAMES[((semis % 12) + 12) % 12]}${Math.floor(semis / 12)}`;
};

const uniqueInOrder = values => values.filter((v, i) => values.indexOf(v) === i);

// what a recording used, from the notes themselves (also works for older single-setting recordings)
function summarize(recording) {
  const notes = normalizeNotes(recording);
  return {
    notes,
    ragas: uniqueInOrder(notes.map(n => n.raga)),
    instruments: uniqueInOrder(notes.map(n => n.instrument)),
    pitches: uniqueInOrder(notes.map(n => n.pitch)),
  };
}

// points in the take where the raga, instrument or pitch changed
function findSwitches(notes) {
  const switches = [];
  for (let i = 1; i < notes.length; i++) {
    const prev = notes[i - 1], note = notes[i];
    const changes = [];
    if (note.raga !== prev.raga) changes.push(note.raga);
    if (note.instrument !== prev.instrument) changes.push(note.instrument);
    if (note.pitch !== prev.pitch) changes.push(`Sa = ${pitchLabel(note.pitch)}`);
    if (changes.length) switches.push({ at: note.timestamp, label: changes.join(' · ') });
  }
  return switches;
}

function Chips({ label, values }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--accent)' }}>{label}</span>
      {values.map((v, i) => (
        <span key={`${v}-${i}`} className="inline-flex items-center gap-1.5">
          {i > 0 && <span style={{ color: 'var(--muted)' }}>→</span>}
          <span>{v}</span>
        </span>
      ))}
    </span>
  );
}

// seekable bar: click or drag anywhere on it; faint ticks are notes, accent marks are switches
function ProgressBar({ position, length, notes, switches, onSeek }) {
  const trackRef = useRef(null);
  const draggingRef = useRef(false);

  const positionAt = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * length;
  };

  const onPointerDown = (e) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    onSeek(positionAt(e.clientX));
  };
  const onPointerMove = (e) => { if (draggingRef.current) onSeek(positionAt(e.clientX)); };
  const onPointerUp = () => { draggingRef.current = false; };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') onSeek(position - SKIP_MS);
    if (e.key === 'ArrowRight') onSeek(position + SKIP_MS);
  };

  const pct = (ms) => `${(ms / length) * 100}%`;

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label="Playback position"
      aria-valuemin={0}
      aria-valuemax={Math.round(length / 1000)}
      aria-valuenow={Math.round(position / 1000)}
      aria-valuetext={formatTime(position)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      className="relative h-6 flex-1 cursor-pointer touch-none outline-none"
    >
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full" style={{ background: 'var(--line-soft)' }} />
      <div className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full" style={{ width: pct(position), background: 'var(--accent)' }} />

      {notes.map((note, i) => (
        <span
          key={i}
          className="pointer-events-none absolute top-1/2 h-2.5 w-px -translate-y-1/2"
          style={{ left: pct(note.timestamp), background: 'var(--ink)', opacity: 0.25 }}
        />
      ))}
      {switches.map((s, i) => (
        <span
          key={i}
          title={s.label}
          className="absolute top-0 h-6 w-0.5 -translate-x-1/2 rounded-full"
          style={{ left: pct(s.at), background: 'var(--flare)' }}
        />
      ))}

      <span
        className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ left: pct(position), background: 'var(--accent)', boxShadow: '0 0 0 3px var(--surface)' }}
      />
    </div>
  );
}

function RecordingCard({ recording, player, onToggle, onSeek, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');

  const { notes, ragas, instruments, pitches } = summarize(recording);
  const switches = findSwitches(notes);
  const length = recordingLength(recording);
  const isActive = player.id === recording.id;
  const position = isActive ? player.position : 0;
  const status = isActive ? player.status : 'stopped';

  // the setting the playhead is in right now, useful for mixed takes
  const current = [...notes].reverse().find(n => n.timestamp <= position) ?? notes[0];

  const saveName = async () => {
    if (!newName.trim()) {
      alert('name cannot be empty');
      return;
    }
    await onRename(newName.trim());
    setEditing(false);
  };

  return (
    <div className="card p-5" style={isActive ? { borderColor: 'var(--line)' } : undefined}>
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveName();
                  if (e.key === 'Escape') setEditing(false);
                }}
                className="flex-1 min-w-0 px-3 h-10 rounded-lg outline-none"
                style={{ background: 'var(--surface-hover)', color: 'var(--ink)', border: '1px solid var(--line)' }}
                autoFocus
              />
              <button onClick={saveName} className="btn btn-primary">Save</button>
              <button onClick={() => setEditing(false)} className="btn">Cancel</button>
            </div>
          ) : (
            <h3 className="serif text-xl font-semibold mb-1 truncate">{recording.raga}</h3>
          )}
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
            {new Date(recording.timestamp).toLocaleString()} · {notes.length} notes · {formatTime(length)}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { setNewName(recording.raga); setEditing(true); }}
            className="btn"
            aria-label="Rename"
            title="Rename"
          >
            <BsPencil />
          </button>
          <button onClick={onDelete} className="btn btn-danger" aria-label="Delete" title="Delete">
            <BsTrash />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1.5 text-sm" style={{ color: 'var(--ink-soft)' }}>
        <Chips label={ragas.length > 1 ? 'Ragas' : 'Raga'} values={ragas} />
        <Chips label={instruments.length > 1 ? 'Instruments' : 'Instrument'} values={instruments} />
        <Chips label="Sa" values={pitches.map(pitchLabel)} />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => onSeek(position - SKIP_MS)}
          className="btn"
          style={{ padding: '0 0.6rem' }}
          aria-label="Back 5 seconds"
          title="Back 5s"
        >
          <BsArrowCounterclockwise />
        </button>
        <button
          onClick={onToggle}
          className="btn btn-primary"
          style={{ width: '2.5rem', padding: 0 }}
          aria-label={status === 'playing' ? 'Pause' : 'Play'}
          disabled={status === 'loading'}
        >
          {status === 'playing' ? <BsPauseFill size={18} /> : <BsPlayFill size={18} />}
        </button>
        <button
          onClick={() => onSeek(position + SKIP_MS)}
          className="btn"
          style={{ padding: '0 0.6rem' }}
          aria-label="Forward 5 seconds"
          title="Forward 5s"
        >
          <BsArrowClockwise />
        </button>

        <span className="w-10 text-right text-xs tabular-nums" style={{ color: 'var(--ink-soft)' }}>{formatTime(position)}</span>
        <ProgressBar position={position} length={length} notes={notes} switches={switches} onSeek={onSeek} />
        <span className="w-10 text-xs tabular-nums" style={{ color: 'var(--ink-soft)' }}>{formatTime(length)}</span>
      </div>

      {isActive && current && (switches.length > 0 || status === 'loading') && (
        <p className="mt-2 text-xs" style={{ color: 'var(--ink-soft)' }}>
          {status === 'loading'
            ? 'Loading instruments…'
            : <>Now: <span style={{ color: 'var(--ink)' }}>{current.raga} · {current.instrument} · Sa = {pitchLabel(current.pitch)}</span></>}
        </p>
      )}
    </div>
  );
}

export default function Recordings() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { player, toggle, seek, stop } = useRecordingPlayer();

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

  const renameRecording = (id, name) =>
    update(ref(db, `recordings/${auth.currentUser.uid}/${id}`), { raga: name });

  const deleteRecording = async (id) => {
    if (!confirm("Delete this recording?")) return;
    if (player.id === id) stop();
    await remove(ref(db, `recordings/${auth.currentUser.uid}/${id}`));
  };

  return (
    <>
      <Navbar />
      <div className="page px-6 pt-28 pb-20">
        <div className="max-w-4xl mx-auto">

          <div className="flex justify-between items-end mb-8 gap-4">
            <h1 className="serif text-4xl font-semibold">
              Your <span style={{ color: 'var(--accent)' }}>Recordings</span>
            </h1>
            {!loading && recordings.length > 0 && (
              <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>{recordings.length} saved</span>
            )}
          </div>

          {recordings.length === 0 ? (
            <div className="card text-center py-20" style={{ color: 'var(--ink-soft)' }}>
              <p className="serif text-xl mb-2" style={{ color: 'var(--ink)' }}>No recordings yet</p>
              <p>Start recording in the playground to save your sessions.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recordings.map(recording => (
                <RecordingCard
                  key={recording.id}
                  recording={recording}
                  player={player}
                  onToggle={() => toggle(recording)}
                  onSeek={(ms) => seek(recording, ms)}
                  onRename={(name) => renameRecording(recording.id, name)}
                  onDelete={() => deleteRecording(recording.id)}
                />
              ))}
            </div>
          )}
          <div className="mt-8">
            <div className="flex justify-center">
              <Link to="/playground" className="btn btn-primary" style={{ height: '3rem', padding: '0 1.75rem', fontSize: '1rem' }}>
                Go to Playground
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
