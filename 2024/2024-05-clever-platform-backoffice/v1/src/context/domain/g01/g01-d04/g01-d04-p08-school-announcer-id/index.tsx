import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWButton from '@component/web/cw-button';
import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import CWTitleBack from '@component/web/cw-title-back';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import CWTLayout from '@domain/g01/g01-d05/local/component/web/template/cw-t-layout';
import { Avatar, Modal } from '@mantine/core';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import API from '../local/api';
import FormAnnouncerInfo from './component/web/template/wc-t-form-announcer-info';
import { UpdatedSchoolAnnouncer, UpdatedTeacherRecord } from '../local/type';
import { Controller, useForm } from 'react-hook-form';
import { useModalInfo } from '../local/component/web/organism/wc-o-modal-info';
import StoreGlobal from '@store/global';
import FormAnnouncerAccount from './component/web/template/wc-t-form-announcer-account';
import { toDateTimeTH } from '@global/utils/date';
import WCAIconChevronLeft from '@component/web/atom/wc-a-icons/iconChevronLeft';
import showMessage from '@global/utils/showMessage';
import CWModalResetPassword from '@component/web/cw-modal/cw-modal-reset-password';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward.tsx';

const SchoolAnnouncerIdPage = () => {
  const navigate = useNavigate();
  const { schoolId, announcerId } = useParams({ strict: false });

  const [schoolName, setSchoolName] = useState('โรงเรียน');
  const [selectedTab, setSelectedTab] = useState('info');
  const [updateAt, setUpdateAt] = useState<Date | null>(null);
  const [updateBy, setUpdateBy] = useState<string | null>(null);
  const [initialProfileImage, setInitialProfileImage] = useState<
    string | null | undefined
  >(null);

  const {
    register,
    reset,
    resetField,
    setValue,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Partial<UpdatedSchoolAnnouncer>>({
    defaultValues: () => {
      return API.schoolAnnouncer.GetById(announcerId).then((res) => {
        if (res.status_code === 200) {
          const { data } = res;
          const { image_url } = data;
          setInitialProfileImage(image_url);
          if (data?.updated_at) setUpdateAt(new Date(data.updated_at));
          if (data?.updated_by) setUpdateBy(data.updated_by);
          return { ...data, profile_image: image_url };
        }
        return {};
      });
    },
  });

  const {
    Modal: ModalInfo,
    setOpen: setModalInfoOpen,
    setModalUI: setModalInfoUI,
  } = useModalInfo({
    title: 'แก้ไขโปรไฟล์',
    buttonText: 'ต่อไป',
  });

  // show controller nav
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  useEffect(() => {
    API.school.GetById(schoolId).then((res) => {
      setSchoolName(res.name);
    });
  }, []);

  function handleOnBack() {
    navigate({
      to: '../..',
      search: {
        tab: 'user-management',
      },
    });
  }

  function onFormSubmit(data: Partial<UpdatedTeacherRecord>) {
    const { profile_image, ...rest } = data;
    API.schoolAnnouncer
      .Update(announcerId, {
        ...rest,
        // check if same as initial, if same don't pass for update
        profile_image: profile_image === initialProfileImage ? undefined : profile_image,
      })
      .then((res) => {
        if (res.status_code === 200 || res.status_code === 201) {
          API.schoolAnnouncer.GetById(announcerId).then((res) => {
            if (res.status_code === 200) {
              showMessage('แก้ไขผู้ประกาศสำเร็จ', 'success');
              navigate({ to: `/admin/school/${schoolId}?tab=user-management` });
              const { data } = res;
              const { image_url } = data;
              setInitialProfileImage(image_url);
              if (data?.updated_at) setUpdateAt(new Date(data.updated_at));
              if (data?.updated_by) setUpdateBy(data.updated_by);
            }
          });
        } else {
          showMessage('แก้ไขผู้ประกาศไม่สำเร็จ', 'error');
        }
      })
      .catch((err) => {
        console.error(err);
        showMessage('แก้ไขผู้ประกาศไม่สำเร็จ', 'error');
      })
      .finally(() => {});
  }

  const tabsList = [
    { key: 'info', label: 'ข้อมูลทั่วไป' },
    // { key: "password", label: "เปลี่ยนรหัสผ่าน" },
  ];

  const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, open, close };
  };

  const [isInAction, setIsInAction] = useState(false);
  const modalResetPassword = useModal();

  const handlePasswordReset = (password: string) => {
    if (!isInAction) {
      setIsInAction(true);
      API.schoolAnnouncer
        .UpdatePassword({
          user_id: announcerId,
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

  return (
    <CWTLayout
      breadcrumbs={[
        { text: 'สำหรับแอดมิน', href: '/', disabled: true },
        { text: 'จัดการโรงเรียน', href: '/admin/school' },
        { text: schoolName ?? 'โรงเรียน', href: '../?tab=school-info' },
        {
          text: 'จัดการผู้ใช้งาน',
          href: '/admin/school/1?tab=user-management&tablist=broadcaster',
        },
        { text: 'ข้อมูลผู้ประกาศ', href: '/' },
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
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex w-full flex-col gap-6 md:w-3/4">
              {selectedTab === 'info' && (
                <FormAnnouncerInfo register={register} control={control} />
              )}
              {selectedTab === 'password' && (
                <FormAnnouncerAccount
                  announcerId={announcerId}
                  register={register}
                  control={control}
                />
              )}
            </div>
            <div className="flex h-fit min-w-[240px] flex-1 flex-col gap-4 rounded-md bg-white p-4 shadow">
              <div className="grid grid-cols-2 place-items-baseline gap-y-4">
                <div>รหัสผู้ใช้งาน</div>
                <div>{announcerId}</div>
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
                className="btn btn-primary"
                onClick={modalResetPassword.open}
              >
                เปลี่ยนรหัสผ่าน
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
      </div>
      <ModalInfo />
    </CWTLayout>
  );
};

export default SchoolAnnouncerIdPage;
