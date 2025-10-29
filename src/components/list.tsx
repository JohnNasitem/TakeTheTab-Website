import { useRouter } from 'next/navigation';
import ListItem, { ItemProps } from "@/components/list-item"

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
        <div className={`font-[family-name:var(--font-geist-mono)] rounded-3xl bg-[var(--color-bg-accent)] p-5 grid gap-3 content-start h-full w-full`}>
            <span className="text-center text-3xl md:text-4xl">{props.title}</span>
            {
                props.allowModify &&
                <button 
                    onClick={() => router.push(props.addItemLink)}
                    className="font-[family-name:var(--font-geist-mono)] rounded-3xl bg-[var(--color-good)] hover:bg-[var(--color-good-accent)] p-4 md:p-5 text-center text-2xl md:text-3xl w-full h-max">
                    {props.addItemText}
                </button>
            }
            {props.items.map((item) => (
                <ListItem key={item.id} {...item} />
            ))}
        </div>
    )
};

export default List;