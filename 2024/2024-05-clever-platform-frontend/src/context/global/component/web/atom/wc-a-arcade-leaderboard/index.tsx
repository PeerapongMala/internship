import { Avatar } from '@component/web/molecule/wc-m-avatar';
import { EventTab } from '@domain/g03/g03-d08/g03-d08-p02-arcade-leaderboard';
import { StateTab } from '@domain/g03/g03-d08/g03-d08-p02-arcade-leaderboard/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ImageKing from '../../../../assets/admin.svg';
import star from '../../../../assets/stars.svg';
import styles from '../../../../css/style.module.css';
import DateTime from '../wc-a-arcade-datetime';
import ScrollableContainer from '../wc-a-scrollable-container';
import Tab from '../wc-a-tab';

export enum DisplayMode {
  Event = 'event',
  Weekly = 'week',
  Monthly = 'month',
}
interface LeaderBoardProps {
  records: AccountList[];
  activeTab: StateTab;
  onTabChange: (tab: StateTab) => void;
  itemsPerPage?: number;
  account: AccountList[] | null;
  scoreStar?: boolean;
  size?: 'mid' | 'full';
  startDate: string;
  endDate: string;
  hasEvent: boolean;
  displayMode: DisplayMode;
  onDisplayModeChange: (displayMode: DisplayMode) => void;
  isLoading?: boolean;
  eventTitle?: string;
  eventIds?: EventTab[];
  selectedEventId?: number | null;
  onEventTabChange?: (eventId: number) => void;
}

interface LeaderboardData {
  index: number;
  time: string;
  score: number;
  avatarImage: string;
  username: string;
  lastLogin?: Date | string;
  status?: 'Waiting' | 'Complete';
  title: string;
  image: string;
  affiliation: AccountList[];
  year: AccountList[];
  classroom: AccountList[];
  country: AccountList[];
  price: number;
  coin: number;
}

interface AccountList {
  index: number;
  avatarImage: string;
  username: string;
  score: number;
  time: string;
}

export default function LeaderBoard({
  records,
  activeTab,
  onTabChange,
  itemsPerPage = 10,
  account,
  scoreStar = true,
  size = 'mid',
  startDate,
  endDate,
  hasEvent,
  displayMode,
  onDisplayModeChange,
  isLoading = false,
  eventTitle,
  eventIds,
  selectedEventId = null,
  onEventTabChange = () => {},
}: LeaderBoardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedRecords, setPaginatedRecords] = useState<AccountList[]>([]);

  const totalPages = Math.ceil(records.length / itemsPerPage);
  const containerWidth = size === 'mid' ? 'w-10/12' : 'w-11/12';
  const gridCols =
    size === 'mid'
      ? 'grid-cols-[64px_64px_500px_70px_200px]'
      : 'grid-cols-[64px_64px_650px_70px_200px]';

  useEffect(() => {
    if (
      displayMode === DisplayMode.Event &&
      activeTab !== StateTab.ClassroomTab &&
      activeTab !== StateTab.YearTab
    ) {
      onTabChange(StateTab.ClassroomTab);
    }
  }, [displayMode, activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, displayMode]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedRecords(records.slice(startIndex, endIndex));
  }, [currentPage, records, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const { t, i18n } = useTranslation(['global']);

  const isEventMode = displayMode === DisplayMode.Event;

  return (
    <div
      className={`flex flex-col gap-1 bg-white bg-opacity-80 border-white border-8 rounded-[32px] mx-auto my-auto ${containerWidth} h-3/4 p-4 box-border ${styles['font-noto-sans-thai']}`}
    >
      <div className="bg-transparent flex items-center justify-center text-3xl font-bold text-gray-20 w-full h-[45px] rounded-t-[16px]">
        {t('leaderboard')}
      </div>

      <div className="mt-1 pt-1 bg-white">
        <DateTime
          startDate={startDate}
          endDate={endDate}
          displayMode={displayMode}
          onDisplayModeChange={onDisplayModeChange}
          hasEvent={hasEvent}
          eventTitle={eventTitle}
          eventIds={eventIds}
          selectedEventId={selectedEventId}
          onEventTabChange={onEventTabChange}
        />
        <div className="flex pt-3">
          <Tab
            label={t('classroom')}
            isActive={activeTab === StateTab.ClassroomTab}
            onClick={() => onTabChange(StateTab.ClassroomTab)}
          />

          <Tab
            label={t('year')}
            isActive={activeTab === StateTab.YearTab}
            onClick={() => onTabChange(StateTab.YearTab)}
          />
          {!isEventMode && (
            <Tab
              label={t('affiliation')}
              isActive={activeTab === StateTab.AffiliationTab}
              onClick={() => onTabChange(StateTab.AffiliationTab)}
            />
          )}

          {!isEventMode && (
            <Tab
              label={t('country')}
              isActive={activeTab === StateTab.CountryTab}
              onClick={() => onTabChange(StateTab.CountryTab)}
            />
          )}
        </div>
      </div>
      <ScrollableContainer id="content" className="flex overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-40 w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div id="classroom-list" className="flex flex-col min-w-full h-fit">
            {paginatedRecords.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <span className="text-xl font-bold text-black">
                  {t('no_data_play_log')}
                </span>
              </div>
            ) : (
              paginatedRecords.map((record, index) => (
                <div
                  key={`${record.index}-${record.username}`}
                  className={`grid ${gridCols} bg-opacity-70 items-center gap-3 p-2 ${
                    index % 2 === 0 ? 'bg-transparent' : 'bg-white'
                  }`}
                >
                  <div
                    className="bg-[#fcd401] rounded-3xl border-4 border-white w-[64px] h-[64px] flex items-center justify-center"
                    style={{
                      boxShadow:
                        '0px 3px 0px 0px #ff6b00, 0px 16px 8px 0px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <span
                      className="text-xl font-bold text-gray-20"
                      style={{
                        textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      {record.index}
                    </span>
                  </div>
                  <Avatar
                    user={{
                      first_name: record.username.split(' ')[0] || '',
                      last_name: record.username.split(' ')[1] || '',
                      image_url: record.avatarImage,
                    }}
                    className="w-16 h-16 rounded-full border-2 border-white"
                  />
                  <div className="flex items-center font-bold text-2xl gap-2">
                    {record.index === 1 && (
                      <img src={ImageKing} alt="KingLogo" className="w-[32px] h-[32px]" />
                    )}
                    {record.username}
                  </div>

                  <div className="flex justify-center items-center">
                    <span className="text-right font-bold text-2xl">{record.score}</span>
                    {scoreStar && <img src={star} alt="star" className="w-8 h-8" />}
                  </div>

                  <span className="text-right font-bold text-2xl">{record.time}</span>
                </div>
              ))
            )}
          </div>
        )}
      </ScrollableContainer>

      {account && (
        <div
          id="waiting-list"
          className="flex flex-col justify-center min-w-[620px] gap-4 h-fit"
        >
          <div
            className={`grid ${gridCols} items-center gap-3 bg-[#ace4f2] p-2 rounded-[32px] shadow-lg border-t-8 border-[#0066ff]`}
          >
            {account?.[0] ? (
              <>
                <div
                  className="bg-[#0066ff] rounded-3xl border-4 border-white w-[64px] h-[64px] shadow-red-500 flex items-center justify-center text-xl noto-sans-thai1200 text-white"
                  style={{
                    boxShadow:
                      '0px 3px 0px 0px #ff6b00, 0px 16px 8px 0px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  {account[0].index}
                </div>

                <Avatar
                  user={{
                    first_name: account[0].username.split(' ')[0] || '',
                    last_name: account[0].username.split(' ')[1] || '',
                    image_url: account[0].avatarImage,
                  }}
                  className="border-2 border-white w-[64px] h-[64px]"
                />

                <span className="text-2xl !font-bold">{account[0].username}</span>

                <div className="flex justify-center items-center">
                  <span className="text-right text-2xl !font-bold">
                    {account[0].score.toLocaleString()}
                  </span>
                  {scoreStar && <img src={star} alt="star" className="w-8 h-8" />}
                </div>

                <span className="text-right text-2xl !font-bold">{account[0].time}</span>
              </>
            ) : (
              <div className="col-span-full text-center text-2xl font-bold text-gray-600 py-4">
                {t('no_user_play_log')}
              </div>
            )}
          </div>
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            &lt;
          </button>

          <span className="px-3 py-1 bg-white text-gray-800 rounded-md">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
