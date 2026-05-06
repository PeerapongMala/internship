import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import CWTCreateLayout from '../template/cw-t-create-layout';
import CWFormInput from '@domain/g04/g04-d01/local/component/web/cw-form-input';
import CWAInputLabel from '@domain/g01/g01-d05/local/component/web/atom/cw-a-input-label';
import CWAPolaroid from '../atom/cw-a-polaroid';
import CWMInputFileButton from '../molecule/cw-m-input-file-button';
import showMessage from '@global/utils/showMessage';
import { template } from 'lodash';

interface CWItemFormPageProps {
  translationKey: string;
  itemType: ItemType;
  breadcrumbs: { text: string; href: string }[];
  item?: Item;
  onSubmit(formData: Partial<Item>): void;
  view?: 'teacher' | 'gm';
  templates?: Item[];
  disbledRole?: 'gm' | 'teacher';
  school_id?: string;
}

const CWItemFormPage = function ({
  translationKey,
  itemType,
  breadcrumbs,
  item,
  onSubmit,
  view = 'gm',
  templates = [],
  disbledRole,
  school_id,
}: CWItemFormPageProps) {
  const { t } = useTranslation([translationKey]);
  const navigate = useNavigate();

  const backgroundURLs = [
    '/assets/images/badge/badge-bg-1/badge-bg-1-1.png',
    '/assets/images/badge/badge-bg-1/badge-bg-1-2.png',
    '/assets/images/badge/badge-bg-1/badge-bg-1-3.png',
    '/assets/images/badge/badge-bg-1/badge-bg-1-4.png',
    '/assets/images/badge/badge-bg-1/badge-bg-1-5.png',
    '/assets/images/badge/badge-bg-2/badge-bg-2-1.png',
    '/assets/images/badge/badge-bg-2/badge-bg-2-2.png',
    '/assets/images/badge/badge-bg-2/badge-bg-2-3.png',
    '/assets/images/badge/badge-bg-2/badge-bg-2-4.png',
    '/assets/images/badge/badge-bg-2/badge-bg-2-5.png',
    '/assets/images/badge/badge-bg-3/badge-bg-3-1.png',
    '/assets/images/badge/badge-bg-3/badge-bg-3-2.png',
    '/assets/images/badge/badge-bg-3/badge-bg-3-3.png',
    '/assets/images/badge/badge-bg-3/badge-bg-3-4.png',
    '/assets/images/badge/badge-bg-3/badge-bg-3-5.png',
    '/assets/images/badge/badge-bg-4/badge-bg-4-1.png',
    '/assets/images/badge/badge-bg-4/badge-bg-4-2.png',
    '/assets/images/badge/badge-bg-4/badge-bg-4-3.png',
    '/assets/images/badge/badge-bg-4/badge-bg-4-4.png',
    '/assets/images/badge/badge-bg-4/badge-bg-4-5.png',
    '/assets/images/badge/badge-bg-5/badge-bg-5-1.png',
    '/assets/images/badge/badge-bg-5/badge-bg-5-2.png',
    '/assets/images/badge/badge-bg-5/badge-bg-5-3.png',
    '/assets/images/badge/badge-bg-5/badge-bg-5-4.png',
    '/assets/images/badge/badge-bg-5/badge-bg-5-5.png',
  ];
  const iconURLs = [
    '/assets/images/badge/badge-img-0/badge-img-0-1.png',
    '/assets/images/badge/badge-img-0/badge-img-0-2.png',
    '/assets/images/badge/badge-img-0/badge-img-0-3.png',
    '/assets/images/badge/badge-img-0/badge-img-0-4.png',
    '/assets/images/badge/badge-img-1/badge-img-1-1.png',
    '/assets/images/badge/badge-img-1/badge-img-1-2.png',
    '/assets/images/badge/badge-img-1/badge-img-1-3.png',
    '/assets/images/badge/badge-img-1/badge-img-1-4.png',
    '/assets/images/badge/badge-img-2/badge-img-2-1.png',
    '/assets/images/badge/badge-img-2/badge-img-2-2.png',
    '/assets/images/badge/badge-img-2/badge-img-2-3.png',
    '/assets/images/badge/badge-img-2/badge-img-2-4.png',
    '/assets/images/badge/badge-img-3/badge-img-3-1.png',
    '/assets/images/badge/badge-img-3/badge-img-3-2.png',
    '/assets/images/badge/badge-img-3/badge-img-3-3.png',
    '/assets/images/badge/badge-img-3/badge-img-3-4.png',
    '/assets/images/badge/badge-img-4/badge-img-4-1.png',
    '/assets/images/badge/badge-img-4/badge-img-4-2.png',
    '/assets/images/badge/badge-img-4/badge-img-4-3.png',
    '/assets/images/badge/badge-img-4/badge-img-4-4.png',
    '/assets/images/badge/badge-img-5/badge-img-5-1.png',
    '/assets/images/badge/badge-img-5/badge-img-5-2.png',
    '/assets/images/badge/badge-img-5/badge-img-5-3.png',
    '/assets/images/badge/badge-img-5/badge-img-5-4.png',
  ];

  const [imageSize] = useState(5);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [backgroundURL, setBackgroundURL] = useState<string>('');
  const [iconURL, setIconURL] = useState<string>('');
  const [imageURLs, setImageURLs] = useState<string[]>(iconURLs);

  useEffect(() => {
    setImageURLs((prev) =>
      [...prev, ...templates.map((t) => t.image_url)].reduce<string[]>((_prev, image) => {
        if (!_prev.includes(image)) {
          _prev.push(image);
        }
        return _prev;
      }, []),
    );
  }, []);

  const [formData, setFormData] = useState<Partial<Item>>({
    school_id: school_id,
    type: itemType,
    status: 'draft',
  });

  const itemTypes = [
    {
      key: 'frame',
      label: 'กรอบรูป',
    },
    {
      key: 'badge',
      label: 'โล่',
    },
    {
      key: 'coupon',
      label: 'คูปอง',
    },
  ];

  const statuses = [
    {
      key: 'draft',
      label: 'แบบร่าง',
      className: 'badge-outline-dark',
    },
    {
      key: 'enabled',
      label: 'ใช้งาน',
      className: 'badge-outline-success',
    },
    {
      key: 'disabled',
      label: 'ไม่ใช้งาน',
      className: 'badge-outline-danger',
    },
  ] as const;

  useEffect(() => {
    if (item) {
      setFormData(item);
      setIconURL(item.image_url || '');
      setBackgroundURL(item.template_path || '');
    }
  }, [item]);

  useEffect(() => {
    setIconURL('');
    setBackgroundURL('');
    setImageFile(undefined);
  }, [formData.type]);

  useEffect(() => {
    setIconURL('');
  }, [imageFile]);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <CWTCreateLayout
      {...item}
      status={formData.status}
      breadcrumbs={breadcrumbs}
      navigateLabel={`${item ? 'แก้ไข' : 'สร้าง'}ไอเทม`}
      navigateTo=".."
      statusOptions={statuses.map((s) => ({
        label: s.label,
        value: s.key,
      }))}
      onStatusChange={(status) => {
        const _status = statuses.find((s) => s.key == status)?.key;
        setFormData((prev) => ({
          ...prev,
          status: _status ?? 'draft',
        }));
      }}
      buttonLabel={'บันทึก'}
      onSubmit={() => {
        if (formRef.current?.reportValidity()) {
          if (
            (imageFile || iconURL) &&
            (formData.type != 'badge' || (formData.type == 'badge' && backgroundURL))
          ) {
            onSubmit({
              ...formData,
              image: imageFile,
              image_url: iconURL || '',
              template_path: itemType == 'badge' ? backgroundURL : undefined,
              template_item_id:
                view == 'teacher' ? formData.template_item_id || undefined : undefined,
            });
          } else {
            showMessage('กรุณาอัปโหลด/เลือกรูปภาพ', 'warning');
          }
        }
      }}
    >
      <form ref={formRef} className="flex flex-col gap-4">
        <CWFormInput
          data={formData}
          onDataChange={setFormData}
          fields={[
            [
              {
                key: 'type',
                type: 'select',
                label: 'ประเภทไอเทม',
                options: itemTypes.map((type) => ({
                  label: type.label,
                  value: type.key,
                })),
                required: true,
                value: item?.type ?? itemType,
                disabled: !!item || disbledRole === 'teacher',
                onChange(value) {
                  if (value) {
                    navigate({ to: `../../${value}/create` });
                  }
                },
              },
              {
                type: 'blank',
                hidden: view == 'teacher',
              },
              {
                key: 'template_item_id',
                type: 'select',
                label: 'เลือกรูปแบบ (Template)',
                hidden: view == 'gm',
                options: templates.map((item) => ({
                  label: item.name,
                  value: item.id.toString(),
                })),
                onChange(value) {
                  const template = templates.find((template) => template.id == +value);
                  if (template) {
                    setImageFile(undefined);
                    setBackgroundURL(template.template_path || '');
                    setIconURL(template.image_url || '');
                    setFormData((prev) => ({
                      ...prev,
                      image_url: template?.image_url || '',
                      name: template?.name || '',
                      badge_description: template?.badge_description || '',
                      description: template?.description || '',
                    }));
                  }
                },
              },
            ],
            [
              {
                type: 'border',
              },
            ],
            [
              {
                type: 'label',
                text: <div className="flex-1 font-bold">รายละเอียด</div>,
              },
            ],
            [
              {
                key: 'name',
                type: 'text',
                label: 'ชื่อไอเทม',
                required: true,
              },
              {
                type: 'blank',
                hidden: !(itemType == 'coupon' || itemType == 'frame'),
              },
              {
                key: 'badge_description',
                type: 'text',
                label: 'ข้อความที่แสดงในโล่',
                required: true,
                hidden: !(itemType == 'badge'),
              },
            ],
            [
              {
                key: 'description',
                type: 'text',
                label: 'คำอธิบาย',
              },
            ],
          ]}
        />
        {itemType == 'badge' ? (
          <>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <CWAInputLabel required>พื้นหลัง</CWAInputLabel>
                <div className="flex w-full gap-6 overflow-y-auto">
                  {backgroundURLs.map((bgURL, index) => (
                    <button
                      className={`mb-2 ${backgroundURL == bgURL ? 'border-2 border-primary shadow-lg' : ''}`}
                      key={`bg-${index}`}
                      onClick={() => {
                        setBackgroundURL(bgURL);
                      }}
                      type="button"
                    >
                      <CWAPolaroid header={<img src={bgURL} alt="" className="h-20" />} />
                    </button>
                  )) ?? <div className="w-full py-8 text-center">ไม่มีรายการ</div>}
                </div>
              </div>
              <div className="flex w-full flex-col gap-2">
                <CWAInputLabel required>รูปโล่</CWAInputLabel>
                <div className="flex w-full gap-6 overflow-y-auto">
                  {imageURLs.map((_iconURL, index) => (
                    <button
                      className={`mb-2 ${_iconURL == iconURL ? 'border-2 border-primary shadow-lg' : ''}`}
                      key={`icon-${index}`}
                      onClick={() => {
                        if (_iconURL == iconURL) {
                          setIconURL('');
                        } else {
                          setImageFile(undefined);
                          setIconURL(_iconURL);
                        }
                      }}
                      type="button"
                    >
                      <CWAPolaroid header={<img src={_iconURL} className="h-20" />} />
                    </button>
                  )) ?? <div className="w-full py-8 text-center">ไม่มีรายการ</div>}
                </div>
                <div className="text-sm text-dark">
                  format: .jpg, .png | ขนาดไม่เกิน {imageSize} MB
                </div>
              </div>
              <CWMInputFileButton
                label={'อัปโหลด'}
                onFileChange={setImageFile}
                accept="image/jpeg, image/png"
                size={imageSize}
                file={imageFile || formData.image_url}
                preview={!!imageFile}
              />
            </div>
            <hr />
            <CWAPolaroid
              body={`ตัวอย่าง: ${formData.badge_description ?? ''}`}
              headerClassName="!h-36"
              header={
                (imageFile || iconURL || formData.image_url) &&
                backgroundURL && (
                  <>
                    <div className="relative flex items-center justify-center">
                      <img src={backgroundURL} alt="" className="h-20" />
                      <div className="absolute flex w-full flex-grow items-center justify-center">
                        <div className="flex w-full flex-nowrap gap-2 overflow-hidden">
                          <img
                            src={
                              imageFile
                                ? URL.createObjectURL(imageFile)
                                : iconURL || formData.image_url || ''
                            }
                            className="!size-16 shrink-0 object-cover"
                          />
                          <div className="flex w-full flex-[1_1_auto] items-center overflow-hidden">
                            <div className="w-full -translate-y-1 truncate pe-3 text-center text-lg font-bold">
                              {formData.badge_description}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )
              }
            />
          </>
        ) : (
          <div className="flex">
            <div className="flex flex-col gap-2">
              <div>
                <CWAInputLabel required>รูปไอเทม</CWAInputLabel>
                <div className="text-sm text-dark">
                  format: .jpg, .png | ขนาดไม่เกิน {imageSize} MB
                </div>
              </div>
              <CWMInputFileButton
                label={'อัปโหลด'}
                onFileChange={setImageFile}
                accept="image/jpeg, image/png"
                size={imageSize}
                file={imageFile || formData.image_url || iconURL}
              />
            </div>
          </div>
        )}
      </form>
    </CWTCreateLayout>
  );
};

export default CWItemFormPage;
