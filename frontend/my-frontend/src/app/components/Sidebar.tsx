"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isCollapsed, toggleCollapse }: {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}) {
  const { logout } = useAuth();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white shadow-md border-r pt-0 transition-all 
        duration-300 flex flex-col ${isCollapsed ? "w-16" : "w-48"}`}>
      
      <div className="h-16 flex items-center justify-center px-2">
        <button onClick={toggleCollapse} className="text-xl hover:bg-gray-200 p-2 
        cursor-pointer rounded">
          ☰</button>
      </div>

        <div className="flex flex-col gap-4 p-4 text-sm">
            <Link href="/" className="hover:underline">
            {!isCollapsed && "🏠 Home"}
            </Link>
            
            <Link href="/likes" className="hover:underline">
                {!isCollapsed && "❤️ Liked videos"}
            </Link>

            <Link href="/login" onClick={logout} className="hover:underline">
                {!isCollapsed && "🚪 Logout"}
            </Link>
        </div>

    </aside>
  );
}
