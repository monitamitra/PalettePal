import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"], // Choose weights you use
  variable: "--font-poppins", // For custom font family variable
});

export const metadata: Metadata = {
  title: "PalettePal",
  description: "Find the right painting tutorial for your mood & skill level", 
  icons: {
    icon: "/Artist-Palette-3d-icon.png"
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
