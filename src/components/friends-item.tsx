import { FriendItemProps } from "@/interfaces/parameters"
import { FriendsApiService } from "@/components/server-api-serivces/friends-api-service"
import Link from 'next/link';

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
        <Link
            href={`friends/${userId}`}
            className="grid grid-cols-[1fr_auto] font-[family-name:var(--font-geist-mono)] rounded-3xl bg-[var(--color-bg-accent)] hover:bg-[var(--color-background)] p-4 md:p-5 text-2xl md:text-3xl w-full h-max">
            <div className='pr-4 h-full flex items-center grid grid-rows-2 md:grid-rows-1 md:grid-cols-[auto_auto_auto_1fr] gap-3'>
                <span className="truncate">{displayName}</span>
                <span className="hidden md:inline">|</span>
                <span className="truncate">{email}</span>
            </div>
            <button
                onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (await removeFriendClick())
                        onRemove();
                }}
                className="bg-[var(--color-bad)] rounded-lg p-2 md:p-3 hover:bg-[var(--color-bad-accent)] w-max justify-self-end aspect-square md:text-1xl">
                <span className="inline">&#x2A2F;</span>
            </button>
        </Link>
    )
};
    
export default FriendItem;