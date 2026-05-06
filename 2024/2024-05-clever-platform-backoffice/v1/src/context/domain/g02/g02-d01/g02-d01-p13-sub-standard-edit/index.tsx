import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Learning, LearningStatus } from '../local/type';

import EditContent from './components/web/template/EditContent';

const DomainJSX = () => {
  const navigate = useNavigate();
  let time = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
  const byAdmin = 'Admin GM';
  const userId = '0000001';
  const ClickBack = () => {
    navigate({ to: '../../' });
  };
  const handleSaveEdit = () => {
    alert('Save Edit');
  };
  const { subStandardId } = useParams({ strict: false });
  return (
    <div className="w-full">
      <div className="w-full">
        <EditContent
          title={'แก้ไขหัวข้อมาตรฐานย่อย'}
          userId={userId}
          handleSaveEdit={handleSaveEdit}
          ClickBack={ClickBack}
          id={subStandardId}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
