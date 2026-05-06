import CWButton from '@component/web/cw-button';
import { Modal } from '@component/web/cw-modal';
import CWSelect from '@component/web/cw-select';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import IconTrash from '@core/design-system/library/component/icon/IconTrash';
import CWTable from '@domain/g04/g04-d02/local/component/web/cw-table';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import { toDateTimeTH } from '@global/utils/date';
import { useEffect, useRef, useState } from 'react';
import CWFormInput from '../cw-form-input';
import API from '../../../api';
import { useParams } from '@tanstack/react-router';
import CWSearchSelect from '../cw-search-select';
import showMessage from '@global/utils/showMessage';
import usePagination from '@global/hooks/usePagination';

interface CWAddedItemRecordsProps {
  onRemove?: (record: AnnounceRewardItem, index: number) => void;
  records: AnnounceRewardItem[];
  coins?: AnnouceRewardCoin;
  onItemSubmit?: (
    record: Pick<
      AnnounceRewardItem,
      'item_id' | 'type' | 'item_name' | 'expired_at' | 'amount'
    >,
  ) => void;
}

const CWAddedItemRecords = function ({
  records,
  onRemove,
  onItemSubmit,
  coins,
}: CWAddedItemRecordsProps) {
  const { schoolId, subjectId } = useParams({ strict: false });

  const {
    page,
    pageSize: limit,
    totalCount: totalRecords,
    setPage,
    setPageSize: setLimit,
    setTotalCount: setTotalRecords,
  } = usePagination();

  const [items, setItems] = useState<DropdownItem[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [filters, setFilters] = useState<{ key: string; value: string }>({
    key: 'id',
    value: '',
  });
  const [selectedItem, setSelectedItem] = useState<DropdownItem>();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const coinTypes = [
    {
      id: 'gold_coin',
      description: 'ใช้ซื้อไอเทมต่างๆ',
      image_url: null,
      name: 'เหรียญทอง',
      type: 'coin',
    },
    {
      id: 'arcade_coin',
      description: '',
      image_url: null,
      name: 'เหรียญเกม Arcade',
      type: 'coin',
    },
  ] as const;

  useEffect(() => {
    if (selectedType == 'coin') {
      let key = (['id', 'name'] as const).find((s) => s == filters.key);
      const _coins: DropdownItem[] = coinTypes
        .filter((t) => !coins?.[t.id])
        .filter((c) => !key || !filters.value || (key && c[key] == filters.value));
      setItems(_coins);
      setTotalRecords(_coins.length);
    } else {
      API.other
        .GetItems({
          school_id: schoolId,
          subject_id: subjectId,
          page,
          limit,
          type: selectedType || undefined,
          [filters.key]: filters.value || undefined,
        })
        .then((res) => {
          if (res.status_code == 200) {
            setItems(res.data);
            setTotalRecords(res._pagination.total_count);
          }
        });
    }
  }, [subjectId, schoolId, page, limit, filters, selectedType]);

  function toItemSelect(record: DropdownItem) {
    const columns = [
      {
        accessor: 'id',
        render: function (record: DropdownItem) {
          return `ID: ${record.id}`;
        },
      },
      {
        accessor: 'image_url',
        className: '!flex-initial w-8',
        render: function (record: DropdownItem) {
          return record.image_url ? <img src={record.image_url} className="w-6" /> : '';
        },
      },
      {
        accessor: 'name',
      },
      {
        accessor: 'description',
      },
    ] as const;

    return columns
      .filter((col) => !(selectedType == 'coin' && col.accessor == 'id'))
      .map((column, index) => {
        return (
          <div
            key={`${column.accessor}-${index}`}
            className={`${'className' in column ? (column.className ?? '') : ''}`}
            onClick={() => setSelectedItem(record)}
          >
            {'render' in column
              ? column.render?.(record)
              : (record[column.accessor] ?? '')}
          </div>
        );
      });
  }

  // step 0: close, 1: select, 2: form
  const [stepItemModal, setStepItemModal] = useState(0);
  function closeModal(reset = true) {
    setStepItemModal(0);
    setSelectedType('');
    setPage(1);
    setLimit(10);
    setFilters({
      key: '',
      value: '',
    });
    if (reset) {
      setSelectedItem(undefined);
    }
  }

  const itemTypes = [
    {
      key: 'frame',
      label: 'กรอปรูป',
    },
    {
      key: 'badge',
      label: 'โล่',
    },
    {
      key: 'coupon',
      label: 'คูปอง',
    },
    {
      key: 'coin',
      label: 'เหรียญ',
    },
  ];

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col gap-5">
      <CWTableTemplate
        className="!bg-transparent !p-0 !shadow-none"
        header={{
          btnIcon: <IconPlus />,
          btnLabel: 'เลือกไอเทม',
          onBtnClick() {
            setStepItemModal(1);
          },
          showBulkEditButton: false,
          showDownloadButton: false,
          showUploadButton: false,
        }}
        table={{
          records: [
            ...coinTypes.reduce<AnnounceRewardItem[]>((prev, type) => {
              if (coins?.[type.id]) {
                prev.push({
                  item_id: type.id,
                  item_description: type.description,
                  amount: coins[type.id] || 0,
                  expired_at: null,
                  item_image_url: null,
                  item_name: type.name,
                  type: type.type,
                  update_at: null,
                  update_by: null,
                });
              }
              return prev;
            }, []),
            ...records,
          ],
          totalRecords,
          minHeight: 400,
          columns: [
            {
              accessor: '#',
              title: '#',
              width: 40,
              render(_, index) {
                return index + 1;
              },
            },
            {
              accessor: 'item_id',
              title: 'รหัสไอเทม',
              render(record, index) {
                return record.type == 'coin' ? '-' : record.item_id;
              },
            },
            {
              accessor: 'type',
              title: 'ประเภทไอเทม',
              render(record, index) {
                const type = itemTypes.find((t) => t.key == record.type);
                return type ? type.label : record.type;
              },
            },
            {
              accessor: 'item_image_url',
              title: 'รูปภาพ',
              render: function (record) {
                return record.item_image_url ? (
                  <img src={record.item_image_url} className="w-6" />
                ) : (
                  ''
                );
              },
            },
            {
              accessor: 'item_name',
              title: 'ชื่อไอเทม',
            },
            {
              accessor: 'amount',
              title: 'จำนวน',
            },
            {
              accessor: 'update_at',
              title: 'แก้ไขล่าสุด',
              render(record, index) {
                return record.update_at ? toDateTimeTH(record.update_at) : '';
              },
            },
            {
              accessor: 'removeBtn',
              title: 'ลบ',
              cellsClassName: 'text-center',
              titleClassName: 'text-center',
              render(record, index) {
                return (
                  <button onClick={() => onRemove?.(record, index)}>
                    <IconTrash />
                  </button>
                );
              },
            },
          ],
        }}
      />

      <Modal
        open={stepItemModal == 1}
        onClose={closeModal}
        title={'เลือกไอเทม'}
        className="w-[1200px]"
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 *:flex-1">
            <CWSelect
              value={selectedType}
              title="หมวดหมู่"
              options={itemTypes.map((type) => ({
                value: type.key,
                label: type.label,
              }))}
              onChange={(e) => {
                const value = e.currentTarget.value;
                setSelectedType(value);
              }}
            />
            <CWSearchSelect
              _key={filters.key}
              options={[
                {
                  label: 'รหัส',
                  value: 'id',
                },
                {
                  label: 'ชื่อ',
                  value: 'name',
                },
              ]}
              onSearchChange={(e) => {
                const value = e.currentTarget.value;
                setFilters((prev) => ({
                  ...prev,
                  value,
                }));
              }}
              onSelectChange={(e) => {
                const value = e.currentTarget.value;
                setFilters((prev) => ({
                  ...prev,
                  key: value,
                }));
              }}
            />
          </div>
          <hr />
          <div>
            <CWTable
              records={items}
              columns={[
                {
                  accessor: 'render',
                  cellsClassName: '!p-0 !py-1',
                  render(record, index) {
                    return (
                      <div
                        className={`flex gap-2 rounded-lg border px-4 py-2 *:flex-1 *:shrink-0 hover:cursor-pointer ${record.id == selectedItem?.id ? 'broder border-primary' : ''}`}
                      >
                        {toItemSelect(record)}
                      </div>
                    );
                  },
                },
              ]}
              options={{
                noHeader: true,
                selectedRecords: undefined,
                // withRowBorders: true,
                highlightOnHover: false,
                onRowClick: ({ record }: { record: DropdownItem }) => {
                  setSelectedItem(record);
                },
                rowClassName: () => `!border-b-0`,
              }}
              page={page}
              onPageChange={setPage}
              limit={limit}
              onLimitChange={setLimit}
              totalRecords={totalRecords}
              minHeight={400}
            />
            <div className="flex justify-between *:min-w-36">
              <CWButton
                outline
                title={'ย้อนกลับ'}
                onClick={() => {
                  closeModal();
                }}
              />
              <CWButton
                disabled={!selectedItem}
                title={'เลือก'}
                onClick={() => {
                  setStepItemModal(2);
                  setFormData({});
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
      {selectedItem && (
        <Modal open={stepItemModal == 2} onClose={() => setStepItemModal(1)}>
          <div className="flex min-w-[500px] flex-col gap-4">
            <div className="flex gap-2 *:flex-1">{toItemSelect(selectedItem)}</div>
            <hr />
            <form ref={formRef}>
              <CWFormInput
                data={formData}
                onDataChange={setFormData}
                fields={[
                  [
                    {
                      key: 'amount',
                      type: 'number',
                      label: 'จำนวน',
                      required: true,
                    },
                  ],
                ]}
              />
            </form>
            <div className="flex justify-between *:min-w-36">
              <CWButton
                outline
                title={'ย้อนกลับ'}
                onClick={() => {
                  setStepItemModal(1);
                }}
              />
              <CWButton
                disabled={!selectedItem}
                title={'ตกลง'}
                onClick={() => {
                  if (formRef.current?.reportValidity()) {
                    onItemSubmit?.({
                      item_id: selectedItem.id,
                      item_name: selectedItem.name,
                      amount: formData.amount,
                      expired_at: formData.expired_at ?? null,
                      type: selectedItem.type,
                    });
                    closeModal(true);
                  }
                }}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CWAddedItemRecords;
