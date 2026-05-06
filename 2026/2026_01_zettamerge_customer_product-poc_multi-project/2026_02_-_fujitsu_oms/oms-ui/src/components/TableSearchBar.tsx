import { DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { useLanguage } from '../i18n/LanguageContext';
import type { TranslationKey } from '../i18n/en';

const { RangePicker } = DatePicker;

interface Props {
  searchText: string;
  onSearchChange: (value: string) => void;
  placeholderKey?: TranslationKey;
  showDateRange?: boolean;
  onDateRangeChange?: (dates: [Dayjs | null, Dayjs | null] | null) => void;
}

export default function TableSearchBar({
  searchText,
  onSearchChange,
  placeholderKey = 'search',
  showDateRange,
  onDateRangeChange,
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="table-search-bar">
      <div className="table-search-input">
        <input
          type="text"
          placeholder={t(placeholderKey)}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <SearchOutlined className="table-search-icon" />
      </div>
      {showDateRange && onDateRangeChange && (
        <RangePicker
          onChange={(dates) => onDateRangeChange(dates as [Dayjs | null, Dayjs | null] | null)}
          format="DD/MM/YYYY"
          placeholder={[t('dateRange'), t('dateRange')]}
          style={{ maxWidth: 320 }}
        />
      )}
    </div>
  );
}
