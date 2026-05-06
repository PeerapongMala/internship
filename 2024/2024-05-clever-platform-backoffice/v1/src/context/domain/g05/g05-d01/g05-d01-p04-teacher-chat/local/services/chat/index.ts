import StoreGlobalPersist from '@store/global/persist';
import { TRoomType } from '../../types/chat';
import { TWsChatRes } from './helper/chat';

const WS_BACKEND_URL = import.meta.env.VITE_WS_BASE_URL;

export class ChatService {
  socket: WebSocket | null = null;
  private listeners: ((data: any) => void)[] = [];
  private closeCallbacks: (() => void)[] = [];
  private url: string;

  schoolId: string;
  roomType: TRoomType;
  roomId: string;
  channelID: string;
  uniqueID: string;
  channel: BroadcastChannel | null = null;
  isBroadcastSupported: boolean = false;

  constructor(
    schoolId: string,
    roomType: TRoomType,
    roomId: string,
    accessToken: string,
  ) {
    this.url =
      WS_BACKEND_URL +
      '/teacher-chat/v1/ws/school/:school_id/room/:room_type/id/:room_id?&token=:access_token';
    // '/teacher-chat/v1/teacher/ws/school/:school_id/room/:room_type/id/:room_id?token=:access_token';
    this.url = this.url.replace(':school_id', schoolId);
    this.url = this.url.replace(':room_type', roomType);
    this.url = this.url.replace(':room_id', roomId.split(`${roomType}-`)[1]);
    // this.url = this.url.replace(':room_id', roomId);
    this.url = this.url.replace(':access_token', accessToken);

    this.schoolId = schoolId;
    this.roomType = roomType;
    this.roomId = roomId;

    const userID = StoreGlobalPersist.StateGetAllWithUnsubscribe().userData?.id;
    this.channelID =
      userID +
      '-' +
      this.schoolId +
      '-' +
      this.roomType +
      '-' +
      this.roomId.split(`${this.roomType}-`)[1];
    // console.log('this.channelID', this.channelID);

    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
    this.uniqueID = generateUUID();

    // Initialize BroadcastChannel if supported
    this.isBroadcastSupported = typeof BroadcastChannel !== 'undefined';
    if (this.isBroadcastSupported) {
      try {
        this.channel = new BroadcastChannel(this.channelID);
        this.setupBroadcastChannel();
      } catch (error) {
        console.error('Error setting up BroadcastChannel:', error);
        this.isBroadcastSupported = false;
      }
    }
  }

  private setupBroadcastChannel() {
    if (!this.channel) return;

    this.channel.onmessage = (event) => {
      console.log('Received message from channel:', event.data);
      // Make sure we're not processing messages sent by this tab
      if (
        event.data &&
        event.data.type === 'WS_MESSAGE' &&
        event.data.sender !== this.uniqueID
      ) {
        console.log('Processing message from another tab:', event.data.data);
        // Notify all listeners about the message received from another tab
        this.listeners.forEach((listener) => {
          console.log('Notifying listener about message from another tab');
          listener(event.data.data);
        });
      }
    };
    this.channel.postMessage({
      type: 'WS_STATUS',
      status: 'connected',
      sender: this.uniqueID,
    });
  }

  connect() {
    this.socket = new WebSocket(this.url);
    console.log('WebSocket :', this.socket);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);

        // Broadcast the message to other tabs if BroadcastChannel is supported
        if (this.isBroadcastSupported && this.channel) {
          const messageToPost = {
            type: 'WS_MESSAGE',
            data: data,
            sender: this.uniqueID,
            timestamp: new Date().getTime(),
          };
          console.log('Broadcasting message to other tabs:', messageToPost);
          this.channel.postMessage(messageToPost);
        }

        // Notify listeners in this tab
        console.log(
          'Notifying listeners in current tab, listener count:',
          this.listeners.length,
        );
        this.listeners.forEach((listener) => listener(data));
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.socket = null;
      this.closeCallbacks.forEach((callback) => callback());
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error', error);
    };
  }

  public observeSchoolChats(schoolId: string, accessToken: string) {
    const url =
      WS_BACKEND_URL +
      '/teacher-chat/v1/ws/observe/:school_id?token=:access_token'
        .replace(':school_id', schoolId)
        .replace(':access_token', accessToken);

    // ปิดการเชื่อมต่อเดิมถ้ามี
    if (this.socket) {
      this.close();
    }

    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received observation update:', data);

        // Broadcast ไปยังทุกแท็บ
        if (this.isBroadcastSupported && this.channel) {
          this.channel.postMessage({
            type: 'CHAT_OBSERVATION',
            data: data,
            sender: this.uniqueID,
          });
        }

        // Notify listeners
        this.listeners.forEach((listener) => listener(data));
      } catch (error) {
        console.error('Error processing observation message:', error);
      }
    };
  }

  sendMessage(message: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.warn('WebSocket is not connected.');
    }
  }

  addListener(callback: (data: TWsChatRes) => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: (data: TWsChatRes) => void) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  addCloseListener(callback: () => void) {
    this.closeCallbacks.push(callback);
  }

  removeCloseListener(callback: () => void) {
    this.closeCallbacks = this.closeCallbacks.filter((cb) => cb !== callback);
  }

  close() {
    if (this.channel) {
      try {
        this.channel.close();
      } catch (error) {
        console.error('Error closing BroadcastChannel:', error);
      }
    }
    if (this.socket) {
      this.socket.close();
    }
  }
}
