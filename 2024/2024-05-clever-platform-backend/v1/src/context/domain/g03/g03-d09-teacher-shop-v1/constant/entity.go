package constant

import (
	"mime/multipart"
	"time"
)

type SubjectTeacherResponse struct {
	SubjectId        int        `json:"subject_id" db:"subject_id"`
	SubjectTeacherId int        `json:"subject_teacher_id" db:"subject_teacher_id"`
	SubjectName      string     `json:"subject_name" db:"subject_name"`
	UpdatedAt        *time.Time `json:"updated_at" db:"updated_at"`
	TeacherName      string     `json:"teacher_name" db:"teacher_name"`
	ShortYear        *string    `json:"short_year" db:"short_year"`
	Year             *string    `json:"year" db:"year"`
	UpdatedByName    string     `json:"updated_by_name" db:"updated_by_name"`
}

type TeacherShopListFilter struct {
	Type       *string `query:"type"`
	SearchText *string `query:"search_text"`
	Status     *string `query:"status"`
}

type ShopItemRequest struct {
	SubjectId     int                   `form:"subject_id"`
	ClassIds      []int                 `form:"class_ids"`
	StudyGroupIds []int                 `form:"study_group_ids"`
	StudentIds    []string              `form:"student_ids"`
	Name          string                `form:"item_name"`
	Description   string                `form:"item_description"`
	Image         *multipart.FileHeader `form:"image"`
	ImageKey      *string               `form:"image_key"`
	Stock         *int                  `form:"initial_stock"`
	LimitPerUser  *int                  `form:"limit_per_user"`
	InitialStock  *int                  `form:"stock"`
	Price         int                   `form:"price" validate:"required,gte=0"`
	Limit         int                   `form:"limit"`
	OpenDate      *time.Time            `form:"open_date"`
	ClosedDate    *time.Time            `form:"closed_date"`
	Status        string                `form:"status" validate:"required,oneof=enabled pending expired"`
	CreatedBy     *string               `form:"created_by"`
	UpdatedBy     *string               `form:"updated_by"`
	ItemId        int
}

type ShopItem struct {
	SubjectId     int          `json:"subject_id" db:"subject_id"`
	ClassIds      []Class      `json:"class_ids" db:"class_ids"`
	StudyGroupIds []StudyGroup `json:"study_group_ids" db:"study_group_ids"`
	StudentIds    []Student    `json:"student_ids" db:"student_ids"`
	ItemId        int          `json:"-" db:"item_id"`
	Name          string       `json:"item_name" db:"name"`
	Description   string       `json:"item_description" db:"description"`
	ImageUrl      *string      `json:"image_url" db:"image_url"`
	ImageKey      *string      `json:"image_key" db:"image_key"`
	InitialStock  *int         `json:"initial_stock" db:"initial_stock"`
	Price         int          `json:"price" db:"price"`
	OpenDate      *time.Time   `json:"open_date" db:"open_date"`
	ClosedDate    *time.Time   `json:"closed_date" db:"closed_date"`
	Status        string       `json:"status" db:"status"`
	LimitPerUser  *int         `json:"limit_per_user" db:"limit_per_user"`
	//CreatedBy     *string        `json:"created_by"`
	//UpdatedBy     *string        `json:"updated_by"`
	//ItemId        int
}

type ShopItemResponse struct {
	ShopItemEntity
	ItemName         string       `json:"item_name" db:"item_name"`
	ItemDescription  *string      `json:"item_description" db:"item_description"`
	ItemType         string       `json:"item_type" db:"item_type"`
	CreatedByName    string       `json:"created_by_name" db:"created_by_name"`
	UpdatedByName    *string      `json:"updated_by_name" db:"updated_by_name"`
	TransactionCount *int         `json:"transaction_count" db:"transaction_count"`
	ImageUrl         *string      `json:"image_url" db:"image_url"`
	Students         []Student    `json:"student_ids" db:"students"`
	StudyGroups      []StudyGroup `json:"study_group_ids" db:"study_groups"`
	Classes          []Class      `json:"class_ids" db:"classes"`
}

type Class struct {
	Id           int    `json:"class_id" db:"id"`
	AcademicYear int    `json:"class_academic_year" db:"academic_year"`
	Name         string `json:"class_name" db:"class_name"`
	Year         string `json:"class_year" db:"class_year"`
	StudentCount int    `json:"student_count" db:"student_count"`
}

type StudyGroup struct {
	Id             int    `json:"study_group_id" db:"id"`
	StudyGroupName string `json:"study_group_name" db:"study_group_name"`
	Name           string `json:"class_name" db:"class_name"`
	Year           string `json:"class_year" db:"class_year"`
	StudentCount   int    `json:"student_count" db:"student_count"`
}

type Student struct {
	UserId    string     `json:"user_id" db:"user_id"`
	StudentId string     `json:"student_id" db:"student_id"`
	Title     string     `json:"title" db:"title"`
	FirstName string     `json:"first_name" db:"first_name"`
	LastName  string     `json:"last_name" db:"last_name"`
	LastLogin *time.Time `json:"last_login" db:"last_login"`
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
	Status         string     `json:"status" db:"status"`
	CreatedAt      *time.Time `json:"created_at" db:"created_at"`
	CreatedBy      *string    `json:"created_by" db:"created_by"`
	UpdatedAt      *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy      *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs   *string    `json:"admin_login_as" db:"admin_login_as"`
	LimitPerUser   *int       `json:"limit_per_user" db:"limit_per_user"`
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

type ShopItemStatusRequest struct {
	Status    string  `json:"status" db:"status" validate:"required,oneof=enabled pending expired"`
	UpdatedBy *string `json:"updated_by" db:"updated_by"`
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
	Status    string  `json:"status" db:"status" validate:"required,oneof=enabled recalled"`
	UpdatedBy *string `json:"updated_by" db:"updated_by"`
}
