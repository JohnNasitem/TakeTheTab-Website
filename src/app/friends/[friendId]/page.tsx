"use client";

import { useState, useEffect } from "react";
import { FriendsApiService } from "@/components/server-api-serivces/friends-api-service"
import { useRouter, useParams  } from "next/navigation";
import { FetchUserFriendsResponse } from '@/interfaces/server-responses'

export default function FetchFriendPage() {
    const { fetchFriends } = FriendsApiService();
    const router = useRouter();
    const params = useParams();
    
    const [friends, setFriends] = useState<FetchUserFriendsResponse>();

    useEffect(() => {
        const getActivity = async () => {
            console.log("Fetching friend with id: ", params.friendId);
            const friendData = await fetchFriends();

            if (!friendData.actionSuccess) {
                alert(friendData.errorMessage);
                router.push("/friend");
                return;
            }

            setFriends(friendData);
        }
    
        getActivity();
        }, [fetchFriends, params.friendId, router]);

    return (
        <div className="pageSection p-3 grid grid-rows-[auto_1fr_1fr] md:grid-rows-[auto_1fr] grid-cols-1 md:grid-cols-2 gap-4">
            {friends?.friends![Number(params.friendId)][0]}
        </div>
    );
}