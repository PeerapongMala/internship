import { useEffect, useState } from 'react';
import CoreSidebarMenu from '@component/web/molecule/cc-o-sidebar-admin-tab-menu';
import DateRangeSelectorApprove from './components/date-range-selector-approve';
import ApproveList from './components/approve';
import {
  Announcement,
  getAnnouncementList,
  StatusUpdate,
  updateAnnouncementStatus,
} from '../local/api/restapi/annoucement';
import { formatDateToString } from '../local/api/restapi/data-format';
import addDay from '@global/helper/uh-add-day';
import { newDate } from 'react-datepicker/dist/date_utils';
import { useNavigate } from '@tanstack/react-router';
import StoreGlobalPersist from '@store/global/persist';
import NotificationSuccess from '@component/web/atom/notification/wc-a-notification-success';
import NotificationError from '@component/web/atom/notification/wc-a-notification-error';
import { NotificationState, NotificationType  } from '@component/web/atom/notification/type'; 



const DomainJSX = () => {
  const navigate = useNavigate()
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  if (!accessToken) { 
    navigate({ to: "/sign-in" })
  }
  const [currentDate, setCurrentDate] = useState<Date | null>(addDay(new Date(), 1));
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const fetchData = async () => {
    setIsLoading(true);
    setStatusUpdates([]);
    try {
      const result = await getAnnouncementList(formatDateToString(currentDate));
      setAnnouncements(result.data.data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 700);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentDate]);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const handleSaveUpdates = async (updates: StatusUpdate[]) => {
    try {
      await updateAnnouncementStatus(updates);
      await fetchData();
      setStatusUpdates([]);
      setNotification({
        show: true,
        title: 'บันทึกข้อมูลสำเร็จ',
        type: 'success',
      });
      
    } catch (error) {
      setNotification({
        show: true,
        title: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง',
        type: 'error',
      });
      console.error('Update failed:', error);
    }finally {
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
        // window.location.reload();
      }, 3000);
    }
  };


  return (
    <div className="bg-white dark:bg-[#262626]">
    <NotificationSuccess
        show={notification.show && notification.type === 'success'}
        title={notification.title}
        message={notification.message}
      />
      <NotificationError
        show={notification.show && notification.type === 'error'}
        title={notification.title}
        message={notification.message}
      />
      <div className="my-[64px] md:my-[135px] md:mx-auto w-full max-w-[954px] flex flex-col gap-y-[63px] md:gap-y-20">
        <div className="px-[10px] md:px-0">
          <CoreSidebarMenu defaultPath="approve" />
        </div>
        <div className="flex flex-col px-[21px] md:pr-[33px]">
          <div>
            <div className="w-full text-left mb-[18px]">
              <nav aria-label="breadcrumb" className="block w-full">
                <ol className="flex w-full flex-wrap items-center">
                  <li className="flex cursor-pointer items-center text-sm font-normal leading-normal text-[#D9A84E] antialiased transition-colors duration-300 hover:text-pink-500">
                    <a href="#">
                      <span>ADMIN</span>
                    </a>
                    <span className="pointer-events-none mx-2 select-none text-black dark:text-[#9096A2]">
                      /
                    </span>
                  </li>
                  <li className="flex items-center text-sm font-normal leading-normal text-[#9096A2]">
                    <span>อนุมัติหนังสือพิมพ์</span>
                  </li>
                </ol>
              </nav>
            </div>
            <div className="flex flex-col gap-y-[27px] mb-[28px]">
              <p className="font-semibold text-[28px] leading-[28px] text-[#101828] dark:text-white">
                อนุมัติหนังสือพิมพ์
              </p>
            </div>

            <DateRangeSelectorApprove
              placeholder="วว/ดด/ปปปป"
              value={currentDate}
              onChange={setCurrentDate}
              minDate={tomorrow}
            />

            <ApproveList
              isLoading={isLoading}
              announcements={announcements}
              setAnnouncements={setAnnouncements}
              onStatusUpdates={setStatusUpdates}
            />
          </div>

          <button
            className="mt-6 w-full h-[38px] rounded-[6px] px-[12px] gap-[16px] bg-secondary flex items-center justify-center disabled:bg-[#D7D7D8]"
            onClick={() => handleSaveUpdates(statusUpdates)}
            disabled={statusUpdates.length === 0}
          >
            <p className="font-bold text-[14px] leading-[20.61px] text-[#FBFBFB] text-center">
              บันทึก
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DomainJSX;
