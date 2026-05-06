import { useEffect, useState } from 'react';
import { EditFormType } from '../edit-form'; 
import {
  CoverNewspaper,
  createCover,
  CreateCoverForm,
  getCoverNewspaperList,
} from '../../../local/api/restapi/cover-newspaper';
import { NotificationState, NotificationType  } from '@component/web/atom/notification/type'; 

import NotificationSuccess from '@component/web/atom/notification/wc-a-notification-success';
import NotificationError from '@component/web/atom/notification/wc-a-notification-error';
import ImageTemplate1 from '../../../local/asset/image/template1.png';
import ImageTemplate2 from '../../../local/asset/image/template2.png';
import Breadcrumb from '../breadcrumb';
import HomeSection from '../section-home';
import AddSection from '../section-add';
import EditSection from '../section-edit';
import PreviewSection from '../section-preview';

import addDay from '@global/helper/uh-add-day';

export enum navCover {
  HOME = 'HOME',
  ADD = 'ADD',
  EDIT = 'EDIT',
  PREVIEW = 'PREVIEW',
}

export interface NewspaperTemplateProps {
  stateForm: EditFormType;
  onSave: (previewImage: string) => Promise<void>;
  onCancel: () => void;
}

export interface Template {
  id: number;
  templateId: number;
  text: string;
  image: string;
}

const mockTemplePreviewList: Template[] = [
  { id: 1, text: 'เทมเพลตที่ 1', image: ImageTemplate1, templateId: 1 },
  { id: 2, text: 'เทมเพลตที่ 2', image: ImageTemplate2, templateId: 2 },
];

const Cover: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<navCover>(navCover.HOME);
  const [currentTemplate, setCurrentTemplate] = useState<number>();
  const [stateForm, setStateForm] = useState<EditFormType>();
  const [startDate, setStartDate] = useState<Date | null>(addDay(new Date,1));
  const [endDate, setEndDate] = useState<Date | null>(addDay(new Date,30));

  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const [coverList, setCoverList] = useState<CoverNewspaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  useEffect(() => {
    if (startDate && endDate) {
      fetchCoverList();
    }
  }, [startDate, endDate]);

  const fetchCoverList = async () => {
    if (!startDate || !endDate) {
 
      return;
    }

    setIsLoading(true);
    try {
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      // Format date to 'YYYY-MM-DD'

      const result = await getCoverNewspaperList({
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      });
      const tempData = [...result.data];
      tempData.sort(
        (a, b) => new Date(a.PublicDate).getTime() - new Date(b.PublicDate).getTime(),
      );
      setCoverList(tempData);
    } catch (error) {
      console.error('Error fetching cover list:', error);
      setCoverList([]);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const handleCreateCover = async (formData: CreateCoverForm) => {
    console.log('formData with preview:', formData);
    try {
      setIsLoading(true);
      await createCover(formData);
      showNotification('success', 'สร้างปกหนังสือพิมพ์สำเร็จ');
      setCurrentPage(navCover.HOME);
      await fetchCoverList();
    } catch (error) {
      console.error('Error creating cover:', error);
      showNotification(
        'error',
        'สร้างปกหนังสือพิมพ์ไม่สำเร็จ',
        error instanceof Error ? error.message : 'กรุณาลองใหม่อีกครั้ง',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type: NotificationType, title: string, message?: string) => {
    setNotification({
      show: true,
      type,
      title,
      message,
    });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 2000);
  };

  const renderPage = () => {
    switch (currentPage) {
      case navCover.HOME:
        return (
          <HomeSection
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            isLoading={isLoading}
            coverList={coverList}
            setCurrentPage={setCurrentPage}
            isEndDateOpen={isEndDateOpen}
            setIsEndDateOpen={setIsEndDateOpen}
          />
        );
      case navCover.ADD:
        return (
          <AddSection
            templates={mockTemplePreviewList}
            onBack={() => setCurrentPage(navCover.HOME)}
            onSelectTemplate={(templateId) => {
              setCurrentPage(navCover.EDIT);
              setCurrentTemplate(templateId);
            }}
            setStateForm={setStateForm}
          />
        );
      case navCover.EDIT:
        return (
          <EditSection
            onBack={() => setCurrentPage(navCover.ADD)}
            currentTemplate={currentTemplate}
            setStateForm={setStateForm}
            setCurrentPage={setCurrentPage}
            stateForm={stateForm}
          />
        );
      case navCover.PREVIEW:
        return (
          <PreviewSection
            onBack={() => setCurrentPage(navCover.EDIT)}
            currentTemplate={currentTemplate}
            stateForm={stateForm}
            onSave={handleCreateCover}
            onCancel={() => setCurrentPage(navCover.EDIT)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
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
      <Breadcrumb currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
};

export default Cover;
