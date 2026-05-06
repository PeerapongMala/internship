import  { useState } from 'react';
import { XIcon, SignInIcon } from '../local/icon/icon';
import SignInModal from './components/signin-modal';




function DomainJSX() {
  const [isModalOpen, setModalOpen] = useState(true);

  const closeModal = () => setModalOpen(false);

  return (
    <div className="bg-neutral-100 dark:bg-[#414141]">
      <SignInModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default DomainJSX;
