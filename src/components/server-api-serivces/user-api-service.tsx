import { useCallback } from "react";
import { sendApiCall } from "@/components/server-api-serivces/api-util";
import { FetchUserResponse, GenericResponse } from "@/interfaces/server-responses";

const serverPath = "https://localhost:7255/api/user";

interface EditUserProfileType {
    displayName: string;
    email: string;
}

interface EditUserPasswordType {
    oldPassword: string;
    newPassword: string;
}

export const UserApiService = () => {
    const fetchUser = useCallback(async (): Promise<FetchUserResponse> => {
        return await sendApiCall<FetchUserResponse>(`${serverPath}`, "GET");
    }, []);

    const editUserProfile = async (editProfileData: EditUserProfileType): Promise<GenericResponse> => {
        return await sendApiCall<GenericResponse>(`${serverPath}`, "PUT", JSON.stringify({ 
            DisplayName: editProfileData.displayName, 
            Email: editProfileData.email, 
        }));
    }
    
    const editUserPassword = async (editPasswordData: EditUserPasswordType): Promise<GenericResponse> => {
        return await sendApiCall<GenericResponse>(`${serverPath}/password`, "PUT", JSON.stringify({ 
            OldPassword: editPasswordData.oldPassword, 
            NewPassword: editPasswordData.newPassword, 
        }));
    }

    return { fetchUser, editUserProfile, editUserPassword };
}