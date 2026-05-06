import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../../config/index.json';
import CWASelect from '../../atom/cw-a-select';

interface CWMPaginationDisplayProps {
  className?: string;
  maxPage?: number;
  pages?: number[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

const CWMPaginationDisplay = function (props: CWMPaginationDisplayProps) {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  let pages = props.pages ?? [10, 25, 50, 100];

  return (
    <div className={`flex items-center gap-1 ${props.className ?? ''}`}>
      <div>{t('pagination.display')}</div>
      <div>1</div>
      <div>{t('pagination.from')}</div>
      <div>{props.maxPage ?? 1}</div>
      <div>{t('pagination.page')}</div>
      <CWASelect
        name="pagination-display"
        options={pages.map((page) => ({
          label: page,
          value: page,
        }))}
        onChange={props.onChange}
        className="!w-20"
      />
    </div>
  );
};

export default CWMPaginationDisplay;
