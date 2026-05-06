import React from 'react';

interface AnnouncementBodyProps {
  onSlotsClick: (announceKey: number) => void;
  t: (key: string) => string;
  index: number;
  announceTitle: string;
  announceDate?: string;
  IsRead?: boolean;
  IsSelected?: boolean;
  showDate?: boolean;
}

const WCTAnnounceListSlot: React.FC<AnnouncementBodyProps> = ({
  onSlotsClick,
  t,
  index,
  announceTitle,
  announceDate,
  IsRead,
  IsSelected,
  showDate,
}) => {
  const SlotProperties: React.CSSProperties = {
    // ...
    width: 288,
    // height: 106,
    backgroundSize: 'cover',
    position: 'relative',
    display: 'flex',
    // minHeight: '32px',
    minHeight: 106,
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
      className="h-[53px] p-2 rounded-sm justify-start items-center gap-2 inline-flex cursor-pointer"
      style={{
        ...SlotProperties,
      }}
      onClick={() => {
        onSlotsClick(index);
      }}
    >
      <div className="w-full grow shrink basis-0 flex-col justify-center items-start gap-1 inline-flex truncate">
        <div
          className={`w-full text-[#333333] text-2xl truncate font-bold font-['Noto Sans Thai'] ${IsRead && !IsSelected ? 'opacity-50' : ''}`}
        >
          {announceTitle}
        </div>
        {showDate && announceDate && (
          <div
            className={`text-center text-[#333333] text-[16px] font-normal font-['Prompt'] ${IsRead && !IsSelected ? 'opacity-50' : ''}`}
          >
            {announceDate}
          </div>
        )}
      </div>
      {!IsRead && <div className="!w-3 !h-3 basis-3 bg-red-600 rounded-full" />}
    </div>
  );
};

export default WCTAnnounceListSlot;
