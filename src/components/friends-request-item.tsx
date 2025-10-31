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
        <div
            className="grid grid-cols-[1fr_auto] font-[family-name:var(--font-geist-mono)] rounded-3xl bg-[var(--color-bg-alt-accent)] hover:bg-[var(--color-bg-accent)] p-4 md:p-5 text-2xl md:text-3xl w-full h-max">
            <div className='pr-4 h-full flex items-center grid grid-rows-2 md:grid-rows-1 md:grid-cols-[auto_auto_auto_1fr] gap-3'>
                <span className="truncate">{displayName}</span>
                <span className="hidden md:inline">|</span>
                <span className="truncate">{email}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => {
                        respondToRequest(true);
                        onAccept();
                    }}
                    className="bg-[var(--color-good)] rounded-lg p-2 md:p-3 hover:bg-[var(--color-good-accent)] w-max justify-self-end aspect-square md:text-1xl">
                    <span>✔</span>
                </button>
                <button
                    onClick={() => {
                        respondToRequest(false);
                        onRemove();
                    }}
                    className="bg-[var(--color-bad)] rounded-lg p-2 md:p-3 hover:bg-[var(--color-bad-accent)] w-max justify-self-end aspect-square md:text-1xl">
                    <span>✖</span>
                </button>
            </div>
        </div>
    )
};
    
export default FriendRequestItem;