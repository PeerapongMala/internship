import CreateLayout from '@domain/g02/g02-d01/local/components/template/CreateLayout';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import SidePanel from '@domain/g02/g02-d01/local/components/organism/Sidepanel';
import InputSelect from '@domain/g02/g02-d01/local/components/organism/Select';
import Input from '@domain/g02/g02-d01/local/components/organism/Input';
import { yearOptions, contentOptions } from '@domain/g02/g02-d01/local/components/option';
import {
  Content,
  ICreateLearningContent,
  Learning,
  LearningStatus,
  Standard,
} from '@domain/g02/g02-d01/local/type';
import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
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

  const [nameData, setNameData] = useState<string>();
  const [selectedIdContent, setSelectedIdContent] = useState<number>();
  const [selectStatus, setSelectStatus] = useState<LearningStatus>();

  const [learningArea, setLearningArea] = useState<Learning[]>([]);
  const [contentData, setContentData] = useState<Content[]>([]);
  const [standardData, setStandardData] = useState<Standard[]>([]);

  const [selectedYear, setSelectedYear] = useState<number>();
  const [selectedContent, setSelectedContent] = useState<number>();
  const [selectedStandard, setSelectedStandard] = useState<number>();

  useEffect(() => {
    fetchLearningArea();
  }, [curriculumId]);
  useEffect(() => {
    fetchContent();
  }, [curriculumId, selectedYear]);
  useEffect(() => {
    fetchStandard();
  }, [curriculumId, selectedContent]);

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
  const fetchContent = async () => {
    setFetching(true);
    try {
      const res = await API.Content.Gets(Number(curriculumId), {
        learning_area_id: selectedYear,
        limit: -1,
      });
      if (res.status_code === 200) {
        setContentData(res.data);
      } else {
        showMessage(res.message, 'error');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('เกิดข้อผิดพลาดในการดึงข้อมูล', 'error');
    } finally {
      setFetching(false);
    }
  };

  const fetchStandard = async () => {
    setFetching(true);
    try {
      const res = await API.Standard.Gets(Number(curriculumId), {
        content_id: selectedContent,
        limit: -1,
      });
      if (res.status_code === 200) {
        setStandardData(res.data);
      } else {
        showMessage(res.message, 'error');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('เกิดข้อผิดพลาดในการดึงข้อมูล', 'error');
    } finally {
      setFetching(false);
    }
  };

  const standardOptionsForYear = learningArea.map((data) => ({
    label:
      data.name && data.seed_year_name
        ? `${data.name} ${data.seed_year_name}`
        : 'ไม่มีข้อมูล',
    value: data.id || '',
  }));

  const standardOptionsForContent = contentData.map((data) => ({
    label: data.name || 'ไม่มีข้อมูล',
    value: data.id || '',
  }));

  const standardOptionsForStandard = standardData.map((data) => ({
    label: data.name || 'ไม่มีข้อมูล',
    value: data.id || '',
  }));

  const handleStatusChange = (value: LearningStatus) => {
    setSelectStatus(value);
  };

  const handleSave = () => {
    if (!selectedYear) {
      showMessage('กรุณาเลือก กลุ่มสาระการเรียนรู้', 'warning');
      return;
    }
    if (!selectedContent) {
      showMessage('กรุณาเลือก สาระ', 'warning');
      return;
    }
    if (!selectedStandard) {
      showMessage('กรุณาเลือก มาตรฐาน', 'warning');
      return;
    }
    if (!nameData) {
      showMessage('กรุณากรอก ชื่อสาระการเรียนรู้', 'warning');
      return;
    }
    if (!selectStatus) {
      showMessage('กรุณาเลือกสถานะ', 'warning');
      return;
    }
    const newData: ICreateLearningContent = {
      criteria_id: Number(selectedStandard),
      name: nameData,
      status: selectStatus,
    };

    API.learningContent.Create(newData).then((res) => {
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
        <div className="grid min-h-[300px] w-[75%] grid-cols-6 gap-5 bg-white p-5">
          <div className="col-span-3 w-full">
            <p className="mb-1.5">
              <span className="text-red-500">*</span>กลุ่มสาระการเรียนรู้
            </p>
            <WCADropdown
              placeholder={
                selectedYear
                  ? standardOptionsForYear.find((opt) => opt.value === selectedYear)
                    ?.label || 'เลือกกลุ่มสาระการเรียนรู้'
                  : 'เลือกกลุ่มสาระการเรียนรู้'
              }
              options={standardOptionsForYear}
              onSelect={(selected) => {
                setSelectedYear(Number(selected));
                setSelectedContent(undefined);
                setSelectedStandard(undefined);
              }}
            />
          </div>
          <div className="col-span-3 w-full">
            <p className="mb-1.5">
              <span className="text-red-500">*</span>สาระ
            </p>
            <WCADropdown
              placeholder={
                selectedContent
                  ? standardOptionsForContent.find((opt) => opt.value === selectedContent)
                    ?.label || 'เลือกสาระ'
                  : 'เลือกสาระ'
              }
              options={standardOptionsForContent}
              onSelect={(selected) => {
                setSelectedContent(Number(selected));
                setSelectedStandard(undefined);
              }}
              disabled={!selectedYear}
            />
          </div>
          <div className="col-span-6 w-full">
            <p className="mb-1.5">
              <span className="text-red-500">*</span>มาตรฐาน
            </p>
            <WCADropdown
              placeholder={
                selectedStandard
                  ? standardOptionsForYear.find((opt) => opt.value === selectedStandard)
                    ?.label || 'เลือกมาตรฐาน'
                  : 'เลือกมาตรฐาน'
              }
              options={standardOptionsForStandard}
              onSelect={(selected) => setSelectedStandard(Number(selected))}
              disabled={!selectedContent}
            />
          </div>

          <div className="col-span-6 w-full">
            <CWInput
              label={'ชื่อสาระการเรียนรู้'}
              required={true}
              onChange={(e) => setNameData(e.target.value)}
            />
          </div>
        </div>

        <SidePanel
          titleName="รหัสสาระการเรียนรู้"
          onClick={handleSave}
          status={handleStatusChange}
          statusValue={selectStatus}
        />
      </div>
    </CreateLayout>
  );
};

export default CreateContent;
