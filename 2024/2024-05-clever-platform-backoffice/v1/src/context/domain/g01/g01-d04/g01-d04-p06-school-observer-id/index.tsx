import CWTitleBack from '@component/web/cw-title-back';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import API from '../local/api';
import UserStatusInfo from './component/web/molecule/UserStatusInfo';
import CWModalPopupSaveError from '@component/web/cw-modal/cw-modal-popup-save-error';
import CWModalPopupSaveComplete from '@component/web/cw-modal/cw-modal-popup-save-complete';
import { IObserverAccess, IObserverInput, IObserverResponse } from '../local/type';
import CWTLayout from '@domain/g01/g01-d05/local/component/web/template/cw-t-layout';
import StoreGlobal from '@store/global';
import FormObserverInfo from './component/web/template/wc-t-form-observer-info';
import FormObserverAccount from './component/web/template/wc-t-form-observer-account';
import WCAIconChevronLeft from '@component/web/atom/wc-a-icons/iconChevronLeft';
import showMessage from '@global/utils/showMessage';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward.tsx';
const tabsList = [
  { key: 'info', label: 'ข้อมูลทั่วไป' },
  // { key: "password", label: "เปลี่ยนรหัสผ่าน" },
];

// Components
const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const SchoolObserverId = () => {
  const navigate = useNavigate();
  const { schoolId, observerId } = useParams({ strict: false });
  const modalComplete = useModal();
  const modalError = useModal();
  //
  const [selectedTab, setSelectedTab] = useState('info');
  const [school, setSchool] = useState<{ id: string | number; name: string }>();

  const [observerAccessItems, setObserverAccessItems] = useState<IObserverAccess[]>([]);

  const [inputValueObserver, setInputValueObserver] = useState<IObserverInput>({
    id: '',
    title: '',
    first_name: '',
    last_name: '',
    profile_image_file: null,
    profile_path: '',
    status: '',
    email: '',
    observer_accesses: [],
  });

  const [updateStatus, setUpdateStatus] = useState<{
    updateAt?: string | null;
    updateBy?: string | null;
  }>();

  useEffect(() => {
    // show controller nav
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  useEffect(() => {
    if (schoolId) {
      API.school.GetById(schoolId).then((res) => {
        if (res.id && res.name) {
          setSchool({
            id: res.id,
            name: res.name,
          });
        }
      });
    }
  }, [schoolId]);

  useEffect(() => {
    if (observerId) {
      fetchGetObserverDetailById(observerId);
    }
  }, [observerId]);

  const fetchGetObserverDetailById = async (observerId: string) => {
    try {
      const response = (await API.schoolObserver.GetById(observerId)) as {
        data: IObserverResponse[];
        status_code: number;
      };

      if (response.status_code === 200) {
        const observer = response.data[0];
        setUpdateStatus({
          updateAt: observer.updated_at,
          updateBy: observer.updated_by,
        });
        setObserverAccessItems(observer.observer_accesses);
        setInputValueObserver({
          id: observer.id,
          title: observer.title,
          first_name: observer.first_name,
          last_name: observer.last_name,
          profile_image_file: null,
          profile_path: observer.image_url || '',
          status: observer.status,
          email: observer.email,
          observer_accesses: observer.observer_accesses,
        });
      }
    } catch (error) {
      console.error('Failed to fetch observer detail', error);
    }
  };

  function handleOnBack() {
    navigate({
      to: '../..',
      search: {
        tab: 'user-management',
      },
    });
  }

  const handleUpdateObserver = async (observerId: string, value: IObserverInput) => {
    if (observerId && schoolId) {
      const formData = new FormData();

      formData.append('title', value.title);
      formData.append('first_name', value.first_name);
      formData.append('last_name', value.last_name);
      formData.append('status', value.status);
      formData.append('email', value.email);

      if (value.profile_image_file) {
        formData.append('profile_image', value.profile_image_file);
      }

      try {
        const response = await API.schoolObserver.Update(observerId, formData);
        if (response.status_code === 200) {
          // Update observer accesses
          const accessIds = value.observer_accesses.map(
            (access) => access.observer_access_id,
          );
          await API.schoolObserver.UpdateObserverAccesses(observerId, accessIds);

          setUpdateStatus({
            updateAt: response.data.updated_at,
            updateBy: response.data.updated_by,
          });
          showMessage('แก้ไขผู้สังเกตสำเร็จ', 'success');
          navigate({ to: `/admin/school/${schoolId}?tab=user-management` });
        } else {
          showMessage('แก้ไขผู้สังเกตไม่สำเร็จ', 'error');
        }
      } catch (err) {
        console.error('Failed to update observer', err);
        modalError.open();
      }
    }
  };

  const handleUpdatePassword = async (observerId: string, password: any) => {
    if (observerId && schoolId) {
      try {
        // Send the FormData via the API
        const response = (await API.schoolTeacher.ResetPassword({
          user_id: observerId,
          password: password,
        })) as { status_code: number };

        if (response.status_code === 200) {
          modalComplete.open();
          modalError.close();
        } else {
          modalComplete.close();
          modalError.open();
        }
      } catch (error) {
        console.error('Failed to fetch observer', error);
      }
    }
  };

  return (
    <>
      <CWModalPopupSaveError
        open={modalError.isOpen}
        onClose={() => {
          modalError.close();
        }}
      />

      <CWModalPopupSaveComplete
        open={modalComplete.isOpen}
        onClose={() => {
          modalComplete.close();
        }}
      />

      <CWTLayout
        breadcrumbs={[
          { text: 'สำหรับแอดมิน', href: '/', disabled: true },
          { text: 'จัดการโรงเรียน', href: '/admin/school' },
          { text: school?.name ?? 'โรงเรียน', href: '../?tab=school-info' },
          {
            text: 'จัดการผู้ใช้งาน',
            href: '/admin/school/1?tab=user-management&tablist=observer',
          },
          { text: 'ข้อมูลผู้สังเกตการณ์', href: '/' },
        ]}
      >
        <div className="flex flex-col gap-5 font-noto-sans-thai">
          <div className="gap-[10px] rounded-md bg-neutral-100 py-2">
            <div className="flex space-x-2 text-left text-xl font-bold text-neutral-900">
              <button className="pl-2" onClick={handleOnBack}>
                <IconArrowBackward />
              </button>
              <span>แก้ไขโปรไฟล์</span>
            </div>
          </div>

          <CWMTabs
            items={tabsList.map((t) => t.label)}
            currentIndex={tabsList.findIndex((tab) => tab.key === selectedTab)}
            onClick={(index) => setSelectedTab(tabsList[index].key)}
          />

          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex w-full flex-col gap-6 md:w-3/4">
              {selectedTab === 'info' && (
                <FormObserverInfo
                  observerInput={inputValueObserver}
                  setObserverInput={setInputValueObserver}
                  observerAccesses={observerAccessItems}
                />
              )}
              {selectedTab === 'password' && (
                <FormObserverAccount
                  observerId={observerId}
                  observerInput={inputValueObserver}
                />
              )}
            </div>
            <UserStatusInfo
              inputValueObserver={inputValueObserver}
              setInputValueObserver={setInputValueObserver}
              updateStatus={updateStatus}
              onSubmit={() => {
                if (observerId) {
                  handleUpdateObserver(observerId, inputValueObserver);
                }
              }}
            />
          </div>
        </div>
      </CWTLayout>
    </>
  );
};

export default SchoolObserverId;
