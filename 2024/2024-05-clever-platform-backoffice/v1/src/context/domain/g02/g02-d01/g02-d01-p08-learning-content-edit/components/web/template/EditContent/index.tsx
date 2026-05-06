import CreateLayout from '@domain/g02/g02-d01/local/components/template/CreateLayout';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import SidePanel from '@domain/g02/g02-d01/local/components/organism/Sidepanel';
import InputSelect from '@domain/g02/g02-d01/local/components/organism/Select';
import Input from '@domain/g02/g02-d01/local/components/organism/Input';
import { contentOptions, yearOptions } from '@domain/g02/g02-d01/local/components/option';
import API from '@domain/g02/g02-d01/local/api';
import { useCallback, useEffect, useState } from 'react';
import {
  IUpdateLearningContent,
  Learning,
  LearningContent,
  LearningStatus,
} from '@domain/g02/g02-d01/local/type';
import CWInput from '@component/web/cw-input';
import CWSelect from '@component/web/cw-select';
import { useNavigate } from '@tanstack/react-router';
import showMessage from '@global/utils/showMessage';
import CWSelectValue from '@component/web/cw-selectValue';

interface EditContentProp {
  id: number;
  userId?: string;
  title?: string;
  time?: string;
  byAdmin?: string;
  handleSaveEdit: () => void;
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
  const [data, setData] = useState<IUpdateLearningContent>({
    id: undefined,
    criteria_id: undefined,
    learning_area_name: '',
    seed_year_name: '',
    content_name: '',
    criteria_name: '',
    criteria_short_name: '',
    status: LearningStatus.DRAFT,
    updated_at: undefined,
    updated_by: undefined,
  });
  console.log(data);

  useEffect(() => {
    API.learningContent.GetById(id).then((res) => {
      if (res.status_code === 200) {
        setData((prev) => ({
          ...prev,
          id: res.data.id,
          criteria_id: res.data.criteria_id,
          learning_area_name: res.data.learning_area_name,
          seed_year_name: res.data.seed_year_name,
          content_name: res.data.content_name,
          criteria_short_name: res.data.criteria_short_name,
          criteria_name: res.data.criteria_name,
          name: res.data.name,
          status: res.data.status || LearningStatus.DRAFT,
          updated_at: res.data.updated_at,
          updated_by: res.data.updated_by,
        }));
      } else {
        console.log(res.message);
      }
    });
  }, []);

  const handleInputChange = useCallback((field: keyof Learning, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);
  const LearningAreaOptions = data.id
    ? [
      {
        value: data.id,
        label: `${data.seed_year_name} ${data.learning_area_name}` || 'ไม่มีข้อมูล',
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

  const SaveEdit = () => {
    API.learningContent
      .Update(id, data)
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกสำเร็จ');
          navigate({ to: '../../' });
          // navigate({
          //   to: '../'
          // })
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
        <div className="grid h-auto w-[75%] grid-cols-6 gap-x-5 bg-white p-5">
          <div className="col-span-3 w-full">
            <CWSelectValue
              options={LearningAreaOptions}
              value={data.id}
              disabled
              required={true}
              title={'ชั้นปี'}
              label={'ชั้นปี'}
              className="col-span-2"
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setData((prev) => ({
                    ...prev,
                    content_id: selectedOption.value,
                  }));
                }
              }}
            />
          </div>
          <div className="col-span-3 w-full">
            <CWSelectValue
              options={ContentNameOptions}
              value={data.id}
              disabled
              required={true}
              title={'จำนวนพีชและคณิต'}
              label={'สาระ'}
              className="col-span-2"
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setData((prev) => ({
                    ...prev,
                    content_id: selectedOption.value,
                  }));
                }
              }}
            />
          </div>
          <div className="col-span-6 mt-4 w-full">
            <CWSelectValue
              options={CriteriaNameOptions}
              value={data.id}
              disabled
              required={true}
              title={'ชื่อมาตรฐาน'}
              label={'มาตรฐาน'}
              className="col-span-2"
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setData((prev) => ({
                    ...prev,
                    content_id: selectedOption.value,
                  }));
                }
              }}
            />
          </div>
          <div className="col-span-6 mt-4 w-full">
            <CWInput
              placeholder="-"
              label={'ชื่อสาระการเรียนรู้'}
              required={true}
              value={data.name}
              onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
        </div>
        <SidePanel
          titleName="รหัสสาระการเรียนรู้"
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
