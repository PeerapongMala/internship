import CreateLayout from '@domain/g02/g02-d01/local/components/template/CreateLayout';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import SidePanel from '@domain/g02/g02-d01/local/components/organism/Sidepanel';
import InputSelect from '@domain/g02/g02-d01/local/components/organism/Select';
import Input from '@domain/g02/g02-d01/local/components/organism/Input';
import { yearOptions } from '@domain/g02/g02-d01/local/components/option';
import API from '@domain/g02/g02-d01/local/api';
import { useCallback, useEffect, useState } from 'react';
import {
  ICreateSubStandard,
  Indicator,
  IUpdateIndicator,
  IUpdateSubStandard,
  Learning,
  LearningStatus,
  SubStandard,
} from '@domain/g02/g02-d01/local/type';
import { useNavigate } from '@tanstack/react-router';
import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import showMessage from '@global/utils/showMessage';
import CWSelectValue from '@component/web/cw-selectValue';

interface EditContentProp {
  id: number;
  userId?: string;
  title?: string;
  time?: string;
  byAdmin?: string;

  handleSaveEdit?: () => void;
  ClickBack: () => void;
}

const EditContent = ({
  id,
  userId,
  time,
  byAdmin,
  handleSaveEdit,
  title,
  ClickBack,
}: EditContentProp) => {
  const navigate = useNavigate();

  const [data, setData] = useState<IUpdateSubStandard>({
    id: undefined,
    sub_criteria_id: undefined,
    learning_content_id: undefined,
    criteria_id: undefined,
    year_id: undefined,
    learning_area_name: '',
    seed_year_name: '',
    content_name: '',
    criteria_name: '',
    criteria_short_name: '',
    learning_content_name: '',
    indicator_id: undefined,
    indicator_name: '',
    indicator_transcript_name: '',
    name: '',
    short_name: '',
    status: LearningStatus.DRAFT,
    updated_at: undefined,
    updated_by: undefined,
  });
  console.log(data);

  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    setFetching(true);
    API.SubStandard.GetById(id)
      .then((res) => {
        if (res.status_code === 200) {
          console.log(res.data);
          setData((prev) => ({
            ...prev,
            id: res.data.id,
            sub_criteria_id: res.data.sub_criteria_id,
            year_id: res.data.year_id,
            learning_content_id: res.data.learning_content_id,
            criteria_id: res.data.criteria_id,
            learning_area_name: res.data.learning_area_name,
            seed_year_name: res.data.seed_year_name,
            content_name: res.data.content_name,
            criteria_short_name: res.data.criteria_short_name,
            criteria_name: res.data.criteria_name,
            learning_content_name: res.data.learning_content_name,
            indicator_id: res.data.indicator_id,
            indicator_name: res.data.indicator_name,
            indicator_transcript_name: res.data.indicator_transcript_name,
            name: res.data.name,
            short_name: res.data.short_name,
            status: res.data.status || LearningStatus.DRAFT,
            updated_at: res.data.updated_at,
            updated_by: res.data.updated_by,
          }));
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

  const handleInputChange = useCallback((field: keyof Learning, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const LearningAreaOptions = data.id
    ? [
      {
        value: data.id,
        label: `${data.seed_year_name} - ${data.learning_area_name}` || 'ไม่มีข้อมูล',
      },
    ]
    : [];
  console.log({ LearningAreaOptions: LearningAreaOptions });

  const ContentNameOptions = data.id
    ? [{ value: data.id, label: data.content_name || 'ไม่มีข้อมูล' }]
    : [];
  console.log({ ContentNameOptions: ContentNameOptions });

  const CriteriaNameOptions = data.id
    ? [
      {
        value: data.id,
        label: `${data.criteria_short_name} ${data.criteria_name}` || 'ไม่มีข้อมูล',
      },
    ]
    : [];
  console.log({ CriteriaNameOptions: CriteriaNameOptions });

  const LearningContentNameOptions = data.id
    ? [{ value: data.id, label: data.learning_content_name || 'ไม่มีข้อมูล' }]
    : [];
  console.log({ LearningContentNameOptions: LearningContentNameOptions });

  const IndicationNameOptions = data.id
    ? [
      {
        value: data.id,
        label:
          `${data.indicator_transcript_name} - ${data.indicator_name}` || 'ไม่มีข้อมูล',
      },
    ]
    : [];
  console.log({ IndicationNameOptions: IndicationNameOptions });

  const SaveEdit = () => {
    API.SubStandard.Update(id, data)
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
        <div className="grid h-auto w-[75%] grid-cols-6 gap-5 bg-white p-5">
          <div className="col-span-3 w-full">
            <CWSelectValue
              options={LearningAreaOptions}
              value={data.id}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setData((prev) => ({
                    ...prev,
                    id: selectedOption.value,
                  }));
                }
              }}
              disabled
              required={false}
              label={'ชั้นปี'}
              className="col-span-2"
            />
          </div>
          <div className="col-span-3 w-full">
            <CWSelectValue
              options={ContentNameOptions}
              value={data.id}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setData((prev) => ({
                    ...prev,
                    sub_criteria_id: selectedOption.value,
                  }));
                }
              }}
              disabled
              required={false}
              label={'สาระ'}
              className="col-span-2"
            />
          </div>
          <div className="col-span-2 w-full">
            <CWSelectValue
              options={CriteriaNameOptions}
              value={data.id}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setData((prev) => ({
                    ...prev,
                    id: selectedOption.value,
                  }));
                }
              }}
              disabled
              required={false}
              label={'มาตรฐาน'}
              className="col-span-2"
            />
          </div>
          <div className="col-span-2 w-full">
            <CWSelectValue
              options={LearningContentNameOptions}
              value={data.id}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setData((prev) => ({
                    ...prev,
                    id: selectedOption.value,
                  }));
                }
              }}
              required={false}
              disabled
              label={'สาระการเรียนรู้'}
              className="col-span-2"
            />
          </div>
          <div className="col-span-2 w-full">
            <CWSelectValue
              options={IndicationNameOptions}
              value={data.id}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setData((prev) => ({
                    ...prev,
                    id: selectedOption.value,
                  }));
                }
              }}
              required={false}
              disabled
              label={'ตัวชี้วัด'}
              className="col-span-2"
            />
          </div>
          <div className="col-span-6 w-full">
            <CWInput
              placeholder={'CANDO-1'}
              onChange={(e) =>
                setData((prev) => ({ ...prev, short_name: e.target.value }))
              }
              value={data.short_name}
              required={true}
              title={'ชั้นปี'}
              label={'ชื่อย่อหัวข้อมาตรฐานย่อย'}
              className="col-span-2"
            />
          </div>
          <div className="col-span-6 w-full">
            <CWInput
              placeholder={
                'เข้าใจความหลากหลายของการแสดงจำนวน ระบบจำนวน การดำเนินการของจำนวน ผลที่เกิดขึ้นจากการดำเนินการ สมบัติของการดำเนินการ และนำไปใช้'
              }
              onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
              value={data.name}
              required={true}
              title={'ชั้นปี'}
              label={'ชื่อหัวข้อมาตรฐานย่อย'}
              className="col-span-2"
            />
          </div>
        </div>
        <SidePanel
          titleName="รหัสตัวชี้วัด"
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
