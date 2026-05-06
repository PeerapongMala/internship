import React, { useEffect, useState } from 'react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Monster, IPagination, LevelType } from '@domain/g02/g02-d03/local/Type';
import ModalCreateMonster from '../../../../../../local/components/modal/ModalCreateMonster';
import IconClose from '@core/design-system/library/component/icon/IconClose';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import API from '@domain/g02/g02-d03/local/api';
import { useNavigate } from '@tanstack/react-router';
import showMessage from '@global/utils/showMessage';
import { MonsterData } from '@domain/g02/g02-d03/local/components/option';

interface MonsterTableProps {
  lessonId: string;
  tier?: string;
  tableTitle?: string;
  onFetch: (createdMonsters: Monster[]) => void;
}
const MonsterTable = ({ lessonId, tier, tableTitle, onFetch }: MonsterTableProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [showModal, setShowModal] = useState(false);
  const [recordsTest, setRecordsTest] = useState<Monster[]>([]);
  const [recordsPreTest, setRecordsPreTest] = useState<Monster[]>([]);
  const [recordsPostTest, setRecordsPostTest] = useState<Monster[]>([]);

  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    limit: 5,
    total_count: 0,
  });

  const getRecordsByTier = () => {
    switch (tier) {
      case LevelType.PRETEST:
        return recordsPreTest;
      case LevelType.POSTTEST:
        return recordsPostTest;
      default:
        return recordsTest;
    }
  };

  const records = getRecordsByTier();

  useEffect(() => {
    if (tier === LevelType.PRETEST) {
      fetchMonsterData(LevelType.PRETEST);
    } else if (tier === LevelType.POSTTEST) {
      fetchMonsterData(LevelType.POSTTEST);
    } else {
      fetchMonsterData(LevelType.TEST);
    }
  }, [tier, onFetch, pagination.page]);

  const fetchMonsterData = async (level: LevelType) => {
    try {
      const res = await API.Lesson.MonsterList.Get(lessonId, {
        limit: pagination.limit,
        page: pagination.page,
        level_type: level,
      });

      if (res.status_code === 200) {
        switch (level) {
          case LevelType.PRETEST:
            setRecordsPreTest(res.data);
            break;
          case LevelType.POSTTEST:
            setRecordsPostTest(res.data);
            break;
          default:
            setRecordsTest(res.data);
            break;
        }
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination.total_count,
        }));
      } else if (res.status_code === 401) {
        navigate({ to: '/' });
      }
    } catch (error) {
      console.error('Error fetching monster data:', error);
    }
  };
  const handleDeleteMonster = async (selectedMonster: number[]) => {
    API.Lesson.MonsterDelete.Delete(selectedMonster).then((res) => {
      console.log({ res: res });
      if (res.status_code === 200) {
        showMessage('ลบมอนเตอร์สำเร็จ');
        if (tier === LevelType.PRETEST) {
          fetchMonsterData(LevelType.PRETEST);
        } else if (tier === LevelType.POSTTEST) {
          fetchMonsterData(LevelType.POSTTEST);
        } else {
          fetchMonsterData(LevelType.TEST);
        }
      }
    });
  };

  const columns: DataTableColumn<Monster>[] = [
    {
      accessor: 'index',
      title: '#',
      render: (record, index) => {
        // return index + 1;
        return (pagination.page - 1) * pagination.limit + index + 1;
      },
    },
    {
      accessor: 'image_path',
      title: 'ชื่อมอนเตอร์',
      width: 900,
      textAlign: 'left',
      render: (record: Monster) => {
        const matchedMonster = MonsterData.find(
          (monster) =>
            monster.name_model === record.image_path ||
            monster.image_path?.includes(record.image_path?.replace('_', '-') ?? ''),
        );

        const monsterName = matchedMonster?.name ?? 'ชื่อไม่พบ';
        const imagePath = matchedMonster?.image_path ?? 'ไม่มีรูป';

        return (
          <div className="flex gap-5 text-wrap text-left">
            <img src={imagePath} className="size-10 object-cover" alt="" />
            <p className="flex items-center justify-end">{monsterName}</p>
          </div>
        );
      },
    },
    {
      accessor: 'id',
      title: 'เอาออก',
      textAlign: 'right',
      render: (record: Monster) => (
        <div className="text-wrap pr-3 text-end">
          <button onClick={() => handleDeleteMonster([record.id])}>
            <IconClose />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <DataTable
        className="table-hover whitespace-nowrap"
        columns={columns}
        records={records}
        noRecordsText="ไม่พบข้อมูล"
        highlightOnHover
        withTableBorder
        withColumnBorders
        minHeight={200}
        totalRecords={pagination.total_count}
        recordsPerPage={pagination.limit}
        page={pagination.page}
        onPageChange={(page) => {
          setPagination((prev) => ({
            ...prev,
            page,
          }));
        }}
        onRecordsPerPageChange={(limit: number) => {
          setPagination((prev) => ({
            ...prev,
            limit,
            page: 1,
          }));
        }}
        recordsPerPageOptions={[5, 10, 15, 20]}
        paginationText={({ from, to, totalRecords }) =>
          `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
        }
        scrollAreaProps={{
          style: { maxHeight: '350px', overflowY: 'auto', overflowX: 'auto' }, // ให้ scroll ทั้งแนวตั้งและแนวนอน
        }}
      />
    </div>
  );
};

const NormalTableMonster = ({ lessonId, onFetch }: MonsterTableProps) => (
  <MonsterTable
    tier={LevelType.TEST}
    tableTitle="ด่านธรรมดา"
    lessonId={lessonId}
    onFetch={onFetch}
  />
);

const PretestTableMonster = ({ lessonId, onFetch }: MonsterTableProps) => (
  <MonsterTable
    tier={LevelType.PRETEST}
    tableTitle="ด่าน pre-test"
    lessonId={lessonId}
    onFetch={onFetch}
  />
);

const PosttestTableMonster = ({ lessonId, onFetch }: MonsterTableProps) => (
  <MonsterTable
    tier={LevelType.POSTTEST}
    tableTitle="ด่าน post-test"
    lessonId={lessonId}
    onFetch={onFetch}
  />
);

export { NormalTableMonster, PosttestTableMonster, PretestTableMonster };
