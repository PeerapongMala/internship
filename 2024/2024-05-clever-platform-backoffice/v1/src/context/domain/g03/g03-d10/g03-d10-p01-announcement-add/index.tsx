import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';
import CWSelect from '@component/web/cw-select';
import CWInput from '@component/web/cw-input';
import CWButton from '@component/web/cw-button';
import IconCamera from '@core/design-system/library/component/icon/IconCamera';
import StoreGlobal from '@global/store/global';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import InputDateTime from '../local/component/web/cw-input-datetime';
import CWEditor from '@component/web/cw-editor';
import showMessage from '@global/utils/showMessage';

import API from '../local/api';
import { BaseAnnouncementEntity } from '../local/type';
import { toDateTimeTH } from '@global/utils/date';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

const AddAnnouncement = () => {
  const navigator = useNavigate();
  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth < 768;
      StoreGlobal.MethodGet().TemplateSet(!isMobile);
      StoreGlobal.MethodGet().BannerSet(!isMobile);

      // ถ้าต้องการ redirect ในกรณีเฉพาะ
      if (isMobile && window.location.pathname !== '/line/teacher/announcement/add') {
        navigator({ to: '/line/teacher/announcement/add' });
      }
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigator]);
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
  useEffect((): void => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

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
      // console.log(announcementData);
      showMessage('สร้างประกาศเรียบร้อยแล้ว');
      await navigator({ to: `/teacher/announcement` });
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
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png'];

    if (files && files[0]) {
      const file = files[0];
      if (file.size > maxSize) {
        showMessage('ขนาดไฟล์ต้องไม่เกิน 5 MB', 'warning');
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        showMessage('กรุณาเลือกไฟล์รูปภาพเท่านั้น', 'warning');
        return;
      }
      setAnnouncementData((prev) => ({
        ...prev,
        announcement_image: file,
      }));
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <CWBreadcrumbs
        links={[
          {
            label: 'การเรียนการสอน',
            href: '/',
            disabled: true,
          },
          {
            label: 'จัดการประกาศ',
            href: '/teacher/announcement',
          },
          {
            label: 'สร้างประกาศ',
          },
        ]}
      />

      <div className="flex items-center gap-2.5">
        <div
          className="cursor-pointer p-2"
          onClick={() => {
            navigator({ to: '/teacher/announcement' });
          }}
        >
          <IconArrowBackward />
        </div>
        <span className="text-xl font-bold">สร้างประกาศ</span>
      </div>

      <div className="flex items-start gap-8">
        <div className="panel flex flex-[3] items-start gap-4">
          {/* Image Upload */}
          <div className="w-full max-w-[360px]">
            {announcementData.announcement_image ? (
              <label className="block cursor-pointer" htmlFor="upload-image">
                <img
                  src={URL.createObjectURL(announcementData.announcement_image)}
                  alt="preview"
                  className="h-auto max-h-[267px] w-full rounded border border-neutral-300 object-contain"
                />
              </label>
            ) : (
              <label
                className="flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-400 p-6 text-center text-neutral-400"
                htmlFor="upload-image"
              >
                <IconCamera className="size-10" />
                <p className="underline">อัปโหลดรูป</p>
                <p className="text-sm">รูปแบบ .jpg, .png | ขนาดไม่เกิน 5 MB</p>
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
          <div className="flex-1 space-y-4">
            {/* <div className="grid grid-cols-1 gap-4 border-b-2 border-neutral-200 pb-4 sm:grid-cols-2">
              <div>
                <CWSelect
                  label={'การเข้าถึง:'}
                  options={[
                    {
                      label: 'ระดับโรงเรียน',
                      value: 'School',
                    },
                  ]}
                  value={announcementData.scope}
                  required={false}
                  disabled={true}
                  onChange={(e) => handleInputChange('scope', e.target.value)}
                  className={'w-full'}
                />
              </div>
              <div>
                <CWSelect
                  label={'ประเภท:'}
                  options={[
                    {
                      label: 'ประกาศจากระบบ',
                      value: 'teacher',
                    },
                  ]}
                  value={announcementData.type}
                  required={true}
                  disabled={true}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className={'w-full'}
                />
              </div>
            </div> */}

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

            <div className="">
              <CWInput
                label={'หัวข้อ:'}
                required={true}
                value={announcementData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={''}
              />
            </div>

            <div className="">
              <CWEditor
                label={'เนื้อหา'}
                required={true}
                value={announcementData.description}
                onChange={(description) => handleInputChange('description', description)}
                inputClassName={'break-words'}
              />
            </div>
          </div>
        </div>

        <div className="panel flex-1 sm:max-w-lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
};

export default AddAnnouncement;
