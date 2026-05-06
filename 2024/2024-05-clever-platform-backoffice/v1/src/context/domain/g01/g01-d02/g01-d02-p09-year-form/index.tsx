// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { useNavigate, useParams } from '@tanstack/react-router';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import CWSelect from '@component/web/cw-select';
import { toDateTimeTH } from '@global/utils/date';
import CWButton from '@component/web/cw-button';
import { SeedYear } from '../local/type';
import CWFormInput from '@domain/g04/g04-d01/local/component/web/cw-form-input';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const { yearId } = useParams({ strict: false });
  const navigate = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [formType] = useState<'create' | 'update'>(yearId ? 'update' : 'create');
  const [isFetching, setIsFetching] = useState(false);
  const [record, setRecord] = useState<SeedYear>();

  const [formData, setFormData] = useState<Partial<SeedYear>>({
    status: 'draft',
  });

  const statuses = [
    {
      label: 'แบบร่าง',
      value: 'draft',
      className: 'badge-outline-dark',
    },
    {
      label: 'ใช้งาน',
      value: 'enabled',
      className: 'badge-outline-success',
    },
    {
      label: 'ไม่ใช้งาน',
      value: 'disabled',
      className: 'badge-outline-danger',
    },
  ] as const;

  const formRef = useRef<HTMLFormElement>(null);

  function onInput(data: Partial<SeedYear>) {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  }

  useEffect(() => {
    if (yearId) {
      API.seedYear.GetById(yearId).then((res) => {
        if (res.status_code == 200) {
          setRecord(res.data);
          setFormData({ ...res.data });
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }, [isFetching]);

  function onSubmit(formData: Partial<SeedYear>) {
    if (record) {
      API.seedYear.Update(record.id, formData).then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('บันทึกสำเร็จ', 'success');
          setIsFetching((prev) => !prev);
        } else {
          showMessage(res.message, 'error');
        }
      });
    } else {
      API.seedYear.Create(formData).then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('บันทึกสำเร็จ', 'success');
          navigate({ to: '..' });
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <CWBreadcrumbs
        links={[
          {
            label: 'สำหรับแอดมิน',
            href: '/',
            disabled: true,
          },
          {
            label: 'จัดการชั้นปี',
            href: '/admin/year',
          },
          {
            label: formType == 'update' ? yearId : 'เพิ่มชั้นปี',
            href: '/',
          },
        ]}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            navigate({ to: '/admin/year' });
          }}
        >
          <IconArrowBackward />
        </button>
        <div className="text-2xl font-bold">
          {formType == 'update' ? 'แก้ไข' : 'เพิ่ม'}ชั้นปี
        </div>
      </div>

      <div className="flex gap-6">
        <form ref={formRef} className="h-fit flex-auto rounded-md bg-white p-4 shadow-sm">
          <CWFormInput
            data={formData}
            onDataChange={setFormData}
            fields={[
              [
                {
                  key: 'name',
                  type: 'text',
                  label: 'ชื่อ',
                  required: true,
                },
                {
                  key: 'short_name',
                  type: 'text',
                  label: 'ชื่อย่อ',
                  required: true,
                },
              ],
            ]}
          />
        </form>

        <div className="w-[500px] shrink-0 rounded-md bg-white p-4 shadow-sm">
          <div className="grid grid-cols-3 items-center gap-5">
            <div>รหัสชั้นปี:</div>
            <div className="col-span-2">{formData?.id ?? '-'}</div>
            <div>สถานะ:</div>
            <div className="col-span-2">
              <CWSelect
                value={formData.status}
                options={statuses.map((status) => status)}
                required
                onChange={(e) => {
                  onInput({
                    status: e.currentTarget.value,
                  });
                }}
              />
            </div>
            <div>แก้ไขล่าสุด:</div>
            <div className="col-span-2">
              {record?.updated_at ? toDateTimeTH(record.updated_at) : '-'}
            </div>
            <div>แก้ไขล่าสุดโดย:</div>
            <div className="col-span-2">{record?.updated_by ?? '-'}</div>
            <div className="col-span-3">
              <CWButton
                onClick={() => {
                  if (formRef.current?.reportValidity()) {
                    onSubmit(formData);
                  }
                }}
                className="col-span-3"
                title="บันทึก"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainJSX;
