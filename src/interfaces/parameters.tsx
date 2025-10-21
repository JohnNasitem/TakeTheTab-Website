export interface FriendItemProps {
    userId: number;
    displayName: string;
    email: string;
    onAccept: () => void;
    onRemove: () => void;
}

export interface ActivityItem {
    itemId?: number;
    itemName: string;
    itemCost: number;
    isSplitTypeEvenly: boolean;
    payers: Record<number, number>;
}