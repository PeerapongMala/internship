package constant

import "time"

type TeacherItemGroupEntity struct {
	Id           *int       `json:"id" db:"id"`
	Year         *string    `json:"year" db:"year"`
	Subject      *string    `json:"subject" db:"subject"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs *string    `json:"-" db:"admin_login_as"`
}

type ItemEntity struct {
	Id               *int       `json:"id" db:"id"`
	TemplateItemId   *int       `json:"template_item_id" db:"template_item_id"`
	TemplateImageUrl *string    `json:"template_image_url" db:"template_image_url"`
	ImageUrl         *string    `json:"image_url" db:"image_url"`
	TemplatePath     *string    `json:"template_path" db:"template_path"`
	TemplateItem     *string    `json:"template_item" db:"template_item"`
	BadgeDescription *string    `json:"badge_description" db:"badge_description"`
	Name             *string    `json:"name" db:"name"`
	Type             *string    `json:"type" db:"type"`
	Description      *string    `json:"description" db:"description"`
	CreatedAt        *time.Time `json:"-" db:"created_at"`
	CreatedBy        *string    `json:"created_by" db:"created_by"`
	UpdatedAt        *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy        *string    `json:"updated_by" db:"updated_by"`
	Status           *string    `json:"status" db:"status"`
	AdminLoginAs     *string    `json:"admin_login_as" db:"admin_login_as"`
	SchoolId         *int       `json:"-" db:"school_id"`
}

type BadgeEntity struct {
	ItemId           *int    `db:"item_id"`
	TemplatePath     *string `db:"template_path"`
	BadgeDescription *string `db:"badge_description"`
}

type TemplateItemEntity struct {
	Id               *int    `json:"id" db:"id"`
	TemplatePath     *string `json:"template_path" db:"template_path"`
	ImageUrl         *string `json:"image_url" db:"image_url"`
	Name             *string `json:"name" db:"name"`
	BadgeDescription *string `json:"badge_description" db:"badge_description"`
	Description      *string `json:"description" db:"description"`
}

type TeacherItemBulkEditItem struct {
	Id     *int    `json:"id" validate:"required"`
	Status *string `json:"status" validate:"required"`
}
