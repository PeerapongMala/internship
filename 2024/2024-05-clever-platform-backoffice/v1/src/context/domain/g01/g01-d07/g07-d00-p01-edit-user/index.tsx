import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import CWTLayout from '@domain/g01/g01-d05/local/component/web/template/cw-t-layout';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import { useNavigate } from '@tanstack/react-router';
import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown.tsx';
import { ParentsAccountResponse, USER_ROLES } from '../local/type';
import API from '../local/api';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward.tsx';
import CWInput from '@component/web/cw-input';
import CWInputCheckbox from '@component/web/cw-input-checkbox';
import { ObserverData, ParentData, NormalUserData, UserDataResponse } from './types';
import { ObserverAccessResponse } from '../local/type';
import showMessage from '@global/utils/showMessage';
import EditInfo from './component/web/template/edit-info';
import PasswordChange from './component/web/template/password-change';
import SaveInfo from './component/web/template/save-intfo';
import { BrowserRouter } from 'react-router-dom';
import usePagination from '@global/hooks/usePagination';

const getTabsList = (type: string) => {
  if (type === 'parent') {
    return [
      { key: 'info', label: 'ข้อมูลทั่วไป' },
      { key: 'account', label: 'ข้อมูลบัญชี' },
    ] as const;
  }
  return [{ key: 'info', label: 'ข้อมูลทั่วไป' }] as const;
};

const statusOptions = [
  { value: 'enabled', label: 'ใช้งาน' },
  { value: 'disabled', label: 'ไม่ใช้งาน' },
  { value: 'draft', label: 'แบบร่าง' },
];

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  const [selectedOptions, setSelectedOptions] = useState({
    affiliation: '',
  });
  const [affiliationList, setAffiliationList] = useState<string[]>([]);

  const dropdownConfigs: {
    key: keyof typeof selectedOptions;
    options: string[];
    placeholder: string;
  }[] = [
    {
      key: 'affiliation',
      options: affiliationList,
      placeholder: 'ความรับผิดชอบ',
    },
  ];

  const [userData, setUserData] = useState<
    ObserverData | ParentData | NormalUserData | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [observerAccesses, setObserverAccesses] = useState<ObserverAccessResponse[]>([]);
  const [pendingRoles, setPendingRoles] = useState<number[]>([]);
  const [pendingPassword, setPendingPassword] = useState<string>('');
  const [pendingImage, setPendingImage] = useState<File | null>(null);

  // เพิ่ม state ควบคุมการ submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  // เพิ่ม function สำหรับตรวจสอบ path
  const getPageType = () => {
    const path = window.location.pathname;
    if (path.includes('/parent/')) {
      return 'parent';
    } else if (path.includes('/observer/')) {
      return 'observer';
    } else if (path.includes('/content-creator/')) {
      return 'content-creator';
    }
    return 'normal';
  };

  //  function สำหรับตรวจสอบว่าเป็นการสร้างหรือแก้ไข
  const isCreateMode = () => {
    return window.location.pathname.includes('/create');
  };

  const getPageTitle = () => {
    const type = getPageType();
    const mode = isCreateMode() ? 'เพิ่ม' : 'แก้ไข';
    switch (type) {
      case 'parent':
        return `${mode}ข้อมูลผู้ปกครอง`;
      case 'observer':
        return `${mode}ข้อมูลผู้สังเกตการณ์`;
      case 'content-creator':
        return `${mode}ข้อมูลนักวิชาการ`;
      case 'normal':
        return `${mode}ข้อมูลแอดมิน`;
      default:
        return `${mode}ข้อมูลผู้ใช้งาน`;
    }
  };

  const Section = ({
    title,
    children,
    className,
  }: {
    title: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={`relative flex flex-col rounded-md bg-white p-4 shadow dark:bg-black ${className}`}
    >
      <p className="pb-4 text-lg font-bold">{title}</p>
      {children}
    </div>
  );

  const fetchUserData = async () => {
    try {
      const pathSegments = window.location.pathname.split('/');
      const userId = pathSegments[pathSegments.length - 1];
      const type = getPageType();

      let response;
      switch (type) {
        case 'observer':
          response = await API.observersAccount.GetById(userId);
          break;
        case 'parent':
          response = await API.parentsAccount.GetById(userId);
          break;
        default:
          response = await API.adminUserAccount.GetById(userId);
      }

      console.log('API Response:', response);
      setUserData(response as ObserverData | ParentData | NormalUserData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const fetchObserverAccesses = async (accessName?: string) => {
    try {
      const response = await API.observersAccount.GetObserverAccesses(
        accessName
          ? { access_name: accessName, page: pagination.page, limit: pagination.limit }
          : { page: pagination.page, limit: pagination.limit },
      );
      if ('data' in response) {
        setObserverAccesses(response.data);
        setPagination((prev) => ({
          ...prev,
          total_count: response._pagination.total_count,
        }));
      }
    } catch (error) {
      console.error('Error fetching observer accesses:', error);
    }
  };

  useEffect(() => {
    fetchObserverAccesses();
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const type = getPageType();

        if (type === 'observer') {
          await fetchObserverAccesses();
        }

        if (!isCreateMode()) {
          await fetchUserData();
        } else {
          if (type === 'parent') {
            navigate({ to: '/admin/user-account' });
            return;
          }

          const baseData = {
            id: '',
            email: '',
            title: '',
            first_name: '',
            last_name: '',
            id_number: null,
            image_url: null,
            status: 'draft' as const,
            created_at: '',
            last_login: '',
            created_by: null,
            updated_at: null,
            updated_by: null,
          };

          let initialData: ObserverData | NormalUserData;
          if (type === 'observer') {
            initialData = { ...baseData, observer_accesses: [] } as ObserverData;
            setPendingRoles([USER_ROLES.OBSERVER]);
          } else {
            initialData = { ...baseData, roles: [] } as NormalUserData;
            const path = window.location.pathname;
            if (path.includes('/content-creator/')) {
              setPendingRoles([USER_ROLES.CONTENT_CREATOR]);
            }
          }

          setUserData(initialData);
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (userData && 'roles' in userData && pendingRoles.length === 0) {
      setPendingRoles(userData.roles);
    }
  }, [userData]);

  const handleInputChange = (field: string, value: string) => {
    if (userData) {
      setUserData({ ...userData, [field]: value });
    }
  };
  // check file
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const checkFileSize = (file: File): boolean => {
    return file.size <= MAX_FILE_SIZE;
  };
  const handleImageChange = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      showMessage('อนุญาตเฉพาะไฟล์รูปภาพ (JPEG, JPG, PNG)', 'warning');
      return;
    }
    if (!checkFileSize(file)) {
      showMessage('ขนาดไฟล์ใหญ่เกินไป ขนาดไฟล์ต้องไม่เกิน 5MB', 'warning');
      return;
    }
    setPendingImage(file);
  };

  const handleSubmit = async () => {
    if (isCreateMode() && pendingRoles.includes(USER_ROLES.ADMIN) && !pendingPassword) {
      showMessage('โปรดกำหนดรหัสผ่าน', 'warning');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (!userData) return;

      const formData = new FormData();
      if (userData.title) formData.append('title', userData.title);
      if (userData.first_name) formData.append('first_name', userData.first_name);
      if (userData.last_name) formData.append('last_name', userData.last_name);
      if (userData.email) formData.append('email', userData.email);
      if (userData.status) formData.append('status', userData.status);
      if (pendingImage) {
        formData.append('profile_image', pendingImage);
      }

      let newUserId = userData.id;

      if (isCreateMode()) {
        const type = getPageType();
        if (type === 'observer') {
          formData.append('roles', USER_ROLES.OBSERVER.toString());
        } else if (type === 'content-creator') {
          formData.append('roles', USER_ROLES.CONTENT_CREATOR.toString());
        } else if ('roles' in userData) {
          pendingRoles.forEach((role) => {
            formData.append('roles', role.toString());
          });
        }
        if (pendingPassword) {
          formData.append('password', pendingPassword);
        }
        const response = await API.adminUserAccount.Create(formData);
        newUserId = response.id;
        showMessage('สร้างข้อมูลสำเร็จ', 'success');
      } else {
        await API.adminUserAccount.Update(userData.id, formData);
        showMessage('บันทึกข้อมูลสำเร็จ', 'success');
        // navigate({ to: "../" })

        // เพิ่มพารามิเตอร์ตามประเภทของผู้ใช้งาน
        const type = getPageType();
        navigate({
          to: '/admin/user-account',
          search: { role: type },
        });
      }

      // อัพเดท observer accesses ถ้าเป็นผู้สังเกตการณ์
      if ('observer_accesses' in userData) {
        const accessIds = userData.observer_accesses.map(
          (access) => access.observer_access_id,
        );
        await API.observersAccount.UpdateObserverAccesses(newUserId, accessIds);
      }

      if (!isCreateMode()) {
        // Update roles if changed
        if ('roles' in userData && !arraysEqual(userData.roles, pendingRoles)) {
          await API.adminUserAccount.UpdateRoles(userData.id, pendingRoles);
          setUserData({ ...userData, roles: pendingRoles });
        }
      }

      if (isCreateMode()) {
        // เพิ่มพารามิเตอร์ตามประเภทของผู้ใช้งาน
        const type = getPageType();
        navigate({
          to: '/admin/user-account',
          search: { role: type },
        });
      }
    } catch (error) {
      console.error('Error saving user:', error);
      showMessage(`${isCreateMode() ? 'สร้าง' : 'บันทึก'}ข้อมูลไม่สำเร็จ`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (roleId: number, checked: boolean) => {
    if (!userData || !('roles' in userData)) return;

    const isEditMode = !!userData.id;
    const isAdminRole = roleId === USER_ROLES.ADMIN;

    if (
      isEditMode &&
      isAdminRole &&
      !checked &&
      pendingRoles.includes(USER_ROLES.ADMIN)
    ) {
      return;
    }

    const newRoles = checked
      ? [...pendingRoles, roleId]
      : pendingRoles.filter((id) => id !== roleId);
    setPendingRoles(newRoles);
  };

  const handleObserverAccessChange = (accessId: number, checked: boolean) => {
    if (!userData || !('observer_accesses' in userData)) return;

    const newAccesses = checked
      ? [
          ...userData.observer_accesses,
          { observer_access_id: accessId, name: '', updated_at: null, updated_by: null },
        ]
      : userData.observer_accesses.filter(
          (access) => access.observer_access_id !== accessId,
        );

    setUserData({ ...userData, observer_accesses: newAccesses });
  };

  // Utility function to compare arrays
  const arraysEqual = (a: number[], b: number[]) => {
    if (a.length !== b.length) return false;
    return a.every((val) => b.includes(val));
  };

  const pageType = getPageType();
  const tabsList = getTabsList(pageType);
  type TabType = (typeof tabsList)[number]['key'];
  const [selectedTab, setSelectedTab] = useState<TabType>('info');

  return (
    <BrowserRouter>
      <CWTLayout
        breadcrumbs={[
          { text: 'สำหรับแอดมิน', href: '/', disabled: true },
          { text: 'จัดการผู้ใช้งาน', href: '/admin/user-account?role=normal' },
          { text: getPageTitle(), href: '/' },
        ]}
      >
        {loading ? (
          <div>กำลังโหลด...</div>
        ) : (
          <>
            <div className={'flex items-center gap-2.5'}>
              <div
                className="cursor-pointer p-2"
                onClick={() => {
                  navigate({
                    to: '/admin/user-account',
                    search: { role: pageType },
                  });
                }}
              >
                <IconArrowBackward />
              </div>
              <span className={'text-2xl font-bold'}>{getPageTitle()}</span>
            </div>

            <CWMTabs
              items={tabsList.map((t) => t.label)}
              currentIndex={tabsList.findIndex((tab) => tab.key === selectedTab)}
              onClick={(index) => setSelectedTab(tabsList[index].key as TabType)}
            />

            <div className="grid grid-cols-4 gap-4">
              {userData && (
                <>
                  {selectedTab === 'info' && (
                    <EditInfo
                      userData={userData}
                      observerAccesses={observerAccesses}
                      pendingRoles={pendingRoles}
                      getPageType={getPageType}
                      handleInputChange={handleInputChange}
                      handleRoleChange={handleRoleChange}
                      selectedTab={selectedTab}
                      pagination={pagination}
                      setPagination={setPagination}
                      path={window.location.pathname}
                      handleObserverAccessChange={handleObserverAccessChange}
                      handleImageChange={handleImageChange}
                      onObserverAccessTabChange={(accessName) =>
                        fetchObserverAccesses(accessName)
                      }
                    />
                  )}
                  {/* {selectedTab === 'password' && pageType !== 'parent' && (
                    <PasswordChange
                      userData={userData}
                      onPasswordChange={(newPassword) => setPendingPassword(newPassword)}
                    />
                  )} */}
                  {selectedTab === 'account' && pageType === 'parent' && (
                    <div className="col-span-3">
                      <Section title="ข้อมูลบัญชี">
                        <div className="flex flex-col gap-4">
                          <div className="flex gap-4 pt-4">
                            <img
                              className="w-[70px]"
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/LINE_New_App_Icon_%282020-12%29.png/480px-LINE_New_App_Icon_%282020-12%29.png"
                            />
                            <div className="flex flex-col justify-center gap-2">
                              <div className="text-lg font-bold">Line</div>
                              <div className="text-sm text-neutral-500">
                                ID :
                                {userData && 'line_subject_id' in userData
                                  ? (userData.line_subject_id ?? ' ยังไม่มีบัญชีไลน์')
                                  : '-'}
                              </div>
                            </div>
                          </div>

                          <div className="pt-6 text-lg font-bold">ปิดบัญชี</div>

                          <div>
                            หากต้องการปิดบัญชีผู้ปกครอง
                            กรณีตรวจสอบว่ามีบัญชีผู้ปกครองว่าเป็นเจ้าของครอบครัวที่เมนู
                            <a
                              href="/admin/family-account"
                              className="text-primary underline"
                            >
                              จัดการครอบครัว
                            </a>
                          </div>
                        </div>
                      </Section>
                    </div>
                  )}
                  <SaveInfo
                    getPageType={getPageType}
                    onPasswordChange={(newPassword) => setPendingPassword(newPassword)}
                    userData={userData}
                    statusOptions={statusOptions}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    pendingRoles={pendingRoles}
                  />
                </>
              )}
            </div>
          </>
        )}
      </CWTLayout>
    </BrowserRouter>
  );
};

export default DomainJSX;
