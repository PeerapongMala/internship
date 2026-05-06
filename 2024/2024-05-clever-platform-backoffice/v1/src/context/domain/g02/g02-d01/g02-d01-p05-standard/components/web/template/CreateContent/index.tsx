import CreateLayout from '@domain/g02/g02-d01/local/components/template/CreateLayout';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import SidePanel from '@domain/g02/g02-d01/local/components/organism/Sidepanel';
import InputSelect from '@domain/g02/g02-d01/local/components/organism/Select';
import Input from '@domain/g02/g02-d01/local/components/organism/Input';
import { yearOptions, contentOptions } from '@domain/g02/g02-d01/local/components/option';
import { useNavigate } from '@tanstack/react-router';
import {
  Content,
  ICreateContent,
  ICreateStandard,
  Learning,
  LearningStatus,
  Standard,
  Year,
} from '@domain/g02/g02-d01/local/type';
import { useEffect, useState } from 'react';
import API from '@domain/g02/g02-d01/local/api';
import CWSelect from '@component/web/cw-select';
import CWInput from '@component/web/cw-input';
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
  const navigate = useNavigate();

  const [fetching, setFetching] = useState<boolean>(false);
  const [contentData, setContentData] = useState<Content[]>([]);
  const [nameData, setNameData] = useState<string>();
  const [shortNameData, setShortNameData] = useState<string>();

  const [learningArea, setLearningArea] = useState<Learning[]>([]);

  const [selectedIdLearningAre, setSelectedIdLearningAre] = useState<number>();
  const [selectStatus, setSelectStatus] = useState<LearningStatus>();
  const [selectedYear, setSelectedYear] = useState<number>();

  useEffect(() => {
    fetchLearningArea();
  }, [curriculumId]);
  useEffect(() => {
    fetchContentData();
  }, [selectedYear, curriculumId]);

  const fetchLearningArea = async () => {
    setFetching(true);
    try {
      const res = await API.LearningArea.Gets(Number(curriculumId), {
        limit: -1,
      });
      if (res.status_code === 200) {
        setLearningArea(res.data);
      } else {
        console.log(res.message);
        showMessage(res.message, 'error');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('เกิดข้อผิดพลาดในการดึงข้อมูล', 'error');
    } finally {
      setFetching(false);
    }
  };

  const fetchContentData = async () => {
    setFetching(true);
    try {
      const res = await API.Content.Gets(Number(curriculumId), {
        learning_area_id: selectedYear,
        limit: 30,
      });
      if (res.status_code === 200) {
        setContentData(res.data);
      } else {
        console.log(res.message);
        showMessage(res.message, 'error');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('เกิดข้อผิดพลาดในการดึงข้อมูล', 'error');
    } finally {
      setFetching(false);
    }
  };

  const contentOptionsForYear = learningArea.map((data) => ({
    label:
      data.name && data.seed_year_name
        ? `${data.name} ${data.seed_year_name}`
        : 'ไม่มีข้อมูล',
    value: data.id || '',
  }));

  const contentOptionsForSubject = contentData.map((data) => ({
    label: data.name || 'ไม่มีข้อมูล',
    value: data.id || '',
  }));

  const handleSelectChange = (value: number) => {
    setSelectedIdLearningAre(value);
  };
  const handleStatusChange = (value: LearningStatus) => {
    setSelectStatus(value);
  };

  const handleSave = () => {
    if (!selectedYear) {
      showMessage('กรุณาเลือก กลุ่มสาระการเรียนรู้', 'warning');
      return;
    }
    if (!selectedIdLearningAre) {
      showMessage('กรุณาเลือก สาระ', 'warning');
      return;
    }
    if (!nameData) {
      showMessage('กรุณากรอก ชื่อมาตรฐาน', 'warning');
      return;
    }
    if (!shortNameData) {
      showMessage('กรุณากรอก ชื่อย่อมาตรฐาน', 'warning');
      return;
    }
    if (!selectStatus) {
      showMessage('กรุณาเลือกสถานะ', 'warning');
      return;
    }
    const newData: ICreateStandard = {
      content_id: Number(selectedIdLearningAre),
      name: nameData,
      short_name: shortNameData,
      status: selectStatus,
    };

    API.Standard.Create(newData).then((res) => {
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
                selectedYear
                  ? contentOptionsForYear.find((opt) => opt.value === selectedYear)
                    ?.label || 'เลือกชั้นปี'
                  : 'เลือกชั้นปี'
              }
              options={contentOptionsForYear}
              onSelect={(selected) => {
                setSelectedYear(Number(selected));
                setSelectedIdLearningAre(undefined);
              }}
            />
          </div>
          <div className="col-span-3 w-full">
            <p className="mb-1.5">
              <span className="text-red-500">*</span>สาระ
            </p>
            <WCADropdown
              placeholder={
                selectedIdLearningAre
                  ? contentOptionsForSubject.find(
                    (opt) => opt.value === selectedIdLearningAre,
                  )?.label || 'เลือกสาระ'
                  : 'เลือกสาระ'
              }
              options={contentOptionsForSubject}
              onSelect={(selected) => setSelectedIdLearningAre(Number(selected))}
              disabled={!selectedYear}
            />
          </div>

          <div className="col-span-4 mt-4 w-full">
            <CWInput
              label={'ชื่อมาตรฐาน'}
              required={true}
              onChange={(e) => setNameData(e.target.value)}
            />
          </div>
          <div className="col-span-2 mt-4 w-full">
            <CWInput
              label={'ชื่อย่อมาตรฐาน'}
              required={true}
              onChange={(e) => setShortNameData(e.target.value)}
            />
          </div>
        </div>

        <SidePanel
          titleName="รหัสมาตรฐาน"
          onClick={handleSave}
          status={handleStatusChange}
          statusValue={selectStatus}
        />
      </div>
    </CreateLayout>
  );
};

export default CreateContent;
