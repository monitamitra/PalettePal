"use client";
import AuthForm from "../components/AuthForm";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter()

    const handleSignup = async (username: string, password: string) => {
        try{
            const res = await fetch("http://localhost:8080/auth/register", {
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