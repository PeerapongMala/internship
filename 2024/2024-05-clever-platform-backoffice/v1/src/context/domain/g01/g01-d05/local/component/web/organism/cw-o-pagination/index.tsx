import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../../../g01-d05-p00-classroom/config/index.json';
import CWMPaginationDisplay from '../../molecule/cw-m-pagination-display';
import CWMPaginationPage from '../../molecule/cw-m-pagination-page';

interface CWOPaginationProps {
  className?: string;
  maxPage: number;
  onPaginateDisplayChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onPageChange?: (pageNo: number) => void;
  currentPage?: number;
}

const CWOPagination = function (props: CWOPaginationProps) {
  const { t } = useTranslation([ConfigJson.key]);

  return (
    <div className="flex justify-between">
      <CWMPaginationDisplay
        maxPage={props.maxPage}
        onChange={props.onPaginateDisplayChange}
      />
      <CWMPaginationPage
        currentPage={props.currentPage}
        maxPage={props.maxPage}
        onClick={props.onPageChange}
      />
    </div>
  );
};

export default CWOPagination;
