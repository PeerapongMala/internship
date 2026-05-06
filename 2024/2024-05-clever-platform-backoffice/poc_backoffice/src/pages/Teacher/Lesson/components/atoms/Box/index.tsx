import { cn } from "@/utils/cn";

const Box = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div
            className={cn(
                "bg-white shadow-md p-5 rounded-md w-full",
                className
            )}
        >
            {children}
        </div>
    );
};

export default Box;
