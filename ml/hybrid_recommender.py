from flask import Flask, request, jsonify
import psycopg2
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()

# load nlp model and define mood mappings to group similar moods 
group_keywords = ['relaxed', 'happy', 'focused', 'sad', 'inspired', 'anxious', 
                  'bored','romantic', 'energetic', 'nostalgic', 'frustrated', 
                  'lonely', 'calm','playful', 'creative']
model = SentenceTransformer('all-MiniLM-L6-v2')
group_vecs = model.encode(group_keywords)

def map_mood_nlp(user_input, threshold=0.4):
    user_vec = model.encode([user_input])
    sims = cosine_similarity(user_vec, group_vecs)[0]
    max_sim = sims.max()
    best_match = group_keywords[sims.argmax()]
    return best_match if max_sim >= threshold else user_input.lower()

# load sql data
def load_data():
    conn = psycopg2.connect( dbname=os.getenv("DB_NAME"), user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"), host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)
    likes = pd.read_sql("SELECT * FROM likes", conn)
    videos = pd.read_sql("SELECT * FROM videos", conn)
    conn.close()
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
def get_user_item_matrix(mood, skill_level):
    mapped_mood = map_mood_nlp(mood)
    mapped_moods = likes_df["mood"].apply(map_mood_nlp)
    subset = likes_df[(mapped_moods == mapped_mood) & (likes_df["skill_level"] == skill_level)]
    return pd.crosstab(subset["user_id"], subset["video_id"])

def get_similar_users(user_id, mood, skill_level, top_k=3):
    matrix = get_user_item_matrix(mood, skill_level)
    if user_id not in matrix.index:
        return []
    sims = cosine_similarity(matrix.loc[[user_id]], matrix)[0]
    matrix["similarity"] = sims
    return matrix.sort_values("similarity", ascending=False).iloc[1:top_k+1].index.tolist()

def recommend_from_users(user_id, mood, skill_level):
    mapped_mood = map_mood_nlp(mood)
    similar_users = get_similar_users(user_id, mood, skill_level)
    if not similar_users:
        return []
    mapped_likes_moods = likes_df["mood"].apply(map_mood_nlp)
    sim_likes = likes_df[
        (likes_df["user_id"].isin(similar_users)) &
        (mapped_likes_moods == mapped_mood) &
        (likes_df["skill_level"] == skill_level)
    ]
    user_liked = likes_df[
        (likes_df["user_id"] == user_id) &
        (mapped_likes_moods == mapped_mood) &
        (likes_df["skill_level"] == skill_level)
    ]["video_id"].tolist()

    recs = sim_likes[~sim_likes["video_id"].isin(user_liked)]
    return recs["video_id"].value_counts().index.tolist()


# hybrid recommender method
def hybrid_recommend(user_id, video_id, mood, skill_level, top_k=5):
    mood = map_mood_nlp(mood)
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

# flask endpoint
@app.route("/recommend", methods=["POST"])
def recommend():
    try:
        data = request.get_json()
        user_id = data["userId"]
        video_id = data["currentVideoId"]
        mood = data["currentMood"]
        skill = data["currentSkillLevel"]

        recs = hybrid_recommend(user_id, video_id, mood, skill)
        return jsonify(recs.to_dict(orient="records"))
    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)

