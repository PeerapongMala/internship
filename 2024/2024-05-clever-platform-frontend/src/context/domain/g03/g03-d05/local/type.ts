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
  is_equipped: boolean;
}

export interface Pet {
  id: number;
  model_id: string;
  is_equipped: boolean;
  is_bought: boolean;
  price: number;
}

export interface PetResponse {
  id: number;
  model_id: string;
  is_equipped: boolean;
  is_bought: boolean;
  price: number;
}

export interface PetOutput {
  id: number;
  name: string;
  pet_id: number;
  description: string;
  model_name: string;
  model_src: string;
  src: string;
  selected: boolean;
  buy: boolean;
  lock: boolean;
  price: number;
  is_equipped: boolean;
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

export interface CouponOutput {
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

export interface InventoryInfo {
  id: number;
  student_id: string;
  gold_coin: number;
  arcade_coin: number;
  ice: number;
}

export interface AssetsResponse {
  status_code: number;
  data: {
    model_id: string;
    url: string;
  }[];
  message: string;
}

export interface ModelAvatar {
  model_id: string;
  url: string;
  model_version_id: string;
}
