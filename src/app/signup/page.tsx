"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthApiService } from "@/components/server-api-serivces/auth-api-service"

export default function SignUpPage() {
    const router = useRouter();
    const { createUser } = AuthApiService();
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevent full page reload

        const formData = new FormData(e.currentTarget);

        console.log("username:" + formData.get("username"));
        console.log("password:" + formData.get("password"));
        console.log("confirm-password:" + formData.get("confirm-password"));
        console.log("phone-number:" + formData.get("phone-number"));

        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirm-password") as string;

        if (password != confirmPassword) {
            setShowErrorMessage(true);
            setErrorMessage("Passwords do not match!");
            return;
        }
        else
            setShowErrorMessage(false);

        const data = await createUser({
            displayName: formData.get("display-name") as string,
            email: formData.get("username") as string,
            password: password,
            phoneNumber: formData.get("phone-number") as string | undefined
        });

        if (data.actionSuccess) {
            alert("Account created! Please log in.");
            router.push("/login");
        }
        else {
            setShowErrorMessage(true);
            setErrorMessage(data.errorMessage!);
        }
    };

    return (
        <div className="pageSection flex text-1xl md:text-2xl">
            <form onSubmit={handleSignup} className=" self-center grid grid-rows-[repeat(8,_auto)] back bg-[var(--color-bg-accent)] place-items-center rounded-lg p-10 mx-auto w-max h-max gap-3 md:gap-6">
                <h1 className="text-3xl md:text-4xl">Sign up</h1>
                <div>
                    <label htmlFor="signup-display-name">Display Name</label><br/>
                    <input type="text" id="signup-display-name" name="display-name" required className="p-3 bg-[var(--color-bg-alt-accent)] rounded-lg"/>
                </div>
                <div>
                    <label htmlFor="signup-username">Email</label><br/>
                    <input type="email" id="signup-username" name="username" autoComplete="username" required className="p-3 bg-[var(--color-bg-alt-accent)] rounded-lg"/>
                </div>
                <div>
                    <label htmlFor="signup-password">Password</label><br/>
                    <input type="password" id="signup-password" name="password" autoComplete="current-password" required className="p-3 bg-[var(--color-bg-alt-accent)] rounded-lg"/>
                </div>
                <div>
                    <label htmlFor="signup-confirm-password">Confirm Password</label><br/>
                    <input type="password" id="signup-confirm-password" name="confirm-password" autoComplete="current-password" required className="p-3 bg-[var(--color-bg-alt-accent)] rounded-lg"/>
                </div>
                <div>
                    <label htmlFor="signup-phone-number">Phone Number</label><br/>
                    <input type="text" id="signup-phone-number" name="phone-number" placeholder="Optional" className="p-3 bg-[var(--color-bg-alt-accent)] rounded-lg"/>
                </div>
                <button className="bg-[#F5F5F5] rounded-lg p-3 container text-[var(--color-background)] hover:bg-[#E0E0E0]">Sign up</button>
                <Link href="/login" className="text-blue-500 hover:text-blue-700">Log In</Link>
                {showErrorMessage && 
                    <div className="text-red-500">
                        {errorMessage}
                    </div>
                }
            </form>
        </div>
    );
}