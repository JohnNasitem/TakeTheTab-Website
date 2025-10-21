"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthApiService } from "@/components/server-api-serivces/auth-api-service"
import { useRouter } from "next/navigation";

export default function LogInPage() {
    const router = useRouter();
    const { logInUser } = AuthApiService();

    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevent full page reload

        const formData = new FormData(e.currentTarget);

        // Try to get existing ID
        let browserId = localStorage.getItem("browserId");
        // If none exists, generate one
        if (!browserId) {       
            browserId = crypto.randomUUID();
            localStorage.setItem("browserId", browserId);
        }

        console.log("username:" + formData.get("username"));
        console.log("password:" + formData.get("password"));
        console.log("browser id:" + browserId);

        const data = await logInUser({
            email: formData.get("username") as string,
            password: formData.get("password") as string,
            browserId: browserId
        });

        console.log(data);

        if (data.actionSuccess) {
            // Send to main page
            router.push("/");
        }
        else {
            setShowErrorMessage(true);
            setErrorMessage(data.errorMessage!)
        }
    };

    return (
        <div className="pageSection flex text-1xl md:text-2xl">
            <form onSubmit={handleLogin} className="self-center grid grid-rows-[repeat(7,_auto)] back bg-[var(--color-bg-accent)] place-items-center rounded-lg p-10 mx-auto w-max h-max gap-3 md:gap-6">
                <h1 className="text-3xl md:text-4xl">Log In</h1>
                <div>
                    <label htmlFor="login-username">Email</label><br/>
                    <input type="email" id="login-username" name="username" autoComplete="username" required className="p-3 bg-[var(--color-bg-alt-accent)] rounded-lg"/>
                </div>
                <div>
                    <label htmlFor="password">Password</label><br/>
                    <input type="password" id="login-password" name="password" autoComplete="current-password" required className="p-3 bg-[var(--color-bg-alt-accent)] rounded-lg"/>
                </div>
                <button className="bg-[#F5F5F5] rounded-lg p-3 container text-[var(--color-background)] hover:bg-[#E0E0E0]">Log in</button>
                <Link href="/signup" className="text-blue-500 hover:text-blue-700">Sign up</Link>
                <Link href="/signup" className="text-blue-500 hover:text-blue-700">Forgot password</Link>
                {showErrorMessage && 
                    <div className="text-red-500">
                        {errorMessage}
                    </div>
                }
            </form>
        </div>
    );
}