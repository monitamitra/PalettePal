"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";

export default function LoginPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

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
