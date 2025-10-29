"use client"

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FriendsApiService } from "@/components/server-api-serivces/friends-api-service"
import FriendItem from "@/components/friends-item"
import FriendRequestItem from "@/components/friends-request-item"
import { FriendItemProps } from "@/interfaces/parameters"

export default function FriendPage() {
    const { fetchFriends, sendFriendRequest } = FriendsApiService();

    const [errorOccured, setErrorOccured] = useState(false);
    const [hasFriends, setHasFreinds] = useState(true);
    const [showSearchStatus, setShowSearchStatus] = useState(true);
    const [setSearchStatus, setSetSearchStatus] = useState("");
    const [setSearchStatusColor, setSetSearchStatusColor] = useState("");
    const [friendItemProps, setfriendItemProps] = useState<FriendItemProps[]>([]);
    const [friendRequestItemProps, setfriendRequestItemProps] = useState<FriendItemProps[]>([]);

    const handleRemoveFriend = useCallback(async (userId: number) => {
        setfriendItemProps(prev => {
            const updated = prev.filter(f => f.userId !== userId);
            setHasFreinds(updated.length > 0);
            return updated;
        });
    }, []);

    const removeUserFromFriendRequest = useCallback((userId: number) => {
        setfriendRequestItemProps(prev => prev.filter(f => f.userId !== userId));
    }, []);

    const handleAcceptFriendRequest = useCallback((request: FriendItemProps) => {
        removeUserFromFriendRequest(request.userId);

        // Add to friends
        setfriendItemProps(prev => prev.concat({
            userId: request.userId,
            displayName: request.displayName,
            email: request.email,
            onAccept() {},
            onRemove() { handleRemoveFriend(request.userId); }
        }));

        setHasFreinds(true);
    }, [removeUserFromFriendRequest, handleRemoveFriend]);

    const handleDeclineToFriendRequest = useCallback((userId: number) => {
        removeUserFromFriendRequest(userId);
    }, [removeUserFromFriendRequest]);

    useEffect(() => {
        const getFriends = async () => {
            const userFriendsData = await fetchFriends()

            if (!userFriendsData.actionSuccess) {
                setErrorOccured(true);
                return;
            }

            const friends = userFriendsData.friends as Record<number, [string, string]>;
            const friendReqs = userFriendsData.incommingFriendRequests as Record<number, [string, string]>

            setErrorOccured(false);
            setHasFreinds(Object.keys(friends).length > 0);

            setfriendItemProps(Object.entries(friends).map(
                ([id, [displayName, email]]) => ({
                    userId: Number(id),
                    displayName,
                    email,
                    onAccept() {},
                    onRemove() {handleRemoveFriend(Number(id))}
                })
            ));
            setfriendRequestItemProps(Object.entries(friendReqs).map(
                ([id, [displayName, email]]) => ({
                    userId: Number(id),
                    displayName,
                    email,
                    onAccept() {handleAcceptFriendRequest({
                        userId: Number(id), 
                        displayName, 
                        email, 
                        onAccept() {},
                        onRemove() {handleRemoveFriend(Number(id))}})},
                    onRemove() {handleDeclineToFriendRequest(Number(id))}
                })
            ));
        }

        getFriends();
    }, [fetchFriends, handleAcceptFriendRequest, handleRemoveFriend, handleDeclineToFriendRequest]);

    const AddFriend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevent full page reload
        const formData = new FormData(e.currentTarget);
        const emailToAdd = (formData.get('friends-email') as string).toLowerCase();

        const data = await sendFriendRequest(emailToAdd)

        setShowSearchStatus(true);

        if (!data.actionSuccess) {
            setSetSearchStatus(data.errorMessage as string);
            setSetSearchStatusColor("red");
            return;
        }

        setSetSearchStatusColor("green");

        if (data.errorMessage === "Sent Friend Request") {
            setSetSearchStatus("Successfully sent friend request");
        }
        else {
            setSetSearchStatus("Accepted incoming friend request!");
            handleAcceptFriendRequest(friendRequestItemProps.filter(f => f.email.toLowerCase() == emailToAdd)[0])
        }
    }


    return (
        <div className="pageSection p-3 grid grid-rows-[auto_auto_auto_1fr] gap-4">
            <form 
                onSubmit={AddFriend}
                id="friend-search" 
                className="grid grid-cols-[1fr_auto] bg-[var(--color-bg-accent)] rounded-3xl p-4">
                <h1 className="text-center text-3xl md:text-4xl font-bold col-span-2"> Your Friends </h1>
                <input
                    type="email"
                    id='friend-search-bar'
                    name="friends-email"
                    placeholder="Friend's Email"
                    className="m-1 border-2 focus:border-3 focus:outline-none focus:ring-0 rounded-lg p-1"/>
                <button
                    className="text-[var(--color-foreground)] hover:bg-[var(--color-background)] bg-[var(--color-bg-alt-accent)] rounded-lg p-3 w-max">
                    Add Friend
                </button>
                <div>
                {showSearchStatus &&
                        <div
                            className={`text-${setSearchStatusColor}-500 col-span-2`}>
                                {setSearchStatus}
                        </div>
                    }
                </div>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                <div
                    id="incoming-friend-requests-list" 
                    className={`rounded-3xl bg-[var(--color-bg-alt-accent)] p-5 grid gap-3 content-start h-full w-full`}>
                    <div className="text-center text-3xl md:text-4xl font-bold m-3"> Friend Requests </div>
                    {friendRequestItemProps.map(friendProp => (
                        <FriendRequestItem
                            key={friendProp.userId}
                            userId={friendProp.userId}
                            displayName={friendProp.displayName}
                            email={friendProp.email}
                            onAccept={friendProp.onAccept}
                            onRemove={friendProp.onRemove}
                        />
                    ))}
                </div>
                <div 
                    id="friend-list" 
                    className={`rounded-3xl bg-[var(--color-bg-alt-accent)] p-5 grid gap-3 content-start h-full w-full`}>
                    <div className="text-center text-3xl md:text-4xl font-bold m-3"> Friends </div>
                    {
                    errorOccured ?
                    <div className="text-[var(--color-bad)] flex h-full items-center justify-center">
                        Server error occured!
                    </div>
                    :
                    (
                        hasFriends ? 
                        <div>
                            {friendItemProps.map(friendProp => (
                                <FriendItem
                                    key={friendProp.userId}
                                    userId={friendProp.userId}
                                    displayName={friendProp.displayName}
                                    email={friendProp.email}
                                    onAccept={friendProp.onAccept}
                                    onRemove={friendProp.onRemove}
                                />
                            ))}
                        </div>
                        :
                        <div className="flex h-full items-center justify-center">
                            <Image
                                className="hidden md:inline"
                                src="/NoFriendsMeme.jpg"
                                alt="No Friends?"
                                sizes="500"
                                width={500}
                                height={300}
                            />
                        </div>
                    )
                    }
                </div>
            </div>
        </div>
    );
}