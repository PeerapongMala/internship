// import { useTranslation } from 'react-i18next';
import MockActivityThumbnail from '@asset/mock-activity.jpg';
import StoreGlobal from '@global/store/global';
import { Link, useParams, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Status } from '../local/type';
import API from '../local/api';

import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import IconSearch from '@core/design-system/library/vristo/source/components/Icon/IconSearch';
import SidePanel from '../local/components/organisms/Sidepanel';

import SelectLesson from './components/template/SelectLesson';
import Breadcrumbs from '@core/design-system/library/component/web/Breadcrumbs';
import TitleBack from '@core/design-system/library/component/web/TitleBack';
import showMessage from '@global/utils/showMessage';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleBack from '@component/web/cw-title-back';

const DomainJSX = () => {
  const { subjectId, templateId } = useParams({ strict: false });
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [statusValue, setStatusValue] = useState<Status>(Status.DRAFT);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const search = useSearch({ strict: false });
  const { subject_name, curriculum_group_name, year_name, year_id } = search;
  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth < 768;
      StoreGlobal.MethodGet().TemplateSet(!isMobile);
      StoreGlobal.MethodGet().BannerSet(!isMobile);

      if (isMobile && window.location.pathname !== '/line/teacher/homework/homework') {
        navigate({ to: '/line/teacher/homework/homework' });
      }
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  useEffect(() => {
    // ตรวจสอบว่าเป็นโหมดแก้ไขหรือไม่
    if (templateId) {
      setIsEditMode(true);
      fetchTemplateData();
    }
  }, [templateId]);

  const fetchTemplateData = async () => {
    try {
      setIsLoading(true);

      // ดึงข้อมูล template ตาม ID
      const response = await API.teacherHomework.GetHomeworkTemplateById(
        Number(templateId),
      );

      if (response.status_code === 200 && response.data) {
        const templateData = response.data;

        // กำหนดค่าให้กับ state ต่างๆ
        setTemplateName(templateData.homework_template_name);
        setSelectedLesson(templateData.lesson_id);

        // แปลงสถานะจาก string เป็น enum Status
        if (templateData.status === 'enabled') {
          setStatusValue(Status.IN_USE);
        } else if (templateData.status === 'disabled') {
          setStatusValue(Status.NOT_IN_USE);
        } else {
          setStatusValue(Status.DRAFT);
        }

        // กำหนดค่า level_ids
        if (templateData.level_ids && Array.isArray(templateData.level_ids)) {
          setSelectedLevels(templateData.level_ids);
        }

        // อัปเดต checkbox ใน SelectLesson component
        // (จะต้องมีการแก้ไข SelectLesson component เพิ่มเติมเพื่อรองรับการตั้งค่า checkbox)
      } else {
        console.error('Failed to fetch homework data:', response.message);
        alert('ไม่สามารถดึงข้อมูลการบ้านได้');
        navigate({ to: '../' });
      }
    } catch (error) {
      console.error('Error fetching homework data:', error);
      alert('เกิดข้อผิดพลาดในการดึงข้อมูลการบ้าน');
      navigate({ to: '../' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (isSubmitting) {
      return;
    }

    if (!templateName || !selectedLesson) {
      showMessage('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
      return;
    }

    try {
      setIsLoading(true);
      setIsSubmitting(true);

      let statusString = 'draft';
      if (statusValue === Status.IN_USE) {
        statusString = 'enabled';
      } else if (statusValue === Status.NOT_IN_USE) {
        statusString = 'disabled';
      }

      const levelIds = selectedLevels.length > 0 ? selectedLevels : [1];

      const templateData = {
        homework_template_name: templateName,
        subject_id: parseInt(subjectId as string) || 1,
        year_id: year_id || 1,
        lesson_id: selectedLesson,
        status: statusString,
        level_ids: levelIds,
      };

      console.log('Sending data:', templateData);

      let response;

      if (isEditMode && templateId) {
        // แก้ไข template
        response = await API.teacherHomework.UpdateHomeworkTemplate(
          Number(templateId),
          templateData,
        );
      } else {
        // สร้าง template ใหม่
        response = await API.teacherHomework.CreateHomeworkTemplate(templateData);
      }

      console.log('API response:', response);

      if (response.status_code === 200) {
        showMessage(isEditMode ? 'แก้ไขข้อมูลสำเร็จ' : 'บันทึกข้อมูลสำเร็จ', 'success');
        if (isEditMode) {
          navigate({ to: backUrl });
        } else {
          navigate({
            to: '../',
            search: {
              subject_name,
              curriculum_group_name,
              year_name,
              year_id,
            },
          });
        }
      } else {
        showMessage(`เกิดข้อผิดพลาด: ${response.message}`, 'error');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      showMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (value: Status) => {
    setStatusValue(value);
  };

  const backUrl = `../../?subject_name=${encodeURIComponent(subject_name || '')}&curriculum_group_name=${encodeURIComponent(curriculum_group_name || '')}&year_name=${encodeURIComponent(year_name || '')}&subject_id=${encodeURIComponent(subjectId || '')}&year_id=${encodeURIComponent(year_id || '')}`;

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'การเรียนการสอน', href: '#' },
          { label: 'การบ้าน', href: '#' },
        ]}
      />
      <div className="my-5 flex items-center gap-3">
        <CWTitleBack
          label={isEditMode ? 'แก้ไขการบ้าน' : 'สร้างการบ้าน'}
          href={backUrl}
        />
      </div>
      <div className="flex w-full gap-5">
        <div className="w-[75%]">
          <div className="w-full">
            <SelectLesson
              templateName={templateName}
              setTemplateName={setTemplateName}
              selectedLesson={selectedLesson}
              setSelectedLesson={setSelectedLesson}
              setSelectedLevels={setSelectedLevels}
              selectedLevels={selectedLevels}
              isLoading={isLoading}
              subjectId={subjectId}
            />
          </div>
        </div>
        <SidePanel
          onClick={handleSaveTemplate}
          titleName="รหัสการบ้าน"
          statusValue={statusValue}
          status={handleStatusChange}
          isLoading={isLoading}
          isEditMode={isEditMode}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
