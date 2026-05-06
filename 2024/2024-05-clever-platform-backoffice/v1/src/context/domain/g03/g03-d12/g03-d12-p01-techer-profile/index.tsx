import StoreGlobalPersist, { IStoreGlobalPersist } from '@store/global/persist';
import { useCallback, useEffect, useState } from 'react';
import { Curriculum } from '../local/type';
import { useNavigate } from '@tanstack/react-router';
import StoreGlobal from '@store/global';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleBack from '@component/web/cw-title-back';
import SidePanel from '@domain/g04/g04-d07/local/components/web/organism/Sidepanel';
import ProfileDetail from '@domain/g04/g04-d07/local/components/web/organism/ProfileDetail';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import {
  IGetProfileTeacherDataProps,
  IUpdateProfileState,
  IUpdateTeacherProfileReq,
} from '../local/api/repository/profile';
import Tabs from '@component/web/cw-tabs';
import CWWhiteBox from '@component/web/cw-white-box';
import CWInput from '@component/web/cw-input';
import CWButton from '@component/web/cw-button';
import LineIcon from '../local/asset/LineIcon.svg';
import LineIcon2 from '../local/asset/LineIcon.svg';
import { toDateTimeTH } from '@global/utils/date';
import config from '@core/config';

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

  useEffect(() => {
    if (!accessToken) {
      navigate({ to: '/' });
    }
  }, []);

  const { isOpen, close, open } = useModal();

  const [useProfileData, setProfileData] = useState<IGetProfileTeacherDataProps[]>([]);
  const [useCurrentData, setCurrentData] = useState<IUpdateProfileState>(
    {} as IUpdateProfileState,
  );
  const [useSelectTab, setSelectTab] = useState<string>('detail');

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const res = await API.bugReport.GetG03D12A01();
      if (res.status_code === 200 && res.Data && res.Data.length > 0) {
        setProfileData(res.Data);
        setCurrentData((prev) => ({ ...prev, ...res.Data[0] }));
        const updatedData = {
          image_url: res.Data[0].image_url,
        };
        (
          StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']
        ).updateUserData(updatedData);
      } else {
        setProfileData([]);
        setCurrentData({} as IUpdateProfileState);
      }
    } catch (error) {
      showMessage(`Failed to fetch profile detail: ${error}`, 'error');
      setProfileData([]);
      setCurrentData({} as IUpdateProfileState);
    }
  };

  const handleResetPassword = useCallback(async (password: string) => {
    if (!password) {
      showMessage(`โปรดกรอกรหัสผ่าน`, 'warning');
      return;
    }
    if (password) {
      try {
        const res = await API.bugReport.PATCHG03D12A02({
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

  const handleSubmitForm = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append('title', useCurrentData.title);
      formData.append('first_name', useCurrentData.first_name);
      formData.append('last_name', useCurrentData.last_name);
      formData.append('status', useCurrentData.status);
      if (useCurrentData?.profile_image) {
        formData.append('profile_image', useCurrentData.profile_image);
      }
      const res = await API.bugReport.PATCHG03D12A03(formData);
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
  }, [useCurrentData]);

  const handleOnClickDeleteOauth = async () => {
    try {
      const res = await API.bugReport.PATCHG03D12A04({
        provider: 'line',
      });
      if (res?.status_code === 200) {
        fetchData();
        showMessage(`Delete line oauth success`, 'success');
      }
    } catch (error) {
      showMessage(`Failed to delete line oauth : ${error}`, 'error');
    }
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

  const handleInputChange = (
    key: keyof IUpdateTeacherProfileReq,
    value: string | File,
  ) => {
    const newCurrentData = { ...useCurrentData };
    newCurrentData[key] = value as string & File;
    setCurrentData(newCurrentData);
  };

  const handledLinkBack = () => {
    return '/teacher/dashboard';
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <CWBreadcrumbs
        links={[
          { label: 'บัญชี', href: '#' },
          { label: 'ข้อมูลครู', href: '#' },
        ]}
      />

      <CWTitleBack label="แก้ไขโปรไฟล์" href={handledLinkBack()} />

      <Tabs
        currentTab={useSelectTab}
        setCurrentTab={(value) => {
          setSelectTab(value);
        }}
        tabs={[
          { label: 'ข้อมูลครู', value: 'detail' },
          { label: 'จัดการบัญชี', value: 'account' },
        ]}
      />

      {useSelectTab === 'detail' && (
        <>
          <div className="flex w-full gap-4">
            <ProfileDetail
              imageUrl={useCurrentData?.image_url || useProfileData[0]?.image_url}
              title={useCurrentData?.title || useProfileData[0]?.title}
              firstName={useCurrentData?.first_name || useProfileData[0]?.first_name}
              lastName={useCurrentData?.last_name || useProfileData[0]?.last_name}
              email={useProfileData[0]?.email}
              handleImageChange={handleImageUpload}
              handleInputChange={handleInputChange}
              role={'ครู'}
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
        </>
      )}

      {useSelectTab === 'account' && (
        <div className="flex w-full gap-4">
          <CWWhiteBox className="flex h-fit min-h-[407px] w-full flex-1 flex-col gap-6">
            <div className="flex h-[56px] w-full items-center">
              <p className="flex text-[18px] font-bold leading-7 text-[#0E1726]">
                ข้อมูลบัญชี
              </p>
            </div>
            <div className="flex w-full flex-col gap-6">
              <CWInput
                label={'อีเมล:'}
                required
                className="w-1/3"
                value={useProfileData[0]?.email}
                disabled
              />
              <div className="flex h-[56px] w-full items-center">
                <p className="flex text-[18px] font-bold leading-7 text-[#0E1726]">
                  การเชื่อมต่อบัญชี
                </p>
              </div>
              <div className="flex w-full justify-between p-2">
                <div className="flex h-fit w-full flex-1 gap-4">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/LINE_New_App_Icon_%282020-12%29.png/480px-LINE_New_App_Icon_%282020-12%29.png"
                    alt=""
                    className="h-[50px] w-[50px]"
                  />
                  <div className="flex flex-col justify-between gap-1">
                    <div className="text-lg font-bold">Line</div>
                    <div className="text-sm text-neutral-500">
                      {useProfileData[0]?.line_user_id
                        ? useProfileData[0]?.line_user_id
                        : '-'}
                    </div>
                  </div>
                </div>
                {useProfileData[0]?.line_user_id && (
                  <CWButton
                    variant="danger"
                    className="w-[149px] min-w-[149px]"
                    title="ยกเลิกการเชื่อมต่อ"
                    onClick={handleOnClickDeleteOauth}
                  />
                )}
              </div>
            </div>
          </CWWhiteBox>
          <div className={`h-fit min-w-[437px] xl:w-[30%]`}>
            <div className="flex h-fit w-full flex-col gap-4 rounded-lg bg-white p-4 shadow-md">
              <div className="flex items-center">
                <p className="block w-[50%] text-sm text-[#0E1726]">รหัสผู้ใช้งาน</p>
                <p className="w-full">{useProfileData[0]?.id || '-'}</p>
              </div>

              <div className="flex items-center">
                <p className="block w-[50%] text-sm text-[#0E1726]">สถานะ</p>
                <p className="w-full">
                  {useProfileData[0]?.status === 'enabled'
                    ? 'ใช้งาน'
                    : useProfileData[0]?.status || '-'}
                </p>
              </div>

              <div className="flex items-center">
                <p className="block w-[50%] text-sm text-[#0E1726]">แก้ไขล่าสุด</p>
                <p className="w-full">
                  {toDateTimeTH(useProfileData[0]?.updated_at ?? '-')}
                </p>
              </div>

              <div className="flex items-center">
                <p className="block w-[50%] text-sm text-[#0E1726]">แก้ไขล่าสุดโดย</p>
                <p className="w-full">{useProfileData[0]?.updated_by}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainJSX;
