"use client";
import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const { login } = useAuth();


  return (
        <AuthForm
            title="Login"
            buttonLabel="Login"
            onSubmit={login}
            alternateLink="/signup"
            alternateLabel="Sign up"
            />
          );
}
