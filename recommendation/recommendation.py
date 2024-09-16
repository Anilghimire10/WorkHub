from flask import Flask, jsonify
from flask_cors import CORS
import pymongo
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import string
from datetime import datetime, timedelta
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

# Initialize Flask and enable CORS
app = Flask(__name__)
CORS(app)

# Load environment variables from .env file
load_dotenv()

# Initialize NLTK objects
nltk.download("punkt")
nltk.download("wordnet")
nltk.download("stopwords")
stop_words = set(stopwords.words("english"))
wordnet_lemmatizer = WordNetLemmatizer()

# Email setup using environment variables
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SITE_URL = os.getenv("SITE_URL")

# MongoDB connection using environment variable
MONGO_URI = os.getenv("MONGO_URI")
client = pymongo.MongoClient(MONGO_URI)
db = client["WorkHub"]

# Preprocess text by tokenizing, removing punctuation/stopwords, and lemmatizing
def preprocess_text(text):
    tokens = word_tokenize(text)
    tokens = [token.lower() for token in tokens if token not in string.punctuation]
    tokens = [token for token in tokens if token not in stop_words]
    tokens = [wordnet_lemmatizer.lemmatize(token) for token in tokens]
    return " ".join(tokens)

# Send an email using the provided email credentials
def send_email(to_email, subject, body):
    try:
        msg = MIMEMultipart()
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = to_email
        msg["Subject"] = subject

        # HTML body
        html_body = f"""
        <html>
        <body>
            <p>{body}</p>
            <p>Visit our site: <a href="{SITE_URL}">{SITE_URL}</a></p>
        </body>
        </html>
        """

        msg.attach(MIMEText(html_body, "html"))

        print(f"Sending email to {to_email} with subject '{subject}'")

        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            text = msg.as_string()
            server.sendmail(EMAIL_ADDRESS, to_email, text)

        print(f"Email sent successfully to {to_email}")

    except Exception as e:
        print(f"Failed to send email to {to_email}. Error: {e}")

# Route to get newly added recommendations
@app.route("/api/recommendations/newly_added", methods=["GET"])
def get_newly_added_recommendations():
    try:
        search_histories = list(db.searchhistories.find())
        if not search_histories:
            return jsonify({"error": "No search history found"}), 404

        search_queries = [
            preprocess_text(entry["searchQuery"]) for entry in search_histories
        ]
        user_search_queries = {
            entry.get("email", "N/A"): preprocess_text(entry["searchQuery"])
            for entry in search_histories
            if entry.get("email")
        }

        date_threshold = datetime.now() - timedelta(days=1)
        newly_added_gigs = list(db.gigs.find({"createdAt": {"$gte": date_threshold}}))

        gig_urls = {
            str(gig["_id"]): f"{SITE_URL}/gig/{gig['_id']}" for gig in newly_added_gigs
        }
        gig_categories = [preprocess_text(gig["category"]) for gig in newly_added_gigs]

        documents = gig_categories + search_queries
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(documents)

        num_gig_categories = len(gig_categories)
        num_search_queries = len(search_queries)

        tfidf_gig_categories = tfidf_matrix[:num_gig_categories]
        tfidf_search_queries = tfidf_matrix[num_gig_categories:]

        recommended_gigs = []
        sent_emails = set()

        for i, query_vector in enumerate(tfidf_search_queries):
            category_similarities = cosine_similarity(
                query_vector, tfidf_gig_categories
            )

            for index, similarity in enumerate(category_similarities.flatten()):
                email = search_histories[i].get("email", "N/A")

                if similarity > 0.3:  # Adjusted threshold to capture more matches
                    gig_title = newly_added_gigs[index]["title"]
                    gig_url = gig_urls[str(newly_added_gigs[index]["_id"])]

                    unique_id = (email, search_queries[i], gig_url)

                    if unique_id not in sent_emails:
                        recommended_gigs.append(
                            {
                                "searchQuery": search_queries[i],
                                "bestMatchCategory": gig_title,
                                "email": email,
                                "gigUrl": gig_url,
                            }
                        )
                        sent_emails.add(unique_id)

                        if email != "N/A":  # Ensure the email exists before sending
                            send_email(
                                email,
                                "New Gig Match Notification",
                                f"Hi, We have found new gigs that match your recent search query '{search_queries[i]}'.\n\nGig Title: {gig_title}\nView it here: {gig_url}\n\nBest regards,\nWorkHub Team\n\nVisit our site: {SITE_URL}",
                            )

        return jsonify({"recommendedGigs": recommended_gigs}), 200

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": "Internal server error"}), 500

# Route to get gig recommendations based on star ratings
@app.route("/api/recommendations/stars", methods=["GET"])
def get_recommendations_stars():
    try:
        gigs = list(db.gigs.find())
        if not gigs:
            return jsonify({"error": "No gigs found"}), 404

        gigs_details = [
            {
                "gigId": str(gig["_id"]),
                "title": gig["title"],
                "desc": gig["desc"],
                "totalStars": gig["totalStars"],
                "starNumber": gig["starNumber"],
                "category": gig["category"],
                "price": gig["price"],
                "cover": gig["cover"],
                "images": gig["images"],
                "shortDesc": gig["shortDesc"],
                "shortTitle": gig["shortTitle"],
                "deliveryTime": gig["deliveryTime"],
                "revisionTime": gig["revisionTime"],
                "revisionNumber": gig["revisionNumber"],
                "features": gig["features"],
                "sales": gig["sales"],
                "createdAt": gig["createdAt"],
                "updatedAt": gig["updatedAt"],
                "starRating": (
                    gig["totalStars"] / gig["starNumber"]
                    if gig["starNumber"] != 0
                    else 0
                ),
            }
            for gig in gigs
            if gig["starNumber"] > 0
        ]

        sorted_gigs_star_ratings = sorted(
            gigs_details, key=lambda x: x["starRating"], reverse=True
        )
        recommended_gigs_star_ratings = sorted_gigs_star_ratings[:3]

        return jsonify({"recommendations_star_ratings": recommended_gigs_star_ratings})

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
