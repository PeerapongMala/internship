import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import Select from '../local/component/web/atom/Select';
// import DatePickerRange from './component/web/atom/DatePickerRange';

import Phorpor5Template from './component/web/template/Phorpor5Template';
import { IGetPhorpor5Detail, Subject } from '../local/api/type';
import API from '../local/api';

import ButtonCSVGroup from '../local/component/web/molecule/ButtonCSVGroup';
import Content from '../local/component/web/atom/Content';
import { useParams } from '@tanstack/react-router';
import showMessage from '@global/utils/showMessage';
import CWButton from '@component/web/cw-button';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import { CWGlobalPdfGenerator } from '@component/web/pdf/cw-global-pdf-generetor';
import Phorpor5PdfSubjectTemplate from '@component/web/pdf/cw-phorpor5-subject-pdf';
import CWSelect from '@component/web/cw-select';

const DomainJSX = () => {
  const [phorpor5Course, setPhorpor5Course] = useState<IGetPhorpor5Detail[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>();
  const [isEditable, setIsEditable] = useState(true);
  const [subjectOptions, setSubjectOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const { evaluationFormId, path } = useParams({
    strict: false,
  });

  // โหลดข้อมูลเมื่อ evaluationFormId เปลี่ยน
  useEffect(() => {
    if (evaluationFormId) {
      fetchData();
    }
  }, [evaluationFormId]);

  // เมื่อโหลดข้อมูล phorpor5Course สำเร็จ จะเตรียม options สำหรับ select วิชา
  useEffect(() => {
    if (phorpor5Course.length > 0) {
      try {
        const subjects = (phorpor5Course[0].data_json as any).subject as Subject[];

        const options = subjects
          .filter((s) => s.is_subject)
          .map((subj: Subject) => ({
            label: subj.name ?? '-',
            value: subj.id,
          }));

        setSubjectOptions(options);

        if (options.length > 0) {
          setSelectedSubject({ id: options[0].value, name: options[0].label } as Subject);
        }
      } catch (error) {
        console.error('Error preparing subject options:', error);
        showMessage('เกิดข้อผิดพลาดในการเตรียมข้อมูลวิชา', 'error');
      }
    }
  }, [phorpor5Course]);

  // ดึงข้อมูลรายละเอียด ปพ.5 จาก API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await API.GetDetailPhorpor5(evaluationFormId, path, {});
      if (res?.status_code === 200) {
        setPhorpor5Course(res.data);
      } else {
        showMessage('ไม่สามารถโหลดข้อมูลได้', 'error');
      }
    } catch (error) {
      console.error('Error fetching phorpor5 data:', error);
      showMessage('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // เมื่อข้อมูลมีการเปลี่ยนแปลง
  const handleDataChange = (updatedData: IGetPhorpor5Detail[]) => {
    if (!updatedData || updatedData.length === 0) return;

    setPhorpor5Course(prev =>
      prev.map(course => {
        const updatedCourse = updatedData.find(c => c.id === course.id);
        if (!updatedCourse) return course;

        const currentSubjects = (course.data_json as any).subject || [];
        const updatedSubjects = (updatedCourse.data_json as any).subject || [];
        const subjectMap = new Map(updatedSubjects.map((s: any) => [s.id, s]));

        const mergedSubjects = currentSubjects.map((subj: any) =>
          subjectMap.has(subj.id) ? subjectMap.get(subj.id) : subj
        );

        return {
          ...course,
          data_json: {
            ...updatedCourse.data_json,
            subject: mergedSubjects,
          },
        };
      })
    );
  };

  // บันทึกข้อมูลผ่าน API
  const handleSave = async () => {
    if (phorpor5Course.some((item) => !item.id || !item.data_json)) {
      showMessage('ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบ', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.UpdateDetailPhorpor5(evaluationFormId, phorpor5Course);
      if (res?.status_code === 200) {
        showMessage('บันทึกข้อมูลสำเร็จ', 'success');
        setIsEditable(true);

        await fetchData();
      } else {
        showMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      showMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // กรองข้อมูล phorpor5Course ตามวิชาที่เลือก (selectedSubject)
  const filteredCourseData = selectedSubject
    ? phorpor5Course.map((course) => {
      try {
        const filteredSubjects = (course.data_json as any).subject?.filter(
          (subj: Subject) => subj.id === selectedSubject.id,
        );
        return {
          ...course,
          data_json: {
            ...course.data_json,
            subject: filteredSubjects,
          },
        };
      } catch (error) {
        console.error('Error filtering course data:', error);
        return course;
      }
    })
    : phorpor5Course;

  return (
    <div className="mt-5">
      <Content>
        <div>

        </div>
        <div className="mb-4 flex gap-2 justify-start">
          {isEditable ? (
            <CWButton
              title="แก้ไข"
              onClick={() => setIsEditable(false)}
              icon={<IconPen />}
              className="mr-2"
              disabled={isLoading}
            />
          ) : (
            <div className="flex gap-5 mr-5">
              <CWButton
                title="ยกเลิก"
                onClick={() => {
                  setIsEditable(true);
                  fetchData();
                }}
                variant="danger"
                outline
                disabled={isLoading}
              />
              <CWButton
                title="บันทึก"
                onClick={handleSave}
                variant="primary"
                disabled={isLoading}
                loading={isLoading}
              />
            </div>
          )}

          <CWGlobalPdfGenerator
            document={
              <Phorpor5PdfSubjectTemplate
                phorpor5CourseData={filteredCourseData}
                selectedSubject={selectedSubject}
              />
            }
            fileName="ปก ปพ5.รายวิชา .pdf"
            downloadButtonText="PDF"
            previewButtonText="ดูตัวอย่าง"
            hidePreviewButton={true}
          />


        </div>
        <div>
          <CWSelect
            className="max-w-[250px]"
            options={subjectOptions}
            value={selectedSubject?.id ?? ''}
            onChange={(e) => {
              try {
                const subject = (
                  (phorpor5Course[0].data_json as any).subject as Subject[]
                ).find((subject) => subject.id == e.target.value);
                if (subject) {
                  setSelectedSubject(subject);
                }
              } catch (error) {
                console.error('Error changing subject:', error);
                showMessage('เกิดข้อผิดพลาดในการเปลี่ยนวิชา', 'error');
              }
            }}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-row gap-2 mt-5">
          {isLoading ? (
            <div>กำลังโหลดข้อมูล...</div>
          ) : (
            <Phorpor5Template
              phorpor5CourseData={filteredCourseData}
              selectedSubject={selectedSubject}
              editable={isEditable}
              onDataChange={handleDataChange}
            />
          )}
        </div>
      </Content>
    </div>
  );
};

export default DomainJSX;