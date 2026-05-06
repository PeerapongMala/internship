import StoreGlobalPersist, { IStoreGlobalPersist } from '@store/global/persist';
import { useEffect, useState } from 'react';
import { Curriculum } from '../local/type';
import { Link, useNavigate } from '@tanstack/react-router';
import StoreGlobal from '@store/global';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { IBugReportProps } from '@domain/g04/g04-d05/local/type';
import CWTitleBack from '@component/web/cw-title-back';

import SidePanel from '@domain/g04/g04-d07/local/components/web/organism/Sidepanel';
import ProfileDetail from '@domain/g04/g04-d07/local/components/web/organism/ProfileDetail';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import {
  IGetProfileDataProps,
  IUpdateProfileReq,
  IUpdateProfileState,
} from '../local/api/repository/profile';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const DomainJSX = () => {
  const navigate = useNavigate();
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const { isOpen, close, open } = useModal();

  const [useProfileData, setProfileData] = useState<IGetProfileDataProps[]>([]);
  const [useCurrentData, setCurrentData] = useState<IUpdateProfileState>(
    {} as IUpdateProfileState,
  );

  const handleResetPassword = async (password: string) => {
    if (!password) {
      showMessage(`โปรดกรอกรหัสผ่าน`, 'warning');
      return;
    }
    const fetchMockData = async () => {
      if (password) {
        try {
          const res = await API.bugReport.PATCHG04D07A03({
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
        showMessage(`โปรดกรอกรหัสผ่าน`, 'warning');
        return;
      }
    };
    fetchMockData();
  };

  const handleSubmitForm = async () => {
    const fetchMockData = async () => {
      try {
        const formData = new FormData();
        formData.append('title', useCurrentData.title);
        formData.append('first_name', useCurrentData.first_name);
        formData.append('last_name', useCurrentData.last_name);
        if (useCurrentData?.profile_image) {
          formData.append('profile_image', useCurrentData.profile_image);
        }
        const res = await API.bugReport.PATCHG04D07A02(formData);
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
          fetchData();
        }
      } catch (error) {
        showMessage(`Failed to update profile : ${error}`, 'error');
      }
    };
    fetchMockData();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setCurrentData({
        ...useCurrentData,
        profile_image: file,
        image_url: imageUrl,
      });
    }
  };

  const handleInputChange = (key: keyof IUpdateProfileReq, value: string | File) => {
    const newCurrentData = { ...useCurrentData };
    newCurrentData[key] = value as string & File;
    setCurrentData(newCurrentData);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const res = await API.bugReport.GetG04D07A01();
      if (res.status_code === 200) {
        setProfileData(res?.Data ?? null);
        setCurrentData({ ...res?.Data[0], ...useCurrentData });
        const updatedData = {
          image_url: res.Data[0].image_url,
        };
        (
          StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
        ).updateUserData(updatedData);
      }
    } catch (error) {
      showMessage(`Failed to fetch profile detail: ${error}`, 'error');
    }
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <CWBreadcrumbs
        links={[
          { label: 'สำหรับแอดมิน', href: '#' },
          { label: 'จัดการผู้ใช้งาน', href: '#' },
          { label: 'แก้ไขโปรไฟล์', href: '#' },
        ]}
      />

      <CWTitleBack label="แก้ไขโปรไฟล์" href="/gamemaster/announcement" />

      <div className="flex w-full gap-4">
        <ProfileDetail
          imageUrl={useCurrentData?.image_url || useProfileData[0]?.image_url}
          title={useCurrentData?.title || useProfileData[0]?.title}
          firstName={useCurrentData?.first_name || useProfileData[0]?.first_name}
          lastName={useCurrentData?.last_name || useProfileData[0]?.last_name}
          email={useProfileData[0]?.email}
          handleImageChange={handleImageUpload}
          handleInputChange={handleInputChange}
        />
        <SidePanel
          isOpenModal={isOpen}
          handleOpenModalResetPassword={open}
          handleCloseModalResetPassword={close}
          handleClickSubmitResetPassword={handleResetPassword}
          handleClickSubmit={handleSubmitForm}
          id={useProfileData[0]?.id}
          updatedAt={useProfileData[0]?.updated_at}
          updateBy={useProfileData[0]?.updated_by}
          isEnabled={useProfileData[0]?.status}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
