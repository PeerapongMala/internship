import PaginationControls from '@global/component/web/cw-pagination/PaginationControl';
import { TAllChat } from '@domain/g03/g03-d11/local/types/chat';
import { TPagination } from '@domain/g01/g01-d09/local/types/pagination';
import { useChatStore } from '@domain/g03/g03-d11/local/stores/chat-list';
import GroupChat from '../../molecule/cw-m-group-chat';

type ListGroupChatProps = {
  chat: TAllChat;
  pagination: TPagination;
  year: string;
  onSelectChat?: (id: string) => void;
  onSetPagination?: (pagination: Partial<TPagination>) => void;
};
const ListGroupChat = ({
  chat,
  pagination,
  year,
  onSelectChat,
  onSetPagination,
}: ListGroupChatProps) => {
  const { currentChatId } = useChatStore();
  const onPageChange = (page: number) => {
    onSetPagination?.({ page: page });
  };

  const handleClickChatRoom = (id: string) => {
    onSelectChat?.(id);
  };
  return (
    <div className="flex h-[70vh] flex-col justify-between">
      <div className="mt-5 flex flex-col gap-3">
        {Object.keys(chat).map(
          (key) =>
            chat[key] &&
            (!year || chat[key].academicYear === Number(year)) && (
              <GroupChat
                key={chat[key].id}
                name={chat[key].chatName}
                latestMessage={chat[key].latestMsg}
                onClick={() => handleClickChatRoom(chat[key].id)}
                type={chat[key].roomType as 'class' | 'group' | 'private' | 'book'}
                isActive={currentChatId === key}
              />
            ),
        )}
      </div>

      {/* <div className="mt-4 flex items-center">
        <PaginationControls
          currentPage={pagination.page}
          totalPages={Math.ceil(pagination.total_count / pagination.limit)}
          onPageChange={onPageChange}
        />
      </div> */}
    </div>
  );
};

export default ListGroupChat;
