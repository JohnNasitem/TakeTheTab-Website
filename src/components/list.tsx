import { useRouter } from 'next/navigation';
import ListItem, { ItemProps } from "@/components/list-item"
import { PlusCircleIcon } from '@heroicons/react/24/outline'

interface ListProps {
    title: string,
    items: ItemProps[]
    addItemLink: string
    addItemText: string
    allowModify: boolean,
}

const List = (props: ListProps) => {
    const router = useRouter();
    
    return (
        <div className={`rounded-3xl bg-[var(--color-bg-accent)] p-5 grid gap-3 content-start h-full w-full`}>
            <span className="text-center text-3xl md:text-4xl">{props.title}</span>
            {props.items.map((item) => (
                <ListItem key={item.id} {...item} />
            ))}
            {
                props.allowModify &&
                <div className='w-full h-full flex justify-center'>
                    <button 
                    onClick={() => router.push(props.addItemLink)}
                    className="h-20 w-20 rounded-full text-[var(--color-good)] hover:text-[var(--color-good-accent)] text-center text-2xl md:text-3xl">
                    <PlusCircleIcon className="w-full h-full" fill="none"/>
                </button>
                </div>
            }
        </div>
    )
};

export default List;