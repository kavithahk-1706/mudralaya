import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, hsla(275, 65%, 52%, 0.88) 0%, hsla(200, 80%, 48%, 0.93) 40%, hsla(165, 75%, 50%, 0.95) 70%, hsla(176, 74%, 71%, 0.92) 100%)',
      padding: '50px 20px',
    }}>
      <div style={{
        minWidth: '900px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '60px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ 
            fontSize: '52px', 
            marginBottom: '15px',
            background: 'linear-gradient(45deg, hsla(275, 65%, 52%, 1), hsla(165, 75%, 50%, 1))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            मुद्रालय (Mudralaya)
          </h1>
          <p style={{ fontSize: '22px', color: '#555', lineHeight: '1.5', marginBottom: '25px' }}>
            Learn/Play Carnatic Music through an AI Powered Visual Interface with live playback.
          </p>
          
          <div style={{
            background: 'linear-gradient(120deg, hsla(275, 65%, 52%, 0.08), hsla(165, 75%, 50%, 0.08))',
            padding: '20px',
            borderRadius: '8px',
            minWidth: '550px',
            margin: '0 auto',
            border: '1px solid hsla(200, 80%, 48%, 0.2)',
            textAlign: 'left'
          }}>
            <p style={{ 
              fontSize: '15px', 
              color: '#555', 
              lineHeight: '1.5',
              textAlign:'center',
              margin: 0 
            }}>
              In Sanskrit, <strong>Mudra</strong> (मुद्रा) means gesture, and <strong>Laya</strong> (लय) means rhythm/music. <br/>
              Put them together and you get "temple of gestures"—basically a space where your hand movements turn into music.
            </p>
          </div>
        </div>        
        
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '15px', color: '#2c3e50' }}>How to use this</h2>
          <ol style={{ lineHeight: '1.8', fontSize: '17px', color: '#34495e' }}>
            <li>Allow camera access (we use MediaPipe for hand tracking)</li>
            <li>Put your hand in front of the camera—make sure all fingers are visible</li>
            <li>Hover over the swara circles to hear a preview</li>
            <li>Pinch your thumb and index finger to actually play the note</li>
            <li>Try different ragas from the dropdown</li>
            <li>Mess around with the three octaves (Mandra, Madhya, Tara)</li>
          </ol>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '15px', color: '#2c3e50' }}>What's in here</h2>
          <div style={{ lineHeight: '1.8', fontSize: '17px', color: '#34495e' }}>
            <p>The swara circles light up when you hover and get brighter when you play them. Each raga has its proper arohana (ascending) and avarohana (descending) patterns with the right swaras.</p>
            <p>You can switch between instruments (flute, sitar) to hear different timbres, adjust the base pitch if you want to sing along, and record your sessions to listen back later.</p>
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(120deg, hsla(275, 65%, 52%, 0.1), hsla(165, 75%, 50%, 0.1))',
          padding: '25px', 
          borderRadius: '8px',
          marginBottom: '40px',
          border: '2px solid hsla(200, 80%, 48%, 0.3)'
        }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50', fontSize: '20px' }}>Quick note</h3>
          <p style={{ lineHeight: '1.6', color: '#555', margin: 0, fontSize: '16px' }}>
            This is just a playground and learning tool, not a substitute for actual practice with a guru. 
            Use it to get familiar with how ragas work, try out different patterns, but don't expect it to replace proper training.
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/playground">
            <button style={{
              padding: '16px 45px',
              fontSize: '19px',
              background: 'linear-gradient(45deg, hsla(275, 65%, 52%, 0.9), hsla(165, 75%, 50%, 0.9))',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
            >
              Try it out
            </button>
          </Link>
          <p style={{ marginTop: '15px', color: '#7f8c8d', fontSize: '15px' }}>
            Browser-based. No installation required.
          </p>
        </div>
      </div>
    </div>
  );
}