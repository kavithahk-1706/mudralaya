# Mudralaya 

**Mudralaya** (मुद्रालय) - where *mudra* (hand gesture) meets *laya* (rhythm/sound) or *alaya* (abode/dwelling). A devotional offering that brings Indian classical music to your fingertips through hand tracking technology.

## About

Mudralaya is a web-based application that allows you to play Indian classical ragas using hand gestures. Built as an offering to Krishna and Maa Saraswathi, this project bridges traditional Carnatic music with modern computer vision technology, making the beauty of ragas accessible to anyone with a webcam.

The application uses MediaPipe hand tracking to detect your hand movements and translates them into musical notes (swaras) based on the selected raga. Each raga has its own unique structure and emotional quality - from the devotional Bhairavi to the serene Shankarabharanam.

### A Learning Tool

While Mudralaya is **not a replacement for learning from a guru or formal training**, it serves as an interactive tool to:
- Understand which swaras belong to different ragas
- Explore the structure and rules of each raga
- Experiment with different octaves (sthayis) and how they change the mood
- Get familiar with raga patterns before applying them in vocal or instrumental practice
- Make Carnatic music concepts more accessible to curious learners

It's more of a companion to your musical journey. Like a way to visualize and interact with raga structures.

## Features

- **Hand Tracking Music**: Play swaras by moving your index finger over the swara chakra and pinching
- **Swara Chakra**: Swaras laid out on a wheel, with Mandra, Madhya and Tara sthayis on their own rings
- **Multiple Ragas**: Choose from melakarta and janya ragas including Mayamalavagowla, Shankarabharanam, Kalyani, Hindolam, and more
- **Instrument Selection**: Switch between Veena, Sitar, Flute, and Violin
- **Pitch Adjustment**: Adjust base pitch from -6 to +6 semitones to match your vocal range
- **View Panel**: Configure the palette, camera overlay, chakra layout and finger trail (gear button, right side)
- **Guide**: A legend for the chakra that follows your palette, raga and layout (compass button, left side)
- **Palettes**: Dark and light palettes, shared across every page
- **Recording**: Record your performances and play them back with a seekable progress bar (requires login). Switching raga, instrument or pitch mid-recording is saved note by note.

## Tech Stack

- **Frontend**: React, Vite
- **Hand Tracking**: MediaPipe Hands
- **Audio**: Tone.js
- **Authentication**: Firebase Auth (Google Sign-In)
- **Database**: Firebase Realtime Database (for recordings)
- **Deployment**: Vercel

## How It Works

1. Your webcam captures your hand movements
2. MediaPipe processes the video and identifies hand landmarks
3. The application maps your index fingertip onto the swara chakra for the selected raga
4. Pinching your thumb and index finger triggers the note; keep pinching and slide to play the next swara
5. The webcam feed itself is never shown directly: you see the chakra, an optional dimmed camera overlay, and a trail behind your index finger

## The Swara Chakra

The swaras sit on a wheel with three rings:

- **Madhya sthayi** (middle ring): starts at S at the bottom and rises anticlockwise, up the right side and over the top, towards Ṡ on the left
- **Tara sthayi** (outer ring, dot above, e.g. Ṡ): carries on from Ṡ, rising clockwise along the outer ring
- **Mandra sthayi** (inner ring, dot below, e.g. Ṣ): falls from S along the inner ring. Its direction depends on the *Mandra ring* setting: clockwise, away from madhya (**Opposite**), or anticlockwise, just inside madhya (**Alongside**)

S and Ṡ are the turning points: S spans the madhya and mandra rings, Ṡ spans madhya and tara. Each swara sits at its true swarasthana, so a raga's shape is visible on the wheel. After you play a note, swaras that the raga's arohana (going up) or avarohana (going down) doesn't allow next are greyed out.

## The View Panel (gear button)

Open it with the gear button on the right of the playground, by mouse or by pinching over it. Every option is remembered for your next visit.

- **Palette**: pick a dark or light palette. The same palette applies to the home, playground and recordings pages, and the home and recordings pages also have a palette button in the top bar.
- **Camera**: turn the camera overlay on or off. Hand tracking keeps working either way.
- **Position**: place the camera in a corner, on the left or right side, or full screen behind the chakra.
- **Size**: small, medium or large (for corner and side positions).
- **Opacity**: how strongly the camera shows through, so it never competes with the swaras.
- **Blur**: soften the camera feed so you see roughly where your hand is without the detail.
- **Tara & mandra swaras**: **Full sthayi** shows every swara of the raga in tara and mandra; **Partial arcs** shows only the ones closest to madhya.
- **Mandra ring**: **Opposite** or **Alongside** (see above).
- **Finger trail**: a glowing trail behind your index finger. It can be turned off while the camera is on, and is always on when the camera is off, since it's then your only reference for where your hand is.

## The Guide (compass button)

The compass button on the left of the playground opens a guide to the chakra: a small live copy of the wheel with arrows showing which way each sthayi moves, the colour of each sthayi in the current palette, and how to play. It updates with your raga, palette and View settings.

## Running Locally

### Prerequisites
- Node.js (v16 or higher)
- A webcam
- Modern browser (Chrome/Edge recommended for best MediaPipe performance)

### Installation

1. Clone the repository
```bash
git clone https://github.com/kavithahk-1706/mudralaya.git
cd mudralaya
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase config:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

6. Allow camera permissions when prompted

## Usage

1. **Select a Raga**: Choose from the dropdown menu
2. **Select an Instrument**: Pick your preferred instrument sound
3. **Adjust Pitch** (optional): Change the base pitch to match your comfort
4. **Set up the view** (optional): Use the gear button to set the palette, camera, chakra layout and trail
5. **Position Your Hand**: Hold your hand in front of the camera
6. **Play**: Move your index finger over the chakra and pinch to play notes. Open the compass guide if you're unsure where a sthayi is.
7. **Record**: Login with Google to save your recordings, then play them back from the Recordings page

## Musical Context

### What are Ragas?
Ragas are the foundation of Indian classical music. Each raga is a specific combination of notes (swaras) with its own character, mood, and traditional time of performance. Unlike Western scales, ragas have rules about which notes can be emphasized, how they should be approached, and their emotional flavor (rasa).

### Swaras
The seven basic notes in Carnatic music are:
- **Sa** (Shadja) - like Do
- **Ri** (Rishabha) - like Re
- **Ga** (Gandhara) - like Mi
- **Ma** (Madhyama) - like Fa
- **Pa** (Panchama) - like Sol
- **Dha** (Dhaivata) - like La
- **Ni** (Nishada) - like Ti

Each raga uses a specific subset of these notes with variations (e.g., Ri can be Shuddha Ri or Chathusruthi Ri).

### Sthayis (Octaves)
- **Mandra Sthayi**: Lower octave (calming, grounding)
- **Madhya Sthayi**: Middle octave (balanced, central)
- **Tara Sthayi**: Upper octave (bright, uplifting)

## Devotional Context

This project is built as an offering to Krishna and Maa Saraswati. Music, especially devotional music, has always been a powerful form of bhakti (devotion). The ability to play ragas with simple hand gestures makes this sacred art form more accessible, allowing anyone to experience the joy of creating classical music as a form of prayer and meditation.

> "यथो हस्तस तथो दृष्टि"  
> "Where the hand goes, the eyes follow"  
> - Natya Shastra

Just as mudras (hand gestures) in classical dance convey meaning and emotion, here they create the very sound of devotion.

## Future Enhancements

- More ragas (there are hundreds!)
- Gamaka (ornamentations) support using ML/DL
- Tambura drone background
- Multi-hand polyphonic playing
- Collaborative jamming sessions
- Metronome/tala support
- Mobile app version

## Credits & Inspiration

Built with devotion by Kavitha Haima Kidambi

Inspired by:
- The timeless tradition of Carnatic music
- The bhakti of saint-composers like Thyagaraja, Purandara Dasa, and Annamacharya

Special thanks to:
- MediaPipe team for the incredible hand tracking technology
- The open-source community
- All the gurus who have preserved and taught Indian classical music

## License

This project is open source and available for anyone to learn from, modify, and use. Built as an offering, shared with love.

---

*"संगीतं सुखदं प्रोक्तं"*  
*"Music is said to be the giver of joy"*

Built with love and devotion for Krishna and Maa Saraswathi

---

## Demo
[Mudralaya Demo](https://www.youtube.com/watch?v=SKOpkNU-Cac&feature=youtu.be)


