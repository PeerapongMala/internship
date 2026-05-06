import React, { Dispatch, SetStateAction } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import Pagination from '@core/design-system/library/component/web/Pagination';
import { TPagination } from '@domain/g05/g05-d02/local/types';
import CWTitleBack from '@component/web/cw-title-back';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';

type Announcement = {
  announcement_id: number;
  title: string;
};

type AnnouncementListProps = {
  announcements: Announcement[];
  pagination: TPagination;
  setPagination: Dispatch<SetStateAction<TPagination>>;
};

const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
  pagination,
  setPagination,
}) => {
  const { user_id, announcementId } = useParams({ strict: false });
  const navigate = useNavigate();
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const paginatedAnnouncements = announcements.slice(startIndex, endIndex);

  const handleClick = (user_id: string, announcement_id: number) => {
    if (!user_id) return;

    navigate({
      to: `/line/parent/clever/announcement/student/${user_id}/announcement/${announcement_id}`,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <div className="mt-5 flex items-center px-5">
          <div className="absolute left-20 hover:cursor-pointer md:relative md:-left-10">
            <a href="/line/parent/clever/announcement/choose-student">
              <IconArrowBackward />
            </a>
          </div>
          <p className="w-full text-center text-2xl font-bold">ประกาศ</p>
        </div>

        <span className="block pb-4 text-center">{announcements.length} รายการ</span>

        {announcements.length === 0 ? (
          <p className="py-8 text-center text-gray-400">ไม่มีประกาศในขณะนี้</p>
        ) : (
          <div className="flex flex-col gap-2 px-2">
            {paginatedAnnouncements.map((announcement) => (
              <div
                key={announcement.announcement_id}
                onClick={() => handleClick(user_id, announcement.announcement_id)}
                className="cursor-pointer border-b border-gray-200 px-4 py-2 transition hover:bg-gray-50"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 text-center font-semibold text-gray-700">
                    {announcement.announcement_id}
                  </div>
                  <div className="flex-1 truncate text-gray-800">
                    {announcement.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {announcements.length > 0 && (
        <div className="mt-4 flex w-full justify-center">
          <Pagination
            currentPage={pagination.page}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            pageSize={pagination.limit}
            setPageSize={(size) => setPagination((prev) => ({ ...prev, limit: size }))}
            totalPages={Math.ceil(announcements.length / pagination.limit)}
            disableDropdown={false}
          />
        </div>
      )}
    </div>
  );
};

export default AnnouncementList;
