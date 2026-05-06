import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Curriculum, Learning, LearningStatus } from '../local/type';

import EditContent from './components/web/template/EditContent';
import StoreGlobalPersist from '@store/global/persist';

const DomainJSX = () => {
  const navigate = useNavigate();
  const ClickBack = () => {
    navigate({ to: '../../' });
  };
  const handleSaveEdit = () => {
    alert('Save Edit');
  };
  const { contentId } = useParams({ strict: false });

  return (
    <div className="w-full">
      <div className="w-full">
        <EditContent
          title={'แก้ไขสาระ'}
          userId={contentId}
          handleSaveEdit={handleSaveEdit}
          ClickBack={ClickBack}
          id={contentId}
        />
      </div>
    </div>
  );
};

export default DomainJSX;
