package constant

import "time"

type GetInventoryAvatarRequest struct {
	StudentId string `json:"student_id" db:"student_id"`
}

type GetInventoryAvatarItemRequest struct {
	StudentId string `json:"student_id" db:"student_id"`
	Type      string `json:"type" db:"type"`
}

type InventoryAvatarEntity struct {
	InventoryId int     `json:"inventory_id" db:"inventory_id"`
	AvatarId    *int    `json:"avatar_id" db:"avatar_id"`
	IsEquipped  bool    `json:"is_equipped" db:"is_equipped"`
	ModelId     *string `json:"model_id" db:"model_id"`
	Level       *int    `json:"level" db:"level"`
}

type InventoryAvatarPetEntity struct {
	InventoryId int     `json:"inventory_id" db:"inventory_id"`
	IsEquipped  bool    `json:"is_equipped" db:"is_equipped"`
	PetId       int     `json:"pet_id" db:"pet_id"`
	ModelId     *string `json:"model_id" db:"model_id"`
}

type InventoryAvatarItemEntity struct {
	InventoryId int     `json:"inventory_id" db:"inventory_id"`
	ItemId      int     `json:"item_id" db:"item_id"`
	Amount      int     `json:"amount" db:"amount"`
	ImageUrl    string  `json:"image_url" db:"image_url"`
	IsEquipped  bool    `json:"is_equipped" db:"is_equipped"`
	Status      string  `json:"status" db:"status"`
	Name        *string `json:"name,omitempty" db:"name"`
	Description *string `json:"description,omitempty" db:"description"`
}

type InventoryAvatarItemBadgeEntity struct {
	InventoryId      int    `json:"inventory_id" db:"inventory_id"`
	ItemId           int    `json:"item_id" db:"item_id"`
	Amount           int    `json:"amount" db:"amount"`
	ImageUrl         string `json:"image_url" db:"image_url"`
	TeamPlatePath    string `json:"template_path" db:"template_path"`
	BadgeDescription string `json:"badge_description" db:"badge_description"`
	IsEquipped       bool   `json:"is_equipped" db:"is_equipped"`
	Status           string `json:"status" db:"status"`
}

type UpdateInventoryAvatarEquippedRequest struct {
	StudentId  string `json:"student_id" db:"student_id"`
	AvatarId   int    `json:"avatar_id" db:"avatar_id"`
	IsEquipped bool   `json:"is_equipped" db:"is_equipped"`
}

type UpdateInventoryAvatarEquippedValidation struct {
	AvatarId   int  `json:"avatar_id"  validate:"required"`
	IsEquipped bool `json:"is_equipped"`
}

type UpdateCustomAvatarPetEquippedRequest struct {
	StudentId  string `json:"student_id" db:"student_id"`
	PetId      int    `json:"pet_id" db:"pet_id"`
	IsEquipped bool   `json:"is_equipped" db:"is_equipped"`
}

type UpdateInventoryAvatarPetEquippedValidation struct {
	IsEquipped *bool `json:"is_equipped" validate:"required"`
	PetId      int   `json:"pet_id" validate:"required"`
}

type UpdateCustomAvatarItemEquippedRequest struct {
	StudentId  string `json:"student_id" db:"student_id"`
	IsEquipped bool   `json:"is_equipped" db:"is_equipped"`
	ItemId     int    `json:"item_id" db:"item_id"`
}

type UpdateInventoryAvatarItemEquippedValidation struct {
	ItemId     int  `json:"item_id" validate:"required"`
	IsEquipped bool `json:"is_equipped"`
}

type StatusResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

type RewardLogEntity struct {
	GoldCoinAmount       *int       `json:"gold_coin_amount" db:"gold_coin_amount"`
	ArcadeCoinAmount     *int       `json:"arcade_coin_amount" db:"arcade_coin_amount"`
	IceAmount            *int       `json:"ice_amount" db:"ice_amount"`
	ItemName             *string    `json:"item_name" db:"item_name"`
	ItemAmount           *int       `json:"item_amount" db:"item_amount"`
	ItemType             *string    `json:"item_type" db:"item_type"`
	ItemImageUrl         *string    `json:"item_image_url" db:"item_image_url"`
	ItemTemplatePath     *string    `json:"item_template_path" db:"item_template_path"`
	ItemBadgeDescription *string    `json:"item_badge_description" db:"item_badge_description"`
	AvatarModelId        *string    `json:"avatar_model_id" db:"avatar_model_id"`
	AvatarAmount         *int       `json:"avatar_amount" db:"avatar_amount"`
	PetModelId           *string    `json:"pet_model_id" db:"pet_model_id"`
	PetAmount            *int       `json:"pet_amount" db:"pet_amount"`
	Description          *string    `json:"description" db:"description"`
	ReceivedAt           *time.Time `json:"received_at" db:"received_at"`
}
