import Link from 'next/link';

export interface ItemProps {
    showTotal: boolean;
    name: string;
    id: number;
    clickLink: string;
    totalOwed?: number;
    totalOwing?: number;
    onRemove?: () => void;
    allowModify?: boolean;
}

const ListItem = (itemProps: ItemProps) => {
    return (
        <Link 
            href={itemProps.clickLink}  
            id='EventItem' 
            className="grid grid-cols-[70fr_30fr] font-[family-name:var(--font-geist-mono)] rounded-3xl bg-[var(--color-bg-alt-accent)] hover:bg-[var(--color-background)] p-4 md:p-5 text-2xl md:text-3xl w-full h-max">
            <div
                className='truncate pr-4 h-full flex items-center'>
                {itemProps.name}
            </div>
            {
                itemProps.showTotal &&
                <div
                    className='grid-cols-2 gap-2 md:gap-2 place-items-end md:text-3xl hidden md:grid'>
                    <span className='text-green-500'>${itemProps.totalOwed}</span>
                    <span className='text-red-500'>${itemProps.totalOwing}</span>
                </div>
            }
            {
                !itemProps.showTotal && itemProps.allowModify &&
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (itemProps.onRemove)
                            itemProps.onRemove();
                    }}
                    className="bg-[#F44336] rounded-lg p-2 md:p-3 hover:bg-[#C62828] w-max justify-self-end aspect-square md:text-1xl">
                    <span className="inline">&#x2A2F;</span>
                </button>
            }
        </Link>
    )
};
    
export default ListItem;