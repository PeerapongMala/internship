import { Avatar } from '@component/web/molecule/wc-m-avatar';
import { ERoomType } from '@domain/g03/g03-d07/local/api/helper/chat';
import { TMessage } from '@domain/g03/g03-d07/local/types/msg';
import { cn } from '@global/helper/cn';
import MsgBox from '../../atom/cw-a-msg-box';
import TimeDisplay from '../../atom/cw-a-time-display';

type MsgItemProps = {
  msg: TMessage;
  isShowMsgTime?: boolean;
  isShowAvatar?: boolean;
};

const MsgItem = ({ msg, isShowMsgTime, isShowAvatar }: MsgItemProps) => {
  const isCurrentUserMsg = msg.isLoggedUser;
  const isOtherUserMsg = !isCurrentUserMsg;
  return (
    <div
      // className="flex justify-start"
      className={cn(
        `flex items-center gap-2`,
        isCurrentUserMsg ? 'justify-end' : 'justify-start',
      )}
    >
      {isOtherUserMsg && (
        <Avatar
          user={{
            first_name: msg.firstName,
            last_name: msg.lastName,
            image_url: msg.imgUrl,
          }}
          className="w-12 h-12"
        />
      )}
      <div className="w-full">
        {isOtherUserMsg && msg.message.roomType != ERoomType.PRIVATE && (
          <p className="text-[10px]">
            {msg.firstName} {msg.lastName}
          </p>
        )}

        <div
          className={cn(
            'flex w-full items-end gap-1',
            isCurrentUserMsg && 'flex-row-reverse',
          )}
        >
          <MsgBox content={msg.message.content} isLoggedUser={isCurrentUserMsg} />
          <TimeDisplay inputDate={msg.message.createdAt} type="time" />
        </div>
      </div>
    </div>
    // <div className="flex w-full gap-2">
    //   {!msg.isLoggedUser && <Avatar className="h-12 w-12" src={msg.message.roomType === ERoomType.CLASS ? IconClass : msg.message.roomType === ERoomType.GROUP ? IconGroup : msg.message.roomType === ERoomType.SUBJECT ? msg.imgUrl ?? IconBook : msg.imgUrl ?? IconUser} />}
    //   {/* {!msg.isLoggedUser && <Avatar className="h-12 w-12" />} */}
    //   {/* {!msg.isLoggedUser && isShowAvatar && <Avatar className="h-12 w-12" />} */}

    //   <div
    //     className={`flex h-fit w-full flex-col ${msg.isLoggedUser ? 'items-end' : ''}`}
    //   >
    //     {!msg.isLoggedUser && msg.message.roomType != ERoomType.PRIVATE && <p className='text-[10px]'>{msg.firstName} {msg.lastName}</p>}
    //     <div className="flex flex-col max-w-xs">
    //       <div
    //         className={`rounded-lg px-4 py-2 ${msg.isLoggedUser
    //             ? 'bg-gray-200 text-gray-800'
    //             : 'bg-gray-300 text-gray-800'
    //           }`}
    //       >
    //         <p className="text-sm">{msg.message.content}</p>
    //       </div>
    //       {isShowMsgTime && <TimeDisplay inputDate={msg.message.createdAt} type="time" />}
    //     </div>
    //     {/* <div className={`flex gap-2 items-end ${msg.isLoggedUser ? 'flex-row-reverse' : ''}`}>
    //       <MsgBox content={msg.message.content} isLoggedUser={msg.isLoggedUser} />
    //       {<TimeDisplay inputDate={msg.message.createdAt} type="time" />}
    //       // {/* {isShowMsgTime && <TimeDisplay inputDate={msg.message.createdAt} type="time" />}
    //     </div> */}
    //   </div>
    // </div>
  );
};

export default MsgItem;
