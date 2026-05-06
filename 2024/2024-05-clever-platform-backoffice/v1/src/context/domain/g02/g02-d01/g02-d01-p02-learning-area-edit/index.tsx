import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Curriculum, Learning, LearningStatus } from '../local/type';

import EditContent from './components/web/template/EditContent';
import StoreGlobalPersist from '@store/global/persist';

const DomainJSX = () => {
  const navigate = useNavigate();
  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);
  const curriculumId = curriculumData?.id;
  let time = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
  const byAdmin = 'Admin GM';
  const userId = '0000001';
  const ClickBack = () => {
    navigate({ to: '../../' });
  };
  const handleSaveEdit = () => {
    alert('Save Edit');
  };
  const { learningAreaId } = useParams({ strict: false });
  return (
    <div className="w-full">
      <div className="w-full">
        <EditContent
          title={'แก้ไขกลุ่มสาระการเรียนรู้'}
          userId={learningAreaId}
          handleSaveEdit={handleSaveEdit}
          ClickBack={ClickBack}
          id={learningAreaId}
          curriculumId={curriculumId}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
