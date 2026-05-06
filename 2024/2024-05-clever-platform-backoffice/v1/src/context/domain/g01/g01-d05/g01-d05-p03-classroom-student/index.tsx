import StoreGlobal from '@global/store/global';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import ConfigJsonLocal from '../local/config/index.json';

import CWTManageUser from '../local/component/web/template/cw-t-manage-user';
import { Modal } from '@core/design-system/library/vristo/source/components/Modal';
import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX';
import { Classroom, ClassroomBase, School, Student } from '../local/api/type';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import { useParams } from '@tanstack/react-router';
import downloadCSV from '@global/utils/downloadCSV';
import { getDateTime } from '../local/utils';
import CWFormInput from '@domain/g04/g04-d01/local/component/web/cw-form-input';
import CWButton from '@component/web/cw-button';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const { t: tLocal } = useTranslation([ConfigJsonLocal.key]);
  const { schoolId, classroomId } = useParams({ strict: false });

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [records, setRecords] = useState<Student[]>([]);
  const [searchText, setSearchText] = useState('');
  const {
    page,
    pageSize: limit,
    totalCount: totalRecords,
    setPage,
    setPageSize: setLimit,
    setTotalCount: setTotalRecords,
  } = usePagination();

  const [fetching, setFetching] = useState(false);

  const [modalContent, setModalContent] = useState('' as React.ReactNode);
  const [modalState, setModalState] = useState('' as 'move' | 'remove' | '');
  const [formData, setFormData] = useState<ClassroomBase & { user_id: string }>({
    school_id: schoolId,
    academic_year: 0,
    name: '',
    year: '',
    user_id: '',
  });

  const [school, setSchool] = useState<School>();
  const [classroom, setClassroom] = useState<Classroom>();
  const [selectedRecords, setSelectedRecords] = useState<Student[]>([]);

  const [loading, setLoading] = useState(false);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const academicYears = useMemo(() => {
    return classrooms.reduce<number[]>((prev, classroom) => {
      if (!prev.includes(classroom.academic_year)) {
        prev = [...prev, classroom.academic_year];
      }
      return prev;
    }, []);
  }, [classrooms]);
  const years = useMemo(() => {
    return classrooms.reduce<string[]>((prev, classroom) => {
      if (classroom.academic_year == formData.academic_year) {
        if (!prev.includes(classroom.year)) {
          prev = [...prev, classroom.year];
        }
      }
      return prev;
    }, []);
  }, [formData.academic_year]);
  const names = useMemo(() => {
    return classrooms.reduce<string[]>((prev, classroom) => {
      if (
        classroom.academic_year == formData.academic_year &&
        classroom.year == formData.year
      ) {
        if (!prev.includes(classroom.name)) {
          prev = [...prev, classroom.name];
        }
      }
      return prev;
    }, []);
  }, [formData.year]);

  function onSelectUsers(rows: Student[]) {
    API.student
      .Create(
        classroomId,
        rows.map((row) => row.id),
      )
      .then((res) => {
        if (res.status_code == 201 || res.status_code == 200) {
          showMessage('เพิ่มนักเรียนสำเร็จ', 'success');
          fetchRecords();
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  function onMoveUser(data: ClassroomBase & { user_id: string }) {
    const classroom = classrooms.find(
      (classroom) =>
        data.academic_year == classroom.academic_year &&
        classroom.year == data.year &&
        classroom.name == data.name,
    );
    if (classroom) {
      setLoading(true);
      API.student.Move(classroom.id, data.user_id).then((res) => {
        if (res.status_code == 201 || res.status_code == 200) {
          showMessage('ย้ายห้องเรียนสำเร็จ', 'success');
          fetchRecords();
          onClose();
        } else {
          showMessage(res.message, 'error');
        }
        setLoading(false);
      });
    } else {
      showMessage('ไม่พบห้องเรียน', 'error');
    }
  }

  function onRemoveUser(row: Student) {
    API.student.Delete(classroomId, row.id).then((res) => {
      if (res.status_code == 201 || res.status_code == 200) {
        showMessage('เอานักเรียนออกสำเร็จ', 'success');
        fetchRecords();
      } else {
        showMessage(res.message, 'error');
      }
    });
  }

  function toOptions<T>(data: T[]) {
    return data.map((d) => ({
      label: d?.toString() ?? '',
      value: d?.toString() ?? '',
    }));
  }

  function onRemoveUsers(rows: Student[]) {
    API.student
      .BulkEdit(
        classroomId,
        rows.map((row) => ({ student_id: row.id, action: 'delete' })),
      )
      .then((res) => {
        if (res.status_code == 201 || res.status_code == 200) {
          showMessage('เอานักเรียนออกสำเร็จ', 'success');
          setSelectedRecords([]);
          fetchRecords();
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  function onDownload() {
    API.student
      .DownloadCSVClassroom(classroomId, {
        limit: totalRecords,
      })
      .then((res) => {
        try {
          downloadCSV(res, `${getDateTime()}_classroom_students`);
        } catch (error) {
          showMessage('Download failed!', 'error');
        }
      });
  }

  function onClose() {
    setModalState('');
    setModalContent('');
    resetFormData();
  }

  function resetFormData() {
    setFormData({
      school_id: schoolId,
      academic_year: 0,
      name: '',
      year: '',
      user_id: '',
    });
  }

  function onFormDataInput(key: keyof ClassroomBase | 'user_id', value: string) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function fetchRecords() {
    setFetching(true);
    API.student
      .GetClassroom(classroomId, {
        limit,
        page,
        search: searchText,
      })
      .then((res) => {
        if (res.status_code == 200) {
          setRecords(res.data);
          setTotalRecords(res._pagination.total_count);
        } else {
          showMessage(res.message, 'error');
        }
        setFetching(false);
      });
  }

  useEffect(() => {
    API.classroom.GetById(classroomId).then((res) => {
      if (res.status_code == 200) {
        setClassroom(res.data);
      } else {
        showMessage(res.message, 'error');
      }
    });
  }, [classroomId]);

  useEffect(() => {
    API.other.School.GetById(schoolId).then((res) => {
      if (res.status_code == 200) {
        setSchool(res.data);
      } else {
        showMessage(res.message, 'error');
      }
    });
    API.classroom.Get(schoolId, {}).then((res) => {
      if (res.status_code == 200) {
        setClassrooms(res.data);
      } else {
        showMessage(res.message, 'error');
      }
    });
  }, [schoolId]);

  useEffect(() => {
    fetchRecords();
  }, [page, limit, searchText]);

  return (
    <CWTManageUser
      type="student"
      selectTabIndex={1}
      tConfigKey={ConfigJson.key}
      bulkEditActions={[
        {
          label: (
            <div className="flex items-center gap-2">
              <IconX />
              {'เอาออก'}
            </div>
          ),
          onClick: () => {
            onRemoveUsers(selectedRecords);
          },
        },
      ]}
      onSubmitUsers={onSelectUsers}
      onDownload={onDownload}
      classroom={classroom}
      school={school}
      userRecords={records}
      limit={limit}
      onLimitChange={setLimit}
      page={page}
      onPageChange={setPage}
      totalRecords={totalRecords}
      onSearchChange={setSearchText}
      fetching={fetching}
      onRemoveUser={onRemoveUser}
      selectedRecords={selectedRecords}
      onSelectedRecordsChange={setSelectedRecords}
      onMove={(record) => {
        resetFormData();
        onFormDataInput('user_id', record.id);
        setModalState('move');
      }}
    >
      {modalState == 'move' && (
        <Modal
          open
          title={'จัดการห้องเรียน'}
          className="w-96"
          onClose={() => setModalState('')}
        >
          <div className="flex flex-col gap-6">
            <CWFormInput
              data={formData}
              fields={[
                [
                  {
                    key: 'user_id',
                    label: 'รหัสบัญชี',
                    type: 'text',
                    disabled: true,
                  },
                ],
                [
                  {
                    key: 'academic_year',
                    label: 'ปีการศึกษา',
                    type: 'select',
                    options: toOptions(academicYears),
                    required: true,
                    onChange(value) {
                      onFormDataInput('academic_year', value);
                    },
                  },
                ],
                [
                  {
                    key: 'year',
                    label: 'ชั้นปี',
                    type: 'select',
                    disabled: !formData.academic_year,
                    options: toOptions(years),
                    required: true,
                    value: formData.year,
                    onChange(value) {
                      onFormDataInput('year', value);
                    },
                  },
                ],
                [
                  {
                    key: 'name',
                    label: 'ชื่อห้อง',
                    type: 'select',
                    disabled: !formData.year,
                    options: toOptions(names),
                    required: true,
                    value: formData.name,
                    onChange(value) {
                      onFormDataInput('name', value);
                    },
                  },
                ],
              ]}
            />
            <div className="flex gap-2 *:flex-1">
              <CWButton
                className="!border-dark-light !bg-transparent !text-black"
                onClick={onClose}
                title={'ยกเลิก'}
                disabled={loading}
              />
              <CWButton
                onClick={() => onMoveUser(formData)}
                disabled={!formData.name}
                title={'จัดการห้องเรียน'}
                loading={loading}
              />
            </div>
          </div>
        </Modal>
      )}
    </CWTManageUser>
  );
};

export default DomainJSX;
