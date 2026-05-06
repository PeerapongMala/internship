import CreateLayout from '@domain/g02/g02-d01/local/components/template/CreateLayout';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import SidePanel from '@domain/g02/g02-d01/local/components/organism/Sidepanel';
import InputSelect from '@domain/g02/g02-d01/local/components/organism/Select';
import Input from '@domain/g02/g02-d01/local/components/organism/Input';
import { yearOptions } from '@domain/g02/g02-d01/local/components/option';
import API from '@domain/g02/g02-d01/local/api';
import { useCallback, useEffect, useState } from 'react';
import { Learning, LearningStatus, Year } from '@domain/g02/g02-d01/local/type';
import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import { useNavigate } from '@tanstack/react-router';
import showMessage from '@global/utils/showMessage';
import CWSelectValue from '@component/web/cw-selectValue';
import WCADropdown from '@domain/g03/g03-d01/local/components/web/atom/WCADropdown';

interface EditContentProp {
  id: number;
  curriculumId?: number;
  userId?: string;
  title?: string;
  time?: string;
  byAdmin?: string;
  handleSaveEdit: () => void;
  ClickBack: () => void;
}

const EditContent = ({
  id,
  curriculumId,
  userId,
  time,
  byAdmin,
  handleSaveEdit,
  title,
  ClickBack,
}: EditContentProp) => {
  const navigate = useNavigate();
  const [yearData, setYearData] = useState<Year[]>([]);

  const [data, setData] = useState<Learning>({
    curriculum_group_id: curriculumId,
    year_id: undefined,
    name: '',
    status: LearningStatus.DRAFT,
    updated_at: undefined,
    updated_by: undefined,
  });
  useEffect(() => {
    if (id) {
      API.LearningArea.GetById(id).then((res) => {
        if (res.status_code === 200) {
          setData((prev) => ({
            ...prev,
            curriculum_group_id: res.data.curriculum_group_id || '',
            name: res.data.name || '',
            year_id: res.data.year_id || '',
            status: res.data.status || LearningStatus.DRAFT,
            updated_at: res.data.updated_at,
            updated_by: res.data.updated_by,
          }));
        }
      });
    }
  }, []);

  useEffect(() => {
    if (id) {
      API.Year.Gets(Number(curriculumId), {}).then((res) => {
        if (res.status_code === 200) {
          setYearData(res.data);
        } else {
          console.log(res.message);
        }
      });
    }
  }, []);
  const yearOptions = yearData.map((year) => ({
    label: year.seed_year_name || '',
    value: year.id || '',
  }));

  const handleInputChange = useCallback((field: keyof Learning, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const SaveEdit = () => {
    API.LearningArea.Update(id, data)
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกสำเร็จ', 'success');
          navigate({ to: '../../' });
        } else {
          showMessage(res.message, 'error');
        }
      })
      .catch((error) => showMessage(error.message, 'error'));
  };

  return (
    <CreateLayout
      title="มาตรฐานหลัก"
      breadcrumbItems={[
        { label: 'เกี่ยวกับหลักสูตร', href: '#' },
        { label: 'มาตรฐานหลัก' },
      ]}
    >
      <div className="mt-4 flex gap-3">
        <button onClick={ClickBack}>
          <IconArrowBackward />
        </button>
        <h1 className="text-[24px] font-bold">{title}</h1>
      </div>
      <div className="mt-10 flex w-full gap-5">
        <div className="grid h-[150px] w-[75%] grid-cols-6 gap-x-5 bg-white p-5">
          <div className="col-span-3 w-full">
            <CWInput
              placeholder="คณิตศาสตร์"
              label="สาระการเรียนรู้"
              required
              value={data.name}
              onChange={(e) => {
                handleInputChange('name', e.target.value);
              }}
            />
          </div>
          <div className="col-span-3 w-full">
            <p className="mb-1.5">
              <span className="text-red-500">*</span>ชั้นปี
            </p>
            <WCADropdown
              placeholder={
                data.year_id
                  ? yearOptions.find((opt) => opt.value === data.year_id)?.label ||
                  'เลือกสาระ'
                  : 'เลือกชั้นปี'
              }
              options={yearOptions}
              onSelect={(selected) => {
                const newValue = Number(selected);
                handleInputChange('year_id', newValue);
              }}
            />
          </div>
        </div>
        <SidePanel
          titleName="รหัสกลุ่มสาระ"
          userId={userId}
          time={data.updated_at}
          byAdmin={data.updated_by}
          onClick={SaveEdit}
          statusValue={data.status}
          status={(value) => handleInputChange('status', value)}
        />
      </div>
    </CreateLayout>
  );
};

export default EditContent;
