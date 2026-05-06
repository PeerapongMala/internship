import { useTranslation } from 'react-i18next';
import CWMDropdown, { DropdownItem } from '../../molecule/cw-m-dropdown';
import { useRef, useState } from 'react';
import { Modal } from '@core/design-system/library/vristo/source/components/Modal';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import IconArrowDown from '@core/design-system/library/component/icon/IconArrowDown';
import CWButton from '@component/web/cw-button';
import CWInputSearch from '@component/web/cw-input-search';
import WCAInputDropdown from '@component/web/atom/wc-a-input-dropdown.tsx';
import WCAInputDate from '@component/web/atom/wc-a-input-date';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import SelectUserSubjectData from '@component/web/cw-select-user-subject-data';

export interface CWOHeaderTableButtonProps {
  btnExportLabel?: any;
  btnImportLabel?: any;
  bulkEditDisabled?: boolean;
  bulkEditActions?: DropdownItem[];
  onDownload?: (data: Record<string, any>) => void;
  onUpload?: (file?: File) => void;
  onSearchChange?: React.ChangeEventHandler<HTMLInputElement>;
  showBulkEditButton?: boolean;
  showDownloadButton?: boolean;
  showDownloadModal?: boolean;
  showUploadButton?: boolean;
  showButtonSpecial?: {
    show: boolean;
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
  };
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
  searchInputValue?: string;
  searchDropdownValue?: string;
  selectSubject?: boolean;
}

const CWOHeaderTableButton = function ({
  inputSearchType = 'input',
  showButtonSpecial,
  selectSubject = false,
  ...props
}: CWOHeaderTableButtonProps) {
  const { t } = useTranslation(['global']);

  // Set default values for the props
  const { showDownloadButton = true, showUploadButton = true } = props;

  const [modalState, setModalState] = useState('' as '' | 'download' | 'upload');
  const [formData, setFormData] = useState({ dateFrom: '', dateTo: '' });

  function closeModal() {
    setModalState('');
    setFormData({ dateFrom: '', dateTo: '' });
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {(props.showBulkEditButton ?? true) && (
            <CWMDropdown
              disabled={props.bulkEditDisabled}
              label={
                <>
                  {t('button.bulkEdit')} <IconArrowDown />
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
            (props.showBulkEditButton ?? true)) && (
              <div className="hidden border-r-2 md:block"></div>
            )}

          {inputSearchType === 'input' && (
            <CWInputSearch
              placeholder={t('search.search')}
              onChange={props.onSearchChange}
              disabled={props.searchDisabled}
              className="w-full md:w-auto"
            />
          )}
          {inputSearchType === 'input-dropdown' && (
            <WCAInputDropdown
              inputPlaceholder={t('search.search')}
              onInputChange={props.onSearchChange}
              dropdownPlaceholder={t('search.searchDropdown')}
              dropdownOptions={props.searchDropdownOptions}
              onDropdownSelect={props.onSearchDropdownSelect}
              disabled={props.searchDisabled}
              inputValue={props.searchInputValue}
              dropdownValue={props.searchDropdownValue}
            />
          )}
          {selectSubject && (
            <SelectUserSubjectData />
          )}
        </div>
        <div className="flex flex-1 gap-2 md:justify-end">
          {showDownloadButton && (
            <CWButton
              className="gap-2 !px-3 !font-bold"
              onClick={() => {
                if (props.showDownloadModal ?? true) {
                  setModalState('download');
                } else {
                  props.onDownload?.({});
                }
              }}
              title={
                props.btnExportLabel ?? (
                  <>
                    <IconDownload /> {t('button.download')}
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
                      <IconUpload /> {t('button.upload')}
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
          {showButtonSpecial && (
            <>
              <CWButton
                className="w-full gap-2 !px-3 !font-bold md:w-auto"
                // onClick={() => {
                //   setModalState("upload");
                // }}
                icon={showButtonSpecial.icon}
                onClick={showButtonSpecial.onClick}
                title={showButtonSpecial.title}
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
                label: t('word.dateFrom'),
                required: undefined,
              },
              { name: 'dateTo', label: t('word.dateTo'), required: undefined },
            ].map((config, index) => (
              <div key={`${config.name}-${index}`} className="flex flex-col gap-1">
                <div className="flex gap-1">
                  {config.required && <span className="text-danger">*</span>}
                  {config.label}:
                </div>
                <WCAInputDate
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
              {t('button.cancel')}
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
              {t(`button.${modalState}`)}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CWOHeaderTableButton;
