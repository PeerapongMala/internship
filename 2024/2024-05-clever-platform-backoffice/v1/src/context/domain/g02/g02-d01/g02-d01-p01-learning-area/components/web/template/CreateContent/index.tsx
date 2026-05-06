import CreateLayout from '@domain/g02/g02-d01/local/components/template/CreateLayout';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import SidePanel from '@domain/g02/g02-d01/local/components/organism/Sidepanel';
import InputSelect from '@domain/g02/g02-d01/local/components/organism/Select';

import { useEffect, useState } from 'react';
import API from '@domain/g02/g02-d01/local/api';
import { Learning, LearningStatus, Year } from '@domain/g02/g02-d01/local/type';
import { useNavigate } from '@tanstack/react-router';
import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import CWSelectValue from '@component/web/cw-selectValue';
import showMessage from '@global/utils/showMessage';
import WCADropdown from '@domain/g03/g03-d01/local/components/web/atom/WCADropdown';

const CreateContent = ({
  setCurrentPage,
  userId,
  time,
  byAdmin,
  handleClick,
  title,
  curriculumId,
  data,
}: any) => {
  const navigate = useNavigate();
  const [learningArea, setLearningArea] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number | string>('');
  const [selectStatus, setSelectStatus] = useState<LearningStatus>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [yearData, setYearData] = useState<Year[]>([]);
  useEffect(() => {
    setFetching(true);
    API.Year.Gets(Number(curriculumId), {
      limit: -1,
    })
      .then((res) => {
        if (res.status_code === 200) {
          setYearData(res.data);
        } else {
          console.log(res.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setFetching(false);
      });
  }, []);

  const handleStatusChange = (value: LearningStatus) => {
    setSelectStatus(value);
  };

  const handleSave = () => {
    if (!learningArea) {
      showMessage('กรุณากรอก สาระการเรียนรู้', 'warning');
      return;
    }
    if (!learningArea) {
      showMessage('กรุณาเลือก ขั้นปี', 'warning');
      return;
    }
    if (!selectStatus) {
      showMessage('กรุณาเลือกสถานะ', 'warning');
      return;
    }
    const newData: Learning = {
      curriculum_group_id: curriculumId,
      name: learningArea,
      year_id: Number(selectedYear),
      status: selectStatus,
    };

    API.LearningArea.Create(newData).then((res) => {
      if (res.status_code === 201) {
        showMessage('เพิ่มข้อมูลสำเร็จ', 'success');
        setCurrentPage('main');
      } else {
        showMessage(res.message, 'error');
      }
    });
  };
  const yearOptions = yearData.map((year) => ({
    label: year.seed_year_name || '',
    value: year.id || '',
  }));
  return (
    <CreateLayout
      title="มาตรฐานหลัก"
      breadcrumbItems={[
        { label: 'เกี่ยวกับหลักสูตร', href: '#' },
        { label: 'มาตรฐานหลัก' },
      ]}
    >
      <div className="mt-4 flex gap-3">
        <button onClick={() => setCurrentPage('main')}>
          <IconArrowBackward />
        </button>
        <h1 className="text-[24px] font-bold">{title}</h1>
      </div>
      <div className="mt-10 w-full gap-5 xl:flex">
        <div className="grid max-h-[150px] grid-cols-6 gap-x-5 bg-white p-5 xl:w-[75%]">
          <div className="col-span-3 w-full">
            <CWInput
              label={'สาระการเรียนรู้'}
              required={true}
              onChange={(e) => setLearningArea(e.target.value)}
            />
          </div>
          <div className="col-span-3 w-full">
            <p className="mb-1.5">
              <span className="text-red-500">*</span>ชั้นปี
            </p>
            <WCADropdown
              placeholder={
                selectedYear
                  ? yearOptions.find((opt) => opt.value === selectedYear)?.label ||
                  'เลือกสาระ'
                  : 'เลือกชั้นปี'
              }
              options={yearOptions}
              onSelect={(selected) => setSelectedYear(selected)}
            />
          </div>
        </div>
        <SidePanel
          titleName="รหัสกลุ่มสาระ"
          time={time}
          byAdmin={byAdmin}
          onClick={handleSave}
          status={handleStatusChange}
          statusValue={selectStatus}
        />
      </div>
    </CreateLayout>
  );
};

export default CreateContent;
