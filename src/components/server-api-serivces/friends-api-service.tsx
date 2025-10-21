import { useCallback } from "react";
import { sendApiCall } from "@/components/server-api-serivces/api-util";
import { GenericResponse, FetchUserFriendsResponse } from "@/interfaces/server-responses";

const serverPath = "https://localhost:7255/api/friends";

interface RespondToFriendRequestType {
    otherUserId: number;
    acceptedRequest: boolean;
}

export const FriendsApiService = () => {
    const fetchFriends = useCallback(async (): Promise<FetchUserFriendsResponse> => {
        return await sendApiCall<FetchUserFriendsResponse>(`${serverPath}`, "GET");
    }, []);

    const sendFriendRequest = useCallback(async (email: string): Promise<GenericResponse> => {
        return await sendApiCall<GenericResponse>(`${serverPath}`, "POST", JSON.stringify({ 
            OtherUserEmail: email
        }));
    }, []);

    const respondToFriendRequest = useCallback(async (respondToFriendRequestData: RespondToFriendRequestType) => {
        return await sendApiCall<GenericResponse>(`${serverPath}`, "PUT", JSON.stringify({ 
            OtherUserId: respondToFriendRequestData.otherUserId, 
            AcceptedRequest: respondToFriendRequestData.acceptedRequest
        }));
    }, []);

    const removeFriend = useCallback(async (friendUserId: number) => {
        return await sendApiCall<GenericResponse>(`${serverPath}/${friendUserId}`, "DELETE");
    }, []);

    return { fetchFriends, sendFriendRequest, respondToFriendRequest, removeFriend };
}