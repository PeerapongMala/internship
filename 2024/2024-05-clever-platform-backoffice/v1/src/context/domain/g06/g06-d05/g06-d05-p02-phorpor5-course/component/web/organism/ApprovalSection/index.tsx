import { useState } from 'react';
import Label from '../../../../../local/component/web/atom/Label';

import { FormDetailProps } from '../Header';
import { CoverPageData } from '@domain/g06/g06-d05/local/api/type';
import FormRow from '@domain/g06/g06-d05/g06-d05-p03-phorpor5-class/component/web/molecule/FormRow';
import CWInputCheckbox from '@component/web/cw-input-checkbox';
import CWInput from '@component/web/cw-input';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';

export default function ApprovalSection({
  phorpor5Course,
  editable = false,
  onDataChange,
}: FormDetailProps) {
  function isCoverPageData(data: any): data is CoverPageData {
    return (
      data &&
      typeof data === 'object' &&
      'approval' in data &&
      typeof data.approval === 'object'
    );
  }
  if (!phorpor5Course || !phorpor5Course[0]) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  const dataJson = phorpor5Course[0]?.data_json;

  const approvalData = isCoverPageData(dataJson)
    ? dataJson.approval
    : {
        subject_teacher: '',
        head_of_subject: '',
        deputy_director: '',
        principal: '',
        approved: false,
        date: '',
      };

  const [approval, setApproval] = useState({
    subjectTeacher: approvalData.subject_teacher || '',
    headOfSubject: approvalData.head_of_subject || '',
    deputyDirector: approvalData.deputy_director || '',
    principal: approvalData.principal || '',
    isApproved: approvalData.approved || false,
    date: approvalData.date || '',
  });

  const handleApprovalChange = (
    field: keyof typeof approval,
    value: string | boolean,
  ) => {
    const newApproval = {
      ...approval,
      [field]: value,
    };
    setApproval(newApproval);

    if (dataJson && onDataChange) {
      const updatedData = [...phorpor5Course];
      const updatedJson = {
        ...dataJson,
        approval: {
          subject_teacher: newApproval.subjectTeacher,
          head_of_subject: newApproval.headOfSubject,
          deputy_director: newApproval.deputyDirector,
          principal: newApproval.principal,
          approved: newApproval.isApproved,
          date: newApproval.date,
        },
      };

      updatedData[0].data_json = updatedJson;
      onDataChange(updatedData);
    }
  };
  return (
    <>
      <h2 className="text-center font-bold">การอนุมัติผลการเรียน</h2>
      <div className="my-5 mt-5 flex flex-col gap-2 pl-20">
        <div className="flex w-full items-center gap-3">
          <p className="w-16 text-left font-bold">ลงชื่อ</p>
          {approval.subjectTeacher ? (
            <FormRow
              labelAfter="ครูประจำวิชา/ครูที่ปรึกษา"
              value={approval.subjectTeacher}
              onChange={(v) => handleApprovalChange('subjectTeacher', v)}
              classNameInput="flex-grow"
              editable={editable}
            />
          ) : (
            <p>.......................</p>
          )}
        </div>
        <div className="flex w-full items-center gap-3">
          <p className="w-16 text-left font-bold">ลงชื่อ</p>
          {approval.headOfSubject ? (
            <FormRow
              labelAfter="หัวหน้างานวิชาการโรงเรียน"
              value={approval.headOfSubject}
              onChange={(v) => handleApprovalChange('headOfSubject', v)}
              classNameInput="flex-grow"
              editable={editable}
            />
          ) : (
            <p>.......................</p>
          )}
        </div>
        <div className="flex w-full items-center gap-3">
          <p className="w-16 text-left font-bold">ลงชื่อ</p>
          {approval.principal ? (
            <FormRow
              labelAfter="ผู้อำนวยการโรงเรียน"
              value={approval.principal}
              onChange={(v) => handleApprovalChange('principal', v)}
              classNameInput="flex-grow"
              editable={editable}
            />
          ) : (
            <p>.......................</p>
          )}
        </div>
      </div>

      <div className="my-5 flex flex-col items-center gap-5 text-sm">
        <div className="flex justify-center gap-5 text-sm">
          <CWInputCheckbox
            label="อนุมัติ"
            checked={approval.isApproved}
            onChange={(e) => handleApprovalChange('isApproved', e.target.checked)}
            disabled={editable}
          />
          <CWInputCheckbox
            label="ไม่อนุมัติ"
            checked={!approval.isApproved}
            onChange={(e) => handleApprovalChange('isApproved', !e.target.checked)}
            disabled={editable}
          />
        </div>
        <div className="flex w-full items-center justify-center gap-3">
          <p className="w-16 text-left font-bold">ลงชื่อ</p>

          {approval.principal ? (
            <CWInput
              type="text"
              value={approval.principal}
              onChange={(e) => handleApprovalChange('principal', e.target.value)}
              className="w-44 text-center"
              disabled={editable}
            />
          ) : (
            <p>.......................</p>
          )}
        </div>

        {approval.principal ? (
          <Label text={`(${approval.principal})`} />
        ) : (
          <p>.......................</p>
        )}

        <Label text="ผู้อำนวยการโรงเรียน" />

        <WCAInputDateFlat
          value={approval.date ? [new Date(approval.date)] : []}
          onChange={(dates) => {
            const dateString =
              dates.length > 0 ? dates[0].toISOString().split('T')[0] : '';
            handleApprovalChange('date', dateString);
          }}
          className="w-44 text-center"
          disabled={editable}
        />
      </div>
    </>
  );
}
