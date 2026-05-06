import { cn } from '@global/helper/cn';
import { HTMLAttributes } from 'react';

type LineProps = HTMLAttributes<HTMLDivElement> & {};

const Line = ({ className }: LineProps) => {
  return <div className={cn('h-px w-full bg-slate-200', className)}></div>;
};

export default Line;
