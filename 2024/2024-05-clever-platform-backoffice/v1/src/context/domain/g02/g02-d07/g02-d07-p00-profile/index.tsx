import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { useCallback, useEffect, useState } from 'react';
import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';

import ProfileHeader from './component/web/template/wc-t-header';
import CWModalEdit from '@component/web/cw-modal/cw-modal-edit';
import {
  IGetAcademicProfileDataProps,
  IUpdateProfileReq,
  IUpdateProfileState,
} from '../local/api/repository/profile';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import { toDateTimeTH } from '@global/utils/date';
import CWInput from '@component/web/cw-input';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@store/global/persist';
import { Curriculum } from '@domain/g02/g02-d01/local/type';
import { useNavigate } from '@tanstack/react-router';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const DomainJSX = () => {
  const navigate = useNavigate();
  const { t } = useTranslation([ConfigJson.key]);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);

  useEffect(() => {
    if (!curriculumData) {
      navigate({
        to: '/curriculum',
      });
    } else if (!accessToken) {
      navigate({ to: '/' });
    }
  }, []);

  const { isOpen, close, open } = useModal();
  const [useProfileData, setProfileData] = useState<IGetAcademicProfileDataProps[]>([]);
  const [useCurrentData, setCurrentData] = useState<IUpdateProfileState>(
    {} as IUpdateProfileState,
  );

  const handleChangePassword = useCallback(async (password: string) => {
    if (!password) {
      showMessage(`โปรดกรอกรหัสผ่าน`, 'warning');
      return;
    }
    if (password) {
      try {
        const res = await API.academicProfile.PATCHG02D07A01({
          password: password,
        });
        if (res?.status_code === 200) {
          close();
          showMessage(`อัพเดทรหัสผ่านสำเร็จ`, 'success');
        }
      } catch (error) {
        showMessage(`Failed to fetch profile detail: ${error}`, 'error');
      }
    } else {
      showMessage(`Password is empty`, 'error');
      return;
    }
  }, []);

  const handleClickSubmit = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append('title', useCurrentData.title);
      formData.append('first_name', useCurrentData.first_name);
      formData.append('last_name', useCurrentData.last_name);
      formData.append('status', useCurrentData.status);
      if (useCurrentData?.profile_image) {
        formData.append('profile_image', useCurrentData.profile_image);
      }
      const res = await API.academicProfile.PATCHG02D07A03(formData);
      if (res?.status_code === 200) {
        const updatedData = {
          first_name: useCurrentData.first_name,
          image_url: useCurrentData.image_url ?? useCurrentData.profile_image,
        };
        (
          StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
        ).updateUserData(updatedData);
        close();
        showMessage(`อัพเดทโปรไฟล์สำเร็จ`, 'success');
      }
    } catch (error) {
      showMessage(`Failed to update profile : ${error}`, 'error');
    }
  }, [useCurrentData]);

  const handleInputChange = (key: keyof IUpdateProfileReq, value: string | File) => {
    const newCurrentData = { ...useCurrentData };
    newCurrentData[key] = value as string & File;
    setCurrentData(newCurrentData);
  };

  useEffect(() => {
    const fetchMockData = async () => {
      try {
        const res = await API.academicProfile.GETG02D07A02();
        if (res.status_code === 200) {
          setProfileData(res?.data ?? null);
          setCurrentData({ ...res?.data[0], ...useCurrentData });
          const updatedData = {
            image_url: res.data[0].image_url,
          };
          (
            StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
          ).updateUserData(updatedData);
        }
      } catch (error) {
        showMessage(`Failed to fetch profile detail: ${error}`, 'error');
      }
    };
    fetchMockData();
  }, []);

  return (
    <LayoutDefault>
      <div className="flex flex-col gap-y-5 font-noto-sans-thai text-[#0E1726]">
        <ProfileHeader />

        <CWModalEdit
          title="กำหนดรหัสผ่าน"
          label="รหัสผ่าน"
          placeholder="กรุณากรอกรหัสผ่านใหม่"
          okButtonText="ตกลง"
          open={isOpen}
          onClose={() => {
            close();
          }}
          onSave={(value) => {
            handleChangePassword(value);
          }}
        />

        {useProfileData && useProfileData?.length > 0 && (
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex w-[70%] flex-1 flex-col gap-6 rounded-md bg-white p-6 shadow-md">
              <div className="flex w-full gap-6">
                <div className="flex min-h-[235px] w-[235px] min-w-[235px] flex-col items-center gap-[10px]">
                  <div className="aspect-square h-60 overflow-hidden rounded-full">
                    {useCurrentData?.profile_image ? (
                      <img
                        src={URL.createObjectURL(useCurrentData.profile_image)}
                        alt="Profile Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : useProfileData?.[0]?.image_url ? (
                      <img
                        src={useProfileData[0].image_url}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-300 text-neutral-500">
                        ไม่มีรูป
                      </div>
                    )}
                  </div>
                  <input
                    id="upload-button"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imageUrl = URL.createObjectURL(file);
                        setCurrentData({
                          ...useCurrentData,
                          profile_image: file,
                          image_url: imageUrl,
                        });
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="upload-button"
                    className="btn btn-outline-primary cursor-pointer"
                  >
                    อัพโหลดรูป
                  </label>

                  <span className="mt-2 text-xs text-gray-400">ขนาดแนะนำ: 60x60</span>
                </div>

                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-semibold">ข้อมูลทั่วไป</h2>

                  {/* <div className="w-1/3 pr-4">
                    <label className="mb-1 block text-sm text-gray-700">
                      ตำแหน่ง <span className="text-red-500">*</span>
                    </label>
                    <select className="form-select w-full" required>
                      <option>นักวิชาการ</option>
                      <option>อาจารย์</option>
                      <option>ผู้ช่วยสอน</option>
                    </select>
                  </div> */}

                  <CWInput
                    label={'ตำแหน่ง:'}
                    required
                    disabled
                    className="w-1/3 pr-4"
                    value={'นักวิชาการ'}
                  />

                  <div className="flex w-full flex-1 flex-col gap-2">
                    <div className="flex w-full items-center gap-6">
                      <CWInput
                        label={'คำนำหน้า:'}
                        required
                        className="w-1/3"
                        value={useCurrentData?.title || useProfileData[0]?.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />

                      <CWInput
                        label={'ชื่อ:'}
                        required
                        className="w-1/3"
                        value={
                          useCurrentData?.first_name || useProfileData[0]?.first_name
                        }
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                      />
                      <CWInput
                        label={'นามสกุล:'}
                        required
                        className="w-1/3"
                        value={useCurrentData?.last_name || useProfileData[0]?.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                      />
                    </div>
                    <CWInput
                      label="อีเมล"
                      required
                      className="w-1/3 pr-4"
                      value={useProfileData[0]?.email}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ส่วนข้อมูลรายละเอียด */}
            <div className="flex h-fit w-[30%] min-w-[340px] flex-col gap-4 rounded-md bg-white p-4 shadow">
              <div className="grid grid-cols-2 items-center gap-y-4">
                <div>รหัสผู้ใช้งาน</div>
                <div>{useProfileData[0]?.id}</div>

                <div>สถานะ</div>
                <div>{useProfileData[0]?.status === 'enabled' ? 'ใช้งาน' : ''}</div>

                <div>แก้ไขล่าสุด</div>
                <div>{toDateTimeTH(useProfileData[0]?.updated_at) ?? '-'}</div>

                <div>แก้ไขล่าสุดโดย</div>
                <div>{useProfileData[0]?.updated_by}</div>
              </div>

              <button
                className="w-full rounded-md bg-primary py-2 font-bold text-white shadow-2xl"
                onClick={(e) => {
                  e?.preventDefault();
                  handleClickSubmit();
                }}
              >
                บันทึก
              </button>
              <button
                className="w-full rounded-md bg-primary py-2 font-bold text-white shadow-2xl"
                onClick={(e) => {
                  e?.preventDefault();
                  open();
                }}
              >
                กำหนดรหัสผ่าน
              </button>
            </div>
          </div>
        )}
      </div>
    </LayoutDefault>
  );
};

export default DomainJSX;
