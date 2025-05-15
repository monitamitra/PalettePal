"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { useState } from "react";

export default function ClientLayout({children}: {children: React.ReactNode}) {
    const pathName = usePathname();
    const hideSidebar = pathName === "/login" || pathName === "/signup";
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
    <div className="h-screen w-full">
    {!hideSidebar && <header className={`fixed w-full top-0 h-16 flex items-center px-6 
        bg-white transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-48"}`}>
        <h1 className="text-2xl font-semibold">PalettePal</h1>
      </header>}
      
    {!hideSidebar && 
        <Sidebar isCollapsed={isCollapsed} 
        toggleCollapse={() => setIsCollapsed((prev) => !prev)}/>
    }
      
      <main
        className={`pt-16 p-6 transition-all duration-300 ${isCollapsed ? "ml-16" : 
            "ml-48"}`}>
        {children}
      </main>
    </div> 
  );
}