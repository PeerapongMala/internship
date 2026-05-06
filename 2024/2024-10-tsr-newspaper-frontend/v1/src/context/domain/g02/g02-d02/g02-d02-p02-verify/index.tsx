import { useEffect, useState } from 'react';
import VerifyPost from './components/verify-post';
import StoreGlobalPersist from '@store/global/persist';


const DomainJSX = () => {

  const { userData: globalUserData } = StoreGlobalPersist.StateGet(['userData']);
  const [user, setUser] = useState({ email: '', first_name: '', last_name: '' });

  useEffect(() => {
    setUser({
      email: globalUserData.email || '',
      first_name: globalUserData.first_name || '',
      last_name: globalUserData.last_name || '',
    });

  }, []);

  return (
    <div className="bg-neutral-100 dark:bg-[#414141]">
      <VerifyPost user={user} />
    </div>
  );
};

export default DomainJSX;
