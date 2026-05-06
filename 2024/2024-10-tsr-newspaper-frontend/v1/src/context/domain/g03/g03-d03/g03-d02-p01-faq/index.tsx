import { useNavigate } from '@tanstack/react-router';
import FaqPage from './components/faq-page';
import StoreGlobalPersist from '@store/global/persist';

const DomainJSX = () => {
  const navigate = useNavigate()
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  if (!accessToken) {
    navigate({ to: "/sign-in" })
  }
  return (
    <div className="bg-white dark:bg-[#262626]">
      <FaqPage />
    </div>
  );
};

export default DomainJSX;
