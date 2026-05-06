import { useEffect, useState } from 'react';
import API from '../local/api';
import { Course, IGetPhorpor5Detail } from '../local/api/type';
import CourseTable from './component/web/template/CourseTable';
import ButtonCSVGroup from '../local/component/web/molecule/ButtonCSVGroup';
import Content from '../local/component/web/atom/Content';
import { useParams } from '@tanstack/react-router';
import { Pagination } from '@domain/g03/g03-d07-v2/local/type';
import CWPagination from '@component/web/cw-pagination';
import CWButton from '@component/web/cw-button';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import showMessage from '@global/utils/showMessage';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const [courseList, setCourseList] = useState<IGetPhorpor5Detail[]>([]);
  const [isEditable, setIsEditable] = useState(false);
  const { evaluationFormId, path } = useParams({
    strict: false,
  });
  const { pagination, setPagination } = usePagination();

  useEffect(() => {
    if (evaluationFormId) {
      fetchData();
    }
  }, [evaluationFormId]);

  const fetchData = async () => {
    API.GetDetailPhorpor5(evaluationFormId, path, {
      page: pagination.page,
      limit: pagination.limit,
    }).then(async (res) => {
      if (res?.status_code === 200) {
        setCourseList(res.data);
      }
    });
  };

  const handleSave = () => {
    if (courseList.some((item) => !item.id || !item.data_json)) {
      showMessage('ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบ', 'error');
      return;
    }
    API.UpdateDetailPhorpor5(evaluationFormId, courseList).then((res) => {
      if (res?.status_code === 200) {
        showMessage('บันทึกข้อมูลสำเร็จ', 'success');
        setIsEditable(false);
      } else {
        showMessage('เกิดข้อผิดพลาด', 'error');
      }
    });
  };

  const handleDataChange = (updatedData: IGetPhorpor5Detail[]) => {
    setCourseList(updatedData);
  };

  return (
    <div className="mt-5">
      <Content>
        <div className="mb-4 flex justify-start">
          {!isEditable ? (
            <CWButton
              title="แก้ไข"
              onClick={() => setIsEditable(true)}
              icon={<IconPen />}
              className="mr-2"
            />
          ) : (
            <div className="flex gap-5">
              <CWButton
                title="ยกเลิก"
                onClick={() => {
                  setIsEditable(false);
                  fetchData();
                }}
                variant="danger"
                outline
              />
              <CWButton title="บันทึก" onClick={handleSave} variant="primary" />
            </div>
          )}
        </div>
        <div>
          <CourseTable
            courseList={courseList}
            isEditable={isEditable}
            onDataChange={handleDataChange}
          />
        </div>
      </Content>
    </div>
  );
};

export default DomainJSX;
