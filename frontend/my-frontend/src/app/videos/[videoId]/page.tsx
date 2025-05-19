"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, HeartOff } from "lucide-react";
import MoodSkillSelector from "../../components/MoodSkillSelector";

export default function VideoDetailPage() {
    const router = useRouter();
    const {videoId}= useParams();
    const [video, setVideo] = useState<any>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [mood, setMood] = useState("relaxed");
    const [skillLevel, setSkillLevel] = useState("beginner");
    const [collabRecs, setCollabRecs] = useState<any[]>([]);
    const [contentRecs, setContentRecs] = useState<any[]>([]);

    useEffect(() => {
    const fetchVideo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Fetch video details
        const res = await fetch(`https://my-backend-late-star-5731.fly.dev/videos/play/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setVideo(data);

        // Fetch liked videos to check if this one is liked
        const likesRes = await fetch(`https://my-backend-late-star-5731.fly.dev/videos/liked`, {
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

  useEffect(() => {
    const fetchRecs = async () => {

      const token = localStorage.getItem("token");
      try {
        const res = await fetch("https://palettepal.onrender.com/recommend", {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, 
            }, 
            body: JSON.stringify({
              currentVideoId: videoId,
              currentMood: mood,
              currentSkillLevel: skillLevel,
            })
        })

        if (!res.ok) throw new Error("Failed to fetch home recommendations");

        const allRecs = await res.json();
        const cf_videos = allRecs.filter((v: any) => v.source === "cf");
        console.log("CF Videos: ", cf_videos)
        const cbf_videos = allRecs.filter((v: any) => v.source === "cbf");
        console.log("CBF Videos: ", cbf_videos)

        setCollabRecs(cf_videos);
        setContentRecs(cbf_videos);

      } catch(err) {
          console.error("Error loading hybrid recommendations: ", err)
      }
    }
    fetchRecs();
  }, [mood, skillLevel, videoId])


  const toggleLike = async () => {
    const token = localStorage.getItem("token");

    try {
      if (isLiked) {
        // unlike
        const res = await fetch(`https://my-backend-late-star-5731.fly.dev/likes/${videoId}`, {
        method: "DELETE", 
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error("Failed to unlike video");
      setIsLiked(false);

      } else {
        // like 
        const res = await fetch(`https://my-backend-late-star-5731.fly.dev/likes/${videoId}`, {
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
  <main className="pl-1 pr-4 py-10 max-w-screen-xl mx-auto">
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-[65%] pr-4">
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

      <div className="w-full lg:w-[35%] flex-shrink-0">
        <MoodSkillSelector
          selectedMood={mood}
          setMood={setMood}
          selectedSkill={skillLevel}
          setSkill={setSkillLevel}
        />

      <div className="mt-6">
      {collabRecs.length > 0 && (
        <>
          <h3 className="text-md font-semibold mb-2">Artists similar to you liked...</h3>
          <div className="flex flex-col gap-6 px-5">
          {collabRecs.map((video) => (
            <div
              key={video.video_id} 
              className="flex gap-4 bg-white rounded shadow p-4 hover:shadow-md 
                cursor-pointer transition border max-h-38 overflow-hidden"
              onClick={() => router.push(`/videos/${video.video_id}`)}
            >
              <div className="relative w-35 h-20 shrink-0">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover rounded"
                />

                <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white 
                    text-xs px-2 py-0.5 rounded">
                  {video.formatted_duration}
                </span>
            </div>
              <div className="flex flex-col justify-between overflow-hidden pr-1">
                <div>
                  <h3 className="text-md font-semibold line-clamp-3">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{video.channel_title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      {contentRecs.length > 0 && (
        <>
          <h3 className="text-md font-semibold mt-4 mb-2">Tutorials similar to this...</h3>
          <div className="flex flex-col gap-6 px-5">
          {contentRecs.map((video) => (
            <div
              key={video.video_id} 
              className="flex gap-4 bg-white rounded shadow p-4 hover:shadow-md 
                cursor-pointer transition border max-h-38 overflow-hidden"
              onClick={() => router.push(`/videos/${video.video_id}`)}
            >
              <div className="relative w-35 h-20 shrink-0">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover rounded"
                />

                <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white 
                    text-xs px-2 py-0.5 rounded">
                  {video.formatted_duration}
                </span>
            </div>
              <div className="flex flex-col justify-between overflow-hidden pr-1">
                <div>
                  <h3 className="text-md font-semibold line-clamp-3">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{video.channel_title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
</div>
      </div>
    </div>
  </main>
);



}