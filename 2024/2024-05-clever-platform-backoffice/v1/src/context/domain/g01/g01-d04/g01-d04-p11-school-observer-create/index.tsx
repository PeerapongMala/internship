import { useNavigate, useParams } from '@tanstack/react-router';
import { Fragment, useEffect, useState } from 'react';
import { IObserverInput } from '../local/type';
import API from '../local/api';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import CWTLayout from '@domain/g01/g01-d05/local/component/web/template/cw-t-layout';
import StoreGlobal from '@store/global';
import { useModalInfo } from '@domain/g01/g01-d04/local/component/web/organism/wc-o-modal-info';
import CWModalPopupSaveError from '@component/web/cw-modal/cw-modal-popup-save-error';
import CWModalPopupSaveComplete from '@component/web/cw-modal/cw-modal-popup-save-complete';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import FormObserverInfo from './component/web/template/wc-t-form-observer-info';
import UserStatusInfo from './component/web/molecule/UserStatusInfo';
import WCAIconChevronLeft from '@component/web/atom/wc-a-icons/iconChevronLeft';
import CWModalResetPassword from '@component/web/cw-modal/cw-modal-reset-password';
import { Controller, useForm } from 'react-hook-form';
import { Tab, TabGroup, TabList } from '@headlessui/react';
import CWSelect from '@component/web/cw-select';
import showMessage from '@global/utils/showMessage';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward.tsx';

const statusUser = [
  { key: 'enabled', label: 'ใช้งาน' },
  { key: 'disabled', label: 'ไม่ใช้งาน' },
  { key: 'draft', label: 'แบบร่าง' },
];

// Components
const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [onClose, setOnClose] = useState<() => void>();
  const open = () => setIsOpen(true);
  const close = () => {
    if (onClose) onClose();
    setIsOpen(false);
  };
  return { isOpen, open, close, setOnClose };
};

const SchoolObserverCreatePage = () => {
  // Translates
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  const { schoolId } = useParams({ strict: false });
  const modalComplete = useModal();
  const modalError = useModal();
  const modalResetPassword = useModal();

  const [school, setSchool] = useState<{
    id: string;
    name: string;
  }>();

  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    Modal: ModalInfo,
    setOpen: setModalInfoOpen,
    setModalUI: setModalInfoUI,
  } = useModalInfo({
    title: 'เพิ่มผู้สังเกตการณ์',
    buttonText: 'ต่อไป',
  });

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    watch,
    formState: { errors, isValid },
  } = useForm<Partial<IObserverInput>>({
    defaultValues: {
      id: schoolId,
      status: 'draft',
      email: '',
      title: '',
      first_name: '',
      last_name: '',
    },
    mode: 'onChange',
  });

  // Watch form values
  const formValues = watch();
  useEffect(() => {
    // Remove console.log for form values
  }, [formValues]);

  useEffect(() => {
    // Remove console.log for form errors
  }, [errors]);

  // show controller nav
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  useEffect(() => {
    // get school data for display in breadcrumb
    API.school.GetById(schoolId).then((res) => {
      if (res.id && res.name) {
        setSchool({ id: String(res.id), name: res.name });
      }
    });
  }, [schoolId]);

  const handleOnBack = () => {
    navigate({
      to: '../..',
      search: {
        tab: 'user-management',
      },
    });
  };

  function onFormSubmit(data: Partial<IObserverInput>) {
    if (!password) {
      showMessage('กรุณากำหนดรหัสผ่าน', 'error');
      return;
    }

    if (!data.email || !data.title || !data.first_name || !data.last_name) {
      showMessage('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('school_id', schoolId);
    formData.append('email', data.email);
    formData.append('title', data.title);
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('id_number', '0000');
    formData.append('status', data.status || 'draft');
    formData.append('password', password);

    if (data.profile_image_file) {
      formData.append('profile_image', data.profile_image_file);
    }

    API.schoolObserver
      .Create(formData)
      .then(async (res) => {
        if (res.status_code === 201) {
          const { data: responseData } = res;

          if (data.observer_accesses && data.observer_accesses.length > 0) {
            try {
              const accessIds = data.observer_accesses.map(
                (access) => access.observer_access_id,
              );
              await API.schoolObserver.UpdateObserverAccesses(responseData.id, accessIds);
            } catch (error) {
              // Remove console.error
            }
          }

          // setModalInfoUI((prev) => ({
          //   ...prev,
          //   title: 'เพิ่มผู้สังเกตการณ์สำเร็จ',
          //   children: <span>เพิ่มผู้สังเกตการณ์สำเร็จแล้ว</span>,
          //   buttonText: 'ปิด',
          //   buttonVariant: 'primary',
          //   buttonOutline: false,
          //   onClose: () => {
          //     navigate({ to: `/admin/school/${schoolId}?tab=user-management` });
          //   },
          // }));
          // setModalInfoOpen(true);
          showMessage('เพิ่มผู้สังเกตการณ์สำเร็จ', 'success');
          navigate({ to: `/admin/school/${schoolId}?tab=user-management` });
        } else {
          // Remove console.error
          // setModalInfoUI((prev) => ({
          //   ...prev,
          //   title: 'เพิ่มผู้สังเกตการณ์ไม่สำเร็จ',
          //   children: <span>โปรดลองใหม่อีกครั้ง</span>,
          //   buttonText: 'ตกลง',
          //   buttonVariant: 'danger',
          //   buttonOutline: false,
          //   onClose: undefined,
          // }));
          // setModalInfoOpen(true);
          showMessage('เพิ่มผู้สังเกตการณ์ไม่สำเร็จ', 'error');
        }
      })
      .catch((error) => {
        // Remove console.error
        setModalInfoUI((prev) => ({
          ...prev,
          title: 'เพิ่มผู้สังเกตการณ์ไม่สำเร็จ',
          children: <span>โปรดลองใหม่อีกครั้ง</span>,
          buttonText: 'ตกลง',
          buttonVariant: 'danger',
          buttonOutline: false,
          onClose: undefined,
        }));
        setModalInfoOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const handlePasswordReset = (password: string) => {
    setPassword(password);
    modalResetPassword.close();
  };

  const renderTabView = () => {
    const handleSave = async () => {
      handleSubmit(
        async (data) => {
          onFormSubmit(data);
        },
        (errors) => {
          setModalInfoUI((prev) => ({
            ...prev,
            title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            children: <span>กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน</span>,
            buttonText: 'ตกลง',
            buttonVariant: 'danger',
            buttonOutline: false,
            onClose: undefined,
          }));
          setModalInfoOpen(true);
        },
      )();
    };

    return (
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex w-full flex-col gap-6 md:w-3/4">
          <FormObserverInfo register={register} control={control} errors={errors} />
        </div>
        <div className="flex h-fit min-w-[240px] flex-1 flex-col gap-4 rounded-md bg-white p-4 shadow">
          <div className="grid grid-cols-2 items-center gap-y-4">
            <div>สถานะ</div>
            <div>
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <CWSelect
                    value={value}
                    onChange={onChange}
                    options={[
                      { label: 'แบบร่าง', value: 'draft' },
                      { label: 'ใช้งาน', value: 'enabled' },
                      { label: 'ไม่ใช้งาน', value: 'disabled' },
                    ]}
                    required
                  />
                )}
                name="status"
              />
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            disabled={isLoading}
            onClick={handleSave}
          >
            {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
          <button
            type="button"
            className="btn btn-primary text-sm font-bold text-white shadow-md"
            onClick={modalResetPassword.open}
            disabled={isLoading}
          >
            กำหนดรหัสผ่าน
          </button>
          <CWModalResetPassword
            open={modalResetPassword.isOpen}
            onOk={handlePasswordReset}
            onClose={() => modalResetPassword.close()}
          />
        </div>
      </div>
    );
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
          { text: 'สำหรับแอดมิน', href: '/' },
          { text: 'จัดการโรงเรียน', href: '../..' },
          { text: school?.name ?? 'โรงเรียน', href: '../?tab=school-info' },
          { text: 'จัดการผู้ใช้งาน', href: '../?tab=user-management' },
          { text: 'ข้อมูลผู้สังเกตการณ์', href: '#' },
        ]}
      >
        <div className="flex flex-col gap-5 font-noto-sans-thai">
          <div className="gap-[10px] rounded-md bg-neutral-100 py-2">
            <div className="flex space-x-2 text-left text-xl font-bold text-neutral-900">
              <button className="pl-2" onClick={handleOnBack}>
                <IconArrowBackward />
              </button>
              <span>เพิ่มผู้สังเกตการณ์</span>
            </div>
          </div>
          <div className="bg-white dark:bg-black">
            <TabGroup>
              <TabList className="flex flex-wrap border-b">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={`${
                        selected
                          ? 'border-b !border-primary text-primary !outline-none'
                          : 'text-neutral-500'
                      } -mb-[1px] flex items-center border-transparent p-6 py-[10px] before:inline-block hover:border-b hover:!border-primary hover:text-primary`}
                    >
                      ข้อมูลผู้สังเกตการณ์
                    </button>
                  )}
                </Tab>
              </TabList>
            </TabGroup>
          </div>
          {renderTabView()}
        </div>
      </CWTLayout>
      <ModalInfo />
    </>
  );
};

export default SchoolObserverCreatePage;
