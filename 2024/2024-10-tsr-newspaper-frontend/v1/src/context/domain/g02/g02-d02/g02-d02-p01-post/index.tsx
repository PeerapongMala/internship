import AlertFailed from './components/AlertFailed';
import { useEffect, useState } from 'react';
import CreateNews from './components/CreateNews';
import SignInModal from '@domain/g01/g01-d02/g01-d02-p01-post/components/signin-modal';
import StoreGlobal from '@store/global/index';
import StoreGlobalPersist from '@store/global/persist';

const DomainJSX = () => {
  const [isModalOpen, setModalOpen] = useState(true);
  const closeModal = () => setModalOpen(false);
  const { role } = StoreGlobalPersist.StateGet(['role'])
 
  return (
    <div className="bg-neutral-100 dark:bg-[#414141]">
      {
        role === null ?
        <SignInModal isOpen={isModalOpen} onClose={closeModal} /> : null
      }
      <CreateNews userRole={role} />
      {/* <AlertFailed /> */}
    </div>
  );  
};

export default DomainJSX;
