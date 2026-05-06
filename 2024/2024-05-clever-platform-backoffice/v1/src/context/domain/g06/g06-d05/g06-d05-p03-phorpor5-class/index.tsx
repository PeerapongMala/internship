import { useEffect, useState } from 'react';
import Phorpor5Template from './component/web/template/Phorpor5Template';

import Content from '../local/component/web/atom/Content';
import { useParams } from '@tanstack/react-router';
import CWButton from '@component/web/cw-button';
import showMessage from '@global/utils/showMessage';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import { CWGlobalPdfGenerator } from '@component/web/pdf/cw-global-pdf-generetor';
import Phorpor5PdfTemplate from '@component/web/pdf/cw-phorpor5-class-pdf';
import StoreGlobalVolatile from '@store/global/volatile';
import StoreGlobalPersist from '@store/global/persist';
import { usePhorpor5Data } from './component/hook/usePhorpor5Data';
import { IGetPhorpor5Detail } from '../local/api/type';
import API from '../local/api';

export type Phorpor5Tab = {
  id: number;
  name: string;
};
const DomainJSX = () => {
  const { evaluationForm }: { evaluationForm: TEvaluationForm } =
    StoreGlobalPersist.StateGet(['evaluationForm']);
  const { phorpor5Tabs }: { phorpor5Tabs: Phorpor5Tab[] } = StoreGlobalVolatile.StateGet([
    'phorpor5Tabs',
  ]);

  const { evaluationFormId, path } = useParams({
    strict: false,
  });
  const [isEditable, setIsEditable] = useState(true);

  const {
    data: phorpor5Course,
    setData: setPhorpor5Course,
    loading: courseLoading,
  } = usePhorpor5Data(evaluationFormId, path);

  const idNameList = phorpor5Tabs.map(({ id, name }) => ({ id, name }));

  const { data: student } = usePhorpor5Data(evaluationFormId, idNameList[3]?.id);
  const { data: fatherMother } = usePhorpor5Data(evaluationFormId, idNameList[4]?.id);
  const { data: parent } = usePhorpor5Data(evaluationFormId, idNameList[5]?.id);
  const { data: classTime } = usePhorpor5Data(evaluationFormId, idNameList[6]?.id);
  const { data: nutritional } = usePhorpor5Data(evaluationFormId, idNameList[7]?.id);
  const { data: learningOutcomes } = usePhorpor5Data(evaluationFormId, idNameList[8]?.id);
  const { data: desiredAttributes } = usePhorpor5Data(
    evaluationFormId,
    idNameList[9]?.id,
  );
  const { data: competencies } = usePhorpor5Data(evaluationFormId, idNameList[10]?.id);
  const { data: studentDevelopmentActivities } = usePhorpor5Data(
    evaluationFormId,
    idNameList[11]?.id,
  );

  const handleDataChange = (updatedData: IGetPhorpor5Detail[]) => {
    setPhorpor5Course(updatedData);
  };

  const handleSave = async () => {
    if (!phorpor5Course || phorpor5Course.some((item) => !item.id || !item.data_json)) {
      showMessage('ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบ', 'error');
      return;
    }
    try {
      const res = await API.UpdateDetailPhorpor5(evaluationFormId, phorpor5Course);
      if (res?.status_code === 200) {
        showMessage('บันทึกข้อมูลสำเร็จ', 'success');
        setIsEditable(true);
      } else {
        showMessage('เกิดข้อผิดพลาด', 'error');
      }
    } catch (error) {
      showMessage('เกิดข้อผิดพลาดในการบันทึก', 'error');
    }
  };

  const handleCancel = () => {
    setIsEditable(true);
    setPhorpor5Course(phorpor5Course);
  };

  if (courseLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Content>
        <ActionButtons
          isEditable={isEditable}
          onEdit={() => setIsEditable(false)}
          onCancel={handleCancel}
          onSave={handleSave}
          evaluationForm={evaluationForm}
          phorpor5Course={phorpor5Course}
          studentData={student}
          fatherMotherData={fatherMother}
          parentData={parent}
          classTimeData={classTime}
          nutritionalData={nutritional}
          learningOutcomesData={learningOutcomes}
          desiredAttributesData={desiredAttributes}
          competenciesData={competencies}
          studentDevelopmentActivitiesData={studentDevelopmentActivities}
        />

        <div className="flex flex-row gap-2">
          <Phorpor5Template
            phorpor5CourseData={phorpor5Course}
            editable={isEditable}
            onDataChange={handleDataChange}
          />
        </div>
      </Content>
    </div>
  );
};

const ActionButtons = ({
  isEditable,
  onEdit,
  onCancel,
  onSave,
  evaluationForm,
  phorpor5Course,
  studentData,
  fatherMotherData,
  parentData,
  classTimeData,
  nutritionalData,
  learningOutcomesData,
  desiredAttributesData,
  competenciesData,
  studentDevelopmentActivitiesData,
}: {
  isEditable: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  evaluationForm: TEvaluationForm;
  phorpor5Course: IGetPhorpor5Detail[];
  studentData: IGetPhorpor5Detail[];
  fatherMotherData: IGetPhorpor5Detail[];
  parentData: IGetPhorpor5Detail[];
  classTimeData: IGetPhorpor5Detail[];
  nutritionalData: IGetPhorpor5Detail[];
  learningOutcomesData: IGetPhorpor5Detail[];
  desiredAttributesData: IGetPhorpor5Detail[];
  competenciesData: IGetPhorpor5Detail[];
  studentDevelopmentActivitiesData: IGetPhorpor5Detail[];
}) => (
  <div className="mb-4 flex gap-2 justify-start">
    {isEditable ? (
      <CWButton title="แก้ไข" onClick={onEdit} icon={<IconPen />} className="mr-2" />
    ) : (
      <div className="mr-5 flex gap-5">
        <CWButton title="ยกเลิก" onClick={onCancel} variant="danger" outline />
        <CWButton title="บันทึก" onClick={onSave} variant="primary" />
      </div>
    )}
    <CWGlobalPdfGenerator
      document={
        <Phorpor5PdfTemplate
          evaluationForm={evaluationForm}
          phorpor5CourseData={phorpor5Course}
          studentData={studentData}
          fatherMotherData={fatherMotherData}
          parentData={parentData}
          classTimeData={classTimeData}
          nutritionalData={nutritionalData}
          learningOutcomesData={learningOutcomesData}
          desiredAttributesData={desiredAttributesData}
          competenciesData={competenciesData}
          studentDevelopmentActivitiesData={studentDevelopmentActivitiesData}
        />
      }
      fileName="ปก ปพ5.รายชั้น .pdf"
      downloadButtonText="PDF"
      previewButtonText="ดูตัวอย่าง"
      hidePreviewButton={true}
    />
  </div>
);

export default DomainJSX;
