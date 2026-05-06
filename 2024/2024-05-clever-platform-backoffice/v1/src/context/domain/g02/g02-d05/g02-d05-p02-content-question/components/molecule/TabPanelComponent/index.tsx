import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import IconEdit from '@core/design-system/library/vristo/source/components/Icon/IconEdit';
import IconGallery from '@core/design-system/library/vristo/source/components/Icon/IconGallery';
import FileUpload from '@core/design-system/library/vristo/source/components/FileUpload';
import { ModalTranslate, TranslationText } from '@domain/g02/g02-d05/local/type';
import InputTranslate from '../../atom/InputTranslate';

const TabPanelComponent = ({
  setInput,
  input,
  inputImage,
  children,
  multipleUpload,
  onUploadChange,
  handleShowModalTranslate,
  inputRequired = true,
  onClear,
}: {
  setInput?: (value: TranslationText) => void;
  input: TranslationText;
  inputImage: any;
  children?: React.ReactNode;
  multipleUpload?: boolean;
  onUploadChange?: (images: any) => void;
  handleShowModalTranslate?: ModalTranslate;
  inputRequired?: boolean;
  onClear?: () => void;
}) => {
  return (
    <Tab.Group>
      <Tab.List className="flex border-b border-white-light dark:border-[#191e3a]">
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={`${selected ? 'border-b !border-secondary text-secondary !outline-none' : ''} before:inline-block' -mb-[1px] flex items-center border-transparent p-5 py-3 hover:border-b hover:!border-secondary hover:text-secondary`}
            >
              <IconEdit className="ltr:mr-2 rtl:ml-2" />
            </button>
          )}
        </Tab>
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={`${selected ? 'border-b !border-secondary text-secondary !outline-none' : ''} before:inline-block' -mb-[1px] flex items-center border-transparent p-5 py-3 hover:border-b hover:!border-secondary hover:text-secondary`}
            >
              <IconGallery className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
            </button>
          )}
        </Tab>
      </Tab.List>
      <Tab.Panels>
        {children ? (
          children
        ) : (
          <>
            <Tab.Panel>
              {/* <div className="flex pt-4">
                            <div
                                className="form-input cursor-pointer"
                                onClick={() => handleShowModalTranslate && handleShowModalTranslate({ show: true, callback: (id, value) => setInput && setInput({ id, value }) })}
                            >
                                {input || <div className="text-gray-500">กรุณาเลือกคำตอบ</div>}
                            </div>
                        </div> */}
              <InputTranslate
                callback={setInput}
                handleShowModalTranslate={handleShowModalTranslate}
                // label='คำถาม'
                placeholder="กรุณาเลือกคำตอบ"
                value={input}
                onClear={onClear}
              />
            </Tab.Panel>
            <Tab.Panel>
              <div className="mt-5 w-full">
                <FileUpload
                  multiple={multipleUpload}
                  onChange={onUploadChange}
                  imageList={inputImage}
                  maxFileSize={5242880}
                />
              </div>
            </Tab.Panel>
          </>
        )}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default TabPanelComponent;
