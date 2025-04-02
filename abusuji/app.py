from flask import Flask, request, jsonify
from flask_cors import CORS
from fuzzywuzzy import fuzz
from pymongo import MongoClient
from datetime import datetime
import os
from bson import ObjectId
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB connection using environment variable
mongo_uri = os.getenv("MONGO_URI")
try:
    client = MongoClient(mongo_uri)
    db = client['abusuji']
    reviews_collection = db['reviews']
    print("✅ Connected to MongoDB successfully!")
except Exception as e:
    print(f"❌ Error connecting to MongoDB: {e}")
    reviews_collection = None
    
# Class to handle ObjectId serialization
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)

# Hindi gaaliyon ki list (phrases included)
bad_words = [
    "maderchod", "behenchod", "bhosadike", "chutiya", "gandu", "harami", "kameena", "randi", "sala", "bhadwa",
    "ma ki chut", "maa ka bhosda", "ma ka bhosda", "bhen ke lode", "ma ke lode", "lund", "madarchod", "behnchod",
    "bhosdiwale", "jhantu", "chinal", "chutiye", "randi ka bacha", "loda", "kutta kamina", "jhant ke baal", "gawar",
    "bhains ki aankh", "chutmarika", "lodu", "gand mara", "tatte", "gaand", "chudail", "ghanta", "chhapri", "haramkhor",
    "saala kutta", "bhain ka takka", "lundbaaz", "fuddu", "gandu saala", "sala harami", "gandu harami", "bhikhmanga",
    "gawar saala", "tatti", "ghatiya", "bakwas", "fuddu", "kutta kamina", "saala kutta", "bhen ke laude", "gandmara",
    "chutiya sala", "kaminey", "jhant ke baal", "lund ke baal", "bhen ke takke", "bhadwe", "khotte da puttar", "kutte",
    "lakkadbaggha", "maadarchod", "randi ka bacha", "behen ke lode", "jhant ke baal", "behen ke takke",
    "gandu ke laude", "saala"
]

# English abusive words
english_bad_words = [
    'idiot', 'stupid', 'dumb', 'fool', 'moron', 'jerk', 'ass', 'asshole',
    'bastard', 'bitch', 'crap', 'damn', 'fuck', 'shit', 'piss', 'dick',
    'cunt', 'whore', 'slut', 'retard', 'loser', 'trash', 'garbage',
    'worthless', 'hate', 'kill', 'die', 'ugly', 'fat', 'pathetic', 'useless',
    'suck', 'hell', 'dumbass', 'bullshit', 'crap', 'scum', 'weirdo', 'douche',
    'douchebag', 'prick', 'twat', 'cock', 'motherfucker', 'jackass', 'wanker',
    'pussy', 'dipshit', 'shithole', 'shithead', 'cocksucker', 'asshat',
    'buttfucker', 'numbnuts', 'fuckface', 'shitbag', 'pisshead', 'cumdumpster',
    'dickhead', 'fucktard', 'knobhead', 'bellend', 'tosser', 'arsehole',
    'bollocks', 'pillock', 'slag', 'git', 'minger', 'wazzock', 'nonce',
    'twunt', 'bint', 'minge', 'chav', 'spastic', 'numpty', 'nutter',
    'poon', 'skank', 'tramp', 'trollop', 'neanderthal', 'dog', 'rat',
    'scumbag', 'shitstain', 'cuntface', 'cockwomble', 'waste', 'dickwad',
    'fuckwit', 'assclown', 'jerkwad', 'shitfaced', 'pissflap', 'wasteoid',
    'cumstain', 'knobjockey', 'poonani', 'flid', 'motherless', 'shitshow',
    'arsewipe', 'smeghead', 'fuckbucket', 'douchecanoe', 'dickweed',
    'taint', 'dumbfuck', 'jizzstain', 'fucknugget', 'pissbaby', 'bitchface',
    'shitlord', 'dickbag', 'twatwaffle', 'cocknose', 'assmunch', 'cockstain',
    'puta', 'puta madre', 'chingada', 'mierda', 'pendejo', 'cabron',
    'gilipollas', 'coño', 'malparido', 'boludo', 'hijo de puta', 'culero'
]


# Common Hindi words list (to ignore) + Positive words
ignore_words = [
    "and", "bhai", "genius", "gajab", "wah", "maza aa gaya", "bahut achha", "badiya", "shandar", "zabardast",
    "great", "brilliant", "khoobsurat", "pyaara", "mind-blowing", "best", "a1", "superb", "thank you", "mazaa",
    "shaandar", "lajawab", "faadu", "amazing", "awesome", "lovely", "beautiful", "badhiya", "aap best ho",
    "dil khush ho gaya", "sundar", "great work", "bahut badiya", "sahi", "jeet gaya", "badhiya kaam", "incredible",
    "lajawab kaam", "fab", "amazing", "banadi"
]

# Function to detect bad words or phrases
def contains_bad_words_fuzzy(message):
    message_lower = message.lower()
    found_words = []
    
    # Check for exact matches in both Hindi and English
    all_bad_words = bad_words + english_bad_words
    for word in message_lower.split():
        clean_word = ''.join(c for c in word if c.isalnum())
        if clean_word in all_bad_words:
            found_words.append(clean_word)
    
    # Check for multi-word phrases
    for phrase in bad_words:
        if ' ' in phrase and phrase in message_lower:
            found_words.append(phrase)
    
    # If no exact match, check with fuzzy matching for Hindi words
    message_words = message_lower.split()
    for word in message_words:
        if word in ignore_words:
            continue  # Ignore common and positive words
        
        clean_word = ''.join(c for c in word if c.isalnum())
        if len(clean_word) < 3:
            continue  # Skip very short words
            
        for bad_word in bad_words:
            # Skip if lengths are too different
            if abs(len(clean_word) - len(bad_word)) > 3:
                continue
                
            similarity = fuzz.ratio(bad_word, clean_word)
            threshold = 80 if len(clean_word) <= 4 else 70
            
            if similarity > threshold and clean_word not in found_words:
                found_words.append(f"{clean_word} (similar to '{bad_word}')")
    
    # Create highlighted text
    highlighted_text = message
    for word in found_words:
        actual_word = word.split(" (similar")[0] if " (similar" in word else word
        # Escape special characters for regex
        escaped_word = ''.join('\\' + c if not c.isalnum() and not c.isspace() else c for c in actual_word)
        pattern = f"\\b{escaped_word}\\b"
        replacement = f'<span class="highlight">{actual_word}</span>'
        
        import re
        highlighted_text = re.sub(pattern, replacement, highlighted_text, flags=re.IGNORECASE)
    
    return {
        "isAbusive": len(found_words) > 0,
        "foundWords": found_words,
        "highlightedText": highlighted_text
    }

@app.route('/check', methods=['POST'])
def check_text():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({
            "isAbusive": False,
            "foundWords": [],
            "highlightedText": ""
        })
    
    result = contains_bad_words_fuzzy(text)
    return jsonify(result)

# Routes for reviews with MongoDB
@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    if reviews_collection is None:
        return jsonify([]), 200
        
    try:
        reviews = list(reviews_collection.find().sort('timestamp', -1))
        return jsonify(json.loads(json.dumps(reviews, cls=JSONEncoder)))
    except Exception as e:
        print(f"Error fetching reviews: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/reviews', methods=['POST'])
def add_review():
    if reviews_collection is None:
        return jsonify({"error": "Database not available"}), 503
        
    try:
        review_data = request.json
        review_data['timestamp'] = datetime.utcnow()
        
        # Validate required fields
        if not all(key in review_data for key in ['name', 'rating', 'comment']):
            return jsonify({"error": "Missing required fields"}), 400
            
        # Convert rating to integer
        try:
            review_data['rating'] = int(review_data['rating'])
            if not (1 <= review_data['rating'] <= 5):
                return jsonify({"error": "Rating must be between 1 and 5"}), 400
        except ValueError:
            return jsonify({"error": "Invalid rating value"}), 400
        
        result = reviews_collection.insert_one(review_data)
        review_data['_id'] = str(result.inserted_id)
        
        return jsonify(review_data), 201
    except Exception as e:
        print(f"Error adding review: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)