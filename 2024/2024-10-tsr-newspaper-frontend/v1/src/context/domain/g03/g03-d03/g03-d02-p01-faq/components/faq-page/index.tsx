import { useEffect, useState } from 'react';
import CoreSidebarMenu from '@component/web/molecule/cc-o-sidebar-admin-tab-menu';
import Breadcrumb from '../breadcrumb';
import FaqList from '../faq-list';
import FaqForm from '../faq-form';
import { createFaq, deleteFaq, getFaqs } from '../../../local/api/restapi/service-faq';
import NotificationSuccess from '@component/web/atom/notification/wc-a-notification-success';
import NotificationError from '@component/web/atom/notification/wc-a-notification-error';
import LoadingSpinner from '@component/web/atom/wc-loading-spinner';

export enum NavFaq {
  HOME = 'HOME',
  ADD = 'ADD',
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export type NotificationType = 'success' | 'error';

interface NotificationState {
  show: boolean;
  type: NotificationType;
  title: string;
  message?: string;
}

const FaqPage: React.FC = () => {
  const textTitle = 'แก้ไขคำถามที่พบบ่อย';
  const [currentPage, setCurrentPage] = useState<NavFaq>(NavFaq.HOME);
  const [faqList, setFaqList] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });
  const [isFetchingData, setIsFetchingData] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setIsFetchingData(true);
    try {
      const mockPagination = {
        page: 0,
        limit: 20,
      };
      const result = await getFaqs(mockPagination);
      setFaqList(result.data);
    } catch (error) {
      setNotification({
        show: true,
        title: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
        type: 'error',
      });
      console.error('Error:', error);
    } finally {
      setTimeout(() => {
        setIsFetchingData(false);
      }, 500);
    }
  };

  const handleAddClick = () => {
    setCurrentPage(NavFaq.ADD);
  };

  const handleHomeClick = () => {
    setCurrentPage(NavFaq.HOME);
  };
  const handleCancel = () => {
    setCurrentPage(NavFaq.HOME);  
  };

  const handleAddFaq = async (newFaq: FaqItem) => {
    setIsLoading(true);
    try {
      await createFaq({
        question: newFaq.question,
        answer: newFaq.answer,
      });

      showNotification('success', 'เพิ่มคำถามสำเร็จ');
      setCurrentPage(NavFaq.HOME);

      await fetchFaqs();
    } catch (err) {
      showNotification(
        'error',
        'เพิ่มคำถามไม่สำเร็จ',
        err instanceof Error ? err.message : 'กรุณาลองใหม่อีกครั้ง',
      );
      console.error('Error creating FAQ:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (itemId: number) => {
    try {
      setIsFetchingData(true);
      await deleteFaq(itemId);

      showNotification('success', 'ลบคำถามสำเร็จ');

      await fetchFaqs();
    } catch (error) {
      console.error('Error:', error);
      showNotification('error', 'ลบคำถามไม่สำเร็จ', 'กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsFetchingData(false);
    }
  };

  const handleSaveChanges = () => {
    console.log('handleSaveChanges');
  };

  const showNotification = (type: NotificationType, title: string, message?: string) => {
    setNotification({
      show: true,
      type,
      title,
      message,
    });

    if (type === 'success') {
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  return (
    <div className="my-[64px] md:my-[135px] md:mx-auto w-full max-w-[954px] flex flex-col gap-y-[63px] md:gap-y-20">
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
      <div className="px-[10px] md:px-0">
        <CoreSidebarMenu defaultPath="faq" />
      </div>
      <div className="flex flex-col px-[21px] md:pr-[33px]">
        <Breadcrumb
          currentPage={currentPage}
          onHomeClick={handleHomeClick}
          textTitle={textTitle}
        />
        {currentPage === NavFaq.HOME ? (
          <>
            {isFetchingData ? (
              <div className="flex justify-center items-center h-40">
                <LoadingSpinner />
              </div>
            ) : (
              <FaqList
                qaList={faqList}
                onDelete={handleDelete}
                onAdd={handleAddClick}
                onSave={handleSaveChanges}
              />
            )}
          </>
        ) : (
          <FaqForm onSubmit={handleAddFaq} isLoading={isLoading} onCancel={handleCancel} />
        )}
      </div>
    </div>
  );
};

export default FaqPage;
