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
        <div className='h-full min-h-0 rounded-3xl bg-[var(--color-bg-accent)]'>
            <div className="p-5 grid gap-3 content-start auto-rows-auto h-full min-h-0">
                <span className="text-center text-3xl md:text-4xl">{props.title}</span>
                <div className='flex min-h-0 h-full w-full flex-col'>
                    <div className="flex-1 overflow-y-auto scrollbar-custom rounded-3xl">
                        <div className='grid gap-3 rounded-3xl bg-[var(--color-background)] p-3 ml-1 mr-1'>
                            {props.items.map((item) => (
                                <ListItem key={item.id} {...item} />
                            ))}
                        </div>
                    </div>
                </div>
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
        </div>
    )
};

export default List;