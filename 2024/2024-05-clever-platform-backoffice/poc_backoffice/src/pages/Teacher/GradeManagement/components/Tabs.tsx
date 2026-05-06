import { cn } from '@/utils/cn';

function Tabs({ items, currentIndex, onClick }: Readonly<{ items: string[]; currentIndex: number; onClick: (index: number) => void }>) {
    return (
        <div className="flex w-full bg-white border-b border-neutral-200 h-9">
            {items.map((text, index) => {
                return (
                    <button
                        onClick={() => onClick(index)}
                        key={text}
                        className={cn(
                            'py-[10px] px-[20px] min-w-[80px] text-center',
                            index === currentIndex && 'text-primary border-b border-primary',
                            index !== currentIndex && 'border-b border-transparent text-neutral-500'
                        )}
                    >
                        {text}
                    </button>
                );
            })}
        </div>
    );
}

export default Tabs;
