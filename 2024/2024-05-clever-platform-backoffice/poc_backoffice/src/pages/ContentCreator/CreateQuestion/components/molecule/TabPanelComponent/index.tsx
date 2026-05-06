import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import IconEdit from '../../../../../../components/Icon/IconEdit';
import IconGallery from '../../../../../../components/Icon/IconGallery';
import FileUpload from '../../../../../../components/FileUpload';

const TabPanelComponent = ({
    setInput,
    isTextarea = false,
    children,
    multipleUpload,
    onUploadChange,
}: {
    setInput?: (value: string) => void;
    isTextarea?: boolean
    children?: React.ReactNode
    multipleUpload?: boolean
    onUploadChange?: (images: any) => void
}) => {
    return (
        <Tab.Group>
            <Tab.List className="flex border-b border-white-light dark:border-[#191e3a]">
                <Tab as={Fragment}>
                    {({ selected }) => (
                        <button
                            className={`${selected ? 'border-b !border-secondary text-secondary !outline-none' : ''}
                                                before:inline-block' -mb-[1px] flex items-center border-transparent p-5 py-3 hover:border-b hover:!border-secondary hover:text-secondary`}
                        >
                            <IconEdit className="ltr:mr-2 rtl:ml-2" />
                        </button>
                    )}
                </Tab>
                <Tab as={Fragment}>
                    {({ selected }) => (
                        <button
                            className={`${selected ? 'border-b !border-secondary text-secondary !outline-none' : ''}
                                            before:inline-block' -mb-[1px] flex items-center border-transparent p-5 py-3 hover:border-b hover:!border-secondary hover:text-secondary`}
                        >
                            <IconGallery className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                        </button>
                    )}
                </Tab>
            </Tab.List>
            <Tab.Panels>
                {children ? children : <>
                    <Tab.Panel>
                        <div className="flex pt-4">
                            {isTextarea ? (
                                <textarea
                                    rows={4}
                                    className="form-textarea"
                                    placeholder="Placeholder"
                                    onChange={(e) => setInput && setInput(e.target.value)}
                                />
                            ) : (
                                <input
                                    className="form-input"
                                    placeholder="Placeholder"
                                    onChange={(e) => setInput && setInput(e.target.value)}
                                />
                            )}
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div>
                            <FileUpload multiple={multipleUpload} onChange={onUploadChange} />
                        </div>
                    </Tab.Panel>
                </>}
            </Tab.Panels>
        </Tab.Group>
    );
};

export default TabPanelComponent;
