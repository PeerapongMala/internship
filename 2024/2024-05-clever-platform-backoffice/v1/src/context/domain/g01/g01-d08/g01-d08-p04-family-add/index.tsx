import { useNavigate } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useState } from 'react';

import CWButton from '@component/web/cw-button';
import CWButtonSwitch from '@component/web/cw-button-switch';
import CWModalSelectMultiParents from '@domain/g01/g01-d08/local/component/web/template/cw-modal-select-multi-parents';
import CWSelect from '@component/web/cw-select';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward.tsx';
import IconPlus from '@core/design-system/library/component/icon/IconPlus.tsx';
import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX.tsx';
import { toDateTimeTH } from '@global/utils/date.ts';
import StoreGlobal from '@store/global';
import { FamilyListResponse } from '@domain/g01/g01-d08/local/api/group/admin-family/type';
import API from '@domain/g01/g01-d08/local/api';
import showMessage from '@global/utils/showMessage';
import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

const FamilyAdd = () => {
  const navigator = useNavigate();
  const [dataList, setDataList] = useState<FamilyListResponse[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const time = toDateTimeTH(new Date());

  // Modal Start
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<FamilyListResponse[]>([]);

  const statusOptions = [
    { label: 'แบบร่าง', value: 'draft' },
    { label: 'ใช้งาน', value: 'enabled' },
    { label: 'ไม่ใช้งาน', value: 'disabled' },
  ];
  const TruncatedText = ({
    text,
    maxLength = 15,
  }: {
    text: string | null | undefined;
    maxLength?: number;
  }) => {
    if (!text) return <span>-</span>;
    return (
      <span title={text}>
        {text.length > maxLength ? `${text.substring(0, maxLength)}...` : text}
      </span>
    );
  };

  const renderRow = (parent: any) => (
    <div className="grid w-full grid-cols-5 gap-5">
      <span>{parent.user_id}</span>
      <TruncatedText text={parent.line_id} />
      <span>{parent.title}</span>
      <span>{parent.first_name}</span>
      <span>{parent.last_name}</span>
    </div>
  );

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleSelectItems = (selectedItems: any[]) => {
    setDataList((prev) => {
      // ตรวจสอบ owner มีไหม
      const hasExistingOwner = prev.some((item) => item.is_owner);

      // เพิ่ม is_owner
      const newItems = selectedItems.map((item) => ({
        ...item,
        is_owner: !hasExistingOwner && prev.length === 0, // ถ้าไม่มี owner อยู่และเป็นรายการแรก ให้เป็น true
      }));

      const existingIds = prev.map((item) => item.user_id);
      const uniqueNewItems = newItems.filter(
        (item) => !existingIds.includes(item.user_id),
      );

      return [...prev, ...uniqueNewItems];
    });

    closeModal();
  };
  // Modal End

  // Sidebar
  useEffect((): void => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const rowColumns: DataTableColumn<FamilyListResponse>[] = [
    {
      accessor: 'index',
      title: '#',
      render: (_: any, index: number) => index + 1,
    },

    {
      title: 'รหัสบัญชี',
      accessor: 'user_id',
    },
    {
      title: 'คำนำหน้า',
      accessor: 'title',
    },
    {
      title: 'ชื่อ',
      accessor: 'first_name',
    },
    {
      title: 'สกุล',
      accessor: 'last_name',
    },
    {
      title: 'LINE ID',
      accessor: 'line_id',
    },
    {
      title: 'ใช้งานล่าสุด',
      accessor: 'created_at',
      render: ({ created_at }) => {
        return toDateTimeTH(created_at);
      },
    },
    {
      accessor: 'owner',
      title: 'เจ้าของ',
      render: (row: any, index: number) => {
        return (
          <CWButtonSwitch
            key={`owner-switch-${row.user_id}`}
            initialState={row.is_owner}
            disabledColor="bg-green-400"
            disabled={row.is_owner}
            onChange={(newState) => {
              setDataList((prev) => {
                // ตั้งค่าทุกอันเป็น false
                const updatedItems = prev.map((item) => ({
                  ...item,
                  is_owner: false,
                }));

                // จากนั้นตั้งเฉพาะรายการที่เลือกเป็น true
                updatedItems[index] = {
                  ...updatedItems[index],
                  is_owner: true,
                };

                return updatedItems;
              });
            }}
          />
        );
      },
    },
    {
      accessor: 'delete',
      title: 'เอาออก',
      render: (row: FamilyListResponse) => (
        <button
          type="button"
          className="w-2 whitespace-nowrap !px-2"
          onClick={() => {
            setDataList((prev) => {
              const updatedItems = prev.filter((item) => item.user_id !== row.user_id);

              // ถ้าเหลือเพียง 1 รายการหลังลบ ให้ตั้ง is_owner เป็น true
              if (updatedItems.length === 1) {
                return updatedItems.map((item) => ({
                  ...item,
                  is_owner: true,
                }));
              }

              return updatedItems;
            });
          }}
        >
          <IconX />
        </button>
      ),
    },
  ];

  const handleSaveClick = () => {
    if (!selectedStatus) {
      showMessage('โปรดเลือกสถานะ', 'warning');
      return;
    }
    const users = dataList.map((item) => ({
      user_id: item.user_id,
      is_owner: item.is_owner,
    }));
    const params = {
      users: users,
      status: selectedStatus,
    };

    API.adminFamily
      .SaveAdminFamily(params)
      .then((res) => {
        if (res.status_code === 200) {
          showMessage('บันทึกข้อมูลสำเร็จ', 'success');
          navigator({ to: '/admin/family' });
        } else {
          showMessage('บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        }
      })
      .catch(() => {
        showMessage('บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
      });
  };

  return (
    <div className="flex flex-col gap-5">
      <CWBreadcrumbs
        links={[
          {
            label: 'สำหรับแอดมิน',
            href: '/',
            disabled: true,
          },
          {
            label: 'จัดการครอบครัว',
            href: '/admin/family',
          },
          {
            label: 'เพิ่มครอบครัว',
            href: '/admin/family/add',
          },
        ]}
      />

      <div className={'flex items-center gap-2.5'}>
        <div
          className="cursor-pointer p-2"
          onClick={() => {
            navigator({ to: '/admin/family' });
          }}
        >
          <IconArrowBackward />
        </div>
        <span className={'text-xl font-bold'}>เพิ่มครอบครัว</span>
      </div>

      <div className={'flex items-start gap-5'}>
        <div className="panel flex w-3/4 flex-col gap-5">
          <CWButton
            title="เลือกผู้ปกครอง"
            onClick={() => {
              openModal();
            }}
            className="w-fit"
            icon={<IconPlus />}
          />

          <div className="datatables">
            <DataTable
              className="table-hover whitespace-nowrap"
              records={dataList}
              columns={rowColumns}
              withTableBorder
              withColumnBorders
              height={'calc(100vh - 350px)'}
              noRecordsText={
                isFetching
                  ? 'กำลังโหลด...'
                  : 'ไม่มีข้อมูล กรุณาเลือกผู้ปกครองจากปุ่มด้านบน'
              }
              fetching={isFetching}
            />
          </div>
        </div>
        <div className="panel flex w-1/4 flex-col gap-5">
          <div className="grid w-full grid-cols-2 items-center gap-x-5 gap-y-5">
            <span>รหัสครอบครัว:</span>
            <span>-</span>

            <span>สถานะ</span>
            <div>
              <WCADropdown
                placeholder={
                  selectedStatus
                    ? statusOptions.find((opt) => opt.value === selectedStatus)?.label ||
                    'เลือกสถานะ'
                    : 'เลือกสถานะ'
                }
                options={statusOptions.map((opt) => opt.label)}
                onSelect={(selectedLabel) => {
                  const selectedOption = statusOptions.find(
                    (opt) => opt.label === selectedLabel,
                  );
                  if (selectedOption) {
                    setSelectedStatus(selectedOption.value);
                  }
                }}
              />
            </div>

            <span>แก้ไขล่าสุด</span>
            <span>-</span>

            <span>แก้ไขล่าสุดโดย</span>
            <span>-</span>
            <div className="col-span-2 w-full">
              <CWButton
                onClick={handleSaveClick}
                disabled={selectedStatus === '' || dataList.length === 0}
                title="บันทึก"

              />
            </div>

            {/* <button
              className="btn btn-primary w-full rounded-md py-2 font-bold text-white shadow-2xl"

            >
              บันทึก
            </button> */}
          </div>
        </div>
      </div>
      <CWModalSelectMultiParents
        open={modalOpen}
        onClose={closeModal}
        selectedItems={selectedItems}
        setSelectItems={handleSelectItems}
        renderRow={renderRow}
        title="เลือกผู้ปกครอง"
        mode="add"
      />
    </div>
  );
};

export default FamilyAdd;
