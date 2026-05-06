import ScreenTemplate from '@domain/g05/local/component/web/template/cw-t-line-layout';
import { useNavigate } from '@tanstack/react-router';

const DomainJsx = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate({ to: '/line/parent/clever/login' });
  };

  return (
    <ScreenTemplate
      className="items-center justify-center"
      headerTitle="Clever Login"
      footer={false}
    >
      <button
        onClick={handleLogin}
        className="rounded-md bg-green-500 p-2 font-bold text-white"
      >
        Login Line
      </button>
    </ScreenTemplate>
  );
};

export default DomainJsx;
