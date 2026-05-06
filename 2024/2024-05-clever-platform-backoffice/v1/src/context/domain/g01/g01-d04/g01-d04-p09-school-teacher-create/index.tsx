import { useNavigate, useParams } from '@tanstack/react-router';
import { Fragment, useEffect, useState } from 'react';
import { CreatedTeacherRecord } from '../local/type';
import API from '../local/api';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import CWTLayout from '@domain/g01/g01-d05/local/component/web/template/cw-t-layout';
import { Controller, useForm } from 'react-hook-form';
import WCAIconChevronLeft from '@component/web/atom/wc-a-icons/iconChevronLeft';
import { Tab, TabGroup, TabList } from '@headlessui/react';
import FormTeacherInfo from './component/web/template/wc-t-form-teacher-info';
import CWSelect from '@component/web/cw-select';
import StoreGlobal from '@store/global';
import { useModalInfo } from '@domain/g01/g01-d04/local/component/web/organism/wc-o-modal-info';
import CWModalResetPassword from '@component/web/cw-modal/cw-modal-reset-password';
import showMessage from '@global/utils/showMessage';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward.tsx';
const SchoolTeacherCreatePage = () => {
  const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, open, close };
  };

  const modalResetPassword = useModal();

  // Translates
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const navigate = useNavigate();
  const { schoolId } = useParams({ strict: false });

  const [school, setSchool] = useState<{
    id: string | number;
    name: string;
  }>();
  const [selectedTab, setSelectedTab] = useState('info');

  const {
    Modal: ModalInfo,
    setOpen: setModalInfoOpen,
    setModalUI: setModalInfoUI,
  } = useModalInfo({
    title: 'เพิ่มครู',
    buttonText: 'ต่อไป',
  });

  // เพิ่ม state สำหรับเก็บ password
  const [password, setPassword] = useState<string>('');

  // show controller nav
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  useEffect(() => {
    // get school data for display in breadcrumb
    API.school.GetById(schoolId).then((res) => {
      if (res.id && res.name) {
        setSchool({ id: res.id, name: res.name });
      }
    });
  }, [schoolId]);

  const {
    register,
    reset,
    resetField,
    setValue,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Partial<CreatedTeacherRecord>>({
    defaultValues: {
      school_id: schoolId,
      teacher_accesses: [],
    },
  });

  function handleOnBack() {
    navigate({
      to: '../..',
      search: {
        tab: 'user-management',
      },
    });
  }

  function onFormSubmit(data: Partial<CreatedTeacherRecord>) {
    if (!password) {
      showMessage('กรุณากำหนดรหัสผ่าน', 'error');
      return;
    }

    const submitData = {
      ...data,
      password: password,
    };

    API.schoolTeacher
      .Create(submitData)
      .then((res) => {
        if (res.status_code === 200 || res.status_code === 201) {
          const { data } = res;
          //
          showMessage('เพิ่มครูสำเร็จ', 'success');
          navigate({ to: `/admin/school/${schoolId}?tab=user-management` });
        } else {
          showMessage('เพิ่มครูไม่สำเร็จ', 'error');
        }
      })
      .catch((err) => {
        console.error(err);
        showMessage('เพิ่มครูไม่สำเร็จ', 'error');
      })
      .finally(() => {});
  }

  const handlePasswordReset = (password: string) => {
    setPassword(password); // เก็บค่า password ที่ได้จาก modal ไว้ใน state
    modalResetPassword.close();
  };

  const renderTabView = () => {
    return (
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex w-full flex-col gap-6 md:w-3/4">
            <FormTeacherInfo register={register} control={control} />
          </div>
          <div className="flex h-fit min-w-[240px] flex-1 flex-col gap-4 rounded-md bg-white p-4 shadow">
            <div className="grid grid-cols-2 items-center gap-y-4">
              <div>สถานะ</div>
              <div>
                <Controller
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <CWSelect
                        value={value}
                        onChange={onChange}
                        options={[
                          {
                            label: 'แบบร่าง',
                            value: 'draft',
                          },
                          {
                            label: 'ใช้งาน',
                            value: 'enabled',
                          },
                          {
                            label: 'ไม่ใช้งาน',
                            value: 'disabled',
                          },
                        ]}
                        required
                      />
                    );
                  }}
                  name={'status'}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              บันทึก
            </button>
            <button
              type="button"
              className="btn btn-primary mb-6 text-sm font-bold text-white shadow-md"
              onClick={modalResetPassword.open}
            >
              กำหนดรหัสผ่าน
            </button>
            <CWModalResetPassword
              open={modalResetPassword.isOpen}
              onOk={handlePasswordReset}
              onClose={() => {
                modalResetPassword.close();
              }}
            />
          </div>
        </div>
      </form>
    );
  };

  return (
    <CWTLayout
      breadcrumbs={[
        { text: 'สำหรับแอดมิน', href: '/' },
        { text: 'จัดการโรงเรียน', href: '../..' },
        { text: school?.name ?? 'โรงเรียน', href: '../?tab=school-info' },
        { text: 'จัดการผู้ใช้งาน', href: '../?tab=user-management' },
        { text: 'ข้อมูลครู', href: '#' },
      ]}
    >
      <div className="flex flex-col gap-5 font-noto-sans-thai">
        <div className="gap-[10px] rounded-md bg-neutral-100 py-2">
          <div className="flex space-x-2 text-left text-xl font-bold text-neutral-900">
            <button className="pl-2" onClick={handleOnBack}>
              <IconArrowBackward />
            </button>
            <span>เพิ่มครู</span>
          </div>
        </div>
        <div className="bg-white dark:bg-black">
          <TabGroup
            onChange={(index) => {
              const tabNames = ['info', 'account', 'teach', 'class'];
              setSelectedTab(tabNames[index]);
            }}
          >
            <TabList className="flex flex-wrap border-b">
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`${selected ? 'border-b !border-primary text-primary !outline-none' : 'text-neutral-500'} -mb-[1px] flex items-center border-transparent p-6 py-[10px] before:inline-block hover:border-b hover:!border-primary hover:text-primary`}
                  >
                    ข้อมูลครู
                  </button>
                )}
              </Tab>
            </TabList>
          </TabGroup>
        </div>
        {renderTabView()}
      </div>
      <ModalInfo />
    </CWTLayout>
  );
};

export default SchoolTeacherCreatePage;
