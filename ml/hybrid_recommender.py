from flask import Flask, request, jsonify
from sqlalchemy import create_engine
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from dotenv import load_dotenv
import os
import jwt
from jwt.exceptions import InvalidTokenError
from flask_cors import CORS

load_dotenv()

# load sql data
def load_data():
    engine = create_engine(os.getenv("DATABASE_URL"))

    likes = pd.read_sql("SELECT * FROM likes", engine)
    videos = pd.read_sql("SELECT * FROM videos", engine)
    return likes, videos

likes_df, videos_df = load_data()

# preprocessing text data to make it easy to find recs
videos_df["title"] = videos_df["title"].fillna('')
videos_df["video_description"] = videos_df["video_description"].fillna('')
videos_df["text"] = (videos_df["title"] + " " + videos_df["video_description"]).str.lower().str.strip()

# generate content based similarity matrix
tfidf = TfidfVectorizer(stop_words="english")
tfidf_matrix = tfidf.fit_transform(videos_df["text"])
cosine_sim = cosine_similarity(tfidf_matrix)

# content based filtering
def get_similar_content_videos(video_id, top_k=5):
    idx = videos_df.index[videos_df['video_id'] == video_id][0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    top_idxs = [i for i, _ in sim_scores[1:top_k+1]]
    return videos_df.iloc[top_idxs][['video_id', 'title']]

# collaborative filtering
def get_user_item_matrix():
    return pd.crosstab(likes_df["user_id"], likes_df["video_id"])

# Context-aware cosine similarity based user matching
def get_similar_users(user_id, mood, skill_level, top_k=3):
    # Filter likes to the same mood and skill level
    context_df = likes_df[
        (likes_df["mood"] == mood) &
        (likes_df["skill_level"] == skill_level)
    ]

    # Pivot user-item matrix for this context only
    matrix = pd.crosstab(context_df["user_id"], context_df["video_id"])

    if user_id not in matrix.index:
        return []

    # Compute cosine similarity
    sims = cosine_similarity(matrix.loc[[user_id]], matrix)[0]
    matrix["similarity"] = sims

    return (
        matrix.drop(index=user_id)
              .sort_values("similarity", ascending=False)
              .head(top_k)
              .index
              .tolist()
    )

# Collaborative filtering using similar users within same mood and skill
def recommend_from_users(user_id, mood, skill_level, top_k_users=3):
    similar_users = get_similar_users(user_id, mood, skill_level, top_k=top_k_users)

    if not similar_users:
        return []

    sim_likes = likes_df[
        (likes_df["user_id"].isin(similar_users)) &
        (likes_df["mood"] == mood) &
        (likes_df["skill_level"] == skill_level)
    ]

    user_liked = likes_df[
        (likes_df["user_id"] == user_id) &
        (likes_df["mood"] == mood) &
        (likes_df["skill_level"] == skill_level)
    ]["video_id"].tolist()

    recs = sim_likes[~sim_likes["video_id"].isin(user_liked)]
    return recs["video_id"].value_counts().index.tolist()


# hybrid recommender method
def hybrid_recommend(user_id, video_id, mood, skill_level, top_k=5):
    cbf_recs = get_similar_content_videos(video_id, top_k=top_k)
    cbf_videos = cbf_recs['video_id'].tolist()
    cf_videos = recommend_from_users(user_id, mood, skill_level)
    combined_ids = list(dict.fromkeys(cbf_videos + cf_videos))
    final_recs = videos_df[videos_df['video_id'].isin(combined_ids)].copy()
    final_recs['source'] = final_recs['video_id'].apply(
        lambda vid: 'both' if vid in cbf_videos and vid in cf_videos
        else 'cbf' if vid in cbf_videos
        else 'cf'
    )
    return final_recs

app = Flask(__name__)
CORS(app,
     origins=["https://palette-pal.vercel.app"],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["POST", "OPTIONS"])

JWT_SECRET = os.getenv('JWT_SECRET').encode("utf-8")

@app.route("/recommend", methods=["POST"])
def recommend():
    # getting user id 
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing or invalid token'}), 401

    token = auth_header.split(' ')[1]
    try:
        # Decode JWT and extract user_id from 'sub' claim
        decoded = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        user_id = decoded.get('sub')
    except InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    
    try:
        data = request.get_json()
        video_id = data["currentVideoId"]
        mood = data["currentMood"]
        skill = data["currentSkillLevel"]

        recs = hybrid_recommend(user_id, video_id, mood, skill)
        return jsonify(recs.to_dict(orient="records"))
    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/recommend_home", methods=["POST"])
def recommend_from_home():
    # getting user id 
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing or invalid token'}), 401

    token = auth_header.split(' ')[1]
    
    try:
        # Decode JWT and extract user_id from 'sub' claim
        decoded = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        user_id = decoded.get('sub')
    except Exception as e:
        print("❌ JWT decode error:", str(e))
        return jsonify({'error': 'Invalid token'}), 401
    
    try:
        data = request.get_json()
        mood = data["currentMood"]
        skill = data["currentSkillLevel"]

        rec_ids = recommend_from_users(user_id, mood, skill)
        if not rec_ids:
            return jsonify([])

        recs = videos_df[videos_df["video_id"].isin(rec_ids)].copy()
        print(jsonify(recs.to_dict(orient="records")))
        return jsonify(recs.to_dict(orient="records"))
    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("✅ Flask is starting on 0.0.0.0:8080")
    app.run(host="0.0.0.0", port=8080)