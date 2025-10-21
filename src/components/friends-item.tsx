import { FriendItemProps } from "@/interfaces/parameters"
import { FriendsApiService } from "@/components/server-api-serivces/friends-api-service"

const FriendItem = ({ userId, displayName, email, onRemove }: FriendItemProps) => {
    const { removeFriend } = FriendsApiService();

    const removeFriendClick = async () => {
        console.log("Remove friend with user id: " + userId);

        if (!window.confirm(`Are you sure you want to remove ${displayName} as a friend?`))
            return false;

        const data = await removeFriend(userId)

        if (!data.actionSuccess) {
            alert(data.errorMessage);
            return false;
        }

        return true;
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
            <button
                onClick={async () => {
                    if (await removeFriendClick())
                        onRemove();
                }}
                className="bg-[var(--color-bad)] rounded-lg p-2 md:pt-3 md:pb-3 md:pl-6 md:pr-6 hover:bg-[var(--color-bad-accent)] w-max justify-self-end m-3 aspect-square md:aspect-auto">
                <span className="inline md:hidden">X</span>
                <span className="hidden md:inline">Remove Friend</span>
            </button>
        </div>
    )
};
    
export default FriendItem;