"use client";
import { useState } from "react";
import Link from "next/link";

export default function AuthForm({
    title, 
    buttonLabel, 
    onSubmit, 
    alternateLink, 
    alternateLabel

}:{
    title: string;
    buttonLabel: string;
    onSubmit: (username: string, password: string) => Promise<void>;
    alternateLink: string; 
    alternateLabel: string;
}) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(username, password);
        setLoading(false);
    };

    
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-cover 
        bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/background.jpg')" }}>
            
            <form className="bg-white rounded-2xl shadow-x2 px-12 py-15" 
                onSubmit = {handleSubmit}>
                <h1 className="font-bold text-2xl text-center p-5px mb-8">{title}</h1>
                
                <input className="w-full px-3 py-2 block border border-gray-300 
                bg-gray-100 rounded-lg mb-5" 
                placeholder="Username"
                type = "username" value = {username}
                onChange = {(e) => setUsername(e.target.value)}
                required>  
                </input>

                <input className="w-full px-3 py-2 block border border-gray-300 
                bg-gray-100 rounded-lg mb-10" type = "password" 
                placeholder="Password"
                value = {password}
                onChange = {(e) => setPassword(e.target.value)}
                required>
                </input>

                <button className="border text-white font-medium text-center mb-5 
                    px-8 py-1.5 mx-auto rounded-lg block" 
                    style={{backgroundColor: "#FF92A5"}} 
                    type = "submit" disabled = {loading}>
                    {loading ? "Loading" : buttonLabel}
                </button>

                <p>
                    {title == "Login" ? "Don't have an account? " : 
                    "Already have an account? "}
                    <Link href={alternateLink}
                    className="font-bold hover:underline"
                    style={{ color: "#FF92A5"}}
                    >
                        {alternateLabel}
                    </Link>
                </p>

            </form>
        </div>
    );

}