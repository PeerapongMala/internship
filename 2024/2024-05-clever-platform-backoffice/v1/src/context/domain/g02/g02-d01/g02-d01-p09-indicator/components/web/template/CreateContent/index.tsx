import CreateLayout from '@domain/g02/g02-d01/local/components/template/CreateLayout';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import SidePanel from '@domain/g02/g02-d01/local/components/organism/Sidepanel';
import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import CWSelect from '@component/web/cw-select';
import CWInput from '@component/web/cw-input';
import {
  Content,
  ICreateIndicator,
  Learning,
  LearningContent,
  LearningStatus,
  Standard,
} from '@domain/g02/g02-d01/local/type';
import API from '@domain/g02/g02-d01/local/api';
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
  const [learningContentData, setLearningContentData] = useState<LearningContent[]>([]);

  const [indicatorNameData, setIndicatorNameData] = useState<string>();
  const [indicatorShortNameData, setIndicatorShortNameData] = useState<string>();
  const [indicatorTranscriptNameData, setIndicatorTranscriptNameData] =
    useState<string>();

  const [selectedIdLearningContent, setSelectedIdLearningContent] = useState<number>();
  const [selectStatus, setSelectStatus] = useState<LearningStatus>();

  const [learningArea, setLearningArea] = useState<Learning[]>([]);
  const [contentData, setContentData] = useState<Content[]>([]);
  const [standardData, setStandardData] = useState<Standard[]>([]);

  const [selectedYear, setSelectedYear] = useState<number>();
  const [selectedContent, setSelectedContent] = useState<number>();
  const [selectedStandard, setSelectedStandard] = useState<number>();
  const [selectedLearningContent, setSelectedLearningContent] = useState<number>();

  useEffect(() => {
    fetchLearningArea();
  }, [curriculumId]);
  useEffect(() => {
    fetchContent();
  }, [selectedYear]);
  useEffect(() => {
    fetchStandard();
  }, [selectedContent]);
  useEffect(() => {
    fetchLearningContent();
  }, [selectedStandard]);

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

  const fetchLearningContent = async () => {
    setFetching(true);
    try {
      const res = await API.learningContent.Gets(Number(curriculumId), {
        criteria_id: selectedStandard,
        limit: -1,
      });
      if (res.status_code === 200) {
        setLearningContentData(res.data);
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

  const OptionsForYear = learningArea.map((data) => ({
    label:
      data.name && data.seed_year_name
        ? `${data.name} ${data.seed_year_name}`
        : 'ไม่มีข้อมูล',
    value: data.id || '',
  }));

  const OptionsForContent = contentData.map((data) => ({
    label: data.name || 'ไม่มีข้อมูล',
    value: data.id || '',
  }));

  const OptionsForStandard = standardData.map((data) => ({
    label: `${data.short_name} ${data.name}` || 'ไม่มีข้อมูล',
    value: data.id || '',
  }));

  const OptionsForLearningContent = learningContentData.map((data) => ({
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
    if (!selectedLearningContent) {
      showMessage('กรุณาเลือก สาระการเรียนรู้', 'warning');
      return;
    }
    if (!indicatorNameData) {
      showMessage('กรุณากรอก ชื่อตัวชี้วัด', 'warning');
      return;
    }
    if (!indicatorShortNameData) {
      showMessage('กรุณากรอก ชื่อย่อตัวชี้วัด', 'warning');
      return;
    }
    if (!indicatorTranscriptNameData) {
      showMessage('กรุณากรอก ชื่อบน ปพ.', 'warning');
      return;
    }
    if (!selectStatus) {
      showMessage('กรุณาเลือกสถานะ', 'warning');
      return;
    }
    const newData: ICreateIndicator = {
      learning_content_id: Number(selectedLearningContent),
      name: indicatorNameData,
      short_name: indicatorShortNameData,
      transcript_name: indicatorTranscriptNameData,
      status: selectStatus,
    };

    API.Indicator.Create(newData).then((res) => {
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
        <div className="grid h-auto w-[75%] grid-cols-6 gap-5 bg-white p-5">
          <div className="col-span-3 w-full">
            <p className="mb-1.5">
              <span className="text-red-500">*</span>กลุ่มสาระการเรียนรู้
            </p>
            <WCADropdown
              placeholder={
                selectedYear
                  ? OptionsForYear.find((opt) => opt.value === selectedYear)?.label ||
                  'เลือกกลุ่มสาระการเรียนรู้'
                  : 'เลือกกลุ่มสาระการเรียนรู้'
              }
              options={OptionsForYear}
              onSelect={(selected) => {
                setSelectedYear(Number(selected));
                setSelectedContent(undefined);
                setSelectedStandard(undefined);
                setSelectedLearningContent(undefined);
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
                  ? OptionsForContent.find((opt) => opt.value === selectedContent)
                    ?.label || 'เลือกสาระ'
                  : 'เลือกสาระ'
              }
              options={OptionsForContent}
              onSelect={(selected) => {
                setSelectedContent(Number(selected));
                setSelectedStandard(undefined);
                setSelectedLearningContent(undefined);
              }}
              disabled={!selectedYear}
            />
          </div>
          <div className="col-span-3 w-full">
            <p className="mb-1.5">
              <span className="text-red-500">*</span>มาตรฐาน
            </p>
            <WCADropdown
              placeholder={
                selectedStandard
                  ? OptionsForStandard.find((opt) => opt.value === selectedStandard)
                    ?.label || 'เลือกมาตรฐาน'
                  : 'เลือกมาตรฐาน'
              }
              options={OptionsForStandard}
              onSelect={(selected) => {
                setSelectedStandard(Number(selected));
                setSelectedLearningContent(undefined);
              }}
              disabled={!selectedContent}
            />
          </div>
          <div className="col-span-3 w-full">
            <p className="mb-1.5">
              <span className="text-red-500">*</span>สาระการเรียนรู้
            </p>
            <WCADropdown
              placeholder={
                selectedLearningContent
                  ? OptionsForLearningContent.find(
                    (opt) => opt.value === selectedLearningContent,
                  )?.label || 'เลือกสาระการเรียนรู้'
                  : 'เลือกสาระการเรียนรู้'
              }
              options={OptionsForLearningContent}
              onSelect={(selected) => setSelectedLearningContent(Number(selected))}
              disabled={!selectedStandard}
            />
          </div>

          <div className="col-span-6 w-full">
            <CWInput
              onChange={(e) => setIndicatorNameData(e.target.value)}
              required={true}
              label={'ชื่อตัวชี้วัด'}
              className="col-span-2"
            />
          </div>
          <div className="col-span-3 w-full">
            <CWInput
              onChange={(e) => setIndicatorShortNameData(e.target.value)}
              required={true}
              label={'ชื่อย่อตัวชี้วัด'}
              className="col-span-2"
            />
          </div>
          <div className="col-span-3 w-full">
            <CWInput
              onChange={(e) => setIndicatorTranscriptNameData(e.target.value)}
              required={true}
              label={'ชื่อย่อบน ปพ.'}
              className="col-span-2"
            />
          </div>
        </div>
        <SidePanel
          titleName="รหัสตัวชี้วัด"
          onClick={handleSave}
          status={handleStatusChange}
          statusValue={selectStatus}
        />
      </div>
    </CreateLayout>
  );
};

export default CreateContent;
