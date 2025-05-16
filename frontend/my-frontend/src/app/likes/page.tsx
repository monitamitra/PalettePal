"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, HeartOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LikesPage() {
    const [likedVideos, setLikedVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(true);
    const router = useRouter();

    useEffect(() => {
    const fetchLikedVideos = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8080/videos/liked", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch liked videos");

        const data = await res.json();
        console.log("liked videos: ", data);
        setLikedVideos(data);
      } catch (err) {
        console.error("Error fetching liked videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  const handleUnlike = async (videoId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8080/likes/${videoId}`, {
        method: "DELETE", 
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error("Failed to unlike video");
      // Remove from local state
      setLikedVideos(prev => prev.filter(video => video.videoId !== videoId));
    } catch(err) {
      console.error("Error unliking video:", err)
    }
  }

  return (
    <div>
      {loading ? (<p>Loading liked videos...</p>) : likedVideos.length === 0 ? (
        <p>You haven’t liked any videos yet.</p>) : (
        
        <div className="flex flex-col gap-6"> {likedVideos.map((video) => (
            <div key={video.videoId} onClick={() => router.push(`/videos/${video.videoId}`)}
              className="flex gap-4 bg-white rounded shadow p-4 hover:shadow-md 
              transition cursor-pointer"
            >
              
              <div className="relative w-64 shrink-0">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="rounded w-full h-36 object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white 
                    text-xs px-2 py-0.5 rounded">
                  {video.formattedDuration}
                </span>
              </div>

              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-semibold">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{video.channelTitle}</p>
                  <p className="text-sm text-gray-700 line-clamp-3">{video.description}</p>
                </div>

                 <button onClick={(e) => { e.stopPropagation();
                    handleUnlike(video.videoId);
                  }} className="inline text-red-500 ml-2 
                    align-middle pl-2" aria-label="Toggle like">
                <Heart fill="currentColor" strokeWidth={2.5} />
            </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );


}