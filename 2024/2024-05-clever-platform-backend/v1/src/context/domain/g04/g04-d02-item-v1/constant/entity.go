package constant

import (
	"mime/multipart"
	"time"
)

type ItemRequest struct {
	Id           int                   `form:"id"`
	Type         *string               `form:"type"`
	Name         *string               `form:"name" validate:"required"`
	Description  *string               `form:"description"`
	Image        *multipart.FileHeader `form:"image"`
	ImageUrl     *string               `form:"image_url"`
	Status       *string               `form:"status"`
	CreateAt     time.Time             `form:"-"`
	CreateBy     *string               `form:"-"`
	UpdateAt     time.Time             `form:"updated_at"`
	UpdateBy     *string               `form:"updated_by"`
	AdminLoginAs *string               `form:"admin_login_as"`
}

type ItemResponse struct {
	Id                 int        `json:"id" db:"id"`
	TeacherItemGroupId *int       `json:"teacher_item_group_id" db:"teacher_item_group_id"`
	TemplateItemId     *int       `json:"template_item_id" db:"template_item_id"`
	Type               *string    `json:"type" db:"type"`
	Name               *string    `json:"name" db:"name"`
	Description        *string    `json:"description" db:"description"`
	ImageUrl           *string    `json:"image_url" db:"image_url"`
	Status             *string    `json:"status" db:"status"`
	CreateAt           *time.Time `json:"-" db:"created_at"`
	CreateBy           *string    `json:"-" db:"created_by"`
	CreateName         *string    `json:"-" db:"created_name"`
	UpdateAt           *time.Time `json:"updated_at" db:"updated_at"`
	UpdateBy           *string    `json:"updated_by" db:"updated_by"`
	UpdateName         *string    `json:"-" db:"updated_name"`
	AdminLoginAs       *string    `json:"admin_login_as" db:"admin_login_as"`
}

type ItemListFilter struct {
	Type       *string `query:"type"`
	Status     *string `query:"status"`
	SearchText *string `query:"search_text"`
}

type ItemBadgeRequest struct {
	ItemId           int     `json:"item_id" validate:"required,gt=0"`
	TemplatePath     *string `json:"template_path"`
	BadgeDescription *string `json:"badge_description"`
}

type ItemBadgeResponse struct {
	ItemId           *int    `form:"item_id" db:"item_id"`
	TemplatePath     *string `form:"template_path" db:"template_path"`
	BadgeDescription *string `form:"badge_description" db:"badge_description"`
}

type ItemAndBadgeRequest struct {
	Id           int       `json:"id" validate:"required,gt=0"`
	Type         string    `json:"type" validate:"required,oneof=badge coupon frame"`
	Name         string    `json:"name" validate:"required"`
	Description  *string   `json:"description"`
	ImageUrl     *string   `json:"image_url"`
	Status       string    `json:"status"`
	CreateAt     time.Time `json:"-"`
	CreateBy     string    `json:"-"`
	UpdateAt     time.Time `json:"updated_at"`
	UpdateBy     string    `json:"updated_by"`
	AdminLoginAs *string   `json:"admin_login_as"`
	Badge        *ItemBadgeResponse
}

type ItemAndBadgeResponse struct {
	Id               int                   `form:"id" json:"id"`
	Type             *string               `form:"type" json:"type"`
	Name             *string               `form:"name" validate:"required" json:"name"`
	Description      *string               `form:"description" json:"description"`
	Image            *multipart.FileHeader `form:"image" json:"image"`
	ImageUrl         *string               `form:"image_url" json:"image_url"`
	Status           *string               `form:"status" json:"status"`
	CreateName       *string               `form:"created_name" json:"-"`
	UpdateName       *string               `form:"updated_name" json:"-"`
	CreateAt         *time.Time            `form:"created_at" json:"-"`
	UpdateAt         *time.Time            `form:"updated_at" json:"updated_at"`
	CreateBy         *string               `form:"created_by" json:"-"`
	UpdateBy         *string               `form:"updated_by" json:"updated_by"`
	AdminLoginAs     *string               `form:"admin_login_as" json:"admin_login_as"`
	TemplatePath     *string               `form:"template_path" db:"template_path" json:"template_path"`
	BadgeDescription *string               `form:"badge_description" db:"badge_description" json:"badge_description"`
	Badge            ItemBadgeResponse     `json:"-"`
}

type ItemBulkEditItem struct {
	Id     int    `json:"id" validate:"required"`
	Status string `json:"status" validate:"required"`
}
