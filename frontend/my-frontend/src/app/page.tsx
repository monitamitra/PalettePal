"use client";
import requireAuth from "./components/requireAuth";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MoodSkillSelector from "./components/MoodSkillSelector";

export default function Home() {
  requireAuth();

  const [videos, setVideos] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [mood, setMood] = useState("Relaxed");
  const [skill, setSkill] = useState("Beginner");
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/videos/search?query=${encodeURIComponent(query)}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Failed to fetch videos");

      const data = await res.json();
      console.log("Raw video data:", data);
      setVideos(data);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setVideos([]);
    }
  };

  return (
    <main >
       <div className="bg-cover bg-center bg-no-repeat w-full pb-5 mb-6"
          style={{ backgroundImage: "url('/background-app.jpeg')" }}>

        <form onSubmit={handleSearch}
          className="px-6 py-5" >
          <div className="relative w-full max-w-2xl mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 
            text-gray-400 bg-white w-5 h-5">
            </Search>

            {query && 
              (<button type="button" onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 
              text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
            </button>)} 

            <input
              className="w-full border border-gray-300 bg-gray-100 rounded-full 
              px-10 py-3 pr-10 font-semibold pl-12 bg-white"
              type="text"
              placeholder="Search tutorials..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </form>    

        <MoodSkillSelector selectedMood={mood} setMood={setMood} selectedSkill={skill}
          setSkill={setSkill}/>
          
      </div>
        

        {videos.length > 0 && (
          
        <div className="flex flex-col gap-6 px-5">
          {videos.map((video) => (
            <div
              key={video.videoId} 
              className="flex gap-4 bg-white rounded shadow p-4 hover:shadow-md 
                cursor-pointer transition"
              onClick={() => router.push(`/videos/${video.videoId}`)}
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
              </div>
            </div>
          ))}
        </div>
      )}

    </main>
  );
}
