# Abusuji - Frontend Web Application

A client-side content moderation tool for detecting Hindi and English profanity.

## Quick Start

**Option 1: Direct File Open**
```bash
# Simply open index.html in your browser
start index.html  # Windows
open index.html   # macOS
```

**Option 2: Local Server (Recommended)**
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Then visit: http://localhost:8000
```

## Features

✅ **No Backend Required** - Runs entirely in the browser  
✅ **Fuzzy Matching** - Custom Levenshtein distance algorithm  
✅ **Bilingual Support** - Hindi and English profanity detection  
✅ **LocalStorage Reviews** - Persistent reviews without a database  
✅ **Dark/Light Theme** - Toggle with theme switcher  
✅ **Real-time Detection** - Instant content analysis

## How It Works

1. Enter text in the input field
2. JavaScript analyzes the text using fuzzy matching
3. Results show detected words with highlighting
4. Reviews are saved to browser's LocalStorage

## Tech Stack

- HTML5
- CSS3 (with CSS Variables for theming)
- Vanilla JavaScript (no frameworks)
- FontAwesome Icons
- LocalStorage API

## Files

- `index.html` - Main HTML structure
- `script.js` - Detection logic & app functionality
- `styles.css` - Styling & themes
- `assets/` - Icons and images
- `app.py` - Legacy Flask backend (not needed)
- `requirements.txt` - Legacy Python dependencies (not needed)

## Development

No build process required! Just edit the files and refresh your browser.

### Key Functions

- `containsBadWordsFuzzy(message)` - Main detection algorithm
- `levenshteinDistance(str1, str2)` - Fuzzy string matching
- `getReviews() / saveReviews()` - LocalStorage management

### Customization

**Add Bad Words:**  
Edit the `badWords` or `englishBadWords` arrays in `script.js` (lines 44-83)

**Add Ignore Words:**  
Edit the `ignoreWords` array in `script.js` (lines 85-92)

**Adjust Thresholds:**  
Modify line 137 in `script.js` for fuzzy match sensitivity

## Browser Compatibility

Works on all modern browsers that support:
- ES6+ JavaScript
- LocalStorage API
- CSS Variables

## Notes

⚠️ **Reviews are local to each browser** - they won't sync across devices  
⚠️ **Bad word lists are visible in source code** - client-side only  
⚠️ **No server-side validation** - this is a demo/educational tool
