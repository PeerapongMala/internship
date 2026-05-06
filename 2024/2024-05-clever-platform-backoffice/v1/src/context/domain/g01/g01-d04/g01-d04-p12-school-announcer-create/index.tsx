import { useNavigate, useParams } from '@tanstack/react-router';
import { Fragment, useEffect, useState } from 'react';
import { CreatedSchoolAnnouncer, CreatedTeacherRecord } from '../local/type';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import CWTLayout from '@domain/g01/g01-d05/local/component/web/template/cw-t-layout';
import { Controller, useForm } from 'react-hook-form';
import WCAIconChevronLeft from '@component/web/atom/wc-a-icons/iconChevronLeft';
import { Tab, TabGroup, TabList } from '@headlessui/react';
import CWSelect from '@component/web/cw-select';
import StoreGlobal from '@store/global';
import { useModalInfo } from '@domain/g01/g01-d04/local/component/web/organism/wc-o-modal-info';
import FormAnnouncerInfo from './component/web/template/wc-t-form-announcer-info';
import API from '../local/api';
import CWModalResetPassword from '@component/web/cw-modal/cw-modal-reset-password';
import showMessage from '@global/utils/showMessage';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward.tsx';
const SchoolTeacherCreatePage = () => {
  // Translates
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  const { schoolId } = useParams({ strict: false });

  const [school, setSchool] = useState<{
    id: string;
    name: string;
  }>();

  const {
    Modal: ModalInfo,
    setOpen: setModalInfoOpen,
    setModalUI: setModalInfoUI,
  } = useModalInfo({
    title: 'เพิ่มผู้ประกาศ',
    buttonText: 'ต่อไป',
  });

  const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, open, close };
  };

  // เพิ่ม modal สำหรับกำหนดรหัสผ่าน
  const modalResetPassword = useModal();
  // เพิ่ม state สำหรับเก็บ password
  const [password, setPassword] = useState<string>('');

  // show controller nav
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  useEffect(() => {
    // todo: get school data
    setSchool({
      id: schoolId,
      name: 'โรงเรียนสาธิตมัธยม',
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
  } = useForm<Partial<CreatedSchoolAnnouncer>>({
    defaultValues: {
      school_id: schoolId,
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

  function onFormSubmit(data: Partial<CreatedSchoolAnnouncer>) {
    if (!password) {
      showMessage('กรุณากำหนดรหัสผ่าน', 'error');
      return;
    }

    const submitData = {
      ...data,
      password: password,
    };

    API.schoolAnnouncer
      .Create(submitData)
      .then((res) => {
        if (res.status_code === 200 || res.status_code === 201) {
          const { data } = res;
          // setModalInfoUI((prev) => {
          //   return {
          //     ...prev,
          //     title: 'เพิ่มผู้ประกาศสำเร็จ',
          //     children: <span>เพิ่มผู้ประกาศสำเร็จแล้ว</span>,
          //     buttonText: 'ปิด',
          //     buttonVariant: 'primary',
          //     buttonOutline: false,
          //     onClose: () => {
          //       navigate({ to: `/admin/school/${schoolId}?tab=user-management` });
          //     },
          //   };
          // });
          showMessage('เพิ่มผู้ประกาศสำเร็จ', 'success');
          navigate({ to: `/admin/school/${schoolId}?tab=user-management` });
        } else {
          // setModalInfoUI((prev) => {
          //   return {
          //     ...prev,
          //     title: 'เพิ่มผู้ประกาศไม่สำเร็จ',
          //     children: <span>โปรดลองใหม่อีกครั้ง</span>,
          //     buttonText: 'ตกลง',
          //     buttonVariant: 'danger',
          //     buttonOutline: false,
          //     onClose: undefined,
          //   };
          // });
          showMessage('เพิ่มผู้ประกาศไม่สำเร็จ', 'error');
        }
      })
      .catch((err) => {
        console.error(err);
        // setModalInfoUI((prev) => {
        //   return {
        //     ...prev,
        //     title: 'เพิ่มผู้ประกาศไม่สำเร็จ',
        //     children: <span>โปรดลองใหม่อีกครั้ง</span>,
        //     buttonText: 'ตกลง',
        //     buttonVariant: 'danger',
        //     buttonOutline: false,
        //     onClose: undefined,
        //   };
        // });
        showMessage('เพิ่มผู้ประกาศไม่สำเร็จ', 'error');
      })
      .finally(() => {
        // setModalInfoOpen(true);
      });
  }

  const handlePasswordReset = (password: string) => {
    setPassword(password);
    modalResetPassword.close();
  };

  const renderTabView = () => {
    return (
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex w-full flex-col gap-6 md:w-3/4">
            <FormAnnouncerInfo register={register} control={control} />
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
        { text: 'ข้อมูลผู้ประกาศ', href: '#' },
      ]}
    >
      <div className="flex flex-col gap-5 font-noto-sans-thai">
        <div className="gap-[10px] rounded-md bg-neutral-100 py-2">
          <div className="flex space-x-2 text-left text-xl font-bold text-neutral-900">
            <button className="pl-2" onClick={handleOnBack}>
              <IconArrowBackward />
            </button>
            <span>เพิ่มผู้ประกาศ</span>
          </div>
        </div>
        <div className="bg-white dark:bg-black">
          <TabGroup
            onChange={(index) => {
              const tabNames = ['info', 'account'];
            }}
          >
            <TabList className="flex flex-wrap border-b">
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`${selected ? 'border-b !border-primary text-primary !outline-none' : 'text-neutral-500'} -mb-[1px] flex items-center border-transparent p-6 py-[10px] before:inline-block hover:border-b hover:!border-primary hover:text-primary`}
                  >
                    ข้อมูลผู้ประกาศ
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
