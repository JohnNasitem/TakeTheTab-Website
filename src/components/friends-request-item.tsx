import { FriendItemProps } from "@/interfaces/parameters"
import { FriendsApiService } from "@/components/server-api-serivces/friends-api-service"

const FriendRequestItem = ({ userId, displayName, email, onAccept, onRemove  }: FriendItemProps) => {
    const { respondToFriendRequest } = FriendsApiService();

    const respondToRequest = async (accepted: boolean) => {
        const data = await respondToFriendRequest({
            otherUserId: userId,
            acceptedRequest: accepted
        });

        if (!data.actionSuccess) {
            alert(data.errorMessage);
            return;
        }
    }

    return (
        <div id={`friend-item-${userId}`} 
            className="grid grid-cols-[1fr_auto] bg-[var(--color-bg-accent)] rounded-lg m-3">
            <div className="flex flex-wrap items-center p-3">
                <span className="truncate md:truncate">{displayName}</span>
                <span className="md:px-5 px-1 hidden md:inline">|</span>
                <span className="w-full md:hidden"></span> {/* acts like a line break on mobile */}
                <span className="truncate md:truncate">{email}</span>
            </div>
            <div className="grid grid-cols-2">
                <button
                    onClick={() => {
                        respondToRequest(true);
                        onAccept();
                    }}
                    className="bg-[#4CAF50] rounded-lg p-0 md:pt-3 md:pb-3 md:pl-6 md:pr-6 hover:bg-[#2E7D32] w-max justify-self-end m-3 aspect-square md:aspect-auto">
                    <span className="inline md:hidden">✔</span>
                    <span className="hidden md:inline">Accept</span>
                </button>
                <button
                    onClick={() => {
                        respondToRequest(false);
                        onRemove();
                    }}
                    className="bg-[#F44336] rounded-lg p-0 md:pt-3 md:pb-3 md:pl-6 md:pr-6 hover:bg-[#C62828] w-max justify-self-end mt-3 mr-3 mb-3 aspect-square md:aspect-auto">
                    <span className="inline md:hidden">✖</span>
                    <span className="hidden md:inline">Decline</span>
                </button>
            </div>
        </div>
    )
};
    
export default FriendRequestItem;