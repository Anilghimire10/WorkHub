from flask import Flask, jsonify, request
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

    # Get user ID from request query parameters
    user_id = request.args.get('userId')

    # Fetch search history for the user
    search_history = list(db.searchhistories.find({"userId": user_id}))

    # If no search history found, return an empty list or appropriate message
    if not search_history:
        return jsonify({"recommendations_search": []})

    # Fetch gigs from MongoDB
    gigs = list(db.gigs.find())

    # Preprocess user's search queries
    search_queries = " ".join([preprocess_text(entry['searchQuery']) for entry in search_history])

    # Preprocess gig texts and fetch all details
    gig_texts = []
    gig_ids_seen = set()  # Track seen gig IDs to avoid duplicates

    for gig in gigs:
        gig_id = str(gig['_id'])  # Convert ObjectId to string if needed
        if gig_id not in gig_ids_seen:
            gig_texts.append({
                "gigId": gig_id,
                "title": gig['title'],
                "desc": gig['desc'],
                "totalStars": gig['totalStars'],
                "starNumber": gig['starNumber'],
                "category": gig['category'],
                "price": gig['price'],
                "cover": gig['cover'],
                "images": gig['images'],
                "shortDesc": gig['shortDesc'],
                "shortTitle": gig['shortTitle'],
                "deliveryTime": gig['deliveryTime'],
                "revisionTime": gig['revisionTime'],
                "revisionNumber": gig['revisionNumber'],
                "features": gig['features'],
                "sales": gig['sales'],
                "createdAt": gig['createdAt'],
                "updatedAt": gig['updatedAt'],
                "text": preprocess_text(gig['title'] + " " + gig['desc'])  # Add preprocessed text for TF-IDF
            })
            gig_ids_seen.add(gig_id)

    # Combine search queries and gig texts into corpus
    corpus = [search_queries] + [gig['text'] for gig in gig_texts]

    # Compute TF-IDF vectors
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(corpus)

    # Compute cosine similarity
    cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    # Get top recommendations based on search queries
    top_indices_search = cosine_similarities.argsort()[::-1]

    # Initialize recommended gigs list
    recommended_gigs_search = []
    recommended_gig_ids = set()  # Track recommended gig IDs

    # Loop through top indices and add unique gigs with non-zero similarity
    for i in top_indices_search:
        if cosine_similarities[i] > 0:
            gig_id = gig_texts[i]['gigId']
            if gig_id not in recommended_gig_ids:
                recommended_gigs_search.append({
                    "gigId": gig_id,
                    "title": gig_texts[i]['title'],
                    "desc": gig_texts[i]['desc'],
                    "totalStars": gig_texts[i]['totalStars'],
                    "starNumber": gig_texts[i]['starNumber'],
                    "category": gig_texts[i]['category'],
                    "price": gig_texts[i]['price'],
                    "cover": gig_texts[i]['cover'],
                    "images": gig_texts[i]['images'],
                    "shortDesc": gig_texts[i]['shortDesc'],
                    "shortTitle": gig_texts[i]['shortTitle'],
                    "deliveryTime": gig_texts[i]['deliveryTime'],
                    "revisionTime": gig_texts[i]['revisionTime'],
                    "revisionNumber": gig_texts[i]['revisionNumber'],
                    "features": gig_texts[i]['features'],
                    "sales": gig_texts[i]['sales'],
                    "createdAt": gig_texts[i]['createdAt'],
                    "updatedAt": gig_texts[i]['updatedAt'],
                    "similarity": cosine_similarities[i],
                })
                recommended_gig_ids.add(gig_id)

                # Break if we have added 3 unique gigs
                if len(recommended_gigs_search) >= 3:
                    break

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

    # Fetch all details for gigs
    gigs_details = [{
        "gigId": str(gig['_id']),  # Convert ObjectId to string if needed
        "title": gig['title'],
        "desc": gig['desc'],
        "totalStars": gig['totalStars'],
        "starNumber": gig['starNumber'],
        "category": gig['category'],
        "price": gig['price'],
        "cover": gig['cover'],
        "images": gig['images'],
        "shortDesc": gig['shortDesc'],
        "shortTitle": gig['shortTitle'],
        "deliveryTime": gig['deliveryTime'],
        "revisionTime": gig['revisionTime'],
        "revisionNumber": gig['revisionNumber'],
        "features": gig['features'],
        "sales": gig['sales'],
        "createdAt": gig['createdAt'],
        "updatedAt": gig['updatedAt'],
        "starRating": gig['totalStars'] / gig['starNumber'] if gig['starNumber'] != 0 else 0,
    } for gig in gigs if gig['starNumber'] > 0]  # Filter out gigs with no star ratings

    # Sort gigs based on star ratings (highest first)
    sorted_gigs_star_ratings = sorted(gigs_details, key=lambda x: x['starRating'], reverse=True)

    # Get top gigs based on star ratings
    recommended_gigs_star_ratings = sorted_gigs_star_ratings[:3]

    # Return recommendations or an empty list if no recommended gigs
    if recommended_gigs_star_ratings:
        return jsonify({"recommendations_star_ratings": recommended_gigs_star_ratings})
    else:
        return jsonify({"recommendations_star_ratings": []})


if __name__ == '__main__':
    app.run(debug=True)
