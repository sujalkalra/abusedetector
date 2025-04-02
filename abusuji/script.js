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

    // ✅ Analyze Text (Fixed Error Handling)
    function analyzeText() {
        if (!userInput.value.trim()) {
            showNotification('Please enter some text to analyze.', 'error');
            return;
        }

        resultBox.classList.remove('hidden');
        resultContent.innerHTML = `<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Analyzing text...</div>`;
        highlightedText.innerHTML = '';

        fetch('http://localhost:5000/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: userInput.value }),
        })
            .then(response => response.json())
            .then(result => {
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
            })
            .catch(error => {
                console.error('Error:', error);
                resultContent.className = 'abusive';
                resultContent.innerHTML = `
                    <div class="result-icon"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="result-text">
                        <h3>Error</h3>
                        <p>Could not connect to the Python backend. Ensure it's running on port 5000.</p>
                    </div>`;
            });
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

    // ✅ Load and Submit Reviews
    if (reviewsList) loadReviews();

    if (reviewForm) {
        reviewForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitReview();
        });
    }

    // In the submitReview function, let's update the validation logic
    async function submitReview() {
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
            const response = await fetch('https://abusedetector.vercel.app/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, rating: parseInt(rating), comment }),
            });
    
            if (!response.ok) throw new Error('Failed to submit review');
    
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

    // Similarly, update the analyzeText function
    function analyzeText() {
        if (!userInput.value.trim()) {
            showNotification('Please enter some text to analyze', 'error');
            userInput.focus();
            return;
        }

        // Rest of the function remains the same
        resultBox.classList.remove('hidden');
        resultContent.innerHTML = `<div class="loading"><i class="fas fa-circle-notch fa-spin"></i> Analyzing text...</div>`;
        highlightedText.innerHTML = '';
    
        fetch('http://localhost:5000/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: userInput.value }),
        })
            .then(response => response.json())
            .then(result => {
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
            })
            .catch(error => {
                console.error('Error:', error);
                resultContent.className = 'abusive';
                resultContent.innerHTML = `
                    <div class="result-icon"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="result-text">
                        <h3>Error</h3>
                        <p>Could not connect to the Python backend. Ensure it's running on port 5000.</p>
                    </div>`;
            });
    }

    async function loadReviews() {
        if (!reviewsList) return;
        try {
            const response = await fetch('https://abusedetector.vercel.app/api/reviews');
            if (!response.ok) throw new Error('Failed to load reviews');
            const reviews = await response.json();

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
