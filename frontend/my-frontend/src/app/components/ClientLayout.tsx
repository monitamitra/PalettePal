"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const hideSidebar = pathName === "/login" || pathName === "/signup";
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">

      <header className="fixed w-full top-0 h-16 flex items-center px-6 bg-white z-30 
        border-b">
        {!hideSidebar && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="mr-4 text-xl focus:outline-none cursor-pointer"
            aria-label="Open sidebar"
          >
            ☰
          </button>
        )}
        <h1 className="text-2xl font-semibold">PalettePal</h1>
      </header>

      {!hideSidebar && !isCollapsed && (
        <>
          <div
            className="fixed inset-0 bg-opacity-10 backdrop-blur-sm z-30"
            onClick={() => setIsCollapsed(true)}
          />
          <div className="fixed top-0 left-0 h-full bg-white z-50 shadow-lg">
            <Sidebar
              isCollapsed={false}
              toggleCollapse={() => setIsCollapsed(true)}
            />
          </div>
        </>
      )}

      <main className="pt-16 relative z-10">
        {children}
      </main>
    </div>
  );
}
