import { Avatar } from '@mantine/core';
import IconUser from '@core/design-system/library/component/icon/IconUser';
import React, { useEffect, useState } from 'react';
import IconClass from '@global/asset/icon/class.svg';
import IconGroup from '@global/asset/icon/Group.svg';
import IconBook from '@global/asset/icon/Book.svg';
import CWModalPopup from '@component/web/cw-modal/cw-modal-popup';
import ModalMemberList from '../cw-m-member-list';
import StoreGlobalPersist from '@store/global/persist';
import API from '@domain/g03/g03-d11/local/api';
import { TChatSearchOption } from '@domain/g03/g03-d11/local/types/chat';

type HeaderNameChatProps = {
  headerText?: string;
  subHeaderText?: string | React.ReactNode;
  type: string;
  src: string;
  roomId: string;
  onSearchOptionChange?: (options: TChatSearchOption) => void;
};

const HeaderNameChat = ({
  headerText,
  subHeaderText,
  type,
  src,
  roomId,
  onSearchOptionChange,
}: HeaderNameChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [memberCount, setMemberCount] = useState(0);

  const { userData, targetData, isLoginAs } = StoreGlobalPersist.StateGet([
    'userData',
    'targetData',
    'isLoginAs',
  ]);

  const schoolId = isLoginAs ? targetData?.school_id : userData?.school_id;

  useEffect(() => {
    const fetchMemberCount = async () => {
      setMemberCount(0);
      const id = roomId?.includes(`${type}-`) ? roomId.split(`${type}-`)[1] : undefined;
      if (
        id &&
        (type === 'class' || type === 'subject' || type === 'group' || type === 'private')
      ) {
        const res = await API.chatRepo.GetMemberListApi({
          schoolId,
          roomType: type,
          searchText: '',
          roomId: id,
        });
        if (res?._pagination?.total_count !== undefined) {
          setMemberCount(res._pagination.total_count);
        } else if (Array.isArray(res?.data)) {
          setMemberCount(res.data.length);
        } else {
          setMemberCount(0);
        }
      }
    };

    fetchMemberCount();
  }, [roomId, type]);

  return (
    <>
      <div className="flex flex-row items-center">
        {/* icon */}
        <div className="[&_slot_svg]:h-[30px] [&_slot_svg]:w-[30px]">
          {type === 'class' ? (
            <IconClass />
          ) : type === 'group' ? (
            <IconGroup />
          ) : type === 'private' ? (
            <IconUser />
          ) : (
            <IconBook />
          )}
        </div>

        {/* name */}
        <div className="flex flex-grow flex-col justify-between py-2 pl-2 pr-4">
          <div className="font-nunito text-[14px] text-dark">{headerText}</div>
          <div className="font-nunito text-[12px] text-gray-400">{subHeaderText}</div>
        </div>

        {/* member count button */}
        <button
          className="flex items-center self-center rounded-lg border-2 border-gray-300"
          disabled={memberCount === 0}
          onClick={() => setIsOpen(true)}
        >
          <div className="flex h-8 w-8 items-center justify-center font-bold text-black">
            <IconUser />
          </div>
          {type !== 'private' && (
            <span className="mr-1 font-medium">{memberCount} คน</span>
          )}
        </button>
      </div>

      <div className="mt-1 border-t border-gray-300"></div>

      <ModalMemberList
        open={isOpen}
        onClose={() => setIsOpen(false)}
        type={type}
        roomId={roomId}
        headerText={headerText || ''}
        onSearchOptionChange={onSearchOptionChange}
      />
    </>
  );
};

export default HeaderNameChat;
