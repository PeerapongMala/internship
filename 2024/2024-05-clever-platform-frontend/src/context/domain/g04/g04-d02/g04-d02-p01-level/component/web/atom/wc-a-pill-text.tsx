import { cn } from '@global/helper/cn';

export default function WCAPillText({
  text,
  className = '',
  variant = 'easy',
}: {
  text: string;
  className?: string;
  variant?: 'easy' | 'medium' | 'hard' | (string & {});
}) {
  return (
    <span
      className={cn(
        `inline-flex items-center justify-center rounded-full px-3 w-fit h-fit shadow-sm`,
        variant === 'easy' && `bg-gradient-to-b from-[#FFFFFF66] to-[#04DD06]`,
        variant === 'medium' && `bg-gradient-to-b from-[#FFFFFF66] to-[#FF7C0D]`,
        variant === 'hard' && `bg-gradient-to-b from-[#FFFFFF66] to-[#CC0000]`,
        `border-2 border-white border-solid`,
        `text-lg font-bold`,
        `text-center`,
        className,
      )}
    >
      {text}
    </span>
  );
}
