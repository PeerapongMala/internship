import CreateLayout from '@domain/g02/g02-d01/local/components/template/CreateLayout';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import SidePanel from '@domain/g02/g02-d01/local/components/organism/Sidepanel';
import InputSelect from '@domain/g02/g02-d01/local/components/organism/Select';
import Input from '@domain/g02/g02-d01/local/components/organism/Input';
import { yearOptions } from '@domain/g02/g02-d01/local/components/option';
import API from '@domain/g02/g02-d01/local/api';
import { useCallback, useEffect, useState } from 'react';
import {
  Content,
  IUpdateStandard,
  Learning,
  LearningStatus,
  Standard,
} from '@domain/g02/g02-d01/local/type';
import CWSelect from '@component/web/cw-select';
import CWInput from '@component/web/cw-input';
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
  const [contentData, setContentData] = useState<Content>({
    id: undefined,
    learning_area_name: '',
    name: '',
  });
  console.log({ contentData: contentData });

  const [data, setData] = useState<IUpdateStandard>({
    content_id: undefined,
    name: '',
    short_name: '',
    status: LearningStatus.DRAFT,
    updated_at: undefined,
    updated_by: undefined,
  });

  useEffect(() => {
    API.Standard.GetById(id).then((res) => {
      if (res.status_code === 200) {
        setData((prev) => ({
          ...prev,
          content_id: res.data.content_id,
          name: res.data.name || '',
          short_name: res.data.short_name || '',
          status: res.data.status || LearningStatus.DRAFT,
          updated_at: res.data.updated_at,
          updated_by: res.data.updated_by,
        }));
      } else {
        console.log(res.message);
      }
    });
  }, []);

  useEffect(() => {
    if (data.content_id) {
      API.Content.GetById(data.content_id)
        .then((res) => {
          if (res.status_code === 200) {
            setContentData((prev) => ({
              ...prev,
              id: res.data.id,
              learning_area_name: `${res.data.seed_year_name} ${res.data.learning_area_name}`,
              name: res.data.name,
            }));
            // navigate({
            //   to: '../'
            // })
          } else {
            console.log(res.message);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [data.content_id]);

  const handleInputChange = useCallback((field: keyof Learning, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const contentOptions = contentData.id
    ? [{ value: contentData.id, label: contentData.learning_area_name || 'ไม่มีข้อมูล' }]
    : [];
  const contentNameOptions = contentData.id
    ? [{ value: contentData.id, label: contentData.name || 'ไม่มีข้อมูล' }]
    : [];

  const SaveEdit = () => {
    API.Standard.Update(id, data)
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกสําเร็จ', 'success');
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
              options={contentOptions}
              value={data.content_id}
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
              options={contentNameOptions}
              value={data.content_id}
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
          <div className="col-span-4 w-full">
            <CWInput
              label={'ชื่อมาตรฐาน'}
              required={true}
              value={data.name}
              onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="col-span-2 w-full">
            <CWInput
              placeholder="ค. ๑.๑"
              label={'ชื่อย่อมาตรฐาน'}
              required={true}
              value={data.short_name}
              onChange={(e) =>
                setData((prev) => ({ ...prev, short_name: e.target.value }))
              }
            />
          </div>
        </div>
        <SidePanel
          titleName="รหัสมาตรฐาน"
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
