import { useTranslation } from "react-i18next";

export interface ErrorItem {
  id: string;
  filename: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
}

interface ErrorListProps {
  items: ErrorItem[];
  className?: string;
  emptyMessage?: string;
  headerClassName?: string
  rowClassName?: string;
}

const typeStyles = {
  error: {
    text: 'text-red-600',
  },
  warning: {
    text: 'text-orange-600',
  },
  info: {
    text: 'text-blue-600',
  },
};

const CWErrorList = ({
  items,
  className = '',
  emptyMessage = 'No errors to display',
  headerClassName = '',
  rowClassName = 'border-b border-gray-100 hover:bg-gray-50 transition-colors',
}: ErrorListProps) => {
  const { t } = useTranslation(["global"]);
  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center  ${className}`}>
        <p className="text-gray-500 text-center m-0">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col w-full rounded-md overflow-hidden ${className}`}>
      {/* Header Row */}
      <div className={`grid grid-cols-[1fr_1fr] px-5 py-3 text-[20px] font-bold text-gray-700 ${headerClassName}`}>
        <div>{t("modal_progress-file.file_name")}</div>
        <div className="text-red-500 text-center">{t("modal_progress-file.issue_to")}</div>
      </div>

      {/* Data Rows */}
      <div className="divide-y divide-gray-100">
        {items.map((item, index) => {
          const styles = item.type ? typeStyles[item.type] : { text: 'text-gray-700', icon: '' };
          const isEven = index % 2 === 0;
          const rowBg = isEven ? 'bg-gray-50' : 'bg-white';
          return (
            <div
              key={item.id}
              className={`grid grid-cols-[1fr_1fr] px-5 py-3 text-sm ${rowBg} ${rowClassName}`}
            >
              <div className="truncate font-normal">{item.filename}</div>
              <div className={`font-medium ${styles.text} flex justify-center items-center  gap-1`}>
                {item.message}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CWErrorList;