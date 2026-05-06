import { useEffect, useState } from 'react';
import { Curriculum, Learning, LearningStatus } from '../local/type';
import CreateContent from './components/web/template/CreateSubStandard';
import StoreGlobalPersist from '@store/global/persist';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const DomainJSX = () => {
  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);
  const curriculumId = curriculumData?.id;

  let time = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
  const userId = '0000001';
  const byAdmin = 'Admin GM';
  const handleClick = () => {
    alert('Click');
  };

  return (
    <div className="w-full">
      <CreateContent
        title={'เพิ่มหัวข้อมาตรฐานย่อย'}
        userId={userId}
        time={time}
        byAdmin={byAdmin}
        handleClick={handleClick}
        curriculumId={curriculumId}
      />
    </div>
  );
};

export default DomainJSX;
