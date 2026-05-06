import { useNavigate, useParams } from '@tanstack/react-router';
import { Fragment, useEffect, useState } from 'react';
import { CreatedTeacherRecord, TeacherRecord, UpdatedTeacherRecord } from '../local/type';
import API from '../local/api';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import CWTLayout from '@domain/g01/g01-d05/local/component/web/template/cw-t-layout';
import { Controller, useForm } from 'react-hook-form';
import WCAIconChevronLeft from '@component/web/atom/wc-a-icons/iconChevronLeft';
import { Tab, TabGroup, TabList } from '@headlessui/react';
import DataGridWC from './component/web/template/datagrid';
import FormTeacherAccount from './component/web/template/wc-t-form-teacher-account';
import FormTeacherInfo from './component/web/template/wc-t-form-teacher-info';
import CWSelect from '@component/web/cw-select';
import StoreGlobal from '@store/global';
import { useModalInfo } from '@domain/g01/g01-d04/local/component/web/organism/wc-o-modal-info';
import TeachingTable from './component/web/template/wc-t-teaching-table';
import ClassTable from './component/web/template/wc-t-class-table';
import { toDateTimeTH } from '@global/utils/date';
import showMessage from '@global/utils/showMessage';
import CWModalResetPassword from '@component/web/cw-modal/cw-modal-reset-password';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward.tsx';

const SchoolTeacherIdPage = () => {
  // Translates
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  const { schoolId, teacherId } = useParams({ strict: false });

  const [school, setSchool] = useState<{
    id: string | number;
    name: string;
  }>();
  const [selectedTab, setSelectedTab] = useState('info');
  const [updateAt, setUpdateAt] = useState<Date | null>(null);
  const [updateBy, setUpdateBy] = useState<string | null>(null);
  const [initialProfileImage, setInitialProfileImage] = useState<
    string | null | undefined
  >(null);

  const {
    Modal: ModalInfo,
    setOpen: setModalInfoOpen,
    setModalUI: setModalInfoUI,
  } = useModalInfo({
    title: 'แก้ไขครู',
    buttonText: 'ต่อไป',
  });

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
  } = useForm<Partial<UpdatedTeacherRecord>>({
    defaultValues: () => {
      return API.schoolTeacher.GetById(teacherId).then((res) => {
        if (res.status_code === 200) {
          const { data } = res;
          const { image_url } = data;
          setInitialProfileImage(image_url);
          return { ...data, profile_image: image_url };
        }
        return {};
      });
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

  function onFormSubmit(data: Partial<UpdatedTeacherRecord>) {
    const { teacher_accesses, profile_image, ...rest } = data;
    Promise.all([
      API.schoolTeacher.Update(teacherId, {
        ...rest,
        // check if same as initial, if same don't pass for update
        profile_image: profile_image === initialProfileImage ? undefined : profile_image,
      }),
      API.schoolTeacher.UpdateTeacherAccess(teacherId, { teacher_accesses }),
    ])
      .then(([resUpdate, resUpdateAccess]) => {
        if (
          (resUpdate.status_code === 200 || resUpdate.status_code === 201) &&
          (resUpdateAccess.status_code === 200 || resUpdateAccess.status_code === 201)
        ) {
          showMessage('แก้ไขครูสำเร็จ', 'success');
          API.schoolTeacher.GetById(teacherId).then((res) => {
            if (res.status_code === 200) {
              const { data } = res;
              const { image_url } = data;
              setInitialProfileImage(image_url);
              if (data?.updated_at) setUpdateAt(new Date(data.updated_at));
              if (data?.updated_by) setUpdateBy(data.updated_by);
            }
          });
        } else {
          showMessage('แก้ไขครูไม่สำเร็จ', 'error');
        }
      })
      .catch((err) => {
        console.error(err);
        showMessage('แก้ไขครูไม่สำเร็จ', 'error');
      })
      .finally(() => {});
  }
  const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, open, close };
  };

  const modalResetPassword = useModal();
  const [isInAction, setIsInAction] = useState(false);

  const handlePasswordReset = (password: string) => {
    if (!isInAction) {
      setIsInAction(true);
      API.schoolTeacher
        .ResetPassword({
          user_id: teacherId,
          password: password,
        })
        .then((res) => {
          if (res.status_code === 200) {
            showMessage('เปลี่ยนรหัสผ่านสำเร็จ', 'success');
          } else {
            showMessage('เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
          }
        })
        .catch((err) => {
          console.error(err);
          showMessage('เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        })
        .finally(() => {
          setIsInAction(false);
          modalResetPassword.close();
        });
    }
  };

  const renderTabView = () => {
    if (selectedTab === 'info' || selectedTab === 'account') {
      return (
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex w-full flex-col gap-6 md:w-3/4">
              {selectedTab === 'info' && (
                <FormTeacherInfo register={register} control={control} />
              )}
              {selectedTab === 'account' && (
                <FormTeacherAccount
                  teacherId={teacherId}
                  register={register}
                  control={control}
                />
              )}
            </div>
            <div className="flex h-fit min-w-[240px] flex-1 flex-col gap-4 rounded-md bg-white p-4 shadow">
              <div className="grid grid-cols-2 place-content-center gap-y-4">
                <div>รหัสผู้ใช้งาน</div>
                <div>{teacherId}</div>
                <div>สถานะ</div>
                <div className="w-full">
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
                          className="w-full"
                          required
                        />
                      );
                    }}
                    name={'status'}
                  />
                </div>
                <div>แก้ไขล่าสุด</div>
                <div>{updateAt ? toDateTimeTH(updateAt) : '-'}</div>
                <div>แก้ไขล่าสุดโดย</div>
                <div>{updateBy ?? '-'}</div>
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
    } else if (selectedTab === 'teach') {
      return <TeachingTable teacherId={teacherId} />;
    } else if (selectedTab === 'class') {
      return <ClassTable teacherId={teacherId} />;
    }
    return <></>;
  };

  return (
    <CWTLayout
      breadcrumbs={[
        { text: 'สำหรับแอดมิน', href: '/', disabled: true },
        { text: 'จัดการโรงเรียน', href: '/admin/school' },
        { text: school?.name ?? 'โรงเรียน', href: '../?tab=school-info' },
        {
          text: 'จัดการผู้ใช้งาน',
          href: '/admin/school/1?tab=user-management&tablist=teacher',
        },
        { text: 'ข้อมูลครู', href: '/' },
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
              {/* <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`${selected ? "border-b !border-primary text-primary !outline-none" : "text-neutral-500"} -mb-[1px] flex items-center border-transparent p-6 py-[10px] before:inline-block hover:border-b hover:!border-primary hover:text-primary`}
                  >
                    จัดการบัญชี
                  </button>
                )}
              </Tab> */}
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`${selected ? 'border-b !border-primary text-primary !outline-none' : 'text-neutral-500'} -mb-[1px] flex items-center border-transparent p-6 py-[10px] before:inline-block hover:border-b hover:!border-primary hover:text-primary`}
                  >
                    จัดการบัญชี
                  </button>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`${selected ? 'border-b !border-primary text-primary !outline-none' : 'text-neutral-500'} -mb-[1px] flex items-center border-transparent p-6 py-[10px] before:inline-block hover:border-b hover:!border-primary hover:text-primary`}
                  >
                    ประวัติการสอน
                  </button>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`${selected ? 'border-b !border-primary text-primary !outline-none' : 'text-neutral-500'} -mb-[1px] flex items-center border-transparent p-6 py-[10px] before:inline-block hover:border-b hover:!border-primary hover:text-primary`}
                  >
                    ประวัติการประจำชั้น
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

export default SchoolTeacherIdPage;
