import React, { useEffect, useState } from 'react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { MonsterData, Monster, IPagination } from '@domain/g02/g02-d03/local/Type';
import ModalCreateMonster from '../../../../../../local/components/modal/ModalCreateMonster';
import IconClose from '@core/design-system/library/component/icon/IconClose';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import API from '@domain/g02/g02-d03/local/api';
import { useNavigate } from '@tanstack/react-router';
import usePagination from '@global/hooks/usePagination';

interface MonsterTableProps {
  tier: string;
  tableTitle: string;
}

const MonsterTable = ({ tier, tableTitle }: MonsterTableProps) => {
  //  all mock dont use

  const navigate = useNavigate();
  const lessonId = '1';
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [showModal, setShowModal] = useState(false);
  const [monsterData, setMonsterData] = useState<Monster[]>([]);

  const { pagination, setPagination } = usePagination();

  useEffect(() => {
    fetchMonsterList();
  }, []);

  const fetchMonsterList = async () => {
    if (lessonId) {
      API.Lesson.MonsterList.Get(lessonId, {})
        .then((res) => {
          if (res.status_code === 200) {
            setMonsterData(res?.data);
            setPagination((prev) => ({
              ...prev,
              total_count: res?._pagination?.total_count,
            }));
          } else if (res.status_code === 401) {
            navigate({ to: '/' });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleDelete = (id: number) => {
    alert(`ลบข้อมูล ${id}`);
  };
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredData = MonsterData.filter((monster) => monster.level_type === tier);
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const columns: DataTableColumn<Monster>[] = [
    {
      accessor: 'id',
      title: '#',
      render: (record, index) => index + 1,
    },
    {
      accessor: 'MonsterName',
      title: 'ชื่อมอนเตอร์',
      width: 900,
      textAlign: 'left',
      render: (record: Monster) => (
        <div className="flex gap-5 text-wrap text-left">
          <img src={record.image_path || 'ไม่มีรูป'} className="size-10" alt="" />
          <p>{record.lesson_id}</p>
        </div>
      ),
    },
    {
      accessor: 'id',
      title: 'เอาออก',
      textAlign: 'right',
      render: (record: Monster) => (
        <div className="text-wrap pr-3 text-end">
          <button onClick={() => handleDelete(record.id)}>
            <IconClose />
          </button>
        </div>
      ),
    },
  ];
  const handleSelectMonster = (selectedMonster: Monster | null) => {};
  return (
    <div>
      <h1 className="relative pl-5 text-[20px] font-bold">
        <span className="absolute left-0 text-[14px]">•</span>
        {tableTitle}
      </h1>
      <button
        className="btn btn-primary my-5 h-10 w-[150px] px-4 py-1.5"
        onClick={handleShowModal}
      >
        <IconPlus /> เพิ่มมอนเตอร์
      </button>
      <ModalCreateMonster
        open={showModal}
        onClose={handleCloseModal}
        lessonId={lessonId}
        onSuccess={() => {}}
      />
      <div className="mt-5 w-full">
        <DataTable
          columns={columns}
          records={currentData}
          page={currentPage}
          onPageChange={handlePageChange}
          recordsPerPage={itemsPerPage}
          totalRecords={filteredData.length}
        />
      </div>
    </div>
  );
};

const NormalTableMonster = () => <MonsterTable tier="normal" tableTitle="ด่านธรรมดา" />;
const PretestTableMonster = () => (
  <MonsterTable tier="pre-test" tableTitle="ด่าน pre-test" />
);
const PosttestTableMonster = () => (
  <MonsterTable tier="post-test" tableTitle="ด่าน post-test" />
);

export { NormalTableMonster, PosttestTableMonster, PretestTableMonster };
