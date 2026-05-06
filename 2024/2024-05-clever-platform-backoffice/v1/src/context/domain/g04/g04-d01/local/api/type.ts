interface RecordStamp {
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  admin_login_as: string | null;
}

type Status = 'draft' | 'enabled' | 'disabled';
type AnnouncementType = 'system' | 'event' | 'reward' | 'notification';

interface AnnouceSystem extends RecordStamp {
  id: number;
  school_id: number;
  school_name: string;
  scope: 'School' | 'Subject';
  type: AnnouncementType;
  started_at: string;
  ended_at: string;
  title: string;
  description: string;
  image_url: string | null;
  announcement_image?: string;
  status: Status;
}

// announcement_image

interface AnnouceEvent extends AnnouceSystem {
  arcade_game_id: number;
  academic_year: number;
  subject_id: number;
  subject_name: string;
}

interface AnnouceReward extends AnnouceNotification {
  item_list: AnnounceRewardItem[];
  coin_list: AnnouceRewardCoin | null;
}

interface AnnouceRewardUpdate extends AnnouceNotification {
  item_list: Partial<AnnounceRewardItem>[];
  gold_coin?: number;
  arcade_coin?: number;
}

interface AnnouceRewardCoin {
  gold_coin: number | null;
  arcade_coin: number | null;
}

interface AnnounceRewardItem {
  item_id: number | string;
  type: string;
  item_image_url: string | null;
  item_name: string;
  item_description: string;
  amount: number;
  expired_at: string | null;
  update_at: string | null;
  update_by: string | null;
}

interface AnnouceNotification extends AnnouceSystem {
  subject_id: number;
  subject_name: string;
  academic_year: number;
  year_id: number;
  seed_year_name: string;
}

type Announcement = AnnouceSystem | AnnouceEvent | AnnouceReward | AnnouceNotification;

interface DropdownSchool {
  id: number;
  name: string;
}

interface DropdownYear {
  id: number;
  name: string;
}

interface DropdownSubject {
  id: number;
  SubjectName: string;
}

interface DropdownAcademicYear {
  academic_year: number;
}

interface DropdownArcadeGame {
  ArcadeGameId: number;
  ArcadeGameName: string;
}

interface DropdownItem {
  id: number | string;
  type: string;
  name: string;
  description: string;
  image_url: string | null;
}
