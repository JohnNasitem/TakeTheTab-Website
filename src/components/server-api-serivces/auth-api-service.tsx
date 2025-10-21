import { useCallback } from "react";
import { GenericResponse } from "@/interfaces/server-responses"
import { sendApiCall } from "@/components/server-api-serivces/api-util";

const serverPath = "https://localhost:7255/api/auth";

interface CreateUserType {
  displayName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

interface LogInUserType {
    email: string;
    password: string;
    browserId: string;
}

export const AuthApiService = () => {
    const refreshTokens = useCallback(async (): Promise<boolean> => {
        try {
            const data = await sendApiCall<GenericResponse>(`${serverPath}/refresh`, "POST")
            return data.actionSuccess;
        }
        catch {
            return false;
        }
    }, []);

    const createUser = async (createUserData: CreateUserType): Promise<GenericResponse> => {
        return await sendApiCall<GenericResponse>(`${serverPath}/register`, "POST", JSON.stringify({ 
            DisplayName: createUserData.displayName,
            Email: createUserData.email, 
            Password: createUserData.password,
            PhoneNumber: createUserData.phoneNumber,
        }));
    };

    const logInUser = async (logInUserData: LogInUserType): Promise<GenericResponse> => {
        return await sendApiCall<GenericResponse>(`${serverPath}/login`, "POST", JSON.stringify({ 
            Email: logInUserData.email, 
            Password: logInUserData.password, 
            BrowserId: logInUserData.browserId  
        }));
    }

    const logOutUser = async () => {
        await sendApiCall<GenericResponse>(`${serverPath}/logout`, "POST");
    };

    return { refreshTokens, createUser, logInUser, logOutUser }
}
