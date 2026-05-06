// import { useTranslation } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import SubjectTeacherHeader from './component/web/template/wc-t-header';
import { useEffect, useState } from 'react';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX';
import DeleteModal from './component/web/template/wc-t-delete-modal';
import AddTeacherModal from './component/web/template/wc-t-teacher-modal';
import ChangeSubjectModal from './component/web/template/wc-t-subject-modal';
import { useNavigate, useParams } from '@tanstack/react-router';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import { AcademicYear, School, Subject, SubjectTeacher } from '../local/type';
import { toDateTimeTH } from '@global/utils/date';
import StoreGlobal from '@store/global';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const { schoolId, subjectId }: { schoolId: string; subjectId: string } = useParams({
    strict: false,
  });

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [school, setSchool] = useState<School>();
  const [subject, setSubject] = useState<Subject>();

  const [fetching, setFetching] = useState(false);
  const [records, setRecords] = useState<SubjectTeacher[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<SubjectTeacher[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<SubjectTeacher>();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const [filters, setFilters] = useState<{ key: string; value: string }>({
    key: 'id',
    value: '',
  });
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [academicYearFilter, setAcademicYearFilter] = useState<string>('');

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  function onBulkEdit(data: { teacher_id: string; academic_year: number }[]) {
    API.subjectTeacher.BulkEdit(+subjectId, data).then((res) => {
      if (res.status_code == 200 || res.status_code == 201) {
        showMessage('Bulk edit สำเร็จ', 'success');
        setSelectedRecords([]);
        fetchRecords();
      } else {
        showMessage(res.message, 'error');
      }
    });
  }

  function onDelete(teacher_id: string, academic_year: number) {
    API.subjectTeacher
      .BulkEdit(+subjectId, [
        {
          teacher_id,
          academic_year,
        },
      ])
      .then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('เอาออกสำเร็จ', 'success');
          setIsDeleteModalOpen(false);
          setSelectedRecord(undefined);
          fetchRecords();
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  function fetchRecords() {
    setFetching(true);
    API.subjectTeacher
      .Get(+schoolId, +subjectId, {
        page,
        limit,
        [filters.key]: filters.value,
        academic_year: academicYearFilter,
      })
      .then((res) => {
        if (res.status_code == 200) {
          // [Note]: เนื่องจาก id ที่ได้รับ response มาเกิดการซ้ำกัน ทำให้ maintine เตือนว่ามีการใช้ id ซ้ำ ส่งผลทำให้เกิดบัคข้อมูลซ้ำ เลยต้องย้าย id เป็น userId แทน
          setRecords(
            res.data.map((d, index) => ({
              ...d,
              id: (index + 1).toString(),
              userId: d.id,
            })),
          );
          setTotalRecords(res._pagination.total_count);
        } else {
          showMessage(res.message, 'error');
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }

  useEffect(() => {
    fetchRecords();
  }, [schoolId, subjectId, page, limit, filters, academicYearFilter]);

  useEffect(() => {
    API.school.GetById(+schoolId).then((res) => {
      if (res.status_code == 200) {
        setSchool(res.data);
      } else {
        showMessage(res.message, 'error');
      }
    });
  }, [schoolId]);

  useEffect(() => {
    API.subjectTeacher.GetById(+subjectId).then((res) => {
      if (res.status_code == 200) {
        setSubject(res.data);
      } else {
        showMessage(res.message, 'error');
      }
    });
  }, [subjectId]);

  useEffect(() => {
    API.subjectTeacher.GetAcademicYears(+schoolId).then((res) => {
      if (res.status_code == 200) {
        setAcademicYears(res.data);
      } else {
        showMessage(res.message, 'error');
      }
    });
  }, []);

  function onTeacherSubmit(data: { teacher_ids: string[]; academic_year: number }) {
    API.subjectTeacher
      .Create({
        subject_id: +subjectId,
        teacher_ids: data.teacher_ids,
        academic_year: data.academic_year,
      })
      .then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('เพิ่มครูสำเร็จ', 'success');
          fetchRecords();
          setIsTeacherModalOpen(false);
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-y-5 font-noto-sans-thai text-[#0E1726]">
        <SubjectTeacherHeader school={school} subject={subject} />
      </div>

      <CWTableTemplate
        header={{
          btnIcon: <IconPlus />,
          btnLabel: 'เพิ่มครู',
          onBtnClick() {
            setIsTeacherModalOpen(true);
          },
          bulkEditDisabled: !selectedRecords.length,
          bulkEditActions: [
            {
              label: (
                <div className="flex items-center gap-2">
                  <IconX duotone={false} />
                  เอาออก
                </div>
              ),
              onClick() {
                onBulkEdit(
                  selectedRecords.map((r) => ({
                    teacher_id: r.userId,
                    academic_year: r.academic_year,
                  })),
                );
              },
            },
          ],
          searchDropdownValue: filters.key,
          showDownloadButton: false,
          showUploadButton: false,
          inputSearchType: 'input-dropdown',
          searchDropdownOptions: [
            {
              label: 'รหัส',
              value: 'id',
            },
            {
              label: 'คำนำหน้า',
              value: 'title',
            },
            {
              label: 'ชื่อ',
              value: 'first_name',
            },
            {
              label: 'สกุล',
              value: 'last_name',
            },
            {
              label: 'อีเมล',
              value: 'email',
            },
          ],
          onSearchChange(e) {
            setFilters((prev) => ({
              ...prev,
              value: e.currentTarget.value,
            }));
          },
          onSearchDropdownSelect(selected) {
            setFilters((prev) => ({
              ...prev,
              key: selected.toString(),
            }));
          },
        }}
        filters={[
          {
            key: 'academic_year',
            value: academicYearFilter,
            placeholder: 'ปีการศึกษา',
            onChange: setAcademicYearFilter,
            options: academicYears.map((y) => ({
              label: y.name,
              value: y.name,
            })),
          },
        ]}
        table={{
          records,
          fetching,
          minHeight: 400,
          page,
          onPageChange: setPage,
          limit,
          onLimitChange: setLimit,
          totalRecords,
          selectedRecords,
          onSelectedRecordsChange: setSelectedRecords,
          columns: [
            {
              accessor: '#',
              title: '#',
              render(_, index) {
                return index + 1;
              },
            },
            {
              accessor: 'userId',
              title: 'รหัสบัญชี',
            },
            {
              accessor: 'academic_year',
              title: 'ปีการศึกษา',
            },
            {
              accessor: 'title',
              title: t('word.prefix'),
            },
            {
              accessor: 'first_name',
              title: t('word.firstName'),
            },
            {
              accessor: 'last_name',
              title: t('word.lastName'),
            },
            {
              accessor: 'email',
              title: t('word.email'),
            },
            {
              accessor: 'last_login',
              title: t('word.lastUsed'),
              render(record, index) {
                return record.last_login ? toDateTimeTH(record.last_login) : '';
              },
            },
            {
              accessor: 'remove',
              title: t('table.body.header.remove'),
              width: 80,
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              render(record, index) {
                return (
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setSelectedRecord(record);
                    }}
                  >
                    <IconX duotone={false} />
                  </button>
                );
              },
            },
          ],
        }}
      />
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedRecord(undefined);
        }}
        onDelete={() => {
          if (selectedRecord) {
            onDelete(selectedRecord.userId, selectedRecord.academic_year);
          } else {
            showMessage('กรุณาเลือกครู', 'warning');
          }
        }}
      />
      <AddTeacherModal
        academicYears={academicYears}
        open={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        onSubmit={onTeacherSubmit}
      />
      {/* <ChangeSubjectModal
        open={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
      /> */}
    </div>
  );
};

export default DomainJSX;
