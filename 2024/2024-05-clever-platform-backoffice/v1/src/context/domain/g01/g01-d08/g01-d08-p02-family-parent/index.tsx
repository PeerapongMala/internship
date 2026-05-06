import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';
import CWMTab from '@component/web/molecule/cw-m-tab';
import CWOHeaderTableButton from '@component/web/organism/cw-o-header-table-button';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward.tsx';
import IconPlus from '@core/design-system/library/component/icon/IconPlus.tsx';
import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX.tsx';
import IconArchive from '@core/design-system/library/component/icon/IconArchive.tsx';
import API from '@domain/g01/g01-d08/local/api';
import {
  FamilyMemberListByParentResponse,
  ParamsFamilyMemberListByParent,
} from '@domain/g01/g01-d08/local/api/group/admin-family/type.ts';
import StoreGlobal from '@global/store/global';
import { toDateTimeTH } from '@global/utils/date.ts';
import { useNavigate, useParams } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import showMessage from '@global/utils/showMessage';
import CWModalSelectMultiParents from '@domain/g01/g01-d08/local/component/web/template/cw-modal-select-multi-parents';

const FamilyParent = () => {
  const navigator = useNavigate();
  const { familyId } = useParams({ from: '' });

  const [data, setData] = useState<FamilyMemberListByParentResponse[]>([]);
  const [fetching, setFetching] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<
    FamilyMemberListByParentResponse[]
  >([]);
  const [filters, setFilters] = useState<ParamsFamilyMemberListByParent | undefined>({});

  // Modal Start
  const [modalOpen, setModalOpen] = useState(false);
  const [refetch, setRefetch] = useState(false);

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
    <div className="grid w-full grid-cols-5">
      {/* <span>{String(parent.id).padStart(11, '0')}</span> */}
      <span>{parent.user_id}</span>
      <TruncatedText text={parent.line_id} />
      <span>{parent.title}</span>
      <span>{parent.first_name}</span>
      <span>{parent.last_name}</span>
    </div>
  );

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  // Modal End

  // Sidebar
  useEffect((): void => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const fetchFamilyMemberList = async () => {
    setFetching(true);
    try {
      const response = await API.adminFamily.GetFamilyMemberListByParent(
        familyId,
        filters,
      );
      if (response?.status_code === 200) setData(response.data);
    } catch (err) {
      console.error('Error fetching family info (parent):', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchFamilyMemberList();
  }, [familyId, filters]);

  useEffect(() => {
    if (refetch) {
      fetchFamilyMemberList();
      setRefetch(false);
    }
  }, [refetch]);

  // Bulk Edit
  const onBulkEdit = async (): Promise<void> => {
    setFetching(true);
    const userIds = selectedRecords.map((record) => record.user_id);

    try {
      const response = await API.adminFamily.BulkEditMemberListByParent(
        Number(familyId),
        { users: userIds },
      );
      if (response.status_code !== 200) {
        showMessage('ปิดใช้งานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        throw new Error('Failed to update family member');
      }
      showMessage('ปิดใช้งาน', 'success');
      fetchFamilyMemberList();
    } catch (error) {
      console.log('Error:', error);
      showMessage('ปิดใช้งานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
    } finally {
      setFetching(false);
      setSelectedRecords([]);
    }
  };

  // Delete member
  const onDeleteMember = async (userId: string): Promise<void> => {
    setFetching(true);
    try {
      const response = await API.adminFamily.DeleteMemberListByParent(
        Number(familyId),
        userId,
      );
      if (response.status_code !== 200) {
        showMessage('ลบผู้ปกครองไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
        throw new Error('Failed to delete family member');
      }
      showMessage('ลบผู้ปกครองสำเร็จ', 'success');
      fetchFamilyMemberList();
    } catch (error) {
      console.log('Error:', error);
      showMessage('ลบผู้ปกครองไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
    } finally {
      setFetching(false);
    }
  };

  const rowColumns: DataTableColumn<FamilyMemberListByParentResponse>[] = [
    {
      accessor: 'index',
      title: '#',
      render: (_, index: number) => index + 1,
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
      render: (row: FamilyMemberListByParentResponse) => {
        return toDateTimeTH(row.created_at);
      },
    },
    {
      accessor: '',
      title: 'เอาออก',
      render: (row: FamilyMemberListByParentResponse) => (
        <button
          type="button"
          className="w-2 whitespace-nowrap !px-2"
          onClick={() => {
            onDeleteMember(row.user_id);
          }}
        >
          <IconX />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <CWMBreadcrumb
        items={[
          {
            text: 'สำหรับแอดมิน',
            href: '#',
          },
          {
            text: 'จัดการครอบครัว',
            href: '#',
          },
          {
            text: `แก้ไขครอบครัว ${familyId}`,
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
        <span className={'text-2xl font-bold'}>แก้ไขครอบครัว</span>
      </div>

      <div className="panel flex flex-col gap-5">
        <CWMTab
          tabs={[
            {
              name: 'ข้อมูลครอบครัว',
              to: '/admin/family/$familyId/info',
              checkActiveUrl: '/admin/family/*/info',
            },
            {
              name: 'ผู้ปกครอง',
              to: '/admin/family/$familyId/parent',
              checkActiveUrl: '/admin/family/*/parent',
            },
            {
              name: 'นักเรียน',
              to: '/admin/family/$familyId/student',
              checkActiveUrl: '/admin/family/*/student',
            },
          ]}
        />

        <CWOHeaderTableButton
          btnIcon={<IconPlus />}
          btnLabel="เพิ่มผู้ปกครอง"
          onBtnClick={() => {
            openModal();
          }}
          showUploadButton={false}
          showDownloadButton={false}
          inputSearchType="input"
          onSearchChange={(e) => {
            const value = e.currentTarget.value;
            if (value !== '') {
              setFilters((prev) => ({
                ...prev,
                user_id: value,
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                user_id: undefined,
              }));
            }
          }}
          bulkEditDisabled={selectedRecords.length === 0}
          bulkEditActions={[
            {
              label: (
                <div className="flex gap-2">
                  <IconArchive />
                  <div>ปิดใช้งาน</div>
                </div>
              ),
              onClick: onBulkEdit,
            },
          ]}
        />
        <CWModalSelectMultiParents
          open={modalOpen}
          onClose={closeModal}
          renderRow={renderRow}
          title="เลือกผู้ปกครอง"
          mode="edit"
          familyId={familyId}
          setRefetch={setRefetch}
        />

        <DataTable
          className="table-hover whitespace-nowrap"
          records={data}
          columns={rowColumns}
          idAccessor="user_id"
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={setSelectedRecords}
          highlightOnHover
          withTableBorder
          withColumnBorders
          height={'calc(100vh - 350px)'}
          noRecordsText="ไม่พบข้อมูล"
          fetching={fetching}
          loaderType="oval"
          loaderBackgroundBlur={4}
        />
      </div>
    </div>
  );
};

export default FamilyParent;
