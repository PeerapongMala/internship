import ButtonBack from '@component/web/atom/wc-a-button-back';
import { useRouter } from '@tanstack/react-router';
import './index.css';

const Header = () => {
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-center px-2 py-3">
      <ButtonBack
        className="w-[55px] h-[55px]"
        onClick={() => router.history.back()}
      />

      <span className="chat-header">แชท</span>
    </div>
  );
};

export default Header;
