import { useState } from 'react';
import { LevelType, Monster } from '../../../Type';
import { MonsterData } from '../../option';
import { Modal, ModalProps } from '@core/design-system/library/component/web/Modal';
import API from '../../../api';
import showMessage from '@global/utils/showMessage';

interface ModalCreateMonsterProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (createdMonsters: Monster[]) => void;
  lessonId: string;
  levelStatus?: LevelType;
}

const ModalCreateMonster = ({
  open,
  onClose,
  lessonId,
  onSuccess,
  levelStatus = LevelType.TEST,
  ...rest
}: ModalCreateMonsterProps) => {
  const [monster, setMonster] = useState<Monster[]>(MonsterData || []);
  const [selectedMonsters, setSelectedMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(false);
  const onCloseModal = () => {
    setSelectedMonsters([]);
    onClose();
  };

  const handleSelectMonster = (monster: Monster) => {
    setSelectedMonsters((prev) => {
      if (prev.some((m) => m.id === monster.id)) {
        return prev.filter((m) => m.id !== monster.id);
      }
      return [...prev, monster];
    });
  };
  const filteredMonsters = monster.filter((m) => m.available_for.includes(levelStatus));
  const handleCreateMonster = async () => {
    if (selectedMonsters.length === 0) return;

    setLoading(true);
    try {
      const res = await API.Lesson.MonsterCreate.Post(lessonId, {
        monster_lists: selectedMonsters.map((monster) => ({
          image_path: monster.name_model,
          level_type: levelStatus || 'test',
        })),
      });

      if (res.status_code === 201) {
        showMessage('สร้างมอนสเตอร์สำเร็จ');
        onCloseModal();
        onSuccess(selectedMonsters);
      } else {
        showMessage('เกิดข้อผิดพลาดการสร้างมอนเตอร์', 'error');
      }
    } catch (error) {
      showMessage('Error creating monsters', 'error');
    } finally {
      setLoading(false);
    }
  };
  const getLevelTypeName = (type: LevelType): string => {
    switch (type) {
      case LevelType.TEST:
        return 'ด่าน test';
      case LevelType.PRETEST:
        return 'ด่าน pre-test';
      case LevelType.POSTTEST:
        return 'ด่าน post-test';
      default:
        return '';
    }
  };
  return (
    <Modal
      className="h-auto w-[1200px]"
      open={open}
      onClose={onClose}
      title={`เลือกมอนสเตอร์สำหรับ ${getLevelTypeName(levelStatus)}`}
      {...rest}
    >
      <div className="relative flex max-h-[650px] flex-col overflow-y-auto">
        <div className="w-full px-10 py-5">
          <div className="grid grid-cols-3 gap-10">
            {filteredMonsters.map((data, index) => (
              <div
                key={index}
                onClick={() => handleSelectMonster(data)}
                className={`flex cursor-pointer flex-col items-center border-4 p-1 duration-200 hover:scale-105 ${selectedMonsters.some((m) => m.id === data.id) ? 'border-yellow-500' : 'hover:border-yellow-400'}`}
              >
                <img
                  src={data.image_path}
                  alt={data.name}
                  className="object-cover xl:h-[200px] xl:w-[250px]"
                />
                <p className="font-medium">{data.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full justify-between gap-5 px-5 py-5">
        <button onClick={onCloseModal} className="btn btn-outline-dark flex w-32 gap-2">
          ย้อนกลับ
        </button>
        <button
          onClick={handleCreateMonster}
          disabled={selectedMonsters.length === 0 || loading}
          className={`btn btn-primary flex w-32 gap-2 ${selectedMonsters.length === 0 || loading ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {loading ? 'กำลังสร้าง...' : `เลือก (${selectedMonsters.length})`}
        </button>
      </div>
    </Modal>
  );
};

export default ModalCreateMonster;
