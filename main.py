from fuzzywuzzy import fuzz

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
    "gandu ke laude",
    # Add more gaaliyon as needed
]

# Common Hindi words list (to ignore) + Positive words
ignore_words = ["bhai",
    "genius", "gajab", "wah", "maza aa gaya", "bahut achha", "badiya", "shandar", "zabardast", "great", "brilliant",
    "khoobsurat", "pyaara", "mind-blowing", "best", "a1", "superb", "thank you", "mazaa", "shaandar", "lajawab",
    "faadu", "amazing", "awesome", "lovely", "beautiful", "badhiya", "aap best ho", "dil khush ho gaya", "sundar",
    "great work", "bahut badiya", "sahi", "jeet gaya", "badhiya kaam", "incredible", "lajawab kaam", "fab", "amazing",
    # Add more positive words as needed
]


# Function to detect bad words or phrases
def contains_bad_words_fuzzy(message):
    message = message.lower()

    # First, check for exact matches of bad phrases
    for phrase in bad_words:
        if phrase in message:
            return True

    # If no exact match, split and check individual words with fuzzy matching
    words_in_message = message.split()
    for word in words_in_message:
        if word in ignore_words:
            continue  # Ignore common and positive words
        for bad_word in bad_words:
            if fuzz.ratio(bad_word, word) > 70:  # 70% similarity threshold
                return True
    return False


# Example usage
user_message = input("Apna message type karein: ")
if contains_bad_words_fuzzy(user_message):
    print("Gaali detect ki gayi hai, entry reject kar di gayi hai!")
else:
    print("Message acceptable hai!")
