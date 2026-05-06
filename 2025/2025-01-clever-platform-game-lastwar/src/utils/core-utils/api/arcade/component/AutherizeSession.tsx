import { useEffect } from 'react';
import { useArcadeStore } from '../arcade-store';

const AuthorizeSession = () => {

  const {
    // setId, 
    setPlayToken
  } = useArcadeStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // const id = params.get('id');
    const playToken = params.get('playToken');

    // if (!id || !playToken) {
    if (!playToken) {
      console.log('ไม่มีสิทธิ์เข้าเล่นเกม');
      return;
    }
    // setId(id);
    setPlayToken(playToken);
  }, [setPlayToken]);
  return <></>;
};

export default AuthorizeSession;
