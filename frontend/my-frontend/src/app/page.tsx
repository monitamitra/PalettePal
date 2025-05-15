"use client";
import requireAuth from "./components/requireAuth";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  requireAuth();

  const [videos, setVideos] = useState<any[]>([]);
  const [query, setQuery] = useState("");
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
    <main className="px-6 py-5 max-w-5xl mx-auto">
        <form onSubmit={handleSearch}
          className="px-6 py-5">
          <div className="relative w-full max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 
            text-gray-400 w-5 h-5">
            </Search>

            {query && 
              (<button type="button" onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 
              text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
            </button>)} 

            <input
              className="w-full border border-gray-300 bg-gray-100 rounded-full 
              px-10 py-3 pr-10 font-semibold pl-12"
              type="text"
              placeholder="Search tutorials..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </form>    

        {videos.length > 0 && (
          
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
          {videos.map((video) => (
            <div
              key={video.videoId} 
              className="cursor-pointer hover:shadow transition"
              onClick={() => router.push(`/videos/${video.videoId}`)}
            >
              <div className=" bg-white p-4 rounded-xl shadow-md aspect-video w-full bg-gray-200 rounded-lg overflow-hidden mb-2 relative">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />

                <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-0.5 rounded">
                  {video.formattedDuration}
                </span>
            </div>
              <h2 className="text-md font-medium text-gray-900">
                {video.title}
              </h2>
            </div>
          ))}
        </div>
      )}

    </main>
  );
}
