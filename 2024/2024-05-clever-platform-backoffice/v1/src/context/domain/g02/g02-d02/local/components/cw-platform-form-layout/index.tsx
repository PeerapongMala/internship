import { ICurriculum } from '@domain/g01/g01-d03/local/type';
import CWSelect from '@component/web/cw-select';
import { useEffect, useRef, useState } from 'react';
import { IPlatform, ISeedPlatform } from '../../type';
import { toDateTimeTH } from '@global/utils/date';
import CWButton from '@component/web/cw-button';
import API from '../../api';
import showMessage from '@global/utils/showMessage';
import CWLayout from '../cw-layout';

interface CWFormLayoutProps {
  platform?: IPlatform;
  onSubmit: (record: Pick<IPlatform, 'seed_platform_id' | 'status'>) => void;
}

const CWFormLayout = function ({ platform, onSubmit }: CWFormLayoutProps) {
  const statuses = [
    {
      key: 'draft',
      label: 'แบบร่าง',
      className: 'badge-outline-dark',
    },
    {
      key: 'enabled',
      label: 'ใช้งาน',
      className: 'badge-outline-success',
    },
    {
      key: 'disabled',
      label: 'ไม่ใช้งาน',
      className: 'badge-outline-danger',
    },
  ] as const;

  const [status, setStatus] = useState<string>(platform?.status ?? statuses[0].key);
  const [platformId, setPlatformId] = useState(platform?.seed_platform_id);
  const [seedPlatforms, setSeedPlatforms] = useState<ISeedPlatform[]>([]);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    API.seedPlatform.Get().then((res) => {
      if (res.status_code == 200) {
        setSeedPlatforms(res.data);
      } else {
        showMessage(res.message, 'error');
      }
    });
  }, []);

  return (
    <CWLayout
      type={platform ? 'updated' : 'created'}
      navigate={{
        title: platform ? 'แก้ไขแพลตฟอร์ม' : 'เพิ่มแพลตฟอร์ม',
        to: '/content-creator/course/platform',
      }}
    >
      <div className="grid w-full grid-cols-12 gap-6">
        <form
          ref={formRef}
          className="col-span-8 h-fit rounded-md bg-white p-4 shadow-md"
        >
          <div className="flex *:flex-1">
            <CWSelect
              label="เลือกแพลตฟอร์ม"
              required
              value={platformId}
              options={seedPlatforms.map((p) => ({
                label: p.name,
                value: p.id,
              }))}
              onChange={(e) => {
                setPlatformId(+e.currentTarget.value);
              }}
            />
            <div></div>
          </div>
        </form>

        <div className="col-span-4 ">
          <div className='!grid h-fit grid-cols-3 items-center gap-4 rounded-md bg-white p-4 shadow-md'>
            <div>รหัสแพลตฟอร์ม</div>
            <div className="col-span-2">{platform?.id ?? '-'}</div>
            <div>สถานะ</div>
            <CWSelect
              className="col-span-2"
              value={status}
              options={statuses.map((s) => ({ label: s.label, value: s.key }))}
              onChange={(e) => {
                setStatus(e.currentTarget.value);
              }}
            />
            <div>แก้ไขล่าสุด</div>
            <div className="col-span-2">
              {platform?.updated_at ? toDateTimeTH(platform.updated_at) : '-'}
            </div>
            <div>แก้ไขล่าสุดโดย</div>
            <div className="col-span-2">{platform?.updated_by ?? '-'}</div>

            <div className="col-span-3">
              <CWButton
                onClick={() => {
                  if (formRef.current?.reportValidity() && platformId != undefined)
                    onSubmit({
                      seed_platform_id: +platformId,
                      status:
                        status == 'draft' || status == 'enabled' || status == 'disabled'
                          ? status
                          : 'draft',
                    });
                }}
                className="w-full"
                title="บันทึก"
              />
            </div>
          </div>


        </div>
      </div>
    </CWLayout>
  );
};

export default CWFormLayout;
