import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import ragaData from '../raga_details.json';
import { BsPlayCircle, BsArrowRight } from 'react-icons/bs';

const SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉';
const formatSwara = sw => sw.replace(/\d/g, d => SUBSCRIPTS[d]);
const formatScale = swaras => swaras.map(formatSwara).join(' ');

const instruments = ["Veena", "Sitar", "Flute", "Violin"];

function SectionHeading({ children }) {
  return <h2 className="serif text-3xl font-semibold mb-4" style={{ color: 'var(--ink)' }}>{children}</h2>;
}

function RagaGroup({ title, ragas }) {
  return (
    <div>
      <h3 className="serif text-xl font-semibold mb-3" style={{ color: 'var(--accent)' }}>{title}</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {ragas.map(raga => (
          <div key={raga.name} className="card px-4 py-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="serif font-semibold">{raga.name}</span>
              {raga.parent && <span className="text-xs truncate" style={{ color: 'var(--ink-soft)' }}>{raga.parent}</span>}
            </div>
            <div className="text-xs mt-1 serif" style={{ color: 'var(--ink-soft)' }}>
              ↑ {formatScale(raga.arohana)}<br />
              ↓ {formatScale(raga.avarohana)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const melakartas = ragaData.filter(r => r.type === 'Melakarta');
  const janyas = ragaData.filter(r => r.type !== 'Melakarta');

  return (
    <>
      <Navbar />
      <div id="home" className="page px-6 pt-28 pb-20">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <header className="text-center mb-16">
            <h1 className="serif text-5xl font-semibold mb-4 leading-tight">
              Welcome to <span style={{ color: 'var(--accent)' }}>मुद्रालय</span>!
            </h1>
            <p className="text-lg mb-8" style={{ color: 'var(--ink-soft)' }}>
              MudraLaya: a space where your hand movements turn into music.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <Link to="/playground" className="btn btn-primary" style={{ height: '3rem', padding: '0 1.75rem', fontSize: '1rem' }}>
                Try it out <BsArrowRight />
              </Link>
              <a
                href="https://youtu.be/SKOpkNU-Cac"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ height: '3rem', padding: '0 1.5rem', fontSize: '1rem' }}
              >
                <BsPlayCircle style={{ color: 'var(--accent)' }} /> Watch a quick demo
              </a>
            </div>

            <div className="card p-6 text-sm leading-relaxed text-left sm:text-center" style={{ color: 'var(--ink-soft)' }}>
              In Sanskrit, <strong style={{ color: 'var(--ink)' }}>Mudra</strong> (मुद्रा) means gesture, and <strong style={{ color: 'var(--ink)' }}>Laya</strong> (लय) means rhythm/music. <br />
              Put them together and you get <strong style={{ color: 'var(--ink)' }}>Mudralaya</strong> (मुद्रालय), which can also be interpreted as a "temple of gestures". <br />
              In other words, a space where your hand movements turn into music.
            </div>
          </header>

          {/* How to use */}
          <section className="mb-16">
            <SectionHeading>How to use</SectionHeading>
            <ol className="space-y-3 leading-relaxed list-none p-0 m-0">
              {[
                'Allow camera access (we use MediaPipe for hand tracking).',
                'Put your hand in front of the camera, with all fingers visible.',
                'Move your index finger over the swaras on the chakra to hover over them. A glowing trail follows your fingertip.',
                'Pinch your thumb and index finger to play a note. Keep pinching and slide to play the next swara.',
                'Pick ragas, instruments and pitch from the menus at the top, by mouse or by pinching over them.',
                'Use the gear button to show or hide the camera, move it around, and change the palette.',
                <><strong>Login with Google</strong> to unlock <strong>recording and playback</strong>.</>,
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span
                    className="serif shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ border: '1px solid var(--line)', color: 'var(--accent)' }}
                  >
                    {i + 1}
                  </span>
                  <span className="pt-1" style={{ color: 'var(--ink-soft)' }}>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* What's included */}
          <section id="whats-included" className="mb-16 scroll-mt-24">
            <SectionHeading>What's in here (more on the way!)</SectionHeading>
            <div className="leading-relaxed mb-8 space-y-3" style={{ color: 'var(--ink-soft)' }}>
              <p>
                The swaras sit on a chakra: madhya sthayi in the middle ring, tara on the outer ring and mandra on the inner ring. A dot above a swara (Ṡ) marks tara sthayi and a dot below (Ṣ) marks mandra.
                Each raga has its own <i>arohana</i> (ascending) and <i>avarohana</i> (descending) patterns that decide which <i>swaras</i> (notes) can be played next.
              </p>
              <p>
                You can switch between instruments to hear different timbres, adjust the base pitch if you want to sing along, and record your sessions to listen back later.
              </p>
            </div>

            <div className="space-y-10">
              <RagaGroup title={`Melakarta ragas (${melakartas.length})`} ragas={melakartas} />
              <RagaGroup title={`Janya ragas (${janyas.length})`} ragas={janyas} />

              <div>
                <h3 className="serif text-xl font-semibold mb-3" style={{ color: 'var(--accent)' }}>Instruments</h3>
                <div className="flex flex-wrap gap-2">
                  {instruments.map(inst => (
                    <span key={inst} className="card px-4 py-2 text-sm">{inst}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <div className="card p-6 mb-16" style={{ borderLeft: '3px solid var(--accent)' }}>
            <h3 className="serif text-xl font-semibold mt-0 mb-2">Quick note</h3>
            <p className="leading-relaxed m-0" style={{ color: 'var(--ink-soft)' }}>
              This is just a playground and learning tool, not a substitute for actual practice with a guru.
              You can use it to get familiar with how ragas work, try out different patterns, but it <strong style={{ color: 'var(--ink)' }}>cannot replace actual learning</strong>.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to="/playground" className="btn btn-primary" style={{ height: '3rem', padding: '0 2rem', fontSize: '1rem' }}>
              Try it out <BsArrowRight />
            </Link>
            <p className="mt-4 text-sm" style={{ color: 'var(--ink-soft)' }}>
              Browser-based. No installation required.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 pt-8" style={{ borderTop: '1px solid var(--line-soft)' }} />
        </div>
      </div>
    </>
  );
}
