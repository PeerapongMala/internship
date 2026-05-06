import SubjectFormHeader from '@domain/g02/g02-d02/g02-d02-p06-subject-info-create/component/web/template/wc-t-header';
import { ISubject, ISubjectGroup, ITag, ITagGroup } from '../../type';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import { useEffect, useRef, useState } from 'react';
import TSubjectInfo from '@domain/g02/g02-d02/local/components/tabs/SubjectInfo';
import { DataTable } from 'mantine-datatable';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import showMessage from '@global/utils/showMessage';
import API from '../../api';
import { useParams } from '@tanstack/react-router';
import { toDateTimeTH } from '@global/utils/date';
import TSubjectTagGroup from '@domain/g02/g02-d02/local/components/tabs/SubjectTagGroup';
import CWSelect from '@component/web/cw-select';
import TSubjectSetup from '@domain/g02/g02-d02/local/components/tabs/SubjectSetup';

interface CWFormLayoutProps {
  subject?: ISubject;
  refresh?: boolean;
  onSubmit: (record: Partial<ISubject>) => void;
  onTagGroupChange?: (data: Partial<ITagGroup>) => void;
  onTagCreate?: (data: Partial<ITag> & { tag_group_id: number }) => void;
  onTagUpdate?: (data: Partial<ITag>) => void;
  onTagArchive?: (status: 'enabled' | 'disabled', data: Partial<ITag>) => void;
}

const CWSubjectFormLayout = ({
  subject,
  refresh = false,
  onSubmit,
  onTagGroupChange = () => {},
  onTagArchive = () => {},
  onTagCreate = () => {},
  onTagUpdate = () => {},
}: CWFormLayoutProps) => {
  const { yearId, subjectId } = useParams({ strict: false });
  const [menuTabIndex, setMenuTabIndex] = useState(0);
  const [subjectGroups, setSubjectGroups] = useState<ISubjectGroup[]>([]);
  const [tagGroups, setTagGroups] = useState<ITagGroup[]>([]);

  const [formData, setFormData] = useState<Partial<ISubject>>({
    ...subject,
    status: subject?.status ?? 'draft',
  });

  useEffect(() => {
    if (menuTabIndex == 0) {
      API.subjectGroup.GetAll(yearId, {}).then((res) => {
        if (res.status_code == 200) {
          setSubjectGroups(res.data);
        }
      });
    } else if (menuTabIndex == 1) {
      API.tagGroup.GetAll(subjectId).then((res) => {
        if (res.status_code == 200) {
          setTagGroups(res.data);
        }
      });
    }
  }, [menuTabIndex, refresh]);

  const type = subject ? 'updated' : 'created';
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <div className="flex flex-col gap-y-5 font-noto-sans-thai text-[#0E1726]">
      <SubjectFormHeader type={type} />

      <CWMTabs
        currentIndex={menuTabIndex}
        items={['ข้อมูลหลักสูตร', 'ตั้งค่า Filter']}
        onClick={(index) => {
          if (type == 'created') {
            showMessage('กรุณาบันทึกก่อน', 'warning');
          } else {
            setMenuTabIndex(index);
          }
        }}
      />

      <form ref={formRef}>
        <div className="flex flex-col gap-6 lg:flex-row">
          {menuTabIndex == 0 ? (
            <div className="flex flex-auto flex-col gap-6">
              <TSubjectInfo
                subject={subject}
                subjectGroups={subjectGroups}
                onDataChange={(data) => {
                  setFormData((prev) => ({ ...prev, ...data }));
                }}
              />
              <TSubjectSetup
                subject={subject}
                onDataChange={(data) => {
                  setFormData((prev) => ({ ...prev, ...data }));
                }}
              />
            </div>
          ) : menuTabIndex == 1 ? (
            <TSubjectTagGroup
              tagGroups={tagGroups}
              onTagGroupChange={onTagGroupChange}
              onTagCreate={onTagCreate}
              onTagUpdate={onTagUpdate}
              onTagArchive={onTagArchive}
            />
          ) : (
            ''
          )}

          <div className="flex h-fit min-w-[440px] flex-col gap-4 rounded-md bg-white p-4 shadow">
            <div className="grid grid-cols-2 items-center gap-y-4">
              <div>รหัสหลักสูตร:</div>
              <div>{subject?.id ?? '-'}</div>

              <div>สถานะ</div>
              <div>
                <CWSelect
                  value={formData.status}
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
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    setFormData((prev) => ({
                      ...prev,
                      status: value,
                    }));
                  }}
                />
              </div>

              <div>แก้ไขล่าสุด</div>
              <div>{subject?.updated_at ? toDateTimeTH(subject.updated_at) : '-'}</div>

              <div>แก้ไขล่าสุดโดย</div>
              <div>{subject?.updated_by ?? '-'}</div>
            </div>

            <button
              type="button"
              className="btn btn-primary mt-4"
              onClick={() => {
                if (formRef.current?.reportValidity()) {
                  onSubmit(formData);
                }
              }}
            >
              บันทึก
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CWSubjectFormLayout;
