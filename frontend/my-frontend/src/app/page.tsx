"use client";
import requireAuth from "./components/requireAuth";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MoodSkillSelector from "./components/MoodSkillSelector";

export default function Home() {
  const router = useRouter();
  const [videos, setVideos] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [mood, setMood] = useState("relaxed");
  const [skill, setSkill] = useState("intermediate");
  const [isDefaultRecs, setIsDefaultRecs] = useState(true);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDefaultRecs(false);

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

   useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); 
    }
  }, []);

  useEffect(() => {
    const fetchDefaultRecs = async () => {
      // skip if user is searching
      if (query.trim()) return;

      const token = localStorage.getItem("token");
      try {
        const res = await fetch("https://palettepal.onrender.com/recommend_home", {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, 
            }, 
            body: JSON.stringify({
              currentMood: mood,
              currentSkillLevel: skill,
            })
        })

        if (!res.ok) throw new Error("Failed to fetch home recommendations");

        const data = await res.json();
        setVideos(data);

      } catch(err) {
          console.error("Error loading home recommendations: ", err)
      }
    }
    fetchDefaultRecs();
  }, [mood, skill])

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

          {isDefaultRecs && videos.length > 0 && (
            <h2 className="text-xl font-semibold mb-4 px-5">
              🎨 Artists similar to you liked...
            </h2>
          )}
        
        {videos.length > 0 && (
          
        <div className="flex flex-col gap-6 px-5">
          {videos.map((video) => (
            <div
              key={video.video_id || video.videoId} 
              className="flex gap-4 bg-white rounded shadow p-4 hover:shadow-md 
                cursor-pointer transition border"
              onClick={() => router.push(`/videos/${video.video_id || video.videoId}`)}
            >
              <div className="relative w-64 shrink-0">
                <img
                  src={isDefaultRecs ? video.thumbnail_url : video.thumbnailUrl}
                  alt={video.title}
                  className="rounded w-full h-36 object-cover"
                />

                <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white 
                    text-xs px-2 py-0.5 rounded">
                  {isDefaultRecs ? video.formatted_duration : video.formattedDuration}
                </span>
            </div>
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-semibold">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{isDefaultRecs ? video.formatted_duration : 
                    video.channelTitle}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-3">{isDefaultRecs ? 
                    video.video_description : video.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </main>
  );
}
