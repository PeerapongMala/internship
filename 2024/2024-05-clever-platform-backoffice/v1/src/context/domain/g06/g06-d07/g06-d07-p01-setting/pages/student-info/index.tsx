import CWWhiteBox from '@component/web/cw-white-box';
import { ChangeEvent, useRef, useState } from 'react';
import ButtonUploadCSV from './components/button-upload-csv';
import TableStudentList from './components/table-student-list';
import {
  THandleTableStudentList,
  TStudentFilter,
} from '@domain/g06/g06-d07/local/types/students';
import SelectYear from '@domain/g06/local/components/web/molecule/cw-m-select-year';
import SelectClass from '@domain/g06/local/components/web/molecule/cw-m-select-class';
import ButtonDownloadCSV from './components/button-download-csv';
import CWInputSearch from '@component/web/cw-input-search';
import EditStudentPanel from './components/edit-student-panel';
import CWAcademicYearModalButton from '@domain/g01/g01-d05/local/component/web/cw-academic-year-modal-button';
import { getUserData } from '@global/utils/store/getUserData';

const StudentInfo = () => {
  const userData = getUserData();
  const tableRef = useRef<THandleTableStudentList>(null);

  enum UseStatus {
    IN_USE = 'enabled',
    DRAFT = 'draft',
    NOT_IN_USE = 'disabled',
  }

  const [editMode, setEditMode] = useState(false);
  const [selectedStudentID, setSelectedStudentID] = useState<number | null>(null);
  const [filter, setFilter] = useState<TStudentFilter>({});

  return (
    <CWWhiteBox className="flex flex-col gap-5">
      {!editMode && (
        <>
          <div className="flex justify-between">
            <CWInputSearch
              className="w-full max-w-56"
              placeholder="ค้นหา"
              value={filter.search_text}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFilter((prev) => ({ ...prev, search_text: e.target.value }))
              }
            />
            <div className="flex gap-5">
              <ButtonUploadCSV
                className="h-9"
                onUploadSuccess={() => tableRef.current?.fetchStudents()}
              />
              <ButtonDownloadCSV className="h-9" filter={filter} />
            </div>
          </div>

          <div className="flex gap-6">
            <CWAcademicYearModalButton
              schoolId={Number(userData.school_id)}
              type="button"
              className="min-w-48"
              placeholder="เลือกปีการศึกษา"
              academicYear={filter.academic_year}
              onDataChange={(value) => {
                setFilter((prev) => ({
                  ...prev,
                  academic_year: value ? Number(value.name) : undefined,
                  year: undefined,
                  school_room: undefined,
                }));
              }}
              createMode={false}
              deleteMode={false}
            />

            <SelectYear
              value={filter.year}
              onChange={(year) =>
                setFilter((prev) => ({
                  ...prev,
                  year: year,
                  school_room: undefined
                }))
              }
              disabled={!filter.academic_year}
            />

            <SelectClass
              value={filter.school_room}
              academicYear={filter.academic_year}
              year={filter.year}
              onChange={(room) => setFilter((prev) => ({ ...prev, school_room: room }))}
              disabled={!filter.year}
            />
          </div>

          <TableStudentList
            ref={tableRef}
            filter={filter}
            onEditStudent={(id) => {
              setEditMode(true);
              setSelectedStudentID(id);
            }}
          />
        </>
      )}

      {editMode && (
        <EditStudentPanel
          selectedStudentID={selectedStudentID}
          onBack={() => {
            setEditMode(false);
            setSelectedStudentID(null);
          }}
          handleSuccess={() => {
            tableRef.current?.fetchStudents();
          }}
        />
      )}
    </CWWhiteBox>
  );
};

export default StudentInfo;
