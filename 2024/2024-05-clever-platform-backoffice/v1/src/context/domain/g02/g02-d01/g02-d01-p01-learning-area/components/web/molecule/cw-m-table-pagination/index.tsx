import WCAIconChevronLeft from '@component/web/atom/wc-a-icons/iconChevronLeft';
import WCAIconChevronRight from '@component/web/atom/wc-a-icons/iconChevronRight';
import WCAIconChevronsLeft from '@component/web/atom/wc-a-icons/iconChevronsLeft';
import WCAIconChevronsRight from '@component/web/atom/wc-a-icons/iconChevronsRight';
import { FC } from 'react';
import CWAButtonPaginationIcon from '../../atom/cw-a-button-pagination-icon';
import CWAButtonPaginationText from '../../atom/cw-a-button-pagination-text';

const CWMTablePagination: FC = () => {
  return (
    <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse">
      <li>
        <CWAButtonPaginationIcon>
          <WCAIconChevronsLeft />
        </CWAButtonPaginationIcon>
      </li>
      <li>
        <CWAButtonPaginationIcon>
          <WCAIconChevronLeft />
        </CWAButtonPaginationIcon>
      </li>
      <li>
        <CWAButtonPaginationText text="1" />
      </li>
      <li>
        <CWAButtonPaginationText text="2" />
      </li>
      <li>
        <CWAButtonPaginationText text="3" />
      </li>
      <li>
        <CWAButtonPaginationIcon>
          <WCAIconChevronRight />
        </CWAButtonPaginationIcon>
      </li>
      <li>
        <CWAButtonPaginationIcon>
          <WCAIconChevronsRight />
        </CWAButtonPaginationIcon>
      </li>
    </ul>
  );
};

export default CWMTablePagination;
