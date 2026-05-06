import CWFormInput from '@domain/g04/g04-d01/local/component/web/cw-form-input';
import { RefObject, useEffect, useRef, useState } from 'react';
import { CurriculumGroup } from '../../local/type';
import CWSelect from '@component/web/cw-select';
import { toDateTimeTH } from '@global/utils/date';
import CWButton from '@component/web/cw-button';

interface TCurriculumFormProps {
  record?: CurriculumGroup;
  onSubmit(formData: Partial<CurriculumGroup>): void;
}

const TCurriculumForm = ({ record, onSubmit }: TCurriculumFormProps) => {
  const [formData, setFormData] = useState<Partial<CurriculumGroup>>({
    status: 'draft',
  });

  useEffect(() => {
    if (record) {
      setFormData({ ...record });
    }
  }, [record]);

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

  function onInput(data: Partial<CurriculumGroup>) {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  }

  return (
    <div className="flex gap-6">
      <form ref={formRef} className="h-fit flex-auto rounded-md bg-white p-4 shadow-sm">
        <CWFormInput
          data={formData}
          onDataChange={setFormData}
          fields={[
            [
              {
                type: 'header',
                text: 'ข้อมูลสังกัด',
              },
            ],
            [
              {
                key: 'name',
                type: 'text',
                label: 'ชื่อสังกัด',
                required: true,
              },
              {
                key: 'short_name',
                type: 'text',
                label: 'ตัวย่อ',
                required: true,
              },
            ],
          ]}
        />
      </form>

      <div className="w-[500px] shrink-0 rounded-md bg-white p-4 shadow-sm">
        <div className="grid grid-cols-3 items-center gap-5">
          <div>รหัสสังกัด:</div>
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

              title="บันทึก"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default TCurriculumForm;
