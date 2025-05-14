"use client";
import requireAuth from "./components/requireAuth";
import { Search, X } from "lucide-react";
import { useState } from "react";

export default function Home() {
  requireAuth();

  const [query, setQuery] = useState("");

  return (
        <form className="px-6 py-5">
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
  );
}
