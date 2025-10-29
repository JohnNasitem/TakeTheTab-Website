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
            className="grid grid-cols-[70fr_30fr] font-[family-name:var(--font-geist-mono)] rounded-3xl bg-[var(--color-bg-accent)] hover:bg-[var(--color-background)] p-4 md:p-5 text-2xl md:text-3xl w-full h-max">
            <div className="flex flex-wrap items-center">
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
                className="bg-[var(--color-bad)] rounded-lg p-2 md:p-3 hover:bg-[var(--color-bad-accent)] w-max justify-self-end aspect-square md:text-1xl">
                <span className="inline">&#x2A2F;</span>
            </button>
        </div>
    )
};
    
export default FriendItem;