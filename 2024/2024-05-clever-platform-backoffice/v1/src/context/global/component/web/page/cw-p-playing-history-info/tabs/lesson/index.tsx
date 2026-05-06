import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import CWSelect from '@component/web/cw-select';
import IconEye from '@core/design-system/library/component/icon/IconEye.tsx';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useState } from 'react';
import CWModalQuestionView from '@component/web/cw-modal/cw-modal-question-view';

const Lesson = () => {
  const options = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
  ];

  const mockData = [
    {
      id: 1,
      level: '1',
      level_type: 'แบบฝึกหัด',
      answer_type: 'ปรนัย',
      difficulty: 'ง่าย',
    },
    {
      id: 2,
      level: '2',
      level_type: 'แบบฝึกหัด',
      answer_type: 'ปรนัย',
      difficulty: 'ปานกลาง',
    },
  ];

  const columns: DataTableColumn[] = [
    {
      accessor: '',
      title: 'ดูคำถาม',
      titleClassName: 'text-center',
      render: (record: any) => (
        <div
          className="flex w-full cursor-pointer justify-center"
          onClick={() => {
            setIsModalOpen(true);
            setLevelId(record.id);
          }}
        >
          <IconEye />
        </div>
      ),
    },
    {
      accessor: 'index',
      title: '#',
      render: (_: any, index: number) => index + 1,
    },
    {
      accessor: 'level',
      title: 'ด่านที่',
    },
    {
      accessor: 'level_type',
      title: 'ประเภท',
    },
    {
      accessor: 'answer_type',
      title: 'รูปแบบคำถาม',
    },
    {
      accessor: 'difficulty',
      title: 'ระดับ',
      render: (row: any) => {
        const text = row.difficulty.toLowerCase();
        const badgeClass =
          text === 'ง่าย'
            ? 'badge-outline-success'
            : text === 'ปานกลาง'
              ? 'badge-outline-warning'
              : text === 'ยาก'
                ? 'badge-outline-danger'
                : 'badge-outline-secondary';
        return (
          <span className={`badge ${badgeClass} flex w-16 items-center justify-center`}>
            {row.difficulty}
          </span>
        );
      },
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [levelId, setLevelId] = useState<number | undefined>(undefined);

  return (
    <div className="panel flex flex-col gap-5">
      <CWOHeaderTableButton showBulkEditButton={false} showUploadButton={false} />

      <div className="grid grid-cols-6 gap-5">
        <WCAInputDateFlat
          options={{
            mode: 'range',
            dateFormat: 'd/m/Y',
          }}
        />
        <CWSelect title="สังกัดวิชา" options={options} />
        <CWSelect title="วิชา" options={options} />
        <CWSelect title="บทเรียน" options={options} />
        <CWSelect title="บทเรียนย่อย" options={options} />
      </div>

      <DataTable
        className="table-hover whitespace-nowrap"
        records={mockData}
        columns={columns}
        highlightOnHover
        withTableBorder
        withColumnBorders
        height={'calc(100vh - 350px)'}
        noRecordsText="ไม่พบข้อมูล"
        totalRecords={20}
        recordsPerPage={10}
        page={1}
        onPageChange={() => {}}
        onRecordsPerPageChange={(_recordsPerPage) => {}}
        recordsPerPageOptions={[10, 25, 50, 100]}
        paginationText={({ from, to, totalRecords }) =>
          `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
        }
      />
      {/* <CWModalQuestionInfo
        title={'คำถาม'}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}
      <CWModalQuestionView
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // CWModalQuestionView_please_fix_this_for_real_data
        levelId={levelId}
        // levelPlayLogId={1}
      />
    </div>
  );
};

export default Lesson;
