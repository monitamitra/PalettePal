"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Heart, HeartOff } from "lucide-react";
import MoodSkillSelector from "../../components/MoodSkillSelector";

export default function VideoDetailPage() {
    const {videoId}= useParams();
    const [video, setVideo] = useState<any>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    //const [liked, setLiked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [mood, setMood] = useState("Relaxed");
    const [skillLevel, setSkillLevel] = useState("Beginner");

    useEffect(() => {
    const fetchVideo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Fetch video details
        const res = await fetch(`http://localhost:8080/videos/play/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setVideo(data);

        // Fetch liked videos to check if this one is liked
        const likesRes = await fetch(`http://localhost:8080/videos/liked`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const likedData = await likesRes.json();
        const liked = likedData.some((v: any) => v.videoId === videoId);
        setIsLiked(liked);
      } catch (err) {
        console.error("Error fetching video or like status:", err);
      }
    };

    fetchVideo();
  }, [videoId]);


  const toggleLike = async () => {
    const token = localStorage.getItem("token");

    try {
      if (isLiked) {
        // unlike
        const res = await fetch(`http://localhost:8080/likes/${videoId}`, {
        method: "DELETE", 
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error("Failed to unlike video");
      setIsLiked(false);

      } else {
        // like 
        const res = await fetch(`http://localhost:8080/likes/${videoId}`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }, 
          body: JSON.stringify({
            mood, skillLevel
          })
        })

        if (!res.ok) throw new Error("Failed to like video");
        setIsLiked(true);
      }

    } catch (err) {
        console.error("Error toggling like:", err);
    }
  }

    if (!video) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    function truncateDescription(desc: string, maxLength = 150): string {
        if (!desc) return ""
        return desc.length > maxLength ? desc.slice(0, maxLength) + "..." : desc;
    }

      return (
  <main className="px-4 py-10 max-w-6xl mx-auto">
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="flex-1">
        <div className="aspect-video mb-4">
          <iframe
            className="w-full h-full rounded-xl"
            src={`https://www.youtube.com/embed/${video.videoId}`}
            title={video.title}
            allowFullScreen
          ></iframe>
        </div>

        <h1 className="text-2xl font-bold mb-4">
          {video.title}
          <button
            onClick={toggleLike}
            className="inline text-red-500 hover:scale-110 transition-transform ml-2 align-middle pl-2"
            aria-label="Toggle like"
          >
            {isLiked ? (
              <Heart fill="currentColor" strokeWidth={2.5} />
            ) : (
              <Heart strokeWidth={2.5} />
            )}
          </button>
        </h1>

        <p className="text-gray-700 mb-2">{video.channelTitle}</p>
        <p className="text-black-600 whitespace-pre-wrap break-words">
          {isExpanded ? video.description : truncateDescription(video.description)}
        </p>
        {video.description && video.description.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-black-600 font-medium mt-2 cursor-pointer hover:shadow transition"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      <div className="w-full lg:w-80 flex-shrink-0">
        <MoodSkillSelector
          selectedMood={mood}
          setMood={setMood}
          selectedSkill={skillLevel}
          setSkill={setSkillLevel}
        />
      </div>
    </div>
  </main>
);



}