package constant

import (
	"time"
)

type ShopItemListFilter struct {
	Type       *string `query:"type"`
	SearchText *string `query:"search_text"`
	Status     *string `query:"status"`
}

type ShopItemRequest struct {
	ItemId       int        `json:"item_id" validate:"required,gt=0"`
	Stock        *int       `json:"stock"`
	InitialStock *int       `json:"initial_stock"`
	Price        int        `json:"price" validate:"required,gte=0"`
	OpenDate     *time.Time `json:"open_date"`
	ClosedDate   *time.Time `json:"closed_date"`
	Status       string     `json:"status" validate:"required,oneof=enabled pending expired"`
	CreatedBy    *string    `json:"created_by"`
	UpdatedBy    *string    `json:"updated_by"`
}

type ShopItemStatusRequest struct {
	Status string `json:"status" db:"status" validate:"required,oneof=enabled pending expired"`
}

type ShopItemStatusBulkEditRequest struct {
	Items []BulkEditList `json:"bulk_edit_list" validate:"dive"`
}

type ShopItemTransactionStatusBulkEditRequest struct {
	Items []BulkEditTransactionList `json:"bulk_edit_list" validate:"dive"`
}

type BulkEditList struct {
	Status string `json:"status" validate:"required,oneof=enabled pending expired"`
	Id     int    `json:"id" validate:"required"`
}

type BulkEditTransactionList struct {
	Status string `json:"status" validate:"required,oneof=enabled recalled"`
	Id     int    `json:"id" validate:"required"`
}
type ShopItemTransactionStatusRequest struct {
	Status string `json:"status" db:"status" validate:"required,oneof=enabled recalled"`
}

type ShopItemResponse struct {
	ShopItemEntity
	ItemName        string  `json:"item_name" db:"item_name"`
	ItemDescription *string `json:"item_description" db:"item_description"`
	ItemType        string  `json:"item_type" db:"item_type"`
	CreatedByName   string  `json:"created_by_name" db:"created_by_name"`
	UpdatedByName   *string `json:"updated_by_name" db:"updated_by_name"`
}

type ShopItemTransactionResponse struct {
	ShopItemTransactionEntity
	Title     string `json:"title" db:"title"`
	FirstName string `json:"first_name" db:"first_name"`
	LastName  string `json:"last_name" db:"last_name"`
}
type ShopItemEntity struct {
	Id             int        `json:"id" db:"id"`
	ItemId         int        `json:"item_id" db:"item_id"`
	TeacherStoreId *int       `json:"teacher_store_id" db:"teacher_store_id"`
	Stock          *int       `json:"stock" db:"stock"`
	InitialStock   *int       `json:"initial_stock" db:"initial_stock"`
	Price          int        `json:"price" db:"price"`
	OpenDate       *time.Time `json:"open_date" db:"open_date"`
	ClosedDate     *time.Time `json:"closed_date" db:"closed_date"`
	LimitPerUser   *int       `json:"limit_per_user" db:"limit_per_user"`
	Status         string     `json:"status" db:"status"`
	CreatedAt      *time.Time `json:"created_at" db:"created_at"`
	CreatedBy      *string    `json:"created_by" db:"created_by"`
	UpdatedAt      *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy      *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs   *string    `json:"admin_login_as" db:"admin_login_as"`
}

type ShopItemTransactionEntity struct {
	Id                 int        `json:"id" db:"id"`
	TeacherStoreItemId int        `json:"teacher_store_item_id" db:"teacher_store_item_id"`
	StudentId          string     `json:"student_id" db:"student_id"`
	Status             string     `json:"status" db:"status"`
	BoughtAt           time.Time  `json:"bought_at" db:"bought_at"`
	RecalledAt         *time.Time `json:"recalled_at" db:"recalled_at"`
	AdminLoginAs       *string    `json:"admin_login_as" db:"admin_login_as"`
}
