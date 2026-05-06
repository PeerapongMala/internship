import CreateLayout from '@domain/g02/g02-d01/local/components/template/CreateLayout';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import SidePanel from '@domain/g02/g02-d01/local/components/organism/Sidepanel';
import { yearOptions } from '@domain/g02/g02-d01/local/components/option';
import CWSelect from '@component/web/cw-select';
import CWInput from '@component/web/cw-input';
import API from '@domain/g02/g02-d01/local/api';
import {
  LearningStatus,
  Learning,
  Content,
  ICreateContent,
  Year,
} from '@domain/g02/g02-d01/local/type';
import { useEffect, useState } from 'react';
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
}: any) => {
  const [contentData, setContentData] = useState<string>('');
  const [selectStatus, setSelectStatus] = useState<LearningStatus>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [learningArea, setLearningArea] = useState<Learning[]>([]);
  const [selectedLearningArea, setSelectedLearningArea] = useState<number>();

  const learningAreaOption = learningArea.map((data) => ({
    label: `${data.name} ${data.seed_year_name}` || 'ไม่มีข้อมูล',
    value: data.id || '',
  }));

  const handleStatusChange = (value: LearningStatus) => {
    setSelectStatus(value);
  };
  useEffect(() => {
    setFetching(true);
    API.LearningArea.Gets(Number(curriculumId), {
      limit: -1,
    })
      .then((res) => {
        if (res.status_code === 200) {
          setLearningArea(res.data);
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

  const handleSave = () => {
    if (!selectedLearningArea) {
      showMessage('กรุณาเลือก กลุ่มสาระการเรียนรู้', 'warning');
      return;
    }
    if (!contentData) {
      showMessage('กรุณากรอก ชื่อสาระ', 'warning');
      return;
    }
    if (!selectStatus) {
      showMessage('กรุณาเลือกสถานะ', 'warning');
      return;
    }
    const newData: ICreateContent = {
      learning_area_id: Number(selectedLearningArea),
      name: contentData,
      status: selectStatus,
    };
    API.Content.Create(newData).then((res) => {
      if (res.status_code === 201) {
        showMessage('เพิ่มข้อมูลสำเร็จ', 'success');
        setCurrentPage('main');
      } else {
        showMessage(res.message, 'error');
      }
    });
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
        <button onClick={() => setCurrentPage('main')}>
          <IconArrowBackward />
        </button>
        <h1 className="text-[24px] font-bold">{title}</h1>
      </div>
      <div className="mt-10 flex w-full gap-5">
        <div className="grid max-h-[250px] w-[75%] grid-cols-6 gap-x-5 bg-white p-5">
          <div className="col-span-3 w-full">
            <p className="mb-1.5">
              <span className="text-red-500">*</span>กลุ่มสาระการเรียนรู้
            </p>
            <WCADropdown
              placeholder={
                selectedLearningArea
                  ? learningAreaOption.find((opt) => opt.value === selectedLearningArea)
                    ?.label || 'เลือกกลุ่มสาระการเรียนรู้'
                  : 'เลือกกลุ่มสาระการเรียนรู้'
              }
              options={learningAreaOption}
              onSelect={(selected) => setSelectedLearningArea(Number(selected))}
            />
          </div>
          <div className="col-span-6 mt-4 w-full">
            <CWInput
              label={'ชื่อสาระ'}
              required={true}
              onChange={(e) => setContentData(e.target.value)}
            />
          </div>
        </div>
        <SidePanel
          titleName="รหัสสาระ"
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
