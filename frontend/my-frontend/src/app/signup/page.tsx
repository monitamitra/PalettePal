"use client";
import AuthForm from "../components/AuthForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignupPage() {
    const router = useRouter();
    const SPRINGBOOT_URL = process.env.NEXT_PUBLIC_SPRINGBOOT_URL;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
        router.push("/");
        }
    }, [router]);

    const handleSignup = async (username: string, password: string) => {
        try{
            const res = await fetch(`${SPRINGBOOT_URL}/auth/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"}, 
                body: JSON.stringify({username, password})
            })

            if (!res.ok) {
                const msg = await res.text()
                alert(msg || "Signup failed")
                return
            }

            alert("Signup successful! You can now log in.");
            router.push("/login");

        } catch(err) {
            console.error("Signup error:", err);
            if (err instanceof Error) {
                alert(err.message); // show actual error message
            } else {
                alert("Unknown error occurred.");
            }alert("Something went wrong. Please try again.");
        }
    }

    return (
        <AuthForm title="Sign Up" buttonLabel="Create Account" onSubmit={handleSignup} 
            alternateLink="/login" alternateLabel="Login"
        />
    )
}