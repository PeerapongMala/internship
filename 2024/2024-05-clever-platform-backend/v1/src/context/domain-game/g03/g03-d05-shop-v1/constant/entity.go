package constant

import "time"

type ShopRequest struct {
	AvatarId  int    `json:"avatar_id" validate:"required"`
	StudentId string `json:"student_id"`
}

type ShopResponse struct {
	InventoryId int     `json:"inventory_id" db:"inventory_id"`
	AvatarId    int     `json:"avatar_id" db:"avatar_id"`
	ModelId     *string `json:"model_id" db:"model_id"`
}

type ShopAvatar struct {
	Id         *int    `json:"id" db:"id"`
	ModelId    *string `json:"model_id" db:"model_id"`
	IsEquipped *bool   `json:"is_equipped" db:"is_equipped"`
	IsBought   *bool   `json:"is_bought" db:"is_bought"`
	Price      *int    `json:"price" db:"price"`
}

type ShopPetResponse struct {
	InventoryId int     `json:"inventory_id" db:"inventory_id"`
	PetId       int     `json:"pet_id" db:"pet_id"`
	ModelId     *string `json:"model_id" db:"model_id"`
}

type ShopPet struct {
	Id         *int    `json:"id" db:"id"`
	ModelId    *string `json:"model_id" db:"model_id"`
	IsEquipped *bool   `json:"is_equipped" db:"is_equipped"`
	IsBought   *bool   `json:"is_bought" db:"is_bought"`
	Price      *int    `json:"price" db:"price"`
}

type ShopItemRequest struct {
	ItemId    *int    `json:"item_id" validate:"required,gt=0"`
	Type      *string `json:"type"  validate:"required"`
	Amount    *int    `json:"amount"  validate:"required,gt=0"`
	StudentId string  `json:"student_id"`
}

type ShopItemResponse struct {
	InventoryId int    `json:"inventory_id" db:"inventory_id"`
	ItemId      int    `json:"item_id" db:"item_id"`
	Type        string `json:"type" db:"type"`
	Amount      int    `json:"amount" db:"amount"`
}

type ShopItem struct {
	Id               *int    `json:"id" db:"id"`
	Stock            *int    `json:"stock" db:"stock"`
	InitialStock     *int    `json:"initial_stock" db:"initial_stock"`
	Price            *int    `json:"price" db:"price"`
	ItemId           *int    `json:"item_id" db:"item_id"`
	Name             *string `json:"name" db:"name"`
	Description      *string `json:"description" db:"description"`
	ImageUrl         *string `json:"image_url" db:"image_url"`
	TemplatePath     *string `json:"template_path" db:"template_path"`
	BadgeDescription *string `json:"badge_description" db:"badge_description"`
	Amount           *int    `json:"amount" db:"amount"`
	IsBought         *bool   `json:"is_bought" db:"is_bought"`
	IsEquipped       *bool   `json:"is_equipped" db:"is_equipped"`
}

type TeacherStoreTransactionEntity struct {
	TeacherStoreItemId int       `json:"teacher_store_item_id" db:"teacher_store_item_id"`
	StudentId          string    `json:"student_id" db:"student_id"`
	Status             string    `json:"status" db:"status"`
	BoughtAt           time.Time `json:"bought_at" db:"bought_at"`
}
