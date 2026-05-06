import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import ConfigJsonLocal from '../local/config/index.json';
import CWTManageUser from '../local/component/web/template/cw-t-manage-user';
import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX';
import { Classroom, School, Teacher } from '../local/api/type';
import API from '../local/api';
import { useParams } from '@tanstack/react-router';
import downloadCSV from '@global/utils/downloadCSV';
import { getDateTime } from '../local/utils';
import showMessage from '@global/utils/showMessage';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const { t: tLocal } = useTranslation([ConfigJsonLocal.key]);
  const { schoolId, classroomId } = useParams({ strict: false });

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [records, setRecords] = useState<Teacher[]>([]);
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

  const [school, setSchool] = useState<School>();
  const [classroom, setClassroom] = useState<Classroom>();
  const [selectedRecords, setSelectedRecords] = useState<Teacher[]>([]);

  function onSubmitUsers(rows: Teacher[]) {
    API.teacher
      .Create(
        classroomId,
        rows.map((row) => row.id),
      )
      .then((res) => {
        if (res.status_code == 201 || res.status_code == 200) {
          showMessage('เพิ่มคุณครูสำเร็จ', 'success');
          fetchRecords();
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  function onRemoveUser(row: Teacher) {
    API.teacher.Delete(classroomId, row.id).then((res) => {
      if (res.status_code == 201 || res.status_code == 200) {
        showMessage('ลบครูออกสำเร็จ', 'success');
        fetchRecords();
      } else {
        showMessage(res.message, 'error');
      }
    });
  }

  function onRemoveUsers(rows: Teacher[]) {
    API.teacher
      .BulkEdit(
        classroomId,
        rows.map((row) => ({ teacher_id: row.id, action: 'delete' })),
      )
      .then((res) => {
        if (res.status_code == 201 || res.status_code == 200) {
          showMessage('เอาครูออกสำเร็จ', 'success');
          setSelectedRecords([]);
          fetchRecords();
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  function onDownload(data: Record<string, any>) {
    API.teacher
      .DownloadCSVClassroom(classroomId, {
        limit: totalRecords,
      })
      .then((res) => {
        try {
          downloadCSV(res, `${getDateTime()}_classroom_teachers`);
        } catch (error) {
          showMessage('Download failed!', 'error');
        }
      });
  }

  function fetchRecords() {
    setFetching(true);
    API.teacher
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
  }, [schoolId]);

  useEffect(() => {
    fetchRecords();
  }, [page, limit, searchText]);

  return (
    <CWTManageUser
      type="teacher"
      selectTabIndex={0}
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
      onSubmitUsers={onSubmitUsers}
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
    />
  );
};

export default DomainJSX;
