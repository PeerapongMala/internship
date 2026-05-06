import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../../config/index.json';
import CWMDropdown, { DropdownItem } from '../../molecule/cw-m-dropdown';
import { useRef, useState } from 'react';
import { Modal } from '@core/design-system/library/vristo/source/components/Modal';
import CWAInputDate from '../../atom/cw-a-input-date';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import IconArrowDown from '@core/design-system/library/component/icon/IconArrowDown';
import CWInputSearch from '@component/web/cw-input-search';
import WCAInputDropdown from '@component/web/atom/wc-a-input-dropdown.tsx';
import CWAInputSearch from '../../atom/cw-a-input-search';
import CWButton from '../../atom/cw-a-button';

export interface CWOHeaderTableButtonProps {
  btnExportLabel?: any;
  btnImportLabel?: any;
  searchValue?: any;
  searchKey?: any;
  bulkEditDisabled?: boolean;
  bulkEditActions?: DropdownItem[];
  onDownload?: (data: { dateFrom: string; dateTo: string }) => void;
  onUpload?: (file?: File) => void;
  onSearchChange?: React.ChangeEventHandler<HTMLInputElement>;
  showBulkEditButton?: boolean;
  showDownloadButton?: boolean;
  showDownloadModal?: boolean;
  showUploadButton?: boolean;
  searchDisabled?: boolean;
  onBtnClick?: () => void;
  btnIcon?: React.ReactNode;
  btnLabel?: string;
  inputSearchType?: 'input' | 'input-dropdown' | 'none';
  searchDropdownPlaceholder?: React.ReactNode;
  searchDropdownOptions?: {
    value: string | number;
    label: React.ReactNode;
  }[];
  onSearchDropdownSelect?: (selected: string | number) => void;
}

const CWOHeaderTableButton = function ({
  inputSearchType = 'input',
  ...props
}: CWOHeaderTableButtonProps) {
  const { t } = useTranslation([ConfigJson.key]);

  // Default visibility for download/upload
  const { showDownloadButton = true, showUploadButton = true } = props;

  const [modalState, setModalState] = useState<'' | 'download' | 'upload'>('');
  const [formData, setFormData] = useState({ dateFrom: '', dateTo: '' });

  function closeModal() {
    setModalState('');
    setFormData({ dateFrom: '', dateTo: '' });
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="flex w-full flex-col items-center gap-4">
        {inputSearchType === 'input' && (
          <div className="flex w-full justify-center">
            <CWAInputSearch
              inputWidth="full"
              placeholder="ค้นหา"
              onChange={props.onSearchChange}
              disabled={props.searchDisabled}
            />
          </div>
        )}

        {(props.showBulkEditButton ?? true) && (
          <div className="flex w-full justify-center">
            <CWMDropdown
              disabled={props.bulkEditDisabled}
              label={
                <>
                  {'Bulk Edit'} <IconArrowDown />
                </>
              }
              items={props.bulkEditActions ?? []}
            />
          </div>
        )}

        {props.onBtnClick && props.btnLabel && (
          <div className="flex w-full justify-center">
            <CWButton
              className="!px-2"
              onClick={props.onBtnClick}
              icon={props.btnIcon}
              title={props.btnLabel}
            />
          </div>
        )}

        {inputSearchType === 'input-dropdown' && (
          <div className="flex w-full justify-center">
            <WCAInputDropdown
              inputPlaceholder="ค้นหา"
              onInputChange={props.onSearchChange}
              dropdownPlaceholder={props.searchDropdownPlaceholder ?? 'ฟิลด์'}
              dropdownOptions={props.searchDropdownOptions}
              onDropdownSelect={props.onSearchDropdownSelect}
              disabled={props.searchDisabled}
              inputValue={props.searchValue}
            />
          </div>
        )}

        {showDownloadButton && (
          <div className="flex w-full justify-center">
            <CWButton
              className="gap-2 !px-3 !font-bold"
              onClick={() => {
                if (props.showDownloadModal ?? true) {
                  setModalState('download');
                } else {
                  props.onDownload?.({ dateFrom: '', dateTo: '' });
                }
              }}
              title={
                props.btnExportLabel ?? (
                  <>
                    <IconDownload /> Download
                  </>
                )
              }
            />
          </div>
        )}

        {showUploadButton && (
          <div className="flex w-full justify-center">
            <CWButton
              className="gap-2 !px-3 !font-bold"
              onClick={() => fileInputRef.current?.click()}
              title={
                props.btnImportLabel ?? (
                  <>
                    <IconUpload /> Upload
                  </>
                )
              }
            />
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".csv"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                props.onUpload?.(file);
              }}
            />
          </div>
        )}
      </div>

      {modalState !== '' && (
        <Modal
          open
          onClose={closeModal}
          title={t(`modal.${modalState}`)}
          className="w-96"
        >
          <div className="flex flex-col gap-4">
            {[
              { name: 'dateFrom', label: 'ตั้งแต่วันที่' },
              { name: 'dateTo', label: 'ถึงวันที่' },
            ].map((config, index) => (
              <div key={`${config.name}-${index}`} className="flex flex-col gap-1">
                <div className="flex gap-1">{config.label}:</div>
                <CWAInputDate
                  name={config.name}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      [config.name]: e.target.value,
                    }));
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex w-full gap-2">
            <button className="btn btn-outline-dark w-full" onClick={closeModal}>
              ยกเลิก
            </button>
            <button
              className="btn btn-primary flex w-full gap-1"
              onClick={async () => {
                if (modalState === 'download') {
                  await props.onDownload?.(formData);
                }
                closeModal();
              }}
            >
              {modalState === 'download' ? <IconDownload /> : <IconUpload />}
              {modalState === 'download' ? 'Download' : 'Upload'}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CWOHeaderTableButton;
