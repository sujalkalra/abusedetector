# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Abusuji** (abusedetector) is a content moderation tool that detects abusive/profane language in both Hindi and English text using fuzzy-logic matching algorithms. It's a **frontend-only web application** that runs entirely in the browser with no backend required.

## Commands

### Running the Application

```powershell
# Simply open index.html in a browser
cd abusuji
start index.html
```

Or use a local development server:

```powershell
# Using Python's built-in server
cd abusuji
python -m http.server 8000
# Then open http://localhost:8000
```

```powershell
# Using Node.js http-server (if installed)
cd abusuji
npx http-server -p 8000
```

### Development

```powershell
# Test the standalone CLI detection logic
python explain.py
```

This runs an interactive CLI version of the profanity detection algorithm.

**Note:** The Flask backend (`app.py`) and MongoDB are **no longer required** for the main application.

## Architecture

### Project Structure

```
abusedetector/
├── abusuji/               # Main web application
│   ├── app.py             # Flask backend with API routes
│   ├── index.html         # Frontend interface
│   ├── script.js          # Frontend logic
│   ├── styles.css         # Styling
│   ├── requirements.txt   # Python dependencies
│   └── assets/            # Static assets (icons, images)
├── explain.py             # Standalone CLI version of detector
└── README.md              # Project documentation
```

### Core Components

**1. Detection Algorithm (`containsBadWordsFuzzy`)**
   - Implemented in JavaScript in `script.js`
   - Uses **Levenshtein distance** algorithm for fuzzy string matching (no external dependencies)
   - Maintains three word lists:
     - `badWords`: Hindi profanity/abuse terms (including multi-word phrases)
     - `englishBadWords`: English profanity terms
     - `ignoreWords`: Common/positive words to exclude from matching
   - Detection strategy:
     1. Exact matching for known bad words
     2. Multi-word phrase detection for Hindi expressions
     3. Fuzzy matching with threshold (70-80% similarity) for misspellings/variations
     4. Length-based filtering to avoid false positives on short words
   - Returns: `{ isAbusive: boolean, foundWords: string[], highlightedText: string }`

**2. Frontend Application (`script.js`)**
   - Pure vanilla JavaScript - no frameworks or build tools required
   - **Client-side only**: All detection happens in the browser
   - Real-time text analysis with simulated delay for UX
   - Dark/light theme toggle with localStorage persistence
   - Star rating system for reviews
   - Custom notification system (replaces browser alerts)

**3. Data Persistence (LocalStorage)**
   - Reviews stored in browser's localStorage under key `abusuji-reviews`
   - No backend or database required
   - Review schema: `{ id, name, rating (1-5), comment, timestamp }`
   - Data persists across browser sessions but is local to each browser/device

**4. Legacy Backend (Optional)**
   - `app.py`: Flask backend (no longer needed for main application)
   - `explain.py`: CLI version for testing the detection algorithm

### Key Design Patterns

- **Client-Side Processing**: All detection logic runs in the browser - no server required
- **Levenshtein Distance**: Custom implementation for fuzzy string matching without dependencies
- **Fuzzy Matching with Thresholds**: Dynamic thresholds based on word length to balance precision/recall
- **Word Filtering**: Ignore list prevents false positives on innocent words that may phonetically match bad words
- **Text Highlighting**: JavaScript generates HTML with `<span class="highlight">` for detected words
- **LocalStorage Persistence**: Reviews stored locally in browser, no database needed

## Development Guidelines

### Working with the Detection Algorithm

- When adding new bad words, add them to the respective arrays (`badWords` or `englishBadWords`) in `script.js` (lines 44-83)
- Test extensively with the `ignoreWords` array to prevent false positives
- Multi-word Hindi phrases should be added as complete strings (e.g., "ma ki chut")
- The similarity threshold is currently 70-80%; adjust in `containsBadWordsFuzzy()` function if needed
- The Levenshtein distance algorithm can be found at lines 4-33 in `script.js`

### Frontend Development

- **No build tools required** - just HTML, CSS, and vanilla JavaScript
- All files in `abusuji/` directory can be opened directly in a browser
- Theme preference stored in `localStorage` as `'theme'`
- Reviews stored in `localStorage` as `'abusuji-reviews'`
- Use `showNotification()` function for user feedback instead of `alert()`
- Simulated 500ms delay in text analysis provides better UX feedback

### Testing

- Open `index.html` directly in a browser to test
- Use browser DevTools Console to debug
- LocalStorage can be inspected in browser DevTools > Application > Local Storage

## Known Limitations

- **Reviews are local-only**: Each browser/device has its own separate review list (not shared globally)
- **No authentication**: Anyone can submit reviews without verification
- **Client-side word lists**: Bad words are visible in source code (consider obfuscation for production)
- **No backend validation**: All detection happens client-side, making it easy to bypass
- **Single-language interface**: UI text is English/Hinglish only
- **No test suite**: No automated tests currently implemented

## Migration Notes

The project was originally built with:
- Flask backend (`app.py`) with Python fuzzy matching
- MongoDB for storing reviews
- API endpoints for detection and review management

These components are still available in the codebase but are **no longer used** by the main application. The old script is backed up as `script_old.js`.
