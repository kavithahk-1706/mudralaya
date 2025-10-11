import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

export default function Home() {
  const ragas = [
    "Mayamalavagowla", "Shankarabharanam", "Kalyani", "Harikambhoji",
    "Mohana", "Hamsadhwani", "Malahari", "Hindolam", "Arabhi",
    "Shuddha Saveri", "Niroshta"
  ];

  const instruments = ["Veena", "Sitar", "Flute", "Violin"];

  return (
    <>
      <Navbar />
      <div id="home" className="min-h-screen bg-gradient-to-br from-purple-500/90 via-cyan-500/95 to-teal-400/90 p-12 pt-28">
        <div className="min-w-4xl mx-auto bg-white/95 rounded-2xl shadow-2xl p-16">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl mb-4 p-3 bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent font-bold">
              Welcome to मुद्रालय (Mudralaya)!
            </h1>
            
            <div className="bg-gradient-to-r from-purple-500/5 to-teal-500/5 border border-cyan-500/20 rounded-lg p-5 min-w-2xl mx-auto mt-6">
              <p className="text-gray-600 text-sm leading-relaxed">
                In Sanskrit, <strong>Mudra</strong> (मुद्रा) means gesture, and <strong>Laya</strong> (लय) means rhythm/music. <br/>
                Put them together and you get <strong>Mudralaya</strong> (मुद्रालय), which can also be interpreted as a "temple of gestures". <br/>
                In other words, a space where your hand movements turn into music.
              </p>
            </div>
          </div>

          {/* How to use */}
          <section className="mb-10">
            <h2 className="text-3xl mb-4 text-gray-800 font-bold">How to use</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>Allow camera access (we use MediaPipe for hand tracking)</li>
              <li>Put your hand in front of the camera (make sure all fingers are visible)</li>
              <li>Move your hand over the swara circles to hover over them</li>
              <li>Pinch your thumb and index finger to actually play the note</li>
              <li>Use your mouse/hand to select different ragas/instruments/pitches from the dropdown menus</li>
              <li><strong>Login with Google</strong> to unlock <strong>recording and playback</strong></li>
            </ol>
          </section>

          {/* What's included */}
          <section id="whats-included" className="mb-10">
            <h2 className="text-3xl mb-1 text-gray-800 font-bold">What's in here (more on the way!)</h2>
            <div className="text-gray-700 leading-relaxed mb-6">
              <p className="mb-3 mt-3">
                The swara circles light up when you hover and get brighter when you play them. Each raga has its own <i>arohana</i> (ascending) and <i>avarohana</i> (descending) patterns that decide what <i>swaras</i> (notes) can be played in it.
              </p>
              <p>
                You can switch between instruments to hear different timbres, adjust the base pitch if you want to sing along, and record your sessions to listen back later.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl mb-3 text-gray-800 font-bold">Currently Available Ragas</h3>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed columns-2 gap-4">
                  {ragas.map(raga => <li key={raga}>{raga}</li>)}
                </ul>
              </div>

              <div>
                <h3 className="text-2xl mb-3 text-gray-800 font-bold">Currently Available Instruments</h3>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed">
                  {instruments.map(inst => <li key={inst}>{inst}</li>)}
                </ul>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <div className="bg-gradient-to-r from-purple-500/10 to-teal-500/10 border-2 border-cyan-500/30 rounded-lg p-6 mb-10">
            <h3 className="text-xl text-gray-800 mt-0 mb-2 font-bold">Quick note</h3>
            <p className="text-gray-600 leading-relaxed m-0">
              This is just a playground and learning tool, not a substitute for actual practice with a guru. 
              You can use it to get familiar with how ragas work, try out different patterns, but it <strong>cannot replace actual learning</strong>.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="mb-6 hover:scale-110 duration-200 font-medium">
              <a 
                href="https://youtu.be/SKOpkNU-Cac" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <span className="font-semibold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
                  Watch a quick demo →
                </span>
              </a>
            </div>
          </div>          
          <div className="text-center">
            <Link to="/playground">
              <button className="px-12 py-4 border-none text-lg bg-gradient-to-r from-purple-600/90 to-teal-500/90 text-white rounded-xl font-semibold hover:scale-110 transition-transform duration-200">
                Try it out
              </button>
            </Link>

          {/* Contact Links */}
          <div className="text-center m-10">
            <h3 className="text-2xl mb-4 text-gray-800 font-bold">Connect with me</h3>
            <div className="flex justify-center gap-6">
              <a 
                href="https://www.linkedin.com/in/kavitha-haima-kidambi-615791353" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 transition-colors duration-200"
              >
                <FaLinkedin className="w-10 h-10 bg-gradient-to-r from-purple-600/90 to-teal-500/90 text-white rounded-sm hover:scale-110 transition-transform duration-200" />
              </a>
              <a 
                href="https://github.com/kavithahk-1706" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                <FaGithub className="w-10 h-10  bg-gradient-to-r from-purple-600/90 to-teal-500/90  text-white rounded-3xl hover:scale-110 transition-transform duration-200" />
              </a>
              <a 
                href="mailto:kavithahaimakidambi0613@gmail.com" 
                className="text-teal-600 hover:text-teal-700 transition-colors duration-200"
              >
                <FaEnvelope className="w-10 h-10 hover:scale-110 bg-gradient-to-r from-purple-600/90 to-teal-500/90 text-white rounded-lg px-1 transition-transform duration-200" />
              </a>
            </div>
          </div>
            <p className="mt-4 text-gray-500 text-sm">
              Browser-based. No installation required.
            </p>
          </div>
          
          {/*Footer*/}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              <em>Built with love and devotion by <a href="https://www.linkedin.com/in/kavitha-haima-kidambi-615791353" target="_blank"><span className="font-semibold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">Kavitha Haima Kidambi</span></a></em>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}