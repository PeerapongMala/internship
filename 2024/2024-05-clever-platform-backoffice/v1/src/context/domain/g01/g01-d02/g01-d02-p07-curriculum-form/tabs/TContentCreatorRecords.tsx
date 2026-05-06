import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import { useEffect, useState } from 'react';
import { ContentCreator } from '../../local/type';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { toDateTimeTH } from '@global/utils/date';
import IconX from '@core/design-system/library/vristo/source/components/Icon/IconX';
import CWSelectRecordsModal from '../component/web/cw-select-records-modal';
import API from '../../local/api';
import downloadCSV from '@global/utils/downloadCSV';
import showMessage from '@global/utils/showMessage';
import usePagination from '@global/hooks/usePagination';

export const TContentCreatorRecords = ({
  curriculumGroupId,
}: {
  curriculumGroupId?: number;
}) => {
  const [records, setRecords] = useState<ContentCreator[]>([]);
  const [searchText, setSearchText] = useState('');
  const [search, setSearch] = useState({
    key: 'id',
    value: '',
  });
  const [searchModal, setSearchModal] = useState({
    key: 'id',
    value: '',
  });

  const {
    page,
    pageSize: limit,
    totalCount: totalRecords,
    setPage,
    setPageSize: setLimit,
    setTotalCount: setTotalRecords,
  } = usePagination();

  const [fetching, setFetching] = useState(false);

  const [contentCreators, setContentCreators] = useState<ContentCreator[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<ContentCreator[]>([]);

  const [selectedContentCreators, setSelectedContentCreators] = useState<
    ContentCreator[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTextModal, setSearchTextModal] = useState('');

  const {
    page: pageModal,
    pageSize: limitModal,
    totalCount: totalRecordsModal,
    setPage: setPageModal,
    setPageSize: setLimitModal,
    setTotalCount: setTotalRecordsModal,
  } = usePagination({ isModal: true });

  const [fetchingModal, setFetchingModal] = useState(false);

  function onDownload(data: { dateFrom: string; dateTo: string }) {
    if (curriculumGroupId) {
      API.contentCreator
        .DownloadCSV(curriculumGroupId, {
          start_date: data.dateFrom ? data.dateFrom + 'T00:00:00Z' : undefined,
          end_date: data.dateTo ? data.dateTo + 'T00:00:00Z' : undefined,
        })
        .then((res) => {
          if (res instanceof Blob) {
            downloadCSV(res, 'content_creators.csv');
          } else {
            showMessage(res.message, 'error');
          }
        });
    }
  }

  function onUpdate(action: 'add' | 'remove', records: ContentCreator[]) {
    if (curriculumGroupId) {
      API.contentCreator
        .Update(
          curriculumGroupId,
          action,
          records.map((record) => record.id),
        )
        .then((res) => {
          if (res.status_code == 200 || res.status_code == 201) {
            if (action == 'remove') {
              showMessage('เอาออกสำเร็จ', 'success');
              setSelectedRecords([]);
            } else {
              showMessage('เพิ่มสำเร็จ', 'success');
              closeModal();
            }
            fetchRecords();
          } else {
            showMessage(res.message, 'error');
          }
        });
    }
  }

  function closeModal() {
    setShowModal(false);
    setSelectedContentCreators([]);
  }

  useEffect(() => {
    fetchRecords();
  }, [page, limit, search]);

  function fetchRecords() {
    if (curriculumGroupId) {
      setFetching(true);
      API.contentCreator
        .Get({
          page,
          limit,
          curriculum_group_id: curriculumGroupId,
          [search.key]: search.value,
        })
        .then((res) => {
          if (res.status_code == 200) {
            setRecords(res.data);
            setTotalRecords(res._pagination.total_count);
          } else {
            showMessage(res.message, 'error');
          }
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }

  useEffect(() => {
    if (showModal) {
      API.contentCreator
        .Get({
          page: pageModal,
          limit: limitModal,
          [searchModal.key]: searchModal.value,
        })
        .then((res) => {
          if (res.status_code == 200) {
            setContentCreators(res.data);
            setTotalRecordsModal(res._pagination.total_count);
          } else {
            showMessage(res.message, 'error');
          }
        });
    }
  }, [showModal, pageModal, limitModal, searchModal]);

  return (
    <>
      <CWTableTemplate
        header={{
          bulkEditActions: [
            {
              label: (
                <div className="flex items-center gap-2">
                  <IconX /> เอาออก
                </div>
              ),
              onClick() {
                onUpdate('remove', selectedRecords);
              },
            },
          ],
          bulkEditDisabled: !selectedRecords.length,
          btnIcon: <IconPlus />,
          btnLabel: 'เพิ่มนักวิชาการ',
          onBtnClick() {
            setShowModal(true);
          },
          inputSearchType: 'input-dropdown',
          onSearchDropdownSelect(selected) {
            setSearch((prev) => ({
              ...prev,
              key: selected.toString(),
            }));
          },
          searchDropdownValue: search.key,
          onSearchChange(e) {
            const value = e.currentTarget.value;
            setSearch((prev) => ({
              ...prev,
              value,
            }));
          },
          searchDropdownOptions: [
            {
              label: 'รหัสบัญชี',
              value: 'id',
            },
            {
              label: 'คำนำหน้า',
              value: 'title',
            },
            {
              label: 'ชื่อ',
              value: 'first_name',
            },
            {
              label: 'สกุล',
              value: 'last_name',
            },
            {
              label: 'อีเมล',
              value: 'email',
            },
          ],
          onDownload: (data) => {
            onDownload?.({
              dateFrom: data.dateFrom || '',
              dateTo: data.dateTo || '',
            });
          },
          showUploadButton: false,
        }}
        table={{
          records,
          minHeight: 400,
          page,
          onPageChange: setPage,
          limit,
          onLimitChange: setLimit,
          totalRecords,
          selectedRecords,
          onSelectedRecordsChange: setSelectedRecords,
          fetching,
          columns: [
            {
              accessor: '#',
              title: '#',
              render(_, index) {
                return index + 1;
              },
            },
            {
              accessor: 'id',
              title: 'รหัสบัญชี',
            },
            {
              accessor: 'title',
              title: 'คำนำหน้า',
            },
            {
              accessor: 'first_name',
              title: 'ชื่อ',
            },
            {
              accessor: 'last_name',
              title: 'สกุล',
            },
            {
              accessor: 'email',
              title: 'อีเมล',
            },
            {
              accessor: 'last_login',
              title: 'แก้ไขล่าสุด',
              render(record, index) {
                return record.last_login ? toDateTimeTH(record.last_login) : '';
              },
            },
            {
              accessor: 'removeBtn',
              title: 'เอาออก',
              width: 80,
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              render(record, index) {
                return (
                  <button
                    onClick={() => {
                      onUpdate('remove', [record]);
                    }}
                  >
                    <IconX duotone={false} />
                  </button>
                );
              },
            },
          ],
        }}
      />

      <CWSelectRecordsModal
        open={showModal}
        title="เลือกนักวิชาการ"
        onClose={closeModal}
        onSubmit={() => {
          onUpdate('add', selectedContentCreators);
        }}
        search={{
          type: 'select',
          key: searchModal.key,
          onSearchChange(value) {
            setSearchModal((prev) => ({
              ...prev,
              value,
            }));
          },
          onSelectChange(key) {
            setSearchModal((prev) => ({
              ...prev,
              key,
            }));
          },
          options: [
            {
              label: 'รหัสบัญชี',
              value: 'id',
            },
            {
              label: 'คำนำหน้า',
              value: 'title',
            },
            {
              label: 'ชื่อ',
              value: 'first_name',
            },
            {
              label: 'สกุล',
              value: 'last_name',
            },
            {
              label: 'อีเมล',
              value: 'email',
            },
          ],
        }}
        columns={[
          {
            accessor: 'id',
          },
          {
            accessor: 'title',
          },
          {
            accessor: 'first_name',
          },
          {
            accessor: 'last_name',
          },
        ]}
        records={contentCreators}
        minHeight={400}
        selectedRecords={selectedContentCreators}
        onSelectedRecordsChange={setSelectedContentCreators}
        page={pageModal}
        onPageChange={setPageModal}
        limit={limitModal}
        onLimitChange={setLimitModal}
        totalRecords={totalRecordsModal}
      />
    </>
  );
};

export default TContentCreatorRecords;
