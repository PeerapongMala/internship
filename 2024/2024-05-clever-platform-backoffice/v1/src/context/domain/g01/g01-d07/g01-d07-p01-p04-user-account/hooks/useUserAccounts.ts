import { useState, useEffect } from 'react';
import { TabType, statusOptions } from '../constants';
import API from '../../local/api';
import showMessage from '@global/utils/showMessage';
import { useNavigate, useSearch } from '@tanstack/react-router';
import {
  UserAccountResponse,
  ParentsAccountResponse,
  ObserversAccountResponse,
  BulkEditRequest,
  ObserverAccessResponse,
  ObserverQueryParams,
} from '../../local/type';
import AdminUserAccountRestAPI from '../../local/api/group/user-account';
import usePagination from '@global/hooks/usePagination';

interface APIResponse<T> {
  status_code: number;
  data: T;
  _pagination: {
    total_count: number;
  };
}

export const useUserAccounts = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/admin/user-account' });
  const [recordsAdmin, setRecordsAdmin] = useState<UserAccountResponse[]>([]);
  const [recordsParents, setRecordsParents] = useState<UserAccountResponse[]>([]);
  const [recordsObservers, setRecordsObservers] = useState<ObserversAccountResponse[]>(
    [],
  );
  const [recordsContentCreator, setRecordsContentCreator] = useState<
    UserAccountResponse[]
  >([]);
  const { pagination, setPagination } = usePagination();
  const [selectedTab, setSelectedTab] = useState<TabType>('admin');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalCloseDeleteAccount, setModalCloseDeleteAccount] = useState(false);
  const [searchField, setSearchField] = useState<string | number>('id');
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<number | null>(1);
  const [observerAccesses, setObserverAccesses] = useState<ObserverAccessResponse[]>([]);
  const [selectedObserverAccess, setSelectedObserverAccess] = useState<number | null>(
    null,
  );
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(searchValue);

  const fetchAdminUserAccount = async () => {
    try {
      const res = (await API.adminUserAccount.Gets({
        page: pagination.page,
        limit: pagination.limit,
        roles: selectedRole ? [selectedRole] : [],
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        [searchField.toString()]: debouncedSearchValue,
      })) as APIResponse<UserAccountResponse[]>;

      if (res.status_code === 200) {
        setRecordsAdmin(res.data);
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination.total_count,
        }));
      }
    } catch (error) {
      showMessage(`Failed to fetch schools: ${error}`, 'error');
    }
  };

  const fetchParentsAccount = async () => {
    try {
      const res = (await API.adminUserAccount.Gets({
        page: pagination.page,
        limit: pagination.limit,
        roles: [8],
        [searchField.toString()]: debouncedSearchValue,
      })) as APIResponse<UserAccountResponse[]>;
      if (res.status_code === 200) {
        setRecordsParents(res.data);
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination.total_count,
        }));
      }
    } catch (error) {
      showMessage(`Failed to fetch parents account: ${error}`, 'error');
    }
  };

  const fetchObserverAccesses = async () => {
    try {
      const response = await API.observersAccount.GetObserverAccesses();
      if ('data' in response) {
        setObserverAccesses(response.data);
      }
    } catch (error) {
      showMessage(`Failed to fetch observer accesses: ${error}`, 'error');
    }
  };

  const fetchObserversAccount = async () => {
    try {
      const res = await API.observersAccount.Gets({
        page: pagination.page,
        limit: pagination.limit,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        observer_access_id: selectedObserverAccess || undefined,
        [searchField.toString()]: debouncedSearchValue,
      } as ObserverQueryParams);
      if (res.status_code === 200) {
        setRecordsObservers(res.data);
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination.total_count,
        }));
      }
    } catch (error) {
      showMessage(`Failed to fetch observers account: ${error}`, 'error');
    }
  };

  const fetchContentCreatorAccount = async () => {
    try {
      const res = (await API.adminUserAccount.Gets({
        page: pagination.page,
        limit: pagination.limit,
        roles: [2],
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        [searchField.toString()]: debouncedSearchValue,
      })) as APIResponse<UserAccountResponse[]>;
      if (res.status_code === 200) {
        setRecordsContentCreator(res.data);
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination.total_count,
        }));
      }
    } catch (error) {
      showMessage(`Failed to fetch content creator accounts: ${error}`, 'error');
    }
  };

  const handleOpenAccount = async (id: string) => {
    try {
      if (!id) return;

      const res = await API.adminUserAccount.Open(id);
      showMessage('เปิดบัญชีสำเร็จ');

      if (selectedTab === 'parent') {
        fetchParentsAccount();
      } else if (selectedTab === 'admin') {
        fetchAdminUserAccount();
      } else if (selectedTab === 'observer') {
        fetchObserversAccount();
      } else if (selectedTab === 'content-creator') {
        fetchContentCreatorAccount();
      }
    } catch (error) {
      showMessage(`เกิดข้อผิดพลาด: ${error}`, 'error');
    } finally {
      setModalCloseDeleteAccount(false);
    }
  };

  const handleCloseAccount = async () => {
    try {
      if (!selectedUserId) return;

      const res = await API.adminUserAccount.Close(selectedUserId);
      showMessage('ปิดบัญชีสำเร็จ');

      if (selectedTab === 'parent') {
        fetchParentsAccount();
      } else if (selectedTab === 'admin') {
        fetchAdminUserAccount();
      } else if (selectedTab === 'observer') {
        fetchObserversAccount();
      } else if (selectedTab === 'content-creator') {
        fetchContentCreatorAccount();
      }
    } catch (error) {
      showMessage(`เกิดข้อผิดพลาด: ${error}`, 'error');
    } finally {
      setModalCloseDeleteAccount(false);
    }
  };

  const onBulkEdit = async (
    records: UserAccountResponse[],
    newStatus: 'enabled' | 'disabled' | 'draft',
  ): Promise<void> => {
    try {
      const bulkEditData: BulkEditRequest = {
        bulk_edit_list: records.map((record) => ({
          user_id: record.id,
          status: newStatus,
        })),
      };

      await AdminUserAccountRestAPI.BulkEdit(bulkEditData);

      // Refresh the data after successful bulk edit
      if (selectedTab === 'parent') {
        fetchParentsAccount();
      } else if (selectedTab === 'admin') {
        fetchAdminUserAccount();
      } else if (selectedTab === 'observer') {
        fetchObserversAccount();
      } else if (selectedTab === 'content-creator') {
        fetchContentCreatorAccount();
      }
    } catch (error) {
      console.error('Failed to bulk edit user accounts:', error);
      throw error;
    }
  };

  const onDownloadCSV = async (data: Record<string, any>): Promise<void> => {
    try {
      let role: 'admin' | 'parent' | 'observer' | 'content-creator';

      switch (selectedTab) {
        case 'admin':
          role = 'admin';
          break;
        case 'parent':
          role = 'parent';
          break;
        case 'observer':
          role = 'observer';
          break;
        case 'content-creator':
          role = 'content-creator';
          break;
        default:
          throw new Error('Invalid tab selected');
      }

      await API.adminUserAccount.DownloadCSV(role);
      showMessage('ดาวน์โหลด CSV สำเร็จ');
    } catch (error) {
      showMessage(`เกิดข้อผิดพลาดในการดาวน์โหลด CSV: ${error}`, 'error');
    }
  };

  const onUploadCSV = async (file?: File, resetFileInput?: () => void): Promise<void> => {
    try {
      if (!file) {
        throw new Error('No file selected');
      }

      let role: 'admin' | 'parent' | 'observer' | 'content-creator';

      switch (selectedTab) {
        case 'admin':
          role = 'admin';
          break;
        case 'parent':
          role = 'parent';
          break;
        case 'observer':
          role = 'observer';
          break;
        case 'content-creator':
          role = 'content-creator';
          break;
        default:
          throw new Error('Invalid tab selected');
      }

      await API.adminUserAccount.UploadCSV(role, file);
      showMessage('อัปโหลด CSV สำเร็จ');

      // Reset file input
      if (resetFileInput) {
        resetFileInput();
      }

      // Refresh data after successful upload
      if (selectedTab === 'parent') {
        fetchParentsAccount();
      } else if (selectedTab === 'admin') {
        fetchAdminUserAccount();
      } else if (selectedTab === 'observer') {
        fetchObserversAccount();
      } else if (selectedTab === 'content-creator') {
        fetchContentCreatorAccount();
      }
    } catch (error) {
      showMessage(`เกิดข้อผิดพลาดในการอัปโหลด CSV: ${error}`, 'error');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    if (selectedTab === 'parent') {
      fetchParentsAccount();
    } else if (selectedTab === 'admin') {
      fetchAdminUserAccount();
    } else if (selectedTab === 'observer') {
      fetchObserversAccount();
    } else if (selectedTab === 'content-creator') {
      fetchContentCreatorAccount();
    }
  }, [
    selectedTab,
    selectedStatus,
    selectedRole,
    selectedObserverAccess,
    pagination.page,
    pagination.limit,
    searchField,
    debouncedSearchValue,
  ]);

  useEffect(() => {
    if (selectedTab === 'observer') {
      fetchObserverAccesses();
    }
  }, [selectedTab]);

  useEffect(() => {
    if (search && search.role) {
      const roleFromUrl = search.role as string;

      switch (roleFromUrl) {
        case 'parent':
          setSelectedTab('parent');
          break;
        case 'observer':
          setSelectedTab('observer');
          break;
        case 'content-creator':
          setSelectedTab('content-creator');
          break;
        case 'normal':
          setSelectedTab('admin');
          break;
        default:
          setSelectedTab('admin');
      }
    }
  }, [search]);

  return {
    handleOpenAccount,
    selectedStatus,
    setSelectedStatus,
    statusOptions,
    recordsAdmin,
    recordsParents,
    recordsObservers,
    recordsContentCreator,
    pagination,
    setPagination,
    selectedTab,
    setSelectedTab,
    selectedRecords,
    setSelectedRecords,
    selectedUserId,
    setSelectedUserId,
    isModalCloseDeleteAccount,
    setModalCloseDeleteAccount,
    onBulkEdit,
    onDownloadCSV,
    onUploadCSV,
    handleCloseAccount,
    searchField,
    setSearchField,
    searchValue,
    setSearchValue,
    selectedRole,
    setSelectedRole,
    observerAccesses,
    selectedObserverAccess,
    setSelectedObserverAccess,
  };
};
