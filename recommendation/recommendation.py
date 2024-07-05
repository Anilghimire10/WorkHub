from flask import Flask, jsonify
from flask_cors import CORS
import pymongo
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import string

app = Flask(__name__)
CORS(app)  # Enable CORS if necessary

# Initialize NLTK objects
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('stopwords')

# Initialize NLTK objects
stop_words = set(stopwords.words('english'))
wordnet_lemmatizer = WordNetLemmatizer()

# Function to preprocess text
def preprocess_text(text):
    # Tokenize
    tokens = word_tokenize(text)

    # Remove punctuation and lowercase
    tokens = [token.lower() for token in tokens if token not in string.punctuation]

    # Remove stopwords
    tokens = [token for token in tokens if token not in stop_words]

    # Lemmatize tokens
    tokens = [wordnet_lemmatizer.lemmatize(token) for token in tokens]

    # Join tokens back into a string
    clean_text = ' '.join(tokens)
    return clean_text

@app.route('/api/recommendations/search', methods=['GET'])
def get_recommendations_search():
    # Connect to MongoDB and fetch necessary data
    client = pymongo.MongoClient("mongodb+srv://Anilghimire:sehuLAgU@cluster0.om29z8c.mongodb.net/WorkHub")
    db = client['WorkHub']

    user_id = "667bb470623a9d8a7cc35efa"
    search_history = list(db.searchhistories.find({"userId": user_id}))
    gigs = list(db.gigs.find())

    # Check if search history and gigs are not empty
    if not search_history:
        return jsonify({"error": "No search history found for the user"}), 404
    if not gigs:
        return jsonify({"error": "No gigs found"}), 404

    # Preprocess user's search queries
    search_queries = " ".join([preprocess_text(entry['searchQuery']) for entry in search_history])

    # Preprocess gig texts
    gig_texts = [preprocess_text(gig['title'] + " " + gig['desc']) for gig in gigs]

    # Combine search queries and gig texts into corpus
    corpus = [search_queries] + gig_texts

    # Compute TF-IDF vectors
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(corpus)

    # Compute cosine similarity
    cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    # Get top recommendations based on search queries
    top_indices_search = cosine_similarities.argsort()[-3:][::-1]
    recommended_gigs_search = [{
        "title": gigs[i]['title'],
        "desc": gigs[i]['desc'],
        "similarity": cosine_similarities[i],
        "totalStars": gigs[i]['totalStars'],
        "starNumber": gigs[i]['starNumber']
    } for i in top_indices_search]

    return jsonify({"recommendations_search": recommended_gigs_search})

@app.route('/api/recommendations/stars', methods=['GET'])
def get_recommendations_stars():
    # Connect to MongoDB and fetch necessary data
    client = pymongo.MongoClient("mongodb+srv://Anilghimire:sehuLAgU@cluster0.om29z8c.mongodb.net/WorkHub")
    db = client['WorkHub']

    gigs = list(db.gigs.find())

    # Check if gigs are not empty
    if not gigs:
        return jsonify({"error": "No gigs found"}), 404

    # Sort gigs based on star ratings (highest first)
    sorted_gigs_star_ratings = sorted(gigs, key=lambda x: x['totalStars'] / x['starNumber'] if x['starNumber'] != 0 else 0, reverse=True)

    # Get top gigs based on star ratings
    recommended_gigs_star_ratings = [{
        "title": gig['title'],
        "desc": gig['desc'],
        "totalStars": gig['totalStars'],
        "starNumber": gig['starNumber'],
        "starRating": gig['totalStars'] / gig['starNumber'] if gig['starNumber'] != 0 else 0
    } for gig in sorted_gigs_star_ratings[:3]]

    return jsonify({"recommendations_star_ratings": recommended_gigs_star_ratings})

if __name__ == '__main__':
    app.run(debug=True)
