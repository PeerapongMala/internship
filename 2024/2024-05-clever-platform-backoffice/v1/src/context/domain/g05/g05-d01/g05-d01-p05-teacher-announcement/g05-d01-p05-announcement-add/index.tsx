import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';
import CWSelect from '@component/web/cw-select';
import CWInput from '@component/web/cw-input';
import CWButton from '@component/web/cw-button';
import IconCamera from '@core/design-system/library/component/icon/IconCamera';
import StoreGlobal from '@global/store/global';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import InputDateTime from '../local/component/web/molecule/InputDateTime';
import CWEditor from '@component/web/cw-editor';
import showMessage from '@global/utils/showMessage';

import API from '../local/api';
import { BaseAnnouncementEntity } from '../local/type';
import { toDateTimeTH } from '@global/utils/date';
import LineLiffPage from '../../local/component/web/template/cw-t-lineliff-page';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';

const AddAnnouncement = () => {
  const navigator = useNavigate();

  const requiredFields = [
    { key: 'scope', label: 'การเข้าถึง' },
    { key: 'type', label: 'ประเภท' },
    { key: 'started_at', label: 'วันที่เริ่มเผยแพร่' },
    { key: 'ended_at', label: 'วันที่หยุดเผยแพร่' },
    { key: 'title', label: 'หัวข้อ' },
    { key: 'description', label: 'เนื้อหา' },
    { key: 'status', label: 'สถานะ' },
  ];

  const [announcementData, setAnnouncementData] = useState<BaseAnnouncementEntity>({
    scope: 'School',
    type: 'teacher',
  } as BaseAnnouncementEntity);

  const [isValidData, setIsValidData] = useState<boolean>(false);

  // Sidebar
  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);

      // ถ้าต้องการ redirect ในกรณีเฉพาะ
      if (isMobile && window.location.pathname !== '/teacher/announcement/add') {
        navigator({ to: '/teacher/announcement/add' });
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigator]);

  useEffect((): void => {
    for (const field of requiredFields) {
      if (!announcementData[field.key as keyof BaseAnnouncementEntity]) {
        return setIsValidData(false);
      }
    }
    setIsValidData(true);
  }, [announcementData]);

  const handleSave = async () => {
    const savedData = localStorage.getItem('storage-user');
    if (!savedData) return showMessage('เกิดข้อผิดพลาด', 'error');

    for (const field of requiredFields) {
      if (!announcementData[field.key as keyof BaseAnnouncementEntity]) {
        showMessage(`กรุณากรอกข้อมูล: ${field.label}`, 'info');
        return;
      }
    }

    try {
      const res = await API.announcement.Create(announcementData);
      console.log(res);
      showMessage('สร้างประกาศเรียบร้อยแล้ว');
      await navigator({ to: `/line/teacher/announcement` });
    } catch (error) {
      console.error('Error saving announcement data:', error);
      showMessage('เกิดข้อผิดพลาด', 'error');
    }
  };

  const handleInputChange = (key: keyof BaseAnnouncementEntity, value: string) => {
    setAnnouncementData((prev) => {
      const updates: Partial<BaseAnnouncementEntity> = { [key]: value };
      return { ...prev, ...updates };
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      setAnnouncementData((prev) => ({
        ...prev,
        announcement_image: file,
      }));
    }
  };

  return (
    <LineLiffPage>
      <div className="flex w-full flex-col items-center gap-5 p-5">
        <div className="flex items-center gap-2.5">
          <div
            className="cursor-pointer p-2"
            onClick={() => {
              navigator({ to: '/line/teacher/announcement' });
            }}
          >
            <IconArrowBackward />
          </div>
          <span className="text-xl font-bold">สร้างประกาศ</span>
        </div>

        <div className="flex w-full justify-center">
          <div className="flex w-full flex-col items-center gap-4">
            {/* Image Upload */}
            <div>
              {announcementData.announcement_image ? (
                <label className="cursor-pointer" htmlFor="upload-image">
                  <img
                    src={URL.createObjectURL(announcementData.announcement_image)}
                    alt="preview image"
                    className="h-[267px] w-[360px] object-cover"
                  />
                </label>
              ) : (
                <label
                  className="flex h-[267px] w-[360px] cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed border-neutral-400 p-5 text-neutral-400"
                  htmlFor="upload-image"
                >
                  <IconCamera className="size-10" />
                  <p className="underline">อัปโหลดรูป</p>
                  <p>format: .jpg, .png | ขนาดไม่เกิน xx MB</p>
                </label>
              )}
              <input
                id="upload-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {/*  Form */}
            <div className="flex w-full flex-col items-center gap-4">
              <InputDateTime
                label={'วันที่เริ่มเผยแพร่:'}
                required={true}
                className="w-full border"
                value={announcementData.started_at}
                onChange={(date) => handleInputChange('started_at', date)}
              />

              <InputDateTime
                label={'วันที่หยุดเผยแพร่:'}
                required={true}
                className="w-full border"
                value={announcementData.ended_at}
                onChange={(date) => handleInputChange('ended_at', date)}
              />

              <div className="w-full">
                <CWInput
                  label={'หัวข้อ:'}
                  required={true}
                  value={announcementData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="w-full">
                <CWEditor
                  label={'เนื้อหา'}
                  required={true}
                  value={announcementData.description}
                  onChange={(description) =>
                    handleInputChange('description', description)
                  }
                  inputClassName={'break-words'}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center">
          <div className="flex w-full flex-col items-center gap-4">
            <div className="grid w-full grid-cols-2 gap-4">
              {/* Announce_ID */}
              <label className="">รหัสประกาศ:</label>
              <p>{announcementData.id || '-'}</p>

              {/* Status */}
              <label className="">สถานะ:</label>
              <CWSelect
                options={[
                  {
                    label: 'ใช้งาน',
                    value: 'enabled',
                  },
                  {
                    label: 'ไม่ใช้งาน',
                    value: 'disabled',
                  },
                  {
                    label: 'แบบร่าง',
                    value: 'draft',
                  },
                ]}
                value={announcementData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className={'flex-1'}
              />

              <label className="">แก้ไขล่าสุด:</label>
              <p>
                {announcementData.updated_at
                  ? toDateTimeTH(new Date(announcementData.updated_at)).toString()
                  : '-'}
              </p>

              <label className="">แก้ไขล่าสุดโดย:</label>
              <p>{announcementData.updated_by || '-'}</p>
            </div>

            <CWButton
              title="บันทึก"
              onClick={handleSave}
              className="mt-2 w-full"
              disabled={!isValidData}
            />
          </div>
        </div>
      </div>
      <FooterMenu />
    </LineLiffPage>
  );
};

export default AddAnnouncement;
