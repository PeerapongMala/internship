import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Learning, LearningStatus } from '../local/type';

import EditContent from './components/web/template/EditContent';

const DomainJSX = () => {
  const navigate = useNavigate();
  const ClickBack = () => {
    navigate({ to: '../../' });
  };
  const handleSaveEdit = () => {
    alert('Save Edit');
  };
  const { learningContentId } = useParams({ strict: false });
  return (
    <div className="w-full">
      <div className="w-full">
        <EditContent
          title={'แก้ไขสาระการเรียนรู้'}
          userId={learningContentId}
          handleSaveEdit={handleSaveEdit}
          ClickBack={ClickBack}
          id={learningContentId}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
