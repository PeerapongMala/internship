import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import CreateLayout from '@domain/g02/g02-d01/local/components/template/CreateLayout';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import SidePanel from '@domain/g02/g02-d01/local/components/organism/Sidepanel';
import {
  yearOptions,
  groupLearningcontentOptions,
  contentOptions,
  standardOptions,
  learningContectOptions,
  inducatorOptions,
} from '../../../../../local/components/option';
import InputSelect from '@domain/g02/g02-d01/local/components/organism/Select';
import Input from '@domain/g02/g02-d01/local/components/organism/Input';
import API from '@domain/g02/g02-d01/local/api';
import {
  LearningContent,
  LearningStatus,
  ICreateIndicator,
  Indicator,
  ICreateSubStandard,
  Learning,
  Content,
  Standard,
} from '@domain/g02/g02-d01/local/type';
import CWSelect from '@component/web/cw-select';
import CWInput from '@component/web/cw-input';
import CWButton from '@component/web/cw-button';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import CWSelectValue from '@component/web/cw-selectValue';
import showMessage from '@global/utils/showMessage';
import WCADropdown from '@domain/g03/g03-d01/local/components/web/atom/WCADropdown';
const CreateSubStandard = ({
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

  const [numberSubStandard, setNumberSubStandard] = useState(1);

  const [subShortNameData, setSubShortNameData] = useState<string>();
  const [subNameData, setSubNameData] = useState<string>();

  const [selectStatus, setSelectStatus] = useState<LearningStatus>();

  const [learningArea, setLearningArea] = useState<Learning[]>([]);
  const [contentData, setContentData] = useState<Content[]>([]);
  const [standardData, setStandardData] = useState<Standard[]>([]);
  const [learningContentData, setLearningContentData] = useState<LearningContent[]>([]);
  const [indicatorData, setIndicatorData] = useState<Indicator[]>([]);

  const [selectedYear, setSelectedYear] = useState<number>();
  const [selectedContent, setSelectedContent] = useState<number>();
  const [selectedStandard, setSelectedStandard] = useState<number>();
  const [selectedLearningContent, setSelectedLearningContent] = useState<number>();
  const [selectedIndicator, setSelectedIndicator] = useState<number>();

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
  useEffect(() => {
    fetchIndicator();
  }, [selectedLearningContent]);

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
  const fetchIndicator = async () => {
    setFetching(true);
    try {
      const res = await API.Indicator.Gets(Number(curriculumId), {
        learning_content_id: selectedLearningContent,
        limit: -1,
      });
      if (res.status_code === 200) {
        setIndicatorData(res.data);
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
    value: `${data.id}` || '',
  }));

  const OptionsForContent = contentData.map((data) => ({
    label: data.name || 'ไม่มีข้อมูล',
    value: `${data.id} ` || '',
  }));

  const OptionsForStandard = standardData.map((data) => ({
    label: `${data.name} ${data.short_name}` || 'ไม่มีข้อมูล',
    value: `${data.id} ` || '',
  }));

  const OptionsForLearningContent = learningContentData.map((data) => ({
    label: data.name || 'ไม่มีข้อมูล',
    value: `${data.id} ` || '',
  }));

  const OptionsForIndicator = indicatorData.map((data) => ({
    label: data.name || 'ไม่มีข้อมูล',
    value: `${data.id} ` || '',
  }));

  const incrementNumber = () => {
    if (numberSubStandard < 3) {
      setNumberSubStandard((prev) => prev + 1);
    }
  };
  const decrementNumber = () => {
    if (numberSubStandard > 1) {
      setNumberSubStandard((prev) => prev - 1);
    }
  };

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
    if (!selectedIndicator) {
      showMessage('กรุณาเลือก ตัวชี้วัด', 'warning');
      return;
    }
    if (!subShortNameData) {
      showMessage('กรุณากรอก ชื่อย่อหัวข้อมาตรฐานย่อย', 'warning');
      return;
    }
    if (!subNameData) {
      showMessage('กรุณากรอก ชื่อหัวข้อมาตรฐานย่อย', 'warning');
      return;
    }
    if (!selectStatus) {
      showMessage('กรุณาเลือกสถานะ', 'warning');
      return;
    }
    const newData: ICreateSubStandard = {
      indicator_id: Number(selectedIndicator),
      name: subNameData,
      short_name: subShortNameData,
      sub_criteria_id: numberSubStandard,
      year_id: indicatorData.find((indicator) => indicator.id === selectedIndicator)
        ?.year_id,
      status: selectStatus,
    };

    API.SubStandard.Create(newData).then((res) => {
      if (res.status_code === 201) {
        showMessage('เพิ่มข้อมูลสำเร็จ', 'success');
        navigate({ to: '/content-creator/standard/sub-standard' });
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
        { label: 'มาตรฐานย่อย' },
        { label: 'มาตรฐานย่อย 1' },
        { label: 'เพิ่มหัวข้อมาตรฐานย่อย' },
      ]}
    >
      <div className="mt-5 flex w-full items-center justify-center gap-4 rounded-md py-4 text-lg font-bold">
        <div>มาตรฐานย่อย</div>
        <CWButton
          className="w-8"
          icon={<IconCaretDown className="h-6 w-6 rotate-90" />}
          onClick={decrementNumber}
        />
        <div className="flex w-[100px] items-center gap-4">
          <CWInput
            type="text"
            className="w-full text-lg font-bold"
            value={numberSubStandard}
            readOnly
            disabled
          />
          <div className="w-full">/ 3</div>
        </div>
        <CWButton
          className="-ml-5 w-8"
          icon={<IconCaretDown className="h-6 w-6 -rotate-90" />}
          onClick={incrementNumber}
        />
      </div>
      <div className="mt-4 flex gap-3">
        <Link to={'/content-creator/standard/sub-standard'}>
          <IconArrowBackward />
        </Link>
        <h1 className="text-[24px] font-bold">
          {title} {numberSubStandard}
        </h1>
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
                  ? OptionsForYear.find((opt) => Number(opt.value) === selectedYear)
                    ?.label || 'เลือกกลุ่มสาระการเรียนรู้'
                  : 'เลือกกลุ่มสาระการเรียนรู้'
              }
              options={OptionsForYear}
              onSelect={(selected) => {
                setSelectedYear(Number(selected));
                setSelectedContent(undefined);
                setSelectedStandard(undefined);
                setSelectedLearningContent(undefined);
                setSelectedIndicator(undefined);
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
                  ? OptionsForContent.find((opt) => Number(opt.value) === selectedContent)
                    ?.label || 'เลือกสาระ'
                  : 'เลือกสาระ'
              }
              options={OptionsForContent}
              onSelect={(selected) => {
                setSelectedContent(Number(selected));
                setSelectedStandard(undefined);
                setSelectedLearningContent(undefined);
                setSelectedIndicator(undefined);
              }}
              disabled={!selectedYear}
            />
          </div>
          <div className="col-span-2 w-full">
            <p className="mb-1.5">
              <span className="text-red-500">*</span>มาตรฐาน
            </p>
            <WCADropdown
              placeholder={
                selectedStandard
                  ? OptionsForStandard.find(
                    (opt) => Number(opt.value) === selectedStandard,
                  )?.label || 'เลือกมาตรฐาน'
                  : 'เลือกมาตรฐาน'
              }
              options={OptionsForStandard}
              onSelect={(selected) => {
                setSelectedStandard(Number(selected));
                setSelectedLearningContent(undefined);
                setSelectedIndicator(undefined);
              }}
              disabled={!selectedContent}
            />
          </div>
          <div className="col-span-2 w-full">
            <p className="mb-1.5">
              <span className="text-red-500">*</span>สาระการเรียนรู้
            </p>
            <WCADropdown
              placeholder={
                selectedLearningContent
                  ? OptionsForLearningContent.find(
                    (opt) => Number(opt.value) === selectedLearningContent,
                  )?.label || 'เลือกมาตรฐาน'
                  : 'เลือกมาตรฐาน'
              }
              options={OptionsForLearningContent}
              onSelect={(selected) => {
                setSelectedLearningContent(Number(selected));
                setSelectedIndicator(undefined);
              }}
              disabled={!selectedStandard}
            />
          </div>
          <div className="col-span-2 w-full">
            <p className="mb-1.5">
              <span className="text-red-500">*</span>ตัวชี้วัด
            </p>
            <WCADropdown
              placeholder={
                selectedIndicator
                  ? OptionsForIndicator.find(
                    (opt) => Number(opt.value) === selectedIndicator,
                  )?.label || 'เลือกตัวชี้วัด'
                  : 'เลือกตัวชี้วัด'
              }
              options={OptionsForIndicator}
              onSelect={(selected) => setSelectedIndicator(Number(selected))}
              disabled={!selectedLearningContent}
            />
          </div>

          <div className="col-span-6 w-full">
            <CWInput
              onChange={(e) => setSubShortNameData(e.target.value)}
              required={true}
              title={'ชั้นปี'}
              label={'ชื่อย่อหัวข้อมาตรฐานย่อย'}
              className="col-span-2"
            />
          </div>
          <div className="col-span-6 w-full">
            <CWInput
              onChange={(e) => setSubNameData(e.target.value)}
              required={true}
              title={'ชั้นปี'}
              label={'ชื่อหัวข้อมาตรฐานย่อย'}
              className="col-span-2"
            />
          </div>
        </div>
        <SidePanel
          titleName="รหัส"
          onClick={handleSave}
          status={handleStatusChange}
          statusValue={selectStatus}
        />
      </div>
    </CreateLayout>
  );
};

export default CreateSubStandard;
