"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
    const {logout} = useAuth();
    const router = useRouter();

    return (
        <aside className="fixed top-0 left-0 h-screen w-48 bg-white shadow-md p-4 
            flex flex-col text-sm border-r justify-between">
            <div className="flex flex-col gap-6">
                <h1 className="text-xl font-semibold text-gray-800">PalettePal</h1>
                <nav className="flex flex-col gap-4">
                    <Link href="/" className="hover:text-black-600">🏠 Home</Link>
                    <Link href="/likes" className="hover:text-black-600">❤️ Liked Videos</Link>
                </nav>
                <button
                    onClick={logout}
                    className="text-red-500 hover:underline text-left">
                    🚪 Logout
                </button>

            </div>
            
        </aside>
    )

}