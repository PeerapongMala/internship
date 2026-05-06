import CreateLayout from '@domain/g02/g02-d01/local/components/template/CreateLayout';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import SidePanel from '@domain/g02/g02-d01/local/components/organism/Sidepanel';
import API from '@domain/g02/g02-d01/local/api';
import { useCallback, useEffect, useState } from 'react';
import { IUpdateContent, Learning, LearningStatus } from '@domain/g02/g02-d01/local/type';
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
  const [learningAreaData, setLearningAreaData] = useState<Learning>({
    id: undefined,
    seed_year_name: '',
    name: '',
  });
  const [data, setData] = useState<IUpdateContent>({
    learning_area_id: undefined,
    name: '',
    seed_year_name: '',
    status: LearningStatus.DRAFT,
    updated_at: undefined,
    updated_by: undefined,
  });

  useEffect(() => {
    API.Content.GetById(id).then((res) => {
      if (res.status_code === 200) {
        console.log(res.data);
        setData((prev) => ({
          ...prev,
          learning_area_id: res.data.learning_area_id,
          name: res.data.name || '',
          seed_year_name: res.data.seed_year_name,
          status: res.data.status || LearningStatus.DRAFT,
          updated_at: res.data.updated_at,
          updated_by: res.data.updated_by,
        }));
        // navigate({
        //   to: '../'
        // })
      } else {
        console.log(res.message);
      }
    });
  }, []);

  useEffect(() => {
    if (data.learning_area_id) {
      API.LearningArea.GetById(data.learning_area_id).then((res) => {
        if (res.status_code === 200) {
          setLearningAreaData((prev) => ({
            ...prev,
            id: res.data.id,
            year_id: res.data.year_id || '',
            seed_year_name: `${res.data.seed_year_name} ${res.data.name}`,
            name: res.data.name,
          }));
          // navigate({
          //   to: '../'
          // })
        } else {
          console.log(res.message);
        }
      });
    }
  }, [data.learning_area_id]);

  const handleInputChange = useCallback((field: keyof Learning, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const learningAreaOptions = learningAreaData.id
    ? [
      {
        value: learningAreaData.id,
        label: learningAreaData.seed_year_name || learningAreaData.name,
      },
    ]
    : [];

  const SaveEdit = () => {
    API.Content.Update(id, data)
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
        <div className="grid h-auto w-[75%] grid-cols-6 gap-x-5 bg-white p-5">
          <div className="col-span-3 w-full">
            <CWSelectValue
              options={learningAreaOptions}
              value={data.learning_area_id}
              title={'ชั้นปี'}
              label={'ชั้นปี'}
              disabled
              className="col-span-2"
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setData((prev) => ({
                    ...prev,
                    learning_area_id: selectedOption.value,
                  }));
                }
              }}
            />
          </div>
          <div className="col-span-6 w-full">
            <CWInput
              placeholder="จำนวนพีชและคณิต"
              label={'ชื่อสาระ'}
              required={true}
              value={data.name}
              onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
        </div>
        <SidePanel
          titleName="รหัสสาระ"
          userId={id}
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
