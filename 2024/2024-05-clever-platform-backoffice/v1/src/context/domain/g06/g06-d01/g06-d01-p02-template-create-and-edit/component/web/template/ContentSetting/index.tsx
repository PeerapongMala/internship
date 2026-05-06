import CWButton from '@component/web/cw-button';
import CWInput from '@component/web/cw-input';
import IconArrowDown from '@core/design-system/library/component/icon/IconArrowDown';
import IconTrash from '@core/design-system/library/component/icon/IconTrash';
import IconSettings from '@core/design-system/library/vristo/source/components/Icon/IconSettings';
import ExampleTable from '@domain/g06/g06-d01/local/component/web/organism/ExampleTable';
import { useEffect, useState } from 'react';
import SettingModal from '../../organism/SettingModal';
import { Subjects } from '@domain/g06/g06-d01/local/api/type';

const ContentSetting = ({ subjects, onContentChange }: contentProps) => {
  const [subject, setSubject] = useState(subjects);

  const [contents, setContent] = useState<content[]>([
    { content_name: undefined, weight: undefined },
  ]);

  const HandleInput = <K extends keyof content>(index: number, key: K, value: any) => {
    const updatedConnections = [...contents];
    updatedConnections[index][key] = value as content[K];
    setContent(updatedConnections);
  };

  useEffect(() => {
    onContentChange?.(contents);
  }, [contents]);

  const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, open, close };
  };

  const [mode, setMode] = useState<'edit' | 'view'>('view');
  const modal = useModal();
  return subject?.map((item, index) => (
    <ul className="mx-auto mb-5 w-full divide-y rounded border bg-white shadow-md">
      <li>
        <details className="group/main">
          <summary className="flex items-center gap-3 px-4 py-4 font-medium marker:content-none hover:cursor-pointer">
            <IconArrowDown className="transition group-open/main:rotate-180" />
            <span className="text-[18px] font-bold">
              วิชาที่ {index + 1}: {item.subject_name}
            </span>
          </summary>

          <article className="px-4 pb-4">
            <ul className="mx-auto mb-5 w-full divide-y rounded border bg-white shadow-md">
              <li>
                <details className="group/sub px-4">
                  <summary className="flex items-center gap-3 px-4 py-4 font-medium marker:content-none hover:cursor-pointer">
                    <IconArrowDown className="transition group-open/sub:rotate-180" />
                    <span className="text-[18px] font-bold">ตัวอย่าง</span>
                  </summary>

                  <article className="border-t-2 px-4 py-4">
                    <ExampleTable />
                  </article>
                </details>
              </li>
            </ul>
            <p className="mb-3 w-full border-b-2 py-5 text-[16px] font-bold">ตัวชี้วัด</p>
            {contents.map((content, index) => (
              <div className="flex w-full items-center gap-2">
                <div className="w-2/5 flex-1">
                  <h1>
                    <span className="text-danger">*</span>ตัวชี้วัด {index + 1}
                  </h1>
                  <CWInput
                    value={content.content_name}
                    placeholder={'ชื่อสาระการเรียนรู้(ดึงข้อมูลมาจาก content creator'}
                    onChange={(e) => HandleInput(index, 'content_name', e.target.value)}
                    required={true}
                  />
                </div>
                <div className="w-2/5 flex-1">
                  <h1>
                    <span className="text-danger">*</span>Weight:
                  </h1>
                  <CWInput
                    value={content.weight}
                    placeholder={'30'}
                    required={true}
                    onChange={(e) => HandleInput(index, 'weight', e.target.value)}
                  />
                </div>
                <div className="w-1/5 items-center">
                  <br />
                  <div className="flex w-full items-center justify-end">
                    {index != 0 && (
                      <button
                        className="ml-5"
                        onClick={() =>
                          setContent([...contents.filter((item, i) => i != index)])
                        }
                      >
                        {' '}
                        <IconTrash />
                      </button>
                    )}
                    <div className="h-14 grow ..."></div>
                    <SettingModal
                      open={modal.isOpen}
                      onClose={modal.close}
                      mode={mode}
                      onMode={(mode: any) => setMode(mode)}
                    />
                    <CWButton
                      className="w-1/10"
                      variant={'primary'}
                      title={'การประเมินคะแนน'}
                      disabled={false}
                      outline={true}
                      icon={<IconSettings />}
                      onClick={modal.open}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-5 border-t-2 pt-5">
              <CWButton
                variant={'primary'}
                title={'เพิ่มสาระการเรียนรู้'}
                disabled={false}
                outline={true}
                onClick={() =>
                  setContent([
                    ...contents,
                    { content_name: undefined, weight: undefined },
                  ])
                }
              />
            </div>
          </article>
        </details>
      </li>
    </ul>
  ));
};

interface content {
  content_name: string | undefined;
  weight: number | undefined;
}

export interface subject {
  subject_name: string;
  is_clever: boolean;
}

interface contentProps {
  subjects?: Subjects[];
  contents?: content[];
  onContentChange?: (contents: content[]) => void;
}

export default ContentSetting;
