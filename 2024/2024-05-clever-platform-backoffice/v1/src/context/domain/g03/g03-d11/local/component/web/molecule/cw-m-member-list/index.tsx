import { Dialog, Transition } from '@headlessui/react';
import React, { useState, Fragment, useEffect, useCallback } from 'react';
import IconClose from '@core/design-system/library/component/icon/IconClose';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useChatStore } from '@domain/g03/g03-d11/local/stores/chat-list';
import API from '@domain/g03/g03-d11/local/api';
import StoreGlobalPersist from '@store/global/persist';
import IconChatDot from '@core/design-system/library/vristo/source/components/Icon/IconChatDots';
import IconUser from '@core/design-system/library/component/icon/IconUser';
import { MListItem, TChatSearchOption } from '@domain/g03/g03-d11/local/types/chat';
import CWInputSearch from '@component/web/cw-input-search';
import CWPagination from '@component/web/cw-pagination';
import { Modal } from '@component/web/cw-modal';
import usePagination from '@global/hooks/usePagination';

export interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  type: string;
  roomId: string;
  headerText: string;
  onSearchOptionChange?: (options: TChatSearchOption) => void;
}

const ModalMemberList = ({
  open,
  onClose,
  type,
  roomId,
  headerText,
  onSearchOptionChange,
}: ModalProps) => {
  const { userData, targetData, isLoginAs } = StoreGlobalPersist.StateGet([
    'userData',
    'targetData',
    'isLoginAs',
  ]);

  const schoolId = isLoginAs ? targetData?.school_id : userData?.school_id;
  const [records, setRecords] = useState<MListItem[]>([]);

  const {
    page,
    pageSize,
    totalCount: totalRecords,
    setPage,
    setPageSize,
    setTotalCount: setTotalRecords,
  } = usePagination();

  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState<string>('');
  const { setCurrentChatId, chatList, fetchChatList } = useChatStore();
  const handleSendMessage = async (user_id: string) => {
    try {
      if (!schoolId) {
        throw new Error('School ID is missing');
      }

      const results = await API.chatRepo.SendMessageFirst({
        school_id: schoolId,
        reciever_id: user_id,
      });

      if (!results) {
        throw new Error('Failed to initiate chat');
      }

      return results;
    } catch (error: any) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };
  const handleStartChat = useCallback(
    async (user_id: string, userName: string) => {
      try {
        const chatId = `private-${user_id}`;

        const searchOptions: TChatSearchOption = {
          name: '',
          roomType: 'all',
          schoolId: schoolId,
        };
        onSearchOptionChange?.(searchOptions);
        await fetchChatList(searchOptions);
        // ถ้ายังไม่มีแชทนี้ใน chatList ให้สร้างใหม่
        if (!chatList[chatId]) {
          await handleSendMessage(user_id);
        }

        // อัปเดต currentChatId และ sessionStorage
        setCurrentChatId(chatId);
        sessionStorage.setItem('currentChatId', chatId);

        // ปิด modal และ reset ค่า
        onClose?.();
        setPage(1);
        setPageSize(10);
        setSearch('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    },
    [handleSendMessage, setCurrentChatId, onClose, chatList],
  );

  const rowColumns: DataTableColumn<MListItem>[] = [
    {
      accessor: 'user_id',
      render: (row) => (
        <div className="flex w-full items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3 [&_svg]:h-[40px] [&_svg]:w-[40px]">
            <IconUser />
            <div className="">
              <p className="text-[16px] font-semibold text-black sm:text-xl">
                {row.first_name} {row.last_name}
              </p>
              <p className="sm:text-md text-[14px] font-light text-[#888EA8]">
                {headerText}
              </p>
            </div>
          </div>
          <button
            className="rounded-lg border border-[#E5E5E5] p-2 hover:border-primary hover:text-primary"
            onClick={() =>
              handleStartChat(row.user_id, `${row.first_name} ${row.last_name}`)
            }
          >
            <IconChatDot />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setFetching(true);
    const fetchData = async () => {
      // const id = roomId.split(`${type}-`)[1];
      const id =
        typeof roomId === 'string' && roomId.includes(`${type}-`)
          ? roomId.split(`${type}-`)[1]
          : undefined;
      if (id) {
        const results = await API.chatRepo.GetMemberListApi({
          schoolId: schoolId,
          roomType: type,
          searchText: search,
          roomId: id,
          pagination: {
            page: page,
            limit: pageSize,
          },
        });
        if (results) {
          console.log('results', results);
          setTotalRecords(results._pagination.total_count);
          setRecords(results.data ?? []);
          setFetching(false);
        } else {
          setTotalRecords(0);
          setRecords([]);
          setFetching(false);
        }
      } else {
        setTotalRecords(0);
        setRecords([]);
        setFetching(false);
      }
    };
    if (type != 'class' && type != 'subject' && type != 'group') {
      setTotalRecords(0);
      setRecords([]);
      setFetching(false);
      return;
    }

    fetchData();
  }, [roomId, search, page, pageSize]);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1); // Reset to first page when page size changes
  };
  return (
    <Modal
      className="h-auto min-h-[220px] w-[850px]"
      open={open}
      onClose={onClose}
      disableCancel
      disableOk
      title={`สมาชิก ${totalRecords}`}
    >
      <div className={``}>
        <div>
          <div className="my-3 px-3">
            <CWInputSearch
              placeholder="ค้นหา"
              onChange={(e) => setSearch(e.currentTarget.value)}
              inputWidth="[100%]"
            />
          </div>
          <DataTable
            fetching={fetching}
            className="table-hover whitespace-nowrap [&_div_div_div_table_thead]:hidden"
            records={records}
            columns={rowColumns}
            highlightOnHover
            withTableBorder
            withColumnBorders
            height={'calc(100vh - 350px)'}
            noRecordsText="ไม่พบข้อมูล"
          />
          <div className="mt-5">
            <CWPagination
              currentPage={page}
              totalPages={Math.ceil(totalRecords / pageSize)}
              onPageChange={handlePageChange}
              pageSize={pageSize}
              setPageSize={handlePageSizeChange}
            />
          </div>
          <div className="mt-5 flex items-center justify-start">
            <button
              type="button"
              className="btn btn-gray border border-primary text-primary"
              onClick={onClose}
            >
              ย้อนกลับ
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalMemberList;
