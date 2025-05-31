# 🎨 PalettePal

**PalettePal** is a full-stack personalized painting tutorial recommender web app that delivers custom video recommendations based on mood, skill level, and user interaction history. It combines content-based and collaborative filtering to power a YouTube-style experience for discovering painting tutorials.

🔗 **Live Demo:** [https://palette-pal.vercel.app](https://palette-pal.vercel.app)
      - Username: monita2903, password: secret217 -> look at (relaxed, intermediate) or (calm, advanced) to see live recommendations with present data

## 🖼️ Screenshots

### Home with Recommendations
![image](https://github.com/user-attachments/assets/247dbd6c-6883-4641-87f6-1311b6967f49)

### Video Details Page with CF recs
![image](https://github.com/user-attachments/assets/99ac1ec4-46aa-45d1-8935-f38a2fdc800e)

### Video Details Page with CBF recs
![image](https://github.com/user-attachments/assets/02a8e88e-ba32-476f-82b9-e5bce8b9dad9)

### Home Page with Search Query
![image](https://github.com/user-attachments/assets/46a5c845-d2c2-49a2-b1ad-882b9624d032)

### Liked Videos Page
![image](https://github.com/user-attachments/assets/50b10fa0-66ad-4f3d-ab1d-cd249433fe36)

### Sidebar Navigation 
![image](https://github.com/user-attachments/assets/6b9dee8e-6049-4ffd-9519-2604b69d389f)

### Login Page 
![image](https://github.com/user-attachments/assets/86ca2043-40f9-45f7-a5e3-a5175a40ea01)

### Signup Page
![image](https://github.com/user-attachments/assets/9fd7a46e-9f54-4454-a5d7-04f456b2b2fc)

---

## 🧠 What It Does

1. **Video Ingestion:**  
   A Python ingestion script pulls painting tutorial videos from the YouTube API and stores metadata (title, description, thumbnail, duration, etc.) in PostgreSQL.

2. **User Interaction:**  
   Users sign up, log in securely via JWT, and like/unlike videos. Mood and skill level are attached to each interaction for context-aware recommendations.

3. **Personalized Recommendations:**  
   When a user views a video or lands on the home screen, Flask returns hybrid recommendations powered by both:
   - **Content-based filtering:** TF-IDF + cosine similarity on video text
   - **Collaborative filtering:** Cosine similarity between user profiles filtered by mood + skill level

---

## 🚀 Features

- 🔐 JWT authentication with secure login
- 🧠 Real-time personalized video recommendations
- ❤️ Like/unlike videos with persistent state
- 🎯 Filtering by mood (e.g. relaxed, focused) and skill level (e.g. beginner, advanced)
- 🎨 Responsive UI styled with Tailwind CSS
- 🌐 Deployed entirely on modern cloud platforms

---

## 🛠️ Tech Stack

**Frontend**
- [Next.js](https://nextjs.org/) (TypeScript)
- Tailwind CSS
- Deployed on Vercel

**Backend**
- **Spring Boot (Java):**
  - User authentication (`/auth`)
  - Video & like APIs (`/videos`, `/likes`)
  - JWT validation and security
  - Deployed on Google Cloud

**Recommender System**
- **Flask (Python):**
  - `POST /recommend` for video detail recommendations
  - `POST /recommend_home` for home screen suggestions
  - TF-IDF + user-user collaborative filtering
  - Deployed on Google Cloud

**Database**
- PostgreSQL (hosted on [Neon.tech](https://neon.tech))

---

## ⚙️ System Flow

1. 📥 **Data Collection**:  
   A script fetches painting videos via the YouTube Data API and inserts them into the `videos` table in PostgreSQL.

2. 👤 **User Auth**:  
   Users register/login via Spring Boot. JWT tokens are issued and stored in localStorage by the frontend.

3. ❤️ **Likes Tracking**:  
   Likes are stored with mood + skill level. This data powers collaborative filtering.

4. 🧠 **Hybrid Recommender**:  
   - Flask receives a `user_id`, `video_id`, `mood`, and `skill_level`
   - Returns combined recommendations from:
     - Content-based filtering via TF-IDF
     - Collaborative filtering from similar users

---

## 🧪 How to Use

1. Visit [https://palette-pal.vercel.app](https://palette-pal.vercel.app)
2. Sign up and log in
3. Filter by mood & skill level
4. View and like painting tutorial videos
5. Receive personalized recommendations on the home page and video detail pages
