"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
    setHasMounted(true);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch("https://my-backend-late-star-5731.fly.dev/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      setToken(data.token);
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid username or password.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!hasMounted) return null;

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
