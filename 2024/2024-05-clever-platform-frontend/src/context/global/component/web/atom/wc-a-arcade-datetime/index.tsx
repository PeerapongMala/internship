import { EventTab } from '@domain/g03/g03-d08/g03-d08-p02-arcade-leaderboard';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import VectorNext from '../../../../assets/VectorNext.svg';
import VectorPrevius from '../../../../assets/VectorPre.svg';
import IconButton from '../wc-a-icon-button';

export enum ViewPosition {
  Event = 'event',
  Weekly = 'week',
  Monthly = 'month',
}

export enum DisplayMode {
  Event = 'event',
  Weekly = 'week',
  Monthly = 'month',
}

interface DateTimeProps {
  onDisplayModeChange: (displayMode: DisplayMode) => void;
  displayMode: DisplayMode;
  hasEvent: boolean;
  startDate: string;
  endDate: string;
  eventTitle?: string;
  eventIds?: EventTab[];
  selectedEventId?: number | null;
  onEventTabChange?: (eventId: number) => void;
}

export function DateTime({
  displayMode,
  onDisplayModeChange,
  hasEvent,
  startDate,
  endDate,
  eventTitle = 'กิจกรรม',
  eventIds = [],
  selectedEventId,
  onEventTabChange,
}: DateTimeProps) {
  const { t } = useTranslation(['global']);
  const [viewPosition, setViewPosition] = useState<ViewPosition>(
    displayMode === DisplayMode.Event
      ? ViewPosition.Event
      : displayMode === DisplayMode.Weekly
        ? ViewPosition.Weekly
        : ViewPosition.Monthly,
  );

  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  useEffect(() => {
    switch (displayMode) {
      case DisplayMode.Event:
        setViewPosition(ViewPosition.Event);
        break;
      case DisplayMode.Weekly:
        setViewPosition(ViewPosition.Weekly);
        break;
      case DisplayMode.Monthly:
        setViewPosition(ViewPosition.Monthly);
        break;
    }
  }, [displayMode]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const handlePrevious = () => {
    if (viewPosition === ViewPosition.Event) {
      // ถ้ายังมี Event ก่อนหน้า
      if (currentEventIndex > 0) {
        const newIndex = currentEventIndex - 1;
        setCurrentEventIndex(newIndex);
        onEventTabChange?.(eventIds[newIndex].id);
      } else {
        setViewPosition(ViewPosition.Monthly);
        onDisplayModeChange(DisplayMode.Monthly);
      }
    } else if (viewPosition === ViewPosition.Weekly) {
      if (hasEvent && eventIds.length > 0) {
        setViewPosition(ViewPosition.Event);
        onDisplayModeChange(DisplayMode.Event);
        setCurrentEventIndex(eventIds.length - 1);
        onEventTabChange?.(eventIds[eventIds.length - 1].id);
      } else {
        setViewPosition(ViewPosition.Monthly);
        onDisplayModeChange(DisplayMode.Monthly);
      }
    } else if (viewPosition === ViewPosition.Monthly) {
      setViewPosition(ViewPosition.Weekly);
      onDisplayModeChange(DisplayMode.Weekly);
    }
  };
  const handleNext = () => {
    if (viewPosition === ViewPosition.Event) {
      // ถ้ายังมี Event ถัดไป
      if (currentEventIndex < eventIds.length - 1) {
        const newIndex = currentEventIndex + 1;
        setCurrentEventIndex(newIndex);
        onEventTabChange?.(eventIds[newIndex].id);
      } else {
        setViewPosition(ViewPosition.Weekly);
        onDisplayModeChange(DisplayMode.Weekly);
        setCurrentEventIndex(0);
      }
    } else if (viewPosition === ViewPosition.Weekly) {
      // ไปโหมด Monthly
      setViewPosition(ViewPosition.Monthly);
      onDisplayModeChange(DisplayMode.Monthly);
    } else if (viewPosition === ViewPosition.Monthly) {
      if (hasEvent && eventIds.length > 0) {
        setViewPosition(ViewPosition.Event);
        onDisplayModeChange(DisplayMode.Event);
        setCurrentEventIndex(0);
        onEventTabChange?.(eventIds[0].id);
      } else {
        setViewPosition(ViewPosition.Weekly);
        onDisplayModeChange(DisplayMode.Weekly);
      }
    }
  };

  const getDisplayModeText = () => {
    switch (viewPosition) {
      case ViewPosition.Event:
        return eventIds[currentEventIndex]?.title || eventTitle;
      case ViewPosition.Weekly:
        return t('datetime.this_week');
      case ViewPosition.Monthly:
        return t('datetime.this_month');
      default:
        return t('datetime.this_week');
    }
  };

  const getDateRangeText = () => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const isPreviousDisabled =
    viewPosition === ViewPosition.Event && currentEventIndex === 0; // Never disable for monthly

  const isNextDisabled = viewPosition === ViewPosition.Monthly;

  return (
    <div className="flex items-center pl-3 w-full">
      <div className="flex items-center justify-between w-4/5">
        {/* ปุ่มเลื่อนไปตำแหน่งก่อนหน้า */}
        <IconButton
          iconSrc={VectorPrevius}
          width={44}
          height={44}
          style={{
            backgroundColor: '#00c5ff',
            borderColor: '#ace4f2',
            opacity: isPreviousDisabled ? 0.5 : 1, // Will always be 1
          }}
          onClick={handlePrevious}
          aria-label="Previous View"
          disabled={isPreviousDisabled}
        />

        {/* ข้อความตำแหน่งปัจจุบัน */}
        <div className="px-6 text-2xl font-bold text-gray-20">{getDisplayModeText()}</div>

        {/* ปุ่มเลื่อนไปตำแหน่งถัดไป */}
        <IconButton
          iconSrc={VectorNext}
          width={44}
          height={44}
          style={{
            backgroundColor: '#00c5ff',
            borderColor: '#ace4f2',
            opacity: isNextDisabled ? 0.5 : 1, // Will always be 1
          }}
          onClick={handleNext}
          aria-label="Next View"
          disabled={isNextDisabled}
        />
      </div>
      <div className="w-2/5 px-6 text-2xl font-bold text-gray-20 text-right">
        {startDate && endDate ? getDateRangeText() : ''}
      </div>
    </div>
  );
}

export default DateTime;
