// ========================================
// Fuzzy String Matching Implementation
// ========================================
function levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = [];

    if (len1 === 0) return len2;
    if (len2 === 0) return len1;

    for (let i = 0; i <= len2; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len1; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len2; i++) {
        for (let j = 1; j <= len1; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[len2][len1];
}

function fuzzRatio(str1, str2) {
    const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    const maxLen = Math.max(str1.length, str2.length);
    return Math.round(((maxLen - distance) / maxLen) * 100);
}

// ========================================
// Bad Words Lists
// ========================================
const badWords = [
    "maderchod", "behenchod", "bhosadike", "chutiya", "gandu", "harami", "kameena", "randi", "sala", "bhadwa",
    "ma ki", "maa ki", "ma ki", "chut", "maa ka bhosda", "ma ka bhosda", "bhen ke lode", "ma ke lode", "lund", "madarchod", "behnchod",
    "bhosdiwale", "jhantu", "chinal", "chutiye", "randi ka bacha", "loda", "kutta kamina", "jhant ke baal", "gawar",
    "bhains ki aankh", "chutmarika", "lodu", "gand mara", "tatte", "gaand", "chudail", "ghanta", "chhapri", "haramkhor",
    "saala kutta", "bhain ka takka", "lundbaaz", "fuddu", "gandu saala", "sala harami", "gandu harami", "bhikhmanga",
    "gawar saala", "tatti", "ghatiya", "bakwas", "fuddu", "kutta kamina", "saala kutta", "bhen ke laude", "gandmara",
    "chutiya sala", "kaminey", "jhant ke baal", "lund ke baal", "bhen ke takke", "bhadwe", "khotte da puttar", "kutte",
    "lakkadbaggha", "maadarchod", "randi ka bacha", "behen ke lode", "jhant ke baal", "behen ke takke",
    "gandu ke laude", "saala", "chodu", "luvdu"
];

const englishBadWords = [
    'arsebandit', 'arsehole', 'arsewipe', 'ass', 'assbitch', 'assclown',
    'asshat', 'asslicker', 'assmunch', 'asswipe', 'bastard', 'bellend',
    'bitch', 'bitchface', 'bollocks', 'boludo', 'buttfucker', 'buttlicker',
    'buttmunch', 'cabron', 'chav', 'chingada', 'cock', 'cockbite',
    'cockburger', 'cockfucker', 'cocklord', 'cockmaster', 'cocknose',
    'cocksplat', 'cockstain', 'cockwomble', 'coño', 'crackwhore', 'crap',
    'cumdumpster', 'cumguzzler', 'cumbubble', 'cumstain', 'dick',
    'dickbag', 'dickbreath', 'dickhead', 'dickless', 'dickmilker',
    'dicknose', 'dicksneeze', 'dickwad', 'dickweed', 'dipshit', 'dog',
    'douche', 'douchebag', 'douchecanoe', 'dumb', 'dumbass', 'dumbfuck',
    'fag', 'faggot', 'faphead', 'flid', 'fuck', 'fuckbag', 'fuckbucket',
    'fuckface', 'fuckhole', 'fucklord', 'fucknugget', 'fuckpuppet',
    'fuckrag', 'fuckstick', 'fucktard', 'fuckwit', 'gilipollas', 'git',
    'hell', 'hijo de puta', 'hoe', 'jackass', 'jerk', 'jerkwad',
    'jizzstain', 'knobhead', 'knobjockey', 'loser', 'malparido', 'minger',
    'mierda', 'minge', 'moron', 'motherfucker', 'motherless', 'neanderthal',
    'nonce', 'numbnuts', 'numpty', 'nutter', 'pendejo', 'pillock',
    'piss', 'pissbaby', 'pissflap', 'pisshead', 'poon', 'poonani', 'prick',
    'puta', 'puta madre', 'queerbait', 'rat', 'retard', 'scum', 'scumbag',
    'shit', 'shitbag', 'shitbrain', 'shitbreath', 'shitcock', 'shitcunt',
    'shitface', 'shitfaced', 'shithead', 'shitlick', 'shitlicker',
    'shitlord', 'shitmuncher', 'shitshow', 'shitstain', 'shithole',
    'skank', 'slag', 'smeghead', 'spastic', 'splooge', 'taint', 'tosser',
    'tramp', 'trash', 'trollop', 'twat', 'twatwaffle', 'twatsicle',
    'twunt', 'wankstain', 'wanker', 'waste', 'wasteoid', 'weirdo',
    'wazzock', 'whore'
];

const ignoreWords = [
    "banda", "chahiye",
    "and", "bhai", "genius", "gajab", "wah", "maza aa gaya", "bahut achha", "badiya", "shandar", "zabardast",
    "great", "brilliant", "khoobsurat", "pyaara", "mind-blowing", "best", "a1", "superb", "thank you", "mazaa",
    "shaandar", "lajawab", "faadu", "amazing", "awesome", "lovely", "beautiful", "badhiya", "aap best ho",
    "dil khush ho gaya", "sundar", "great work", "bahut badiya", "sahi", "jeet gaya", "badhiya kaam", "incredible",
    "lajawab kaam", "fab", "amazing", "banadi", "hamra", "banda", "bandi", "chapter", "chahiye", "waste", "hmara", "wale", "badle"
];

// ========================================
// Detection Algorithm
// ========================================
function containsBadWordsFuzzy(message) {
    const messageLower = message.toLowerCase();
    const foundWords = [];
    const allBadWords = [...badWords, ...englishBadWords];

    // Check for exact matches
    const messageWords = messageLower.split(/\s+/);
    for (const word of messageWords) {
        const cleanWord = word.replace(/[^a-z0-9]/gi, '');
        if (allBadWords.includes(cleanWord)) {
            foundWords.push(cleanWord);
        }
    }

    // Check for multi-word phrases
    for (const phrase of badWords) {
        if (phrase.includes(' ') && messageLower.includes(phrase)) {
            if (!foundWords.includes(phrase)) {
                foundWords.push(phrase);
            }
        }
    }

    // Fuzzy matching for Hindi words
    for (const word of messageWords) {
        if (ignoreWords.includes(word)) {
            continue;
        }

        const cleanWord = word.replace(/[^a-z0-9]/gi, '');
        if (cleanWord.length < 3 || ignoreWords.includes(cleanWord)) {
            continue;
        }

        for (const badWord of badWords) {
            if (Math.abs(cleanWord.length - badWord.length) > 3) {
                continue;
            }

            const similarity = fuzzRatio(badWord, cleanWord);
            const threshold = cleanWord.length <= 4 ? 80 : 70;

            if (similarity > threshold && !foundWords.some(fw => fw.includes(cleanWord))) {
                foundWords.push(`${cleanWord} (similar to '${badWord}')`);
            }
        }
    }

    // Create highlighted text
    let highlightedText = message;
    for (const word of foundWords) {
        const actualWord = word.split(' (similar')[0];
        const escapedWord = actualWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`\\b${escapedWord}\\b`, 'gi');
        highlightedText = highlightedText.replace(pattern, `<span class="highlight">${actualWord}</span>`);
    }

    return {
        isAbusive: foundWords.length > 0,
        foundWords: foundWords,
        highlightedText: highlightedText
    };
}

// ========================================
// LocalStorage Review Management
// ========================================
function getReviews() {
    const reviews = localStorage.getItem('abusuji-reviews');
    return reviews ? JSON.parse(reviews) : [];
}

function saveReviews(reviews) {
    localStorage.setItem('abusuji-reviews', JSON.stringify(reviews));
}

function addReview(reviewData) {
    const reviews = getReviews();
    const newReview = {
        ...reviewData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
    };
    reviews.unshift(newReview); // Add to beginning of array
    saveReviews(reviews);
    return newReview;
}

// ========================================
// Main Application
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    const userInput = document.getElementById('userInput');
    const checkButton = document.getElementById('checkButton');
    const clearButton = document.getElementById('clearButton');
    const resultBox = document.getElementById('resultBox');
    const resultContent = document.getElementById('resultContent');
    const highlightedText = document.getElementById('highlightedText');
    const reviewForm = document.getElementById('reviewForm');
    const starRating = document.querySelector('.star-rating');
    const ratingInput = document.getElementById('reviewRating');
    const reviewsList = document.getElementById('reviewsList');
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;

    // Create notification element
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);

    // Function to show notification instead of alert
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        });
    }

    // ✅ Theme Toggle Functionality
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);

        themeToggle.addEventListener('click', function () {
            const currentTheme = root.classList.contains('light-theme') ? 'dark' : 'light';
            setTheme(currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }

    function setTheme(theme) {
        root.classList.toggle('light-theme', theme === 'light');
        themeToggle.innerHTML = theme === 'light' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    // ✅ Clear Button Functionality
    if (clearButton) {
        clearButton.addEventListener('click', function () {
            userInput.value = '';
            resultBox.classList.add('hidden');
            userInput.focus();
        });
    }

    // ✅ Event Listener for Check Button
    if (checkButton) {
        checkButton.addEventListener('click', function () {
            analyzeText();
        });
    }

    // ✅ Handle "Enter" Key in Textarea
    if (userInput) {
        userInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                analyzeText();
            }
        });
    }

    // ✅ Analyze Text (Now using local detection)
    function analyzeText() {
        if (!userInput.value.trim()) {
            showNotification('Please enter some text to analyze.', 'error');
            return;
        }

        resultBox.classList.remove('hidden');
        resultContent.innerHTML = `<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Analyzing text...</div>`;
        highlightedText.innerHTML = '';

        // Simulate processing delay for better UX
        setTimeout(() => {
            const result = containsBadWordsFuzzy(userInput.value);
            
            if (result.isAbusive) {
                resultContent.className = 'abusive';
                resultContent.innerHTML = `
                    <div class="result-icon"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="result-text">
                        <h3>Abusive Content Detected</h3>
                        <p>We found ${result.foundWords.length} inappropriate word(s):</p>
                        <div class="detected-words">${result.foundWords.join(', ')}</div>
                    </div>`;
            } else {
                resultContent.className = 'safe';
                resultContent.innerHTML = `
                    <div class="result-icon"><i class="fas fa-check-circle"></i></div>
                    <div class="result-text">
                        <h3>Content Looks Good</h3>
                        <p>No inappropriate content detected.</p>
                    </div>`;
            }
            highlightedText.innerHTML = result.highlightedText || '<p class="empty-text">No text to analyze</p>';
        }, 500);
    }

    // ✅ Handle Star Rating Selection
    if (starRating) {
        const stars = starRating.querySelectorAll('i');
        stars.forEach(star => {
            star.addEventListener('mouseover', function () {
                highlightStars(this.dataset.rating);
            });
            star.addEventListener('mouseout', function () {
                highlightStars(ratingInput.value);
            });
            star.addEventListener('click', function () {
                ratingInput.value = this.dataset.rating;
                highlightStars(ratingInput.value);
            });
        });
    }

    function highlightStars(rating) {
        const stars = starRating.querySelectorAll('i');
        stars.forEach(star => {
            star.classList.toggle('fas', star.dataset.rating <= rating);
            star.classList.toggle('far', star.dataset.rating > rating);
        });
    }

    // ✅ Load and Submit Reviews (now using localStorage)
    if (reviewsList) loadReviews();

    if (reviewForm) {
        reviewForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitReview();
        });
    }

    function submitReview() {
        const name = document.getElementById('reviewName').value.trim();
        const rating = ratingInput.value;
        const comment = document.getElementById('reviewComment').value.trim();

        // Check each field individually and show specific messages
        if (!name) {
            showNotification('Please enter your name', 'error');
            document.getElementById('reviewName').focus();
            return;
        }
        
        if (rating === '0') {
            showNotification('Please select a rating', 'error');
            return;
        }
        
        if (!comment) {
            showNotification('Please share your feedback', 'error');
            document.getElementById('reviewComment').focus();
            return;
        }

        try {
            addReview({
                name: name,
                rating: parseInt(rating),
                comment: comment
            });

            reviewForm.reset();
            highlightStars(0);
            ratingInput.value = '0';
            loadReviews();
            showNotification('Thank you for your review!', 'success');
        } catch (error) {
            console.error('Error submitting review:', error);
            showNotification('Failed to submit review. Please try again.', 'error');
        }
    }

    function loadReviews() {
        if (!reviewsList) return;

        try {
            const reviews = getReviews();
            
            reviewsList.innerHTML = reviews.length
                ? reviews.map(reviewTemplate).join('')
                : '<p class="empty-reviews">Be the first to leave a review!</p>';
        } catch (error) {
            console.error('Error loading reviews:', error);
            reviewsList.innerHTML = '<p class="empty-reviews">Could not load reviews. Please try again later.</p>';
        }
    }

    function reviewTemplate(review) {
        const starsHtml = [...Array(5)].map((_, i) =>
            `<i class="${i < review.rating ? 'fas' : 'far'} fa-star"></i>`
        ).join('');
        const formattedDate = new Date(review.timestamp).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
        return `
            <div class="review-item">
                <div class="review-author">
                    <i class="fas fa-user-circle"></i>
                    <span>${review.name}</span>
                    <div class="rating">${starsHtml}</div>
                </div>
                <p>"${review.comment}"</p>
                <div class="review-date">${formattedDate}</div>
            </div>`;
    }
});