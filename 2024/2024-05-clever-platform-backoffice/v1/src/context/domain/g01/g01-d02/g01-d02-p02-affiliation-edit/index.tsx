// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';

import { AffiliationGroupType, Affiliation, UseStatus } from '../local/type';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import Breadcrumbs from '../local/component/web/atom/wc-a-breadcrumbs';
import LinkTabs from '../local/component/web/molecule/wc-m-link-tabs';
import AffiliationDOEContent from '../local/component/web/template/wc-t-doe-content';
import AffiliationLAOContent from '../local/component/web/template/wc-t-lao-content';
import AffiliationOBECContent from '../local/component/web/template/wc-t-obec-content';
import AffiliationOPECContent from '../local/component/web/template/wc-t-opec-content';
import AffiliationOtherContent from '../local/component/web/template/wc-t-other-content';
import { useForm } from 'react-hook-form';
import API from '../local/api';
import { prepareRequestData } from '../local/api/helper';
import SelectRegister from '../local/component/web/molecule/wc-m-select-register';
import { toDateTimeTH } from '@global/utils/date';
import { useModalInfo } from '../local/component/web/organism/wc-o-modal-info';
import showMessage from '@global/utils/showMessage';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  // get path variables
  const { affiliationId } = useParams({ strict: false });
  const {
    Modal: ModalInfo,
    setOpen: setModalInfoOpen,
    setModalUI: setModalInfoUI,
  } = useModalInfo({
    title: 'แก้ไขสังกัด',
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
    defaultValues: async () =>
      API.affiliation.GetById(affiliationId).then((res) => {
        if (res.status_code === 200) {
          return res.data as Partial<Affiliation>;
        }
        return { id: affiliationId };
      }),
  });

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []); // Make sure to provide an appropriate dependency array

  // affiliation group variables
  const affiliationData = watch();
  const affiliationGroup = watch('school_affiliation_group');

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
    if (data) {
      const requestBody = prepareRequestData<Affiliation>(data);
      API.affiliation
        .Update(requestBody)
        .then((res) => {
          if (res.status_code === 200 || res.status_code === 201) {
            // setModalInfoUI((prev) => {
            //   return {
            //     ...prev,
            //     title: 'แก้ไขสังกัดสำเร็จ',
            //     children: <span>แก้ไขสังกัดสำเร็จแล้ว</span>,
            //     buttonText: 'ปิด',
            //     buttonVariant: 'primary',
            //     buttonOutline: false,
            //   };
            // });
            showMessage('บันทึกสังกัดสำเร็จ', 'success');
            navigate({ to: '../' });
          } else {
            showMessage(res.message, 'error');
          }
        })
        .catch((err) => {
          console.error(err);
          // setModalInfoUI((prev) => {
          //   return {
          //     ...prev,
          //     title: 'แก้ไขสังกัดไม่สำเร็จ',
          //     children: <span>โปรดลองใหม่อีกครั้ง</span>,
          //     buttonText: 'ตกลง',
          //     buttonVariant: 'danger',
          //     buttonOutline: false,
          //   };
          // });
          showMessage(err.message, 'error');
        })
        .finally(() => {
          // setModalInfoOpen(true);
        });
    }
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
              label: `${affiliationData.id}: ${affiliationData.name}`,
              href: '/',
            },
          ]}
        />
        {/** back button */}
        <div className="flex items-center gap-2.5">
          <Link to="../">
            <IconArrowBackward className="h-8 w-8 p-1" />
          </Link>
          <span className="text-2xl font-bold leading-8">แก้ไขสังกัด</span>
        </div>
        {/** affiliation title */}
        <div className="rounded-md bg-neutral-100 p-2.5">
          <span className="text-2xl font-bold leading-8">{affiliationData.name}</span>
        </div>
        {/** tabs */}
        <LinkTabs
          tabs={[
            {
              label: 'ข้อมูลสังกัด',
              href: `#`,
              active: true,
            },
            {
              label: 'สัญญาสังกัด',
              href: `./contract`,
            },
          ]}
        />
        {/** content container */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 lg:flex-row">
            {/** affiliation detail */}
            <div className="flex flex-1 flex-col gap-4 rounded-md bg-white p-4 shadow">
              <span className="text-xl font-bold leading-8">ข้อมูลสังกัด</span>

              {/** first row */}
              <div>
                <label htmlFor="" className="before:text-red-500 before:content-['*']">
                  กลุ่มสังกัด
                </label>
                <select
                  value={affiliationData.school_affiliation_group}
                  className="form-select max-w-sm truncate !font-normal !text-[#0E1726]"
                  required
                  disabled
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
                <div>รหัสสังกัด:</div>
                <div>{affiliationData.id}</div>
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
                <div>แก้ไขล่าสุด</div>
                <div>
                  {affiliationData?.updated_at
                    ? toDateTimeTH(affiliationData?.updated_at)
                    : '-'}
                </div>
                <div>แก้ไขล่าสุดโดย</div>
                <div>{affiliationData?.updated_by ?? '-'}</div>
              </div>
              <button type="submit" className="btn btn-primary">
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
