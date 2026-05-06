import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../../config/index.json';
import CWMDropdown, { DropdownItem } from '../../molecule/cw-m-dropdown';
import { useRef, useState } from 'react';
import { Modal } from '@core/design-system/library/vristo/source/components/Modal';
import CWAInputDate from '../../atom/cw-a-input-date';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import IconArrowDown from '@core/design-system/library/component/icon/IconArrowDown';
import CWButton from '@component/web/cw-button';
import CWInputSearch from '@component/web/cw-input-search';
import WCAInputDropdown from '@component/web/atom/wc-a-input-dropdown.tsx';

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

  // Set default values for the props
  const {
    showDownloadButton = true,
    showUploadButton = true,
    searchDropdownOptions,
  } = props;

  const [modalState, setModalState] = useState('' as '' | 'download' | 'upload');
  const [formData, setFormData] = useState({ dateFrom: '', dateTo: '' });

  function closeModal() {
    setModalState('');
    setFormData({ dateFrom: '', dateTo: '' });
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const dropdownPlaceholder =
    searchDropdownOptions && searchDropdownOptions.length > 0
      ? searchDropdownOptions[0].label
      : 'ฟิลด์';

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {(props.showBulkEditButton ?? true) && (
            <CWMDropdown
              disabled={props.bulkEditDisabled}
              // disabled={true}
              label={
                <>
                  {'Bulk Edit'} <IconArrowDown />
                </>
              }
              items={props.bulkEditActions ?? []}
            />
          )}
          {props.onBtnClick && props.btnLabel && (
            <CWButton
              className="!px-2"
              onClick={props.onBtnClick}
              icon={props.btnIcon}
              title={props.btnLabel}
            />
          )}

          {((props.onBtnClick && props.btnLabel) ||
            (props.showBulkEditButton ?? true)) && <div className="border-r-2"></div>}

          {inputSearchType === 'input' && (
            <CWInputSearch
              placeholder={'ค้นหา'}
              onChange={props.onSearchChange}
              disabled={props.searchDisabled}
            />
          )}
          {inputSearchType === 'input-dropdown' && (
            <WCAInputDropdown
              inputPlaceholder={'ค้นหา'}
              onInputChange={props.onSearchChange}
              dropdownPlaceholder={dropdownPlaceholder}
              dropdownOptions={props.searchDropdownOptions}
              onDropdownSelect={props.onSearchDropdownSelect}
              disabled={props.searchDisabled}
              inputValue={props.searchValue}
            />
          )}
        </div>
        <div className="flex flex-1 justify-end gap-2">
          {showDownloadButton && (
            <CWButton
              className="gap-2 !px-3 !font-bold"
              onClick={() => {
                if (props.showDownloadModal ?? true) {
                  setModalState('download');
                } else {
                  props.onDownload?.({
                    dateFrom: '',
                    dateTo: '',
                  });
                }
              }}
              title={
                props.btnExportLabel ?? (
                  <>
                    <IconDownload /> {'Download'}
                  </>
                )
              }
            />
          )}
          {showUploadButton && (
            <>
              <CWButton
                className="gap-2 !px-3 !font-bold"
                // onClick={() => {
                //   setModalState("upload");
                // }}
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                title={
                  props.btnImportLabel ?? (
                    <>
                      <IconUpload /> {'Upload'}
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
            </>
          )}
        </div>
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
              {
                name: 'dateFrom',
                label: 'ตั้งแต่วันที่',
                required: undefined,
              },
              { name: 'dateTo', label: 'ถึงวันที่', required: undefined },
            ].map((config, index) => (
              <div key={`${config.name}-${index}`} className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {config.required && <span className="text-danger">*</span>}
                  {config.label}:
                </div>
                <CWAInputDate
                  name={config.name}
                  onChange={(e) => {
                    setFormData((prev) => {
                      return {
                        ...prev,
                        [config.name]: e.target.value,
                      };
                    });
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex w-full gap-2 *:flex-1">
            <button className="btn btn-outline-dark" onClick={closeModal}>
              {'ยกเลิก'}
            </button>
            <button
              className="btn btn-primary flex gap-1"
              onClick={async () => {
                if (modalState === 'download') {
                  await props.onDownload?.(formData);
                }
                closeModal();
              }}
            >
              {modalState === 'download' ? <IconDownload /> : <IconUpload />}{' '}
              {modalState == 'download' ? 'Download' : 'Upload'}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CWOHeaderTableButton;
