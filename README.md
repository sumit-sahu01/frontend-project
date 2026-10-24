# ProxiSpeak — Geospatial Proximity Audio Frontend

A polished, human-designed, responsive web application for **“ProxiSpeak — Geospatial Proximity Audio”**, built to faithfully match the multi-screen reference specification with pixel-precision, custom Leaflet mapping, global audio playback, and a consistent purple & deep-navy design system.

---

## 🎨 Design System & Visual Palette

- **Primary Purple**: `#583BFF`
- **Bright Purple**: `#6947FF`
- **Deep Navy**: `#10182F`
- **Dark Hero Background**: `#101A30`
- **Main White**: `#FFFFFF`
- **Light Page Background**: `#F5F7FC`
- **Light Lavender**: `#EEEAFE`
- **Primary Text**: `#111827`
- **Secondary Text**: `#68738A`
- **Borders**: `#E5E9F2`
- **Success Green**: `#20A66A`
- **Error Red**: `#F04452`
- **Typography**: Inter (400, 500, 600, 700, 800)

---

## 📱 Five Screen Architecture

1. **Screen 1: Home / Landing Page (`/`)**
   - Brand logo with location pin + audio wave identity.
   - Large photographic hero featuring sunset over Jaipur heritage landmarks with dark navy gradient overlay.
   - Headline: *"Discover Stories Around You"*.
   - CTAs: *"Explore Nearby"* and interactive *"Watch Video"*.
   - Floating live audio preview card with animated sound waveform, landmark thumbnail (*Hawa Mahal Whispers*), distance badge, and direct play trigger.
   - Project statistics bar: 1,200+ Audio Spots, 45,000+ Community Users, 85+ Cities, 12 Categories.
   - 4-column *"How It Works"* feature grid (*Find a Place*, *Listen to Stories*, *Create & Share*, *Be Part of Community*).
   - Popular Jaipur heritage spots showcase and creator call-to-action banner.

2. **Screen 2: Explore Nearby (`/explore`)**
   - Split-screen layout: Left sidebar (~420px) + Interactive Leaflet map (occupying the majority of desktop viewport).
   - Live search input and category filter chips (*All*, *History*, *Nature*, *Food*, *Art*, *Education*, *Culture*).
   - Nearby audio spots list with image thumbnails, distance badges, categories, ratings, and circular purple play buttons.
   - Full Leaflet map with OpenStreetMap tiles, custom image marker pins, user GPS pulse indicator with 450m proximity radius circle.
   - Map vs. Satellite imagery toggle, recenter-to-my-location button, and zoom controls.
   - Floating bottom notification: *"Nearby story detected: Hawa Mahal Whispers (150m away) — Tap to listen"*.

3. **Screen 3: Audio Story Details (`/stories/:id`)**
   - Breadcrumb navigation: *"← Back to Explore"*.
   - High-resolution hero image of City Palace Jaipur with category badge, location (*Jaipur, Rajasthan*), and distance (*350 m away*).
   - Rich historical narrative recounting Maharaja Sawai Jai Singh II, Mubarak Mahal, and Peacock Gate.
   - Thumbnail photo gallery with interactive zoom selection.
   - Tag chips: `#Architecture`, `#RoyalHeritage`, `#Jaipur`, `#Culture`, `#18thCentury`.
   - Dedicated Audio Narration Player with scrubber slider, animated 27-bar waveform, 10s rewind/forward, speed options (*0.75x, 1x, 1.25x, 1.5x, 2x*), and volume slider.
   - Related audio spots carousel for nearby landmarks (*Amer Fort, Jantar Mantar, Jal Mahal, Albert Hall*).

4. **Screen 4: Create a New Audio Spot (`/create`)**
   - 3-step progress stepper:
     1. **Details**: Title, Category, Location name, Historical description, Tags.
     2. **Location**: Latitude and Longitude fields, *"Use My Location"* GPS autofill, and embedded interactive Leaflet map coordinate picker (clicking anywhere places the pin and updates coordinates), plus location accuracy advice.
     3. **Upload & Review**: Drag-and-drop audio file upload (.mp3, .wav), landmark cover image upload, live listener preview card, and publish submission.
   - Client-side validation and immediate addition to local application state.

5. **Screen 5: My Audio Spots / User Dashboard (`/dashboard`)**
   - Left profile sidebar with avatar (*Aarav Sharma*), email, bio, and navigation items (*My Audio Spots, Liked Spots, Listening History, My Locations, Edit Profile, Settings, Log Out*).
   - Main content toolbar with status tabs (*All, Published, Drafts*) and real-time search filter.
   - Audio recordings data list displaying thumbnails, titles, locations, durations, and status badges (*Published* in green, *Draft* in amber).
   - Interactive Public / Private visibility toggle switch.
   - Working inline Edit modal (modify title, category, status, description) and Delete dialog with confirmation.

6. **Persistent Global Audio Player**
   - Fixed at the bottom of the screen across all routes whenever audio is playing.
   - Synchronized scrubber, play/pause, 10s skip controls, animated waveform, speed selector, volume slider, and thumbnail preview.

---

## 🚀 Installation & Running Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` (or the port indicated in your terminal).

### Step 3: Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 🔌 Functional vs. Backend-Separated Features

| Feature Area | Functional in Frontend Prototype | Requires Production Backend |
|---|---|---|
| Page Navigation & Routing | ✅ Fully functional (React Router v6) | — |
| Interactive Map | ✅ Real Leaflet + OpenStreetMap tiles, custom marker popups, satellite toggle | Production tile server or custom vector map styles |
| Audio Playback | ✅ Functional HTML5 Audio engine + ambient synth fallback, scrubber, speed & volume | Cloud CDN / S3 audio file streaming |
| Category Filtering & Search | ✅ Real-time filtering across sample spots | Full-text Elasticsearch / database indexing |
| Geolocation | ✅ Browser Geolocation API (`navigator.geolocation`) | Real-time geofence push notifications via WebSocket / ServiceWorker |
| Create Spot Stepper | ✅ 3-step flow, audio & image upload preview, map click pin drop, client validation, local persistence | Multipart file upload to object storage (e.g., AWS S3 / Cloud Storage) |
| Dashboard Management | ✅ Edit modal, delete confirmation, public/private visibility toggle, status tabs | Persistent database (PostgreSQL / MongoDB) with auth tokens |
| User Profile | ✅ Displayed with stats and navigation links | OAuth2 / JWT authentication service |
