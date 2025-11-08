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

- **Hand Tracking Music**: Play swaras by moving your hand across the screen and pinching
- **Multiple Ragas**: Choose from various classical ragas including Mayamalavagowla, Shankarabharanam, Kalyani, and more
- **Instrument Selection**: Switch between Veena, Sitar, Flute, and Violin
- **Pitch Adjustment**: Adjust base pitch from -6 to +6 semitones to match your vocal range
- **Recording**: Record your performances and save them for later playback (requires login)
- **Three Sthayis**: Play across Mandra (lower), Madhya (middle), and Tara (upper) octaves

## Tech Stack

- **Frontend**: React, Vite
- **Hand Tracking**: MediaPipe Hands
- **Audio**: Tone.js
- **Authentication**: Firebase Auth (Google Sign-In)
- **Database**: Firebase Firestore (for recordings)
- **Deployment**: Vercel

## How It Works

1. Your webcam captures your hand movements
2. MediaPipe processes the video and identifies hand landmarks
3. The application maps your fingertip position to specific swaras based on the selected raga
4. Pinching your thumb and index finger triggers the note
5. Move vertically to switch between octaves (sthayis)
6. Move horizontally to play different notes within the raga

## Running Locally

### Prerequisites
- Node.js (v16 or higher)
- A webcam
- Modern browser (Chrome/Edge recommended for best MediaPipe performance)

### Installation

1. Clone the repository
```bash
git clone [https://github.com/kavithahaima/Mudralaya.git](https://github.com/kavithahk-1706/mudralaya.git)
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
4. **Position Your Hand**: Hold your hand in front of the camera
5. **Play**: Move your hand across the screen and pinch to play notes
6. **Record**: Login with Google to save your recordings

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


