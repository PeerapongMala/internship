import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import CWTLayout from '@domain/g01/g01-d05/local/component/web/template/cw-t-layout';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import IconArchive from '@core/design-system/library/component/icon/IconArchive.tsx';
import IconPlus from '@core/design-system/library/component/icon/IconPlus.tsx';
import { useNavigate } from '@tanstack/react-router';
import WCADropdown from '@component/web/atom/wc-a-dropdown/WCADropdown.tsx';
import { UserAccountResponse, ParentsAccountResponse } from '../local/type';
import showMessage from '@global/utils/showMessage';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import API from '../local/api';
import IconSearch from '@component/web/atom/wc-a-icons/IconSearch.tsx';
import ModalAction from '../local/component/web/organism/wc-o-modal-action';
import { AdminTable } from './component/web/template/AdminTable';
import { ParentTable } from './component/web/template/ParentTable';
import { ObserversTable } from './component/web/template/ObserversTable';
import { TabType, tabsList, statusLabels } from './constants';
import { useUserAccounts } from './hooks/useUserAccounts';
import { TableHeader } from './component/web/template/TableHeader';
import { ModalCloseAccount } from './component/web/template/ModalCloseAccount';
import { ContentCreatorTable } from './component/web/template/table-content-creator';
import { USER_ROLE_LABELS } from '../local/type';
import { ModalOpenAccount } from './component/web/template/ModalOpenAccount';

interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  const {
    handleOpenAccount,
    selectedStatus,
    setSelectedStatus,
    statusOptions,
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
    setSearchField,
    setSearchValue,
    recordsAdmin,
    recordsParents,
    recordsObservers,
    recordsContentCreator,
    selectedRole,
    setSelectedRole,
    observerAccesses,
    selectedObserverAccess,
    setSelectedObserverAccess,
  } = useUserAccounts();

  const [selectedOptions, setSelectedOptions] = useState({
    affiliation: '',
  });
  const [affiliationList, setAffiliationList] = useState<string[]>([]);
  const [isModalOpenAccount, setModalOpenAccount] = useState(false);

  function openModalOpenUser(id: string) {
    console.log('id', id);
    setModalOpenAccount(true);
    setSelectedUserId(id);
  }

  const dropdownConfigs: {
    key: keyof typeof selectedOptions;
    options: string[];
    placeholder: string;
  }[] = [
    {
      key: 'affiliation',
      options: affiliationList,
      placeholder: 'ความรับผิดชอบ',
    },
  ];

  return (
    <CWTLayout
      breadcrumbs={[
        { text: 'สำหรับแอดมิน', href: '/', disabled: true },
        { text: 'จัดการผู้ใช้งาน', href: '/' },
      ]}
    >
      <div className="flex flex-col gap-[23px]">
        <div>
          <p className="text-2xl font-bold">จัดการผู้ใช้งาน</p>
        </div>
        <CWMTabs
          items={tabsList.map((t) => t.label)}
          currentIndex={tabsList.findIndex((tab) => tab.key === selectedTab)}
          onClick={(index) => setSelectedTab(tabsList[index].key as TabType)}
        />
      </div>

      <div className="panel flex flex-col gap-5">
        <TableHeader
          selectedRecords={selectedRecords}
          selectedTab={selectedTab}
          onBulkEdit={onBulkEdit}
          onDownloadCSV={onDownloadCSV}
          onUploadCSV={onUploadCSV}
          navigate={navigate}
          setSearchField={setSearchField}
          setSearchValue={setSearchValue}
        />

        {selectedTab === 'admin' && (
          <div className="max-w-[200px]">
            <WCADropdown
              placeholder={
                selectedRole === null ? 'ทั้งหมด' : USER_ROLE_LABELS[selectedRole]
              }
              options={['ทั้งหมด', ...Object.values(USER_ROLE_LABELS)]}
              onSelect={(label: string) => {
                if (label === 'ทั้งหมด') {
                  setSelectedRole(null);
                } else {
                  const roleId = Object.entries(USER_ROLE_LABELS).find(
                    ([_, value]) => value === label,
                  )?.[0];
                  if (roleId) {
                    setSelectedRole(Number(roleId));
                  }
                }
              }}
            />
          </div>
        )}

        {selectedTab !== 'parent' && (
          <CWMTabs
            items={statusOptions.map((option) => option.label)}
            currentIndex={statusOptions.findIndex(
              (option) => option.value === selectedStatus,
            )}
            onClick={(index) => setSelectedStatus(statusOptions[index].value)}
          />
        )}

        {selectedTab === 'admin' && (
          <AdminTable
            onOpen={openModalOpenUser}
            records={recordsAdmin}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            pagination={pagination}
            setPagination={setPagination}
            navigate={navigate}
            onArchive={(user) => {
              setSelectedUserId(user);
              setModalCloseDeleteAccount(true);
            }}
            pathname={location.pathname}
          />
        )}

        {selectedTab === 'parent' && (
          <ParentTable
            onArchive={(user) => {
              setSelectedUserId(user);
              setModalCloseDeleteAccount(true);
            }}
            onOpen={openModalOpenUser}
            records={recordsParents}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            pagination={pagination}
            setPagination={setPagination}
            navigate={navigate}
          />
        )}
        {selectedTab === 'observer' && (
          <div className="max-w-[200px]">
            <WCADropdown
              placeholder="ความรับผิดชอบ"
              options={['ทั้งหมด', ...observerAccesses.map((access) => access.name)]}
              onSelect={(label: string) => {
                if (label === 'ทั้งหมด') {
                  setSelectedObserverAccess(null);
                } else {
                  const access = observerAccesses.find((a) => a.name === label);
                  if (access) {
                    setSelectedObserverAccess(access.id);
                  }
                }
              }}
            />
          </div>
        )}
        {selectedTab === 'observer' && (
          <ObserversTable
            onOpen={openModalOpenUser}
            records={recordsObservers}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            pagination={pagination}
            setPagination={setPagination}
            navigate={navigate}
            onArchive={(user) => {
              setSelectedUserId(user);
              setModalCloseDeleteAccount(true);
            }}
            pathname={location.pathname}
          />
        )}

        {selectedTab === 'content-creator' && (
          <ContentCreatorTable
            onOpen={openModalOpenUser}
            records={recordsContentCreator}
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            pagination={pagination}
            setPagination={setPagination}
            navigate={navigate}
            onArchive={(user) => {
              setSelectedUserId(user);
              setModalCloseDeleteAccount(true);
            }}
            pathname={location.pathname}
          />
        )}
      </div>

      <ModalCloseAccount
        isOpen={isModalCloseDeleteAccount}
        onClose={() => setModalCloseDeleteAccount(false)}
        onAccept={handleCloseAccount}
        selectedUserId={selectedUserId}
      />
      <ModalOpenAccount
        isOpen={isModalOpenAccount}
        onClose={() => setModalOpenAccount(false)}
        onAccept={handleOpenAccount}
        selectedUserId={selectedUserId}
      />
    </CWTLayout>
  );
};

export default DomainJSX;
