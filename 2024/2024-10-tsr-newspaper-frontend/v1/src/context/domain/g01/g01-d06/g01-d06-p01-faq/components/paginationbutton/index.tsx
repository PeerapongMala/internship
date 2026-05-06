import { useEffect, useState } from 'react';

interface Props {
  pageNum: string;
  selected: boolean;
  onSelect: (pageNum: string) => void;
  className: string
}

export default function PaginationButton({ pageNum, className, selected, onSelect }: Props) {
  const color = selected ? 'secondary' : '[#E0E6ED]';
  const textColor = selected ? 'white' : 'black';
  const brightness = selected ? '100' : '90';

  return (
    <button
      className={`${className} flex justify-center items-center bg-${color} text-${textColor} text-lg rounded-full w-10 h-10 hover:brightness-${brightness}`}
      onClick={() => onSelect(pageNum)}
    >
      {pageNum}
    </button>
  );
}
