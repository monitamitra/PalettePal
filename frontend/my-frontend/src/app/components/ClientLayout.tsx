"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function ClientLayout({children}: {children: React.ReactNode}) {
    const pathName = usePathname();
    const hideSidebar = pathName === "/login" || pathName === "/signup";

    return (
        <div className="flex">
            {!hideSidebar && <Sidebar></Sidebar>}
            <main className={hideSidebar ? "w-full" : "ml-48 w-full p-6"}>
                {children}
            </main>
        </div>
    )
}