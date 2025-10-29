"use client"

import { useState, useEffect, useRef } from "react";
import { UserApiService } from "@/components/server-api-serivces/user-api-service"
import { AuthApiService } from "@/components/server-api-serivces/auth-api-service"
import { useRouter } from 'next/navigation';
function ChangePassword() {
    // Send api request to change password
    console.log("Password changed");
}

export default function AccountPage() {
    const { fetchUser, editUserProfile, editUserPassword } = UserApiService();
    const { logOutUser } = AuthApiService();
    const router = useRouter();
    
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [oldDisplayName, setOldDisplayName] = useState("");
    const [oldEmail, setOldEmail] = useState("");

    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [canChangePassword, setCanChangePassword] = useState(false);

    const oldPasswordRef = useRef<HTMLInputElement>(null);
    const newPasswordRef = useRef<HTMLInputElement>(null);
    const confirmNewPasswordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const getData = async () => {
          const userData = await fetchUser();
    
          if (!userData.actionSuccess) {
            setDisplayName("Server error!");
            setEmail("Server error!");
            return;
          }

          const displayName = userData.userDisplayName as string;
          const email = userData.userEmail as string;
    
          setDisplayName(displayName);
          setEmail(email);
          setOldDisplayName(displayName);
          setOldEmail(email);
        }
    
        getData();
    }, [fetchUser]);

    async function logOut() {
        await logOutUser();
        router.push('/login');
    }

    function ValidateNewPassword() {
        let areAllFieldsPopulated = true;
        let areNewPasswordsTheSame = true;

        const arePasswordsDifferent = oldPasswordRef.current?.value !== newPasswordRef.current?.value;
        
        // Check if any field is empty and add a red border if it is

        if (oldPasswordRef.current?.value === "")
            areAllFieldsPopulated = false;
        else if (newPasswordRef.current?.value === "")
            areAllFieldsPopulated = false;
        else if (confirmNewPasswordRef.current?.value === "")
            areAllFieldsPopulated = false;

        // Make sure the new password and confirm password fields match
        if (newPasswordRef.current?.value !== confirmNewPasswordRef.current?.value) {
            newPasswordRef.current?.classList.add("border-red-500");
            confirmNewPasswordRef.current?.classList.add("border-red-500");
            areNewPasswordsTheSame = false;
        } else {
            newPasswordRef.current?.classList.remove("border-red-500");
            confirmNewPasswordRef.current?.classList.remove("border-red-500");
        }

        setCanChangePassword(areAllFieldsPopulated && areNewPasswordsTheSame && arePasswordsDifferent);
        setShowErrorMessage(!areAllFieldsPopulated || !areNewPasswordsTheSame || !arePasswordsDifferent);

        if (!areAllFieldsPopulated)
            setErrorMessage("All fields must be populated!");
        else if (!areNewPasswordsTheSame)
            setErrorMessage("New passwords must match!");
        else if (!arePasswordsDifferent)
            setErrorMessage("Old and new passwords cannot be the same!");
        else
            setErrorMessage("");
    }

    const EditProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevent full page reload

        // Dont send request if nothing changed
        if (displayName == oldDisplayName && email == oldEmail)
            return;

        const data = await editUserProfile({
            displayName: displayName,
            email: email
        });
        
        if (data.actionSuccess) {
            setOldDisplayName(displayName);
            setOldEmail(email);
        }
        // Revert changes if not successful
        else {
            setEmail(oldEmail);
            setDisplayName(oldDisplayName)
        }
    }

    const editPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevent full page reload
        const formData = new FormData(e.currentTarget);

        const password = formData.get("new-password") as string;
        const oldPassword = formData.get("old-password") as string;
        console.log("old password:" + oldPassword);
        console.log("new password:" + password);
        
        const data = (await editUserPassword({
            oldPassword: oldPassword,
            newPassword: password
        }));

        if (data.actionSuccess) {
            setShowErrorMessage(false);
            setErrorMessage("");
            if (oldPasswordRef.current) oldPasswordRef.current.value = "";
            if (newPasswordRef.current) newPasswordRef.current.value = "";
            if (confirmNewPasswordRef.current) confirmNewPasswordRef.current.value = "";
            alert("Password changed successfully!");
        }
        else{
            setShowErrorMessage(true);
            setErrorMessage(data.errorMessage as string);
        }
    }


    return (
        <div className="pageSection grid grid-rows-[repeat(2,_auto)_1fr] gap-3 p-3">
            <form onSubmit={EditProfile} id="AccountProfile" className="grid grid-cols-1 md:grid-cols-[max-content_1fr] h-max bg-[var(--color-bg-accent)] rounded-3xl p-3 text-1xl md:text-2xl gap-3">
                <div className="text-center text-3xl md:text-4xl font-bold md:col-span-2"> Profile </div>

                <label 
                    htmlFor="profile-display-name"
                    className="flex md:items-center">Display Name:</label>
                <input 
                    id="profile-display-name" 
                    name="display-name"
                    type="text" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={!isEditing} 
                    className={`${isEditing ? "text-[var(--color-foreground)]" : "text-[var(--color-disabled-foreground)]"} bg-[var(--color-bg-alt-accent)] rounded-lg p-3 w-full`}/>
                
                <label 
                    htmlFor="profile-email"
                    className="flex md:items-center">Email:</label>
                <input 
                    id="profile-email" 
                    name="username"
                    type="text" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing} 
                    className={`${isEditing ? "text-[var(--color-foreground)]" : "text-[var(--color-disabled-foreground)]"} bg-[var(--color-bg-alt-accent)] rounded-lg p-3 w-full`}/>

                <button
                    onClick={() => setIsEditing(!isEditing)}
                    type={isEditing ? "button" : "submit"}
                    className="bg-[var(--color-bg-alt-accent)] rounded-lg pt-3 pb-3 pl-6 pr-6 hover:bg-[var(--color-background)] md:col-2 w-max justify-self-end">
                    {isEditing ? "Save" : "Edit"}
                </button>
            </form>

            <form onSubmit={editPassword} id="AccountPassword" className="grid grid-col-1 md:grid-cols-[max-content_1fr] h-max bg-[var(--color-bg-accent)] rounded-3xl p-3 text-1xl md:text-2xl gap-3">
                <div className="text-center text-3xl md:text-4xl font-bold md:col-span-2"> Password </div>

                {/* Hidden username field for password managers */}
                <input 
                    id="hiddenUsername" 
                    type="text" 
                    autoComplete="username"
                    hidden/>

                <label 
                    htmlFor="account-old-password" 
                    className="flex md:items-center">Old Password: </label>
                <input 
                    ref={oldPasswordRef}
                    id="account-old-password"
                    name="old-password"
                    onChange={ValidateNewPassword} 
                    type="password" 
                    autoComplete="current-password"
                    className={`bg-[var(--color-bg-alt-accent)] rounded-lg p-3 border w-full`}/>

                <label 
                    htmlFor="account-new-password" 
                    className="flex md:items-center">New Password: </label>
                <input 
                    ref={newPasswordRef}
                    id="account-new-password" 
                    name="new-password"
                    onChange={ValidateNewPassword} 
                    type="password" 
                    autoComplete="new-password"
                    className={`bg-[var(--color-bg-alt-accent)] rounded-lg p-3 border w-full`}/>

                <label 
                    htmlFor="account-confirm-new-password" 
                    className="flex md:items-center">Confirm New Password: </label>
                <input 
                    ref={confirmNewPasswordRef}
                    id="account-confirm-new-password" 
                    name="confirm-new-password"
                    onChange={ValidateNewPassword} 
                    type="password" 
                    autoComplete="new-password"
                    className={`bg-[var(--color-bg-alt-accent)] rounded-lg p-3 border w-full`}/>

                <div
                    className="grid grid-cols-[1fr_max-content] md:col-span-2">
                    {showErrorMessage && 
                        <div className="text-red-500 text-center align-middle">
                            {errorMessage}
                        </div>
                    }

                    <button 
                        onClick={ChangePassword} 
                        disabled={!canChangePassword} 
                        className={`${canChangePassword ? "text-[var(--color-foreground)] hover:bg-[var(--color-background)]" : "text-[var(--color-disabled-foreground)]"} bg-[var(--color-bg-alt-accent)] rounded-lg p-3 md:col-2 w-max justify-self-end`}>
                        Change Password
                    </button>
                </div>
            </form>

            <div
                className="grid grid-col-1 md:grid-cols-[max-content_1fr] h-max rounded-3xl p-3 text-1xl md:text-2xl gap-3">
                <button 
                    onClick={logOut} 
                    className="bg-[#F44336] rounded-lg pt-3 pb-3 pl-6 pr-6 hover:bg-[#C62828] md:col-2 w-max justify-self-end">
                    Log out
                </button>
            </div>
        </div>
    );
}