import CWTitleBack from '@component/web/cw-title-back';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import { API } from '@domain/g05/local/api';
import router from '@global/utils/router-global';
import { useState, useEffect } from 'react';

type AnnouncementDetailTemplateProps = {
  announcementId: string;
};

const AnnouncementDetailTemplate: React.FC<AnnouncementDetailTemplateProps> = ({
  announcementId,
}) => {
  type TAnnouncement = {
    announcement_id: number;
    title: string;
    description: string;
    type: string;
  };

  const [announcement, setAnnouncement] = useState<TAnnouncement | null>(null);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    if (!announcementId) return;

    try {
      const response = await API.Announcement.GetAnnouncement({
        announcement_id: announcementId,
      });

      console.log('Fetched announcement:', response.data.data);
      setAnnouncement(response.data.data);
    } catch (err) {
      console.error('Error fetching announcement:', err);
    }
  };

  return (
    <div className="mt-4 font-semibold text-gray-700">
      <div className="flex w-full items-center px-5">
        <div className="absolute left-5">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              router.history.back();
            }}
          >
            <IconArrowBackward />
          </a>
        </div>
        <p className="w-full text-center text-2xl font-bold">{announcement?.title}</p>
      </div>
      {announcement ? (
        <p dangerouslySetInnerHTML={{ __html: announcement.description }} />
      ) : (
        <p className="mt-4 text-red-500">ไม่พบข้อมูลประกาศ</p>
      )}
    </div>
  );
};

export default AnnouncementDetailTemplate;
