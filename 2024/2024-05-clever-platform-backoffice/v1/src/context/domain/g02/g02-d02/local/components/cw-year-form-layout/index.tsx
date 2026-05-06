import CWSelect from '@component/web/cw-select';
import { useEffect, useState } from 'react';
import { IManageYear, ISeedYear, ManageYearStatus } from '../../type';
import API from '../../api';
import ManageYearHeader from '@domain/g02/g02-d02/g02-d02-p02-manage-year-create/component/web/template/wc-t-header';
import { toDateTimeTH } from '@global/utils/date';
import CWButton from '@component/web/cw-button';

interface CWFormLayoutProps {
  year?: IManageYear;
  onSubmit: (record: Pick<IManageYear, 'seed_year_id' | 'status'>) => void;
}

const CWYearFormLayout = function ({ year, onSubmit }: CWFormLayoutProps) {
  const [yearId, setYearId] = useState(year?.seed_year_id?.toString() ?? '');
  const [status, setStatus] = useState(year?.status ?? 'draft');
  const [seedYearList, setSeedYearList] = useState<ISeedYear[]>([]);

  const statuses = [
    { label: 'แบบร่าง', value: ManageYearStatus.DRAFT },
    { label: 'ใช้งาน', value: ManageYearStatus.IN_USE },
    { label: 'ไม่ใช้งาน', value: ManageYearStatus.NOT_IN_USE },
  ] as const;

  useEffect(() => {
    API.seedYear.GetAll({}).then((res) => {
      if (res.status_code == 200) {
        setSeedYearList(res.data);
      }
    });
  }, []);

  return (
    <div className="flex flex-col gap-y-5 font-noto-sans-thai text-[#0E1726]">
      <ManageYearHeader type={year ? 'updated' : 'created'} />

      <div className="flex gap-6 lg:flex-row">
        <div className="flex h-fit flex-1 gap-4 bg-white p-4 *:flex-1">
          <div>
            <CWSelect
              label="เลือกชั้นปี"
              value={yearId}
              required
              onChange={(e) => setYearId(e.target.value)}
              options={seedYearList.map((y) => ({
                label: y.name,
                value: y.id.toString()
              }))}
            />
          </div>
          <div></div>
        </div>

        <div className="flex h-fit min-w-[440px] flex-col gap-4 rounded-md bg-white p-4 shadow">
          <div className="grid grid-cols-2 items-center gap-y-4">
            <div>รหัสชั้นปี:</div>
            <div>{year?.id ?? '-'}</div>

            <div>สถานะ</div>
            <div>
              <CWSelect
                value={status}
                onChange={(e) => setStatus(e.currentTarget.value)}
                options={statuses.map((s) => ({
                  label: s.label,
                  value: s.value,
                }))}
              />
            </div>

            <div>แก้ไขล่าสุด</div>
            <div>{year?.updated_at ? toDateTimeTH(year.updated_at) : '-'}</div>

            <div>แก้ไขล่าสุดโดย</div>
            <div>{year?.updated_by ?? '-'}</div>
          </div>

          <CWButton
            className="btn btn-primary mt-4"
            onClick={() => {
              onSubmit({
                seed_year_id: +yearId,
                status:
                  status == 'enabled'
                    ? 'enabled'
                    : status == 'disabled'
                      ? 'disabled'
                      : 'draft',
              });
            }}
            title='บันทึก'
          />
        </div>
      </div>
    </div>
  );
};

export default CWYearFormLayout;
