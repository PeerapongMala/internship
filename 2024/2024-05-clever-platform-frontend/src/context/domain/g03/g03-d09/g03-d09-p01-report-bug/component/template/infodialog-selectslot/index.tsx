import { cn } from '@global/helper/cn';
import React from 'react';

interface AnnouncementBodyProps {
  onSlotsClick: (announceKey: number) => void;
  t: (key: string) => string;
  index: number;
  announceTitle: string;
  IsRead?: boolean;
  IsSelected?: boolean;
  showDate?: boolean;
  dateCreate?: string;
}

const WCTAnnounceListSlot: React.FC<AnnouncementBodyProps> = ({
  onSlotsClick,
  t,
  index,
  announceTitle,
  IsRead,
  IsSelected,
  showDate,
  dateCreate,
}) => {
  const SlotProperties: React.CSSProperties = {
    // ...
    width: 288,
    height: 106,
    backgroundSize: 'cover',
    position: 'relative',
    display: 'flex',
    minHeight: '32px',
    padding: '8px',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.3s ease-in-out',
    backgroundColor: IsSelected
      ? '#FCD401'
      : IsRead
        ? 'rgba(255, 255, 255, 0.8)'
        : '#FFFFFFCC',
  };

  return (
    <div
      key={IsRead ? 999 : index}
      className="w-36 h-[53px] p-2 rounded-sm justify-start items-center gap-2 inline-flex cursor-pointer"
      style={{
        ...SlotProperties,
      }}
      onClick={() => {
        onSlotsClick(index);
      }}
    >
      <div className="grow shrink basis-0 flex-col justify-center items-start gap-1 inline-flex w-full">
        <div
          className={cn(
            "self-stretch text-[#333333] text-[16px] font-bold font-['Noto Sans Thai'] truncate",
            IsRead && !IsSelected ? 'opacity-50' : '',
          )}
        >
          {announceTitle}
        </div>
        {showDate && (
          <div
            className={cn(
              "text-center text-[#333333] text-[16px] font-normal font-['Prompt']",
              IsRead && !IsSelected ? 'opacity-50' : '',
            )}
          >
            {dateCreate}
          </div>
        )}
      </div>
    </div>
  );
};

export default WCTAnnounceListSlot;
