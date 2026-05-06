export interface Character {
  inventory_id: number;
  avatar_id: number;
  is_equipped: boolean;
  model_id: string;
  level: number;
}

export interface CharacterResponse {
  inventory_id: number;
  avatar_id: number;
  is_equipped: boolean;
  model_id: string;
  level: number;
  buy: boolean;
}

export interface CharacterOutput {
  id: number;
  name: string;
  avatar_id: number;
  description: string;
  model_src: string;
  src: string;
  selected: boolean;
  buy: boolean;
}

export interface CharacterData {
  name: string;
  description: string;
  src: string;
}

export interface Pet {
  id: number;
  model_id: string;
  is_equipped: boolean;
  is_bought: boolean;
  price: number;
  pet_id: number;
}

export interface PetResponse {
  id: number;
  model_id: string;
  is_equipped: boolean;
  is_bought: boolean;
  price: number;
  pet_id: number;
}

export interface PetOutput {
  id: number;
  name: string;
  pet_id: number;
  description: string;
  model_src: string;
  model_name: string;
  animation_src: string;
  src: string;
  selected: boolean;
  buy: boolean;
  lock: boolean;
  price: number;
  is_equipped: boolean;
}

export interface Badge {
  id: number;
  stock: number;
  initial_stock: number;
  price: number;
  item_id: number;
  name: string;
  description: string;
  image_url: string;
  template_path: string;
  badge_description: string;
  amount: number;
  is_bought: boolean;
  is_equipped: boolean;
}

export interface BadgeResponse {
  id: number;
  stock: number;
  initial_stock: number;
  price: number;
  item_id: number;
  name: string;
  description: string;
  image_url: string;
  template_path: string;
  badge_description: string;
  amount: number;
  is_bought: boolean;
  is_equipped: boolean;
}

export interface BadgeOutput {
  id: number;
  stock: number;
  initial_stock: number;
  price: number;
  item_id: number;
  name: string;
  description: string;
  image_url: string;
  template_path: string;
  badge_description: string;
  amount: number;
  is_bought: boolean;
  is_equipped: boolean;
  selected: boolean;
  src: string;
  lock: boolean;
  buy: boolean;
}
export interface Frame {
  id: number;
  stock: number;
  initial_stock: number;
  price: number;
  item_id: number;
  name: string;
  description: string;
  image_url: string;
  template_path: string;
  badge_description: string;
  amount: number;
  is_bought: boolean;
  is_equipped: boolean;
}

export interface FrameResponse {
  id: number;
  stock: number;
  initial_stock: number;
  price: number;
  item_id: number;
  name: string;
  description: string;
  image_url: string;
  template_path: string;
  badge_description: string;
  amount: number;
  is_bought: boolean;
  is_equipped: boolean;
}

export interface FrameOutput {
  id: number;
  stock: number;
  initial_stock: number;
  price: number;
  item_id: number;
  name: string;
  description: string;
  image_url: string;
  template_path: string;
  badge_description: string;
  amount: number;
  is_bought: boolean;
  is_equipped: boolean;
  selected: boolean;
  src: string;
  lock: boolean;
  buy: boolean;
}

export interface Avatar {
  id: number;
  model_id: number;
  is_equipped: boolean;
  is_bought: string;
  price: number;
}

export interface AvatarResponse {
  id: number;
  model_id: string; // Change to string to match the characterURLs key
  is_equipped: boolean;
  is_bought: boolean;
  price: number;
  avatar_id: number;
}

export interface AvatarOutput {
  id: number;
  name: string;
  avatar_id: string; // Match model_id type
  description: string;
  model_src: string;
  src: string;
  selected: boolean;
  buy: boolean;
  price: number;
  lock: boolean;
}

export interface Coupon {
  id: number;
  stock: number;
  initial_stock: number;
  price: number;
  item_id: number;
  name: string;
  description: string;
  image_url: string;
  template_path: string;
  badge_description: string;
  amount: number;
  is_bought: boolean;
  is_equipped: boolean;
}

export interface CouponResponse {
  inventory_id: number;
  item_id: number;
  amount: number;
  image_url: string;
  is_equipped: boolean;
  name: string;
  description: string;
  status: string;
}

export interface CouponOutput {
  id: number;

  item_id: number;
  name: string;
  description: string;
  amount: number;
  image_url: string;
  is_bought: boolean;
  is_equipped: boolean;
  selected: boolean;
  src: string;
}

export interface InventoryInfo {
  id: number;
  student_id: string;
  gold_coin: number;
  arcade_coin: number;
  ice: number;
}

export interface ItemData {
  gold_coin_amount: number | null;
  arcade_coin_amount: number | null;
  ice_amount: number | null;
  item_name: string;
  item_amount: number;
  item_type: 'badge' | string;
  item_image_url: string;
  item_template_path: string;
  item_badge_description: string;
  avatar_model_id: string | null;
  avatar_amount: number | null;
  pet_model_id: string | null;
  pet_amount: number | null;
  description: string;
  received_at: string;
}

export interface RewardItem {
  gold_coin_amount: number | null;
  arcade_coin_amount: number | null;
  ice_amount: number | null;
  item_name: string | null;
  item_amount: number | null;
  item_type: string | null; // Could be more specific e.g., 'badge' | null if only 'badge' is expected
  item_image_url: string | null;
  item_template_path: string | null;
  item_badge_description: string | null;
  avatar_model_id: string | number | null; // Assuming it could be a string or number ID if not null
  avatar_amount: number | null;
  pet_model_id: string | number | null; // Assuming it could be a string or number ID if not null
  pet_amount: number | null;
  description: string; // e.g., "coupon", "streak-login", "level", "mail-box"
  received_at: string; // ISO 8601 date-time string
}

export interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

export interface RewardResponse {
  status_code: number;
  _pagination: Pagination;
  data: RewardItem[];
  message: string;
}
