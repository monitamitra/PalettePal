"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Heart, HeartOff } from "lucide-react";
import MoodSkillSelector from "../../components/MoodSkillSelector";

export default function VideoDetailPage() {
    const {videoId}= useParams();
    const [video, setVideo] = useState<any>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [liked, setLiked] = useState(false);
    const [mood, setMood] = useState("Relaxed");
    const [skill, setSkill] = useState("Beginner");

    useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/videos/play/${videoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched video detail:", data);
        setVideo(data);
      })
      .catch((err) => console.error("Failed to load video", err));
    }, [videoId]);

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
            onClick={() => setLiked(!liked)}
            className="inline text-red-500 hover:scale-110 transition-transform ml-2 align-middle pl-2"
            aria-label="Toggle like"
          >
            {liked ? (
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
          selectedSkill={skill}
          setSkill={setSkill}
        />
      </div>
    </div>
  </main>
);



}