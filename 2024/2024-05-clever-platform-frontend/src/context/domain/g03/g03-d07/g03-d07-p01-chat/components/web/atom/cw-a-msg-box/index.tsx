import { cn } from '@global/helper/cn';
import { HTMLAttributes } from 'react';

type MsgBoxProps = HTMLAttributes<HTMLDivElement> & {
  isLoggedUser?: boolean;
};
const MsgBox = ({ className, content, isLoggedUser }: MsgBoxProps) => {
  return (
    <div className={cn(" bg-black !bg-opacity-10  px-4 py-2 break-words w-fit max-w-[45%]", isLoggedUser ? 'rounded-l-md rounded-tr-md' : 'rounded-r-md rounded-tl-md', className)}>
      <p className="text-sm">{content}</p>
    </div>
    // <div
    //   className={cn(
    //     'w-fit rounded-r-md rounded-tl-md bg-black !bg-opacity-10 rounded-l-md rounded-br-none rounded-tr-md max-w-[45%] break-words whitespace-pre-wrap',
    //     className,
    //   )}
    // >
    //   <div className="p-2">
    //     {content}
    //   </div>
    // </div>
  );
};

export default MsgBox;
