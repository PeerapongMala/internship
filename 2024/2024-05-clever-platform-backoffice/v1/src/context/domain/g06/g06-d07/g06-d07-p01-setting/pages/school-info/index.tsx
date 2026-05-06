import CWWhiteBox from '@component/web/cw-white-box';
import TableSchoolInfo from './components/table-school-info';
import { getUserData } from '@global/utils/store/getUserData';

const SchoolInfo = () => {
  const userData = getUserData();

  return (
    <CWWhiteBox className="">
      <TableSchoolInfo userData={userData} />
    </CWWhiteBox>
  );
};

export default SchoolInfo;
