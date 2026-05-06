// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link, useRouter, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';

import { UseStatus, AffiliationGroupType, Affiliation } from '../local/type';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import Tabs from '../local/component/web/molecule/wc-m-tabs';
import Breadcrumbs from '../local/component/web/atom/wc-a-breadcrumbs';
import { useForm } from 'react-hook-form';
import AffiliationOBECContent from '../local/component/web/template/wc-t-obec-content';
import AffiliationDOEContent from '../local/component/web/template/wc-t-doe-content';
import AffiliationOPECContent from '../local/component/web/template/wc-t-opec-content';
import AffiliationLAOContent from '../local/component/web/template/wc-t-lao-content';
import AffiliationOtherContent from '../local/component/web/template/wc-t-other-content';
import API from '../local/api';
import SelectRegister from '../local/component/web/molecule/wc-m-select-register';
import { useModalInfo } from '../local/component/web/organism/wc-o-modal-info';
import showMessage from '@global/utils/showMessage';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const router = useRouter();
  const { group = AffiliationGroupType.OBEC } = useSearch({ strict: false });

  const [currentTab, setCurrentTab] = useState<string>('ข้อมูลสังกัด');
  const {
    Modal: ModalInfo,
    setOpen: setModalInfoOpen,
    setModalUI: setModalInfoUI,
  } = useModalInfo({
    title: 'สร้างสังกัด',
    buttonText: 'ต่อไป',
  });

  const {
    register,
    reset,
    resetField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Partial<Affiliation>>({
    defaultValues: {
      school_affiliation_group: group,
    },
  });

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []); // Make sure to provide an appropriate dependency array

  // affiliation group variables and effect
  const affiliationGroup = watch('school_affiliation_group');
  useEffect(() => {
    // reset all fields except school affiliation group
    // when school affiliation group have been change
    reset({
      school_affiliation_group: affiliationGroup,
    });
  }, [affiliationGroup]);

  function renderTypeContent() {
    switch (affiliationGroup) {
      case AffiliationGroupType.OBEC:
        return <AffiliationOBECContent register={register} watch={watch} />;
      case AffiliationGroupType.DOE:
        return <AffiliationDOEContent register={register} watch={watch} />;
      case AffiliationGroupType.OPEC:
        return <AffiliationOPECContent register={register} watch={watch} />;
      case AffiliationGroupType.LAO:
        return (
          <AffiliationLAOContent
            register={register}
            watch={watch}
            resetField={resetField}
          />
        );
      default:
        return <AffiliationOtherContent register={register} />;
    }
  }

  function onSubmit(data: Partial<Affiliation>) {
    API.affiliation
      .Create(data)
      .then((res) => {
        if (res.status_code === 200 || res.status_code === 201) {
          const { data } = res;
          // setModalInfoUI((prev) => {
          //   return {
          //     ...prev,
          //     title: 'สร้างสังกัดสำเร็จ',
          //     children: <span>สร้างสังกัดสำเร็จแล้ว</span>,
          //     buttonText: 'ปิด',
          //     buttonVariant: 'primary',
          //     buttonOutline: false,
          //     onClose: () => {
          //       router.navigate({
          //         to: '../$affiliationId',
          //         params: {
          //           affiliationId: data?.id,
          //         },
          //       });
          //     },
          //   };
          // });
          showMessage('บันทึกสังกัดสำเร็จ', 'success');
          router.navigate({
            to: '../$affiliationId',
            params: {
              affiliationId: data?.id,
            },
          });
        } else {
          showMessage(res.message, 'error');
        }
      })
      .catch((err) => {
        console.error(err);
        // setModalInfoUI((prev) => {
        //   return {
        //     ...prev,
        //     title: 'สร้างสังกัดไม่สำเร็จ',
        //     children: <span>โปรดลองใหม่อีกครั้ง</span>,
        //     buttonText: 'ตกลง',
        //     buttonVariant: 'danger',
        //     buttonOutline: false,
        //     onClose: undefined,
        //   };
        // });
        showMessage(err.message, 'error');
      })
      .finally(() => {
        // setModalInfoOpen(true);
      });
  }

  return (
    <LayoutDefault>
      <div className="flex flex-col gap-y-5 font-noto-sans-thai text-[#0E1726]">
        {/** breadcrumbs */}
        <CWBreadcrumbs
          links={[
            { label: 'สำหรับแอดมิน', href: '/', disabled: true },
            { label: 'สังกัดโรงเรียน', href: '/admin/affiliation' },
            {
              label: 'สร้างสังกัด',
              href: '/',
            },
          ]}
        />
        {/** back button */}
        <div className="flex items-center gap-2.5">
          <Link to="../">
            <IconArrowBackward className="h-8 w-8 p-1" />
          </Link>
          <span className="text-2xl font-bold leading-8">เพิ่มสังกัด</span>
        </div>
        {/** tabs */}
        <Tabs
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          tabs={[{ label: 'ข้อมูลสังกัด', value: 'ข้อมูลสังกัด' }]}
        />
        {/** content container */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 lg:flex-row">
            {/** affiliation detail */}
            <div className="flex flex-1 flex-col gap-4 rounded-md bg-white p-4 shadow">
              <span className="text-xl font-bold leading-8">ข้อมูลสังกัด</span>
              {/** first row */}
              <div>
                <label
                  htmlFor="school-affiliation-group-select"
                  className="before:text-red-500 before:content-['*']"
                >
                  กลุ่มสังกัด
                </label>
                <select
                  id="school-affiliation-group-select"
                  className="form-select max-w-sm truncate !font-normal !text-[#0E1726]"
                  {...register('school_affiliation_group', { required: true })}
                >
                  <option value={AffiliationGroupType.OBEC}>
                    สพฐ. - สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน
                  </option>
                  <option value={AffiliationGroupType.DOE}>
                    สนศ. กทม. - สำนักการศึกษา กรุงเทพมหานคร
                  </option>
                  <option value={AffiliationGroupType.OPEC}>
                    สช. - สำนักงานคณะกรรมการส่งเสริมการศึกษาเอกชน
                  </option>
                  <option value={AffiliationGroupType.LAO}>
                    อปท. - องค์กรปกครองส่วนท้องถิ่น
                  </option>
                  <option value={AffiliationGroupType.OTHER}>อื่นๆ</option>
                </select>
              </div>
              {renderTypeContent()}
            </div>
            <div className="flex h-fit min-w-[440px] flex-col gap-4 rounded-md bg-white p-4 shadow">
              <div className="grid grid-cols-2 items-center gap-y-4">
                <div>สถานะ</div>
                <div>
                  <SelectRegister
                    register={register('status', { required: true })}
                    selectedValue={watch('status')}
                    options={[
                      {
                        label: 'แบบร่าง',
                        value: UseStatus.DRAFT,
                      },
                      {
                        label: 'ใช้งาน',
                        value: UseStatus.IN_USE,
                      },
                      {
                        label: 'ไม่ใช้งาน',
                        value: UseStatus.NOT_IN_USE,
                      },
                    ]}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full">
                บันทึก
              </button>
            </div>
          </div>
        </form>
      </div>
      {/** modal result */}
      <ModalInfo />
    </LayoutDefault>
  );
};

export default DomainJSX;
