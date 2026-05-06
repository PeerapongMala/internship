import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import CWFormInput from '@domain/g04/g04-d01/local/component/web/cw-form-input';
import { useNavigate } from '@tanstack/react-router';
import { Item, StoreItem } from '../../../api/type';
import { useEffect, useRef, useState } from 'react';
import CWSelect from '@component/web/cw-select';
import { toDateTimeTH } from '@global/utils/date';
import CWButton from '@component/web/cw-button';
import showMessage from '@global/utils/showMessage';

interface CWShopFormLayoutProps {
  type: 'frame' | 'badge' | 'coupon';
  breadcrumbs: {
    label: string;
    href: string;
  }[];
  items: Item[];
  storeItem?: StoreItem;
  onSubmit: (
    data: Pick<
      StoreItem,
      'item_id' | 'initial_stock' | 'price' | 'open_date' | 'closed_date' | 'status'
    >,
  ) => void;
  disbledRole?: 'gm' | 'teacher';
  isSubmitting?: boolean;
}
const CWShopFormLayout = ({
  type,
  breadcrumbs,
  items,
  storeItem,
  onSubmit,
  disbledRole,
  isSubmitting,
}: CWShopFormLayoutProps) => {
  const navigate = useNavigate();
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<StoreItem> & Record<string, any>>({
    item_type: type,
    status: 'pending',
  });
  const [item, setItem] = useState<Item>();
  const validateDates = () => {
    if (formData.closed_date_unlimited) return true;

    if (
      !formData.open_date_unlimited &&
      formData.open_date &&
      !formData.closed_date_unlimited &&
      formData.closed_date
    ) {
      const openDate = new Date(formData.open_date);
      const closedDate = new Date(formData.closed_date);

      if (openDate > closedDate) {
        showMessage('วันที่เริ่มเผยแพร่ต้องไม่มากกว่าวันที่หยุดเผยแพร่', 'warning');
        return false;
      }
      if (closedDate < openDate) {
        showMessage('วันที่หยุดเผยแพร่ต้องไม่น้อยกว่าวันที่เริ่มเผยแพร่', 'warning');
        return false;
      }

      return true;
    }
    return true;
  };
  useEffect(() => {
    if (storeItem) {
      setFormData({
        ...storeItem,
        open_date: storeItem.open_date ? storeItem.open_date.split('T')[0] : '',
        closed_date: storeItem.closed_date ? storeItem.closed_date.split('T')[0] : '',
        open_date_unlimited: storeItem.open_date == null,
        closed_date_unlimited: storeItem.closed_date == null,
        inital_stock_unlimited: storeItem.initial_stock == null,
      });
      setItem(items.find((item) => item.id == storeItem.item_id));
    }
  }, [storeItem]);

  const formEl = useRef<HTMLFormElement>(null);

  const itemTypes = [
    { value: 'frame', label: 'กรอปรูป' },
    { value: 'badge', label: 'โล่' },
    { value: 'coupon', label: 'คูปอง' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <CWBreadcrumbs links={breadcrumbs} />
      <div className="flex items-center gap-4 text-2xl">
        <button
          onClick={() => {
            navigate({ to: `..` });
          }}
        >
          <IconArrowBackward />
        </button>
        <div className="font-bold">{storeItem ? 'แก้ไข' : 'เพิ่ม'}สินค้า</div>
      </div>

      <div className="flex w-full gap-6 *:h-fit *:rounded-lg *:bg-white *:p-4 *:shadow-md">
        <form className="flex-auto rounded-lg bg-white p-4 shadow-md" ref={formEl}>
          <CWFormInput
            data={formData}
            onDataChange={setFormData}
            fields={[
              [
                {
                  key: 'item_type',
                  label: 'ประเภทสินค้า',
                  type: 'select',
                  required: true,
                  value: formData.item_type,
                  options: itemTypes,
                  disabled: !!storeItem || disbledRole === 'teacher',
                  onChange(value) {
                    if (itemTypes.find((t) => t.value == value)) {
                      navigate({ to: `../../${value}/create` });
                    } else {
                      navigate({
                        to: `../../$itemType/create`,
                      });
                    }
                    setItem(undefined);
                    setFormData((prev) => ({
                      ...prev,
                      item_id: '',
                    }));
                  },
                },
                {
                  key: 'item_id',
                  label: 'เลือกไอเทม',
                  type: 'select',
                  required: true,
                  value: formData.item_id,
                  // disabled: !formData.item_type,
                  options: items.map((item) => ({
                    value: item.id.toString(),
                    label: item.name,
                  })),
                  onChange(value) {
                    setItem(items.find((item) => item.id.toString() == value));
                  },
                },
              ],
              [
                {
                  type: 'component',
                  component: (() => {
                    const selectedItem =
                      item ||
                      items.find(
                        (itm) => itm.id.toString() === formData.item_id?.toString(),
                      );

                    return (
                      <div className="flex gap-4 rounded-lg bg-gray-100 p-4">
                        <div className="size-16 rounded-md bg-white">
                          {selectedItem?.image_url && (
                            <img
                              src={selectedItem.image_url}
                              className="h-full w-full"
                              alt=""
                            />
                          )}
                        </div>
                        <div className="flex flex-col justify-between py-1">
                          <div className="text-lg font-bold">
                            {selectedItem?.name ?? 'กรุณาเลือกไอเทม'}
                          </div>
                          <div>
                            {selectedItem ? (
                              <span>
                                รหัสไอเทม: {selectedItem.id} - คำอธิบาย{' '}
                                {selectedItem.description}
                              </span>
                            ) : (
                              <span className="text-gray-500">ยังไม่มีการเลือกไอเทม</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })(),
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
                  text: 'รายละเอียดสินค้า',
                  className: 'font-bold text-lg',
                },
              ],
              [
                {
                  key: 'initial_stock',
                  type: 'number',
                  label: 'จำนวนที่ขายในร้าน',
                  placeholder: '0',
                  required: true,
                  chceckbox: true,
                  chceckboxLabel: 'ไม่จำกัดจำนวน',
                  checkboxKey: 'inital_stock_unlimited',
                  value: formData.initial_stock,
                  onCheckboxChange: (checked) => {
                    setFormData((prev) => ({
                      ...prev,
                      inital_stock_unlimited: checked,
                      initial_stock: checked ? null : prev.initial_stock,
                    }));
                  },
                },
                {
                  key: 'price',
                  type: 'number',
                  placeholder: '0',
                  label: 'ราคา (เหรียญทอง)',
                  required: true,
                  value: formData.price,
                },
                {
                  key: 'open_date',
                  type: 'date',
                  label: 'วันที่เริ่มเผยแพร่',
                  required: true,
                  chceckbox: true,
                  chceckboxLabel: 'เผยแพร่ทันที',
                  checkboxKey: 'open_date_unlimited',
                  value: formData.open_date,
                  onChange: (value) => {
                    if (
                      value &&
                      formData.closed_date &&
                      !formData.closed_date_unlimited &&
                      new Date(value) > new Date(formData.closed_date)
                    ) {
                      showMessage(
                        'วันที่เริ่มเผยแพร่ต้องไม่มากกว่าวันที่หยุดเผยแพร่',
                        'warning',
                      );
                      setFormData((prev) => ({
                        ...prev,
                        open_date: '',
                        open_date_unlimited: false,
                      }));
                      return;
                    }
                    setFormData((prev) => ({
                      ...prev,
                      open_date: value,
                    }));
                  },
                  onCheckboxChange: (checked) => {
                    setFormData((prev) => ({
                      ...prev,
                      open_date_unlimited: checked,
                      open_date: checked ? '' : prev.open_date,
                    }));
                  },
                },
                {
                  key: 'closed_date',
                  type: 'date',
                  label: 'วันที่หยุดเผยแพร่',
                  required: true,
                  chceckbox: true,
                  chceckboxLabel: 'ไม่กำหนด',
                  checkboxKey: 'closed_date_unlimited',
                  value: formData.closed_date,
                  onChange: (value) => {
                    if (
                      value &&
                      formData.open_date &&
                      !formData.open_date_unlimited &&
                      new Date(value) < new Date(formData.open_date)
                    ) {
                      showMessage(
                        'วันที่หยุดเผยแพร่ต้องไม่น้อยกว่าวันที่เริ่มเผยแพร่',
                        'warning',
                      );

                      setFormData((prev) => ({
                        ...prev,
                        closed_date: '',
                        closed_date_unlimited: false,
                      }));
                      return;
                    }

                    setFormData((prev) => ({
                      ...prev,
                      closed_date: value,
                    }));
                  },
                  onCheckboxChange: (checked) => {
                    setFormData((prev) => ({
                      ...prev,
                      closed_date_unlimited: checked,
                      closed_date: checked ? '' : prev.closed_date,
                    }));
                  },
                },
              ],
            ]}
          />
        </form>
        <div className="w-[450px]">
          <div className="grid grid-cols-3 items-center gap-4">
            <div>รหัสสินค้า:</div>
            <div className="col-span-2">{storeItem?.id ?? '-'}</div>
            <div>สถานะ:</div>
            <CWSelect
              className="col-span-2"
              value={formData.status}
              options={[
                { value: 'pending', label: 'รอเผยแพร่' },
                { value: 'enabled', label: 'เผยแพร่' },
                { value: 'expired', label: 'หมดอายุ' },
              ]}
              onChange={(e) => {
                const value = e.currentTarget.value;
                setFormData((prev) => ({
                  ...prev,
                  status: value as StoreItem['status'],
                }));
              }}
            />
            <div>แก้ไขล่าสุด:</div>
            <div className="col-span-2">
              {storeItem?.updated_at ? toDateTimeTH(storeItem.updated_at) : '-'}
            </div>
            <div>แก้ไขล่าสุดโดย:</div>
            <div className="col-span-2">{storeItem?.updated_by_name ?? '-'}</div>
            <div className="col-span-3">
              <CWButton

                title="บันทึก"
                disabled={isSubmitting || localSubmitting}
                onClick={async () => {
                  if (!formData.item_id) {
                    showMessage('โปรดเลือก ไอเทม', 'warning');
                    return;
                  }
                  if (
                    !formData.inital_stock_unlimited &&
                    +(formData.initial_stock ?? 0) <= 0
                  ) {
                    showMessage('โปรดกรอกจำนวนที่ขายในร้าน', 'warning');
                    return;
                  }
                  if (
                    !formData.inital_stock_unlimited &&
                    +(formData.initial_stock ?? 0) < 0
                  ) {
                    showMessage('จำนวนที่ขายต้องไม่ติดลบ', 'warning');
                    return;
                  }
                  if (+(formData.price ?? 0) <= 0) {
                    showMessage('โปรดกำหนด ราคา', 'warning');
                    return;
                  }
                  if (+(formData.price ?? 0) < 0) {
                    showMessage('ราคาต้องไม่ติดลบ', 'warning');
                    return;
                  }
                  if (!formData.open_date && !formData.open_date_unlimited) {
                    showMessage('โปรดกำหนด วันที่เริ่มเผยแพร่', 'warning');
                    return;
                  }
                  if (!formData.closed_date && !formData.closed_date_unlimited) {
                    showMessage('โปรดกำหนด วันที่หยุดเผยแพร่', 'warning');
                    return;
                  }
                  if (!formData.status) {
                    showMessage('โปรดเลือกสถานะ', 'warning');
                    return;
                  }

                  if (
                    formEl.current?.reportValidity() &&
                    !isSubmitting &&
                    !localSubmitting
                  ) {
                    if (!validateDates()) return;

                    setLocalSubmitting(true);

                    try {
                      await onSubmit({
                        item_id: +(formData.item_id ?? ''),
                        initial_stock: formData.inital_stock_unlimited
                          ? null
                          : Math.max(0, +(formData.initial_stock ?? '')),
                        price: +(formData.price ?? ''),
                        open_date: formData.open_date_unlimited
                          ? null
                          : (formData.open_date ?? ''),
                        closed_date: formData.closed_date_unlimited
                          ? null
                          : (formData.closed_date ?? ''),
                        status: formData.status as StoreItem['status'],
                      });
                    } catch (error) {
                      console.error(error);
                    } finally {
                      setLocalSubmitting(false);
                    }
                  }
                }}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CWShopFormLayout;
