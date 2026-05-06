import { useState } from 'react';
import {
  Modal,
  ModalProps,
} from '../../../../../../../../core/design-system/library/vristo/source/components/Modal';
import showMessage from '@global/utils/showMessage';
import StoreGlobalPersist from '@store/global/persist';

interface ModalChatProps extends ModalProps {
  open: boolean;
  onClose: () => void;
  receivers?: string[];
  subjectId?: string;
  selectedStudents?: {
    title: string;
    first_name: string;
    last_name: string;
  }[];
}

const ModalChat = ({
  open,
  onClose,
  children,
  onOk,
  receivers,
  subjectId,
  selectedStudents,
  ...rest
}: ModalChatProps) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const { userData } = StoreGlobalPersist.StateGet(['userData']);
  const { targetData } = StoreGlobalPersist.StateGet(['targetData']);
  const schoolId = userData?.school_id ?? targetData?.school_id;
  const getReceiverCount = () => {
    if (receivers && receivers.length > 0) {
      return receivers.length;
    }
    return subjectId ? 1 : 0;
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      showMessage('กรุณากรอกข้อความ', 'warning');
      return;
    }

    // check receivers not zero
    let roomIdList: string[] = [];
    if (!receivers || receivers.length === 0) {
      if (!subjectId) {
        showMessage('กรุณาเลือกผู้รับ', 'error');
        return;
      } else {
        roomIdList = [subjectId];
      }
    } else {
      roomIdList = receivers;
    }

    // check scoolId not zero
    if (!schoolId) {
      showMessage('ไม่พบข้อมูลโรงเรียน', 'error');
      return;
    }
    // // check selectedStudents not zero
    // if (!selectedStudents || selectedStudents.length === 0) {
    //   showMessage('กรุณาเลือกนักเรียน', 'error');
    //   return;
    // }

    setIsSending(true);

    const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
    const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;
    const WS_BACKEND_URL = import.meta.env.VITE_WS_BASE_URL;
    // // api get chatroom from user id

    // let roomIdList: string[] = [];
    // try {
    //   const payload = {
    //     users_id: subjectId ? [subjectId] : receivers,
    //   };

    //   const response = await fetch(`${BACKEND_URL}/teacher-chat/v1/${schoolId}/rooms`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //     body: JSON.stringify(payload),
    //   });

    // if (!response.ok) {
    //     throw new Error('Failed to get chat room');
    //   }

    //   console.log('response',await response.json());
    //   roomIdList = (await response.json()).room_id;
    //   console.log('roomIdList', roomIdList);
    // } catch (error) {

    //   console.error('Error getting chat room:', error);
    // }

    // for (const roomId of roomIdList) {
    //   console.log('roomId', roomId);
    //   let url =
    //   WS_BACKEND_URL +
    //   '/teacher-chat/v1/ws/school/:school_id/room/:room_type/id/:room_id?&token=:access_token';
    //   url = url.replace(':school_id', schoolId);
    //   url = url.replace(':room_type', 'private');
    //   url = url.replace(':room_id', roomId);
    //   url = url.replace(':access_token', accessToken);

    //   await new Promise<void>((resolve, reject) => {
    //   const ws = new WebSocket(url);

    //   ws.onclose = () => {
    //     // console.log('WebSocket disconnected');
    //     resolve();
    //   };

    //   ws.onerror = (error) => {
    //     // console.error('WebSocket error:', error);
    //     showMessage('เกิดข้อผิดพลาดในการส่งข้อความ', 'error');
    //     ws.close();
    //     reject(error);
    //   };

    //   ws.onopen = () => {
    //     // console.log('WebSocket connected');
    //     ws.send(message.trim());
    //     showMessage('ส่งข้อความสำเร็จ', 'success');
    //     setMessage('');
    //     onClose();
    //     ws.close();
    //     setIsSending(false);
    //   };
    //   });
    // }

    // send massage with feltch

    try {
      const payload = {
        message: message.trim(),
        // subjectId is selectedId.user_id
        users_id: subjectId ? [subjectId] : receivers,
        // || [subjectId],
      };
      const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;
      const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

      const response = await fetch(
        `${BACKEND_URL}/teacher-chat/v1/send-message/${schoolId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      showMessage('ส่งข้อความสำเร็จ', 'success');
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      showMessage('เกิดข้อผิดพลาดในการส่งข้อความ', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal
      className="w-[400px]"
      open={open}
      onClose={onClose}
      onOk={onOk}
      disableCancel
      disableOk
      title="แชท"
      {...rest}
    >
      <div className="flex flex-col gap-5">
        <p className="text-sm">จำนวน: {getReceiverCount()} คน</p>

        <div className="flex flex-col gap-2">
          {selectedStudents?.map((student, idx) => (
            <p key={idx} className="text-sm">
              {student.title} {student.first_name} {student.last_name}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm">ข้อความ</p>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="form-textarea max-h-[150px] min-h-[100px]"
            placeholder="พิมพ์ข้อความ"
            disabled={isSending}
          />
        </div>
      </div>
      <div className="mt-4 flex w-full justify-center gap-5">
        <button
          onClick={onClose}
          className="btn btn-outline-dark flex w-full gap-2"
          disabled={isSending}
        >
          ยกเลิก
        </button>
        <button
          onClick={handleSendMessage}
          className="btn btn-primary flex w-full gap-2"
          disabled={isSending}
        >
          {isSending ? 'กำลังส่ง...' : 'ส่ง'}
        </button>
      </div>
    </Modal>
  );
};

export default ModalChat;
