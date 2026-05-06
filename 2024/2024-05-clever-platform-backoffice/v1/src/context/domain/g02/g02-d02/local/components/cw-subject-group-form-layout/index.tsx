import CWSelect from '@component/web/cw-select';
import { useEffect, useState } from 'react';
import { ISeedSubjectGroup, ISubjectGroup, ManageYearStatus } from '../../type';
import API from '../../api';
import { toDateTimeTH } from '@global/utils/date';
import ManageSubjectGroupFormHeader from '@domain/g02/g02-d02/g02-d02-p04-subject-group-create/component/web/template/wc-t-header';

interface CWFormLayoutProps {
  subjectGroup?: ISubjectGroup;
  onSubmit: (record: Pick<ISubjectGroup, 'seed_subject_group_id' | 'status'>) => void;
}

const CWSubjectGroupFormLayout = function ({
  subjectGroup,
  onSubmit,
}: CWFormLayoutProps) {
  const [seedSubjectGroupId, setSeedSubjectGroupId] = useState(
    subjectGroup?.seed_subject_group_id.toString() ?? '',
  );
  const [status, setStatus] = useState(subjectGroup?.status ?? 'draft');
  const [seedSubjectGroupList, setSeedSubjectGroupList] = useState<ISeedSubjectGroup[]>(
    [],
  );

  useEffect(() => {
    API.seedSubjectGroup.GetAll().then(async (res) => {
      if (res.status_code === 200) {
        setSeedSubjectGroupList(res.data);
      }
    });
  }, []);

  const statuses = [
    { label: 'แบบร่าง', value: ManageYearStatus.DRAFT },
    { label: 'ใช้งาน', value: ManageYearStatus.IN_USE },
    { label: 'ไม่ใช้งาน', value: ManageYearStatus.NOT_IN_USE },
  ] as const;

  return (
    <div className="flex flex-col gap-y-5 font-noto-sans-thai text-[#0E1726]">
      <ManageSubjectGroupFormHeader type={subjectGroup ? 'updated' : 'created'} />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4 bg-white p-4">
          <div className="flex gap-6">
            <CWSelect
              label="ชื่อกลุ่มวิชา"
              value={seedSubjectGroupId}
              required
              options={seedSubjectGroupList.map((s) => ({
                label: s.name,
                value: s.id.toString(),
              }))}
              className="flex-1"
              onChange={(e) => setSeedSubjectGroupId(e.currentTarget.value)}
            />
            <div className="flex-1"></div>
          </div>
        </div>

        <div className="flex h-fit min-w-[440px] flex-col gap-4 rounded-md bg-white p-4 shadow">
          <div className="grid grid-cols-2 items-center gap-y-4">
            <div>รหัสกลุ่มวิชา:</div>
            <div>{subjectGroup?.id ?? '-'}</div>

            <div>สถานะ</div>
            <div>
              <CWSelect
                value={status}
                options={statuses.map((s) => ({
                  label: s.label,
                  value: s.value,
                }))}
                onChange={(e) => setStatus(e.currentTarget.value)}
              />
            </div>

            <div>แก้ไขล่าสุด</div>
            <div>
              {subjectGroup?.updated_at ? toDateTimeTH(subjectGroup.updated_at) : '-'}
            </div>

            <div>แก้ไขล่าสุดโดย</div>
            <div>{subjectGroup?.updated_by ?? '-'}</div>
          </div>

          <button
            type="button"
            className="btn btn-primary mt-4"
            onClick={() => {
              onSubmit({
                seed_subject_group_id: +seedSubjectGroupId,
                status,
              });
            }}
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default CWSubjectGroupFormLayout;
