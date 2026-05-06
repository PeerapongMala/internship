export type TWsChatRes = {
  Message: {
    id: number;
    content: string;
    school_id: number;
    sender_id: string;
    reciever_id: string | null;
    room_id: string;
    room_type: string;
    created_at: string;
  };
  first_name: string;
  last_name: string;
  image_url: string | null;
};
