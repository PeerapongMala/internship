import { useState, useEffect } from 'react';
import { TabType } from '../constants';
import API from '../../local/api';
import showMessage from '@global/utils/showMessage';
import { useNavigate } from '@tanstack/react-router';
import AdminUserAccountRestAPI from '../../local/api/group/user-account';
import {
  UserAccountResponse,
  ParentsAccountResponse,
  ObserversAccountResponse,
  BulkEditRequest,
} from '../../local/type';
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
  const [recordsAdmin, setRecordsAdmin] = useState<UserAccountResponse[]>([]);
  const [recordsParents, setRecordsParents] = useState<ParentsAccountResponse[]>([]);
  const [recordsObservers, setRecordsObservers] = useState<ObserversAccountResponse[]>(
    [],
  );
  const [recordsContentCreator, setRecordsContentCreator] = useState<
    UserAccountResponse[]
  >([]);
  const { pagination, setPagination } = usePagination();

  const [selectedTab, setSelectedTab] = useState<TabType>('admin');
  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalCloseDeleteAccount, setModalCloseDeleteAccount] = useState(false);

  const fetchAdminUserAccount = async () => {
    try {
      const res = (await API.adminUserAccount.Gets({
        page: pagination.page,
        limit: pagination.limit,
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
      const res = (await API.parentsAccount.Gets({
        page: pagination.page,
        limit: pagination.limit,
      })) as APIResponse<ParentsAccountResponse[]>;
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

  const fetchObserversAccount = async () => {
    try {
      const res = await API.observersAccount.Gets({
        page: pagination.page,
        limit: pagination.limit,
      });
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
        roles: [2], // Content Creator role
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

  const handleCloseAccount = async () => {
    try {
      if (!selectedUserId) return;

      const res = await API.adminUserAccount.Close(selectedUserId);
      showMessage('ปิดบัญชีสำเร็จ');

      if (selectedTab === 'admin') {
        fetchAdminUserAccount(); // refresh data
      } else if (selectedTab === 'parent') {
        fetchParentsAccount(); // refresh data
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
    // TODO: Implement CSV download
  };

  const onUploadCSV = async (file?: File): Promise<void> => {
    // TODO: Implement CSV upload
  };

  useEffect(() => {
    fetchAdminUserAccount();
  }, []);

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
  }, [selectedTab, pagination.page, pagination.limit]);

  return {
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
  };
};
