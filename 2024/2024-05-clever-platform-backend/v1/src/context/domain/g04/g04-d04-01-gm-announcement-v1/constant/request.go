package constant

import (
	"mime/multipart"
	"time"
)

type CreateGlobalAnnounceRequest struct {
	SchoolId     int                   `form:"school_id" db:"school_id"`
	Scope        string                `form:"scope" db:"scope"`
	Type         string                `form:"type" db:"type"`
	StartAt      time.Time             `form:"started_at" db:"started_at"`
	EndAt        time.Time             `form:"ended_at" db:"ended_at"`
	Title        string                `form:"title" db:"title"`
	Description  string                `form:"description" db:"description"`
	Image        *string               `db:"image_url"`
	Status       string                `form:"status" db:"status"`
	CreatedBy    string                `db:"created_by"`
	AdminLoginAs *string               `db:"admin_login_as"`
	ImageFile    *multipart.FileHeader `form:"announcement_image"`
}
type UpdateGlobalAnnounceRequest struct {
	Id           int                   `db:"id"`
	SchoolId     int                   `form:"school_id" db:"school_id"`
	Scope        string                `form:"scope" db:"scope"`
	Type         string                `form:"type" db:"type"`
	StartAt      time.Time             `form:"started_at" db:"started_at"`
	EndAt        time.Time             `form:"ended_at" db:"ended_at"`
	Title        string                `form:"title" db:"title"`
	Description  string                `form:"description" db:"description"`
	Image        *string               `db:"image_url"`
	Status       string                `form:"status" db:"status"`
	UpdatedBy    string                `db:"updated_by"`
	AdminLoginAs *string               `db:"admin_login_as"`
	ImageFile    *multipart.FileHeader `form:"announcement_image"`
}
type CreateEventAnnounceRequest struct {
	SchoolId     int                   `form:"school_id" db:"school_id"`
	Scope        string                `form:"scope" db:"scope"`
	Type         string                `form:"type" db:"type"`
	StartAt      time.Time             `form:"started_at" db:"started_at"`
	EndAt        time.Time             `form:"ended_at" db:"ended_at"`
	Title        string                `form:"title" db:"title"`
	Description  string                `form:"description" db:"description"`
	Image        *string               `db:"image_url"`
	Status       string                `form:"status" db:"status"`
	CreatedBy    string                `db:"created_by"`
	ArcadeGameId int                   `form:"arcade_game_id" db:"arcade_game_id"`
	AcademicYear int                   `form:"academic_year" db:"academic_year"`
	SubjectId    int                   `form:"subject_id" db:"subject_id"`
	AdminLoginAs *string               `db:"admin_login_as"`
	ImageFile    *multipart.FileHeader `form:"announcement_image"`
}
type UpdateEventAnnounceRequest struct {
	Id           int                   `db:"id"`
	SchoolId     int                   `form:"school_id" db:"school_id"`
	Scope        string                `form:"scope" db:"scope"`
	Type         string                `form:"type" db:"type"`
	StartAt      time.Time             `form:"started_at" db:"started_at"`
	EndAt        time.Time             `form:"ended_at" db:"ended_at"`
	Title        string                `form:"title" db:"title"`
	Description  string                `form:"description" db:"description"`
	Image        *string               `db:"image_url"`
	Status       string                `form:"status" db:"status"`
	UpdatedBy    string                `db:"updated_by"`
	ArcadeGameId int                   `form:"arcade_game_id" db:"arcade_game_id"`
	AcademicYear int                   `form:"academic_year" db:"academic_year"`
	SubjectId    int                   `form:"subject_id" db:"subject_id"`
	AdminLoginAs *string               `db:"admin_login_as"`
	ImageFile    *multipart.FileHeader `form:"announcement_image"`
}
type CreateRewardAnnounceRequest struct {
	SchoolId     int       `form:"school_id" db:"school_id"`
	Scope        string    `form:"scope" db:"scope"`
	Type         string    `form:"type" db:"type"`
	StartAt      time.Time `form:"started_at" db:"started_at"`
	EndAt        time.Time `form:"ended_at" db:"ended_at"`
	Title        string    `form:"title" db:"title"`
	Description  string    `form:"description" db:"description"`
	Image        *string   `db:"image_url"`
	Status       string    `form:"status" db:"status"`
	CreatedBy    string    ` db:"created_by"`
	AcademicYear int       `form:"academic_year" db:"academic_year"`
	SubjectId    int       `form:"subject_id" db:"subject_id"`
	// ItemId       int                   `form:"item_id" db:"item_id"`
	// Amount       int                   `form:"amount" db:"amount"`
	// ExpiredAt    time.Time             `form:"expired_at" db:"expired_at"`
	AdminLoginAs *string               `db:"admin_login_as"`
	ImageFile    *multipart.FileHeader `form:"announcement_image"`
}
type CreateRewardAnnounceRequestService struct {
	SchoolId     int                   `form:"school_id" db:"school_id"`
	Scope        string                `form:"scope" db:"scope"`
	Type         string                `form:"type" db:"type"`
	StartAt      time.Time             `form:"started_at" db:"started_at"`
	EndAt        time.Time             `form:"ended_at" db:"ended_at"`
	Title        string                `form:"title" db:"title"`
	Description  string                `form:"description" db:"description"`
	Image        *string               `db:"image_url"`
	Status       string                `form:"status" db:"status"`
	CreatedBy    string                ` db:"created_by"`
	AcademicYear int                   `form:"academic_year" db:"academic_year"`
	SubjectId    int                   `form:"subject_id" db:"subject_id"`
	Items        []ItemListRequest     `form:"item_list"`
	GoldCoin     *int                  `form:"gold_coin"`
	ArcadeCoin   *int                  `form:"arcade_coin"`
	Ice          *int                  `form:"ice"`
	AdminLoginAs *string               `db:"admin_login_as"`
	ImageFile    *multipart.FileHeader `form:"announcement_image"`
}

type ItemListRequest struct {
	ItemId     int       `form:"item_id"`
	Amount     int       `form:"amount"`
	ExpiredAt  time.Time `form:"expired_at"`
	GoldCoin   *int      `form:"gold_coin_amount"`
	ArcadeCoin *int      `form:"arcade_coin_amount"`
	IceAmount  *int      `form:"ice_amount"`
}
type UpdateRewardAnnounceRequest struct {
	Id           int       `form:"id" db:"id"`
	SchoolId     int       `form:"school_id" db:"school_id"`
	Scope        string    `form:"scope" db:"scope"`
	Type         string    `form:"type" db:"type"`
	StartAt      time.Time `form:"started_at" db:"started_at"`
	EndAt        time.Time `form:"ended_at" db:"ended_at"`
	Title        string    `form:"title" db:"title"`
	Description  string    `form:"description" db:"description"`
	Image        *string   `db:"image_url"`
	Status       string    `form:"status" db:"status"`
	UpdatedBy    string    `db:"updated_by" `
	AcademicYear int       `form:"academic_year" db:"academic_year"`
	SubjectId    int       `form:"subject_id" db:"subject_id"`
	// ItemId       int                   `form:"item_id" db:"item_id"`
	// Amount       int                   `form:"amount" db:"amount"`
	// ExpiredAt    time.Time             `form:"expired_at" db:"expired_at"`
	AdminLoginAs *string               `db:"admin_login_as"`
	ImageFile    *multipart.FileHeader `form:"announcement_image"`
}
type UpdateRewardAnnounceRequestService struct {
	Id           int                   `form:"id" db:"id"`
	SchoolId     int                   `form:"school_id" db:"school_id"`
	Scope        string                `form:"scope" db:"scope"`
	Type         string                `form:"type" db:"type"`
	StartAt      time.Time             `form:"started_at" db:"started_at"`
	EndAt        time.Time             `form:"ended_at" db:"ended_at"`
	Title        string                `form:"title" db:"title"`
	Description  string                `form:"description" db:"description"`
	Image        *string               `db:"image_url"`
	Status       string                `form:"status" db:"status"`
	UpdatedBy    string                `db:"updated_by" `
	AcademicYear int                   `form:"academic_year" db:"academic_year"`
	SubjectId    int                   `form:"subject_id" db:"subject_id"`
	ItemList     []ItemListRequest     `form:"item_list"`
	GoldCoin     *int                  `form:"gold_coin"`
	ArcadeCoin   *int                  `form:"arcade_coin"`
	Ice          *int                  `form:"ice"`
	AdminLoginAs *string               `db:"admin_login_as"`
	ImageFile    *multipart.FileHeader `form:"announcement_image"`
}
type CreateNewsAnnounceRequest struct {
	SchoolId     int                   `form:"school_id" db:"school_id"`
	Scope        string                `form:"scope" db:"scope"`
	Type         string                `form:"type" db:"type"`
	StartAt      time.Time             `form:"started_at" db:"started_at"`
	EndAt        time.Time             `form:"ended_at" db:"ended_at"`
	Title        string                `form:"title" db:"title"`
	Description  string                `form:"description" db:"description"`
	Image        *string               `db:"image_url"`
	Status       string                `form:"status" db:"status"`
	CreatedBy    string                `db:"created_by"`
	AcademicYear int                   `form:"academic_year" db:"academic_year"`
	SubjectId    int                   `form:"subject_id" db:"subject_id"`
	AdminLoginAs *string               `db:"admin_login_as"`
	ImageFile    *multipart.FileHeader `form:"announcement_image"`
}
type UpdateNewsAnnounceRequest struct {
	Id           int                   `form:"id" db:"id"`
	SchoolId     int                   `form:"school_id" db:"school_id"`
	Scope        string                `form:"scope" db:"scope"`
	Type         string                `form:"type" db:"type"`
	StartAt      time.Time             `form:"started_at" db:"started_at"`
	EndAt        time.Time             `form:"ended_at" db:"ended_at"`
	Title        string                `form:"title" db:"title"`
	Description  string                `form:"description" db:"description"`
	Image        *string               `db:"image_url"`
	Status       string                `form:"status" db:"status"`
	UpdatedBy    string                ` db:"updated_by"`
	AcademicYear int                   `form:"academic_year" db:"academic_year"`
	SubjectId    int                   `form:"subject_id" db:"subject_id"`
	AdminLoginAs *string               `db:"admin_login_as"`
	ImageFile    *multipart.FileHeader `form:"announcement_image"`
}
type AddRewardItemRequest struct {
	ItemId           int
	AnnounceRewardId int
	Amount           int
	ExpiredAt        time.Time
}
type AddRewardCoinRequest struct {
	AnnnouncementId int
	GoldCoin        *int
	ArcadeCoin      *int
	Ice             *int
}
type UpdateRewardCoinRequest struct {
	AnnnouncementId int
	GoldCoin        *int
	ArcadeCoin      *int
	Ice             *int
}
type UpdateRewardItemRequest struct {
	ItemId           int
	AnnounceRewardId int
	Amount           int
	ExpiredAt        time.Time
}

type SystemAnnounceFilter struct {
	StartedAtStart *time.Time `query:"started_at_start"`
	StartedAtEnd   *time.Time `query:"started_at_end"`
	EndedAtStart   *time.Time `query:"ended_at_start"`
	EndedAtEnd     *time.Time `query:"ended_at_end"`
	StartDate      string     `query:"started_at"`
	EndDate        string     `query:"ended_at"`
	SchoolId       int        `query:"school_id"`
	Status         string     `query:"status"`
	AnnouncementId int        `query:"announcement_id"`
	Title          string     `query:"title"`
	SchoolName     string     `query:"school_name"`
}
type EventAnnounceFilter struct {
	StartDate      string `query:"started_at"`
	EndDate        string `query:"ended_at"`
	SchoolId       int    `query:"school_id"`
	SubjectId      int    `query:"subject_id"`
	YearId         int    `query:"year_id"`
	AcademicYear   int    `query:"academic_year"`
	Status         string `query:"status"`
	AnnouncementId int    `query:"announcement_id"`
	Title          string `query:"title"`
	SchoolName     string `query:"school_name"`
}
type RewardAnnounceFilter struct {
	StartDate      string `query:"started_at"`
	EndDate        string `query:"ended_at"`
	SchoolId       int    `query:"school_id"`
	SubjectId      int    `query:"subject_id"`
	YearId         int    `query:"year_id"`
	AcademicYear   int    `query:"academic_year"`
	Status         string `query:"status"`
	AnnouncementId int    `query:"announcement_id"`
	Title          string `query:"title"`
	SchoolName     string `query:"school_name"`
}
type NewsAnnounceFilter struct {
	StartDate      string `query:"started_at"`
	EndDate        string `query:"ended_at"`
	SchoolId       int    `query:"school_id"`
	SubjectId      int    `query:"subject_id"`
	YearId         int    `query:"year_id"`
	AcademicYear   int    `query:"academic_year"`
	Status         string `query:"status"`
	AnnouncementId int    `query:"announcement_id"`
	Title          string `query:"title"`
	SchoolName     string `query:"school_name"`
}

type CheckRoleRequest struct {
	Roles     []int
	SubjectId string
}

type AnnounceBulkEdit struct {
	Id     int    `db:"id" json:"id"`
	Status string `db:"status" json:"status"`
}
type User struct {
	UpdatedBy    string  `db:"updated_by"`
	AdminLoginAs *string `db:"admin_login_as"`
}

type SubjectFilter struct {
	SchoolId int `query:"school_id"`
	YearId   int `query:"year_id"`
}
type YearFilter struct {
	SchoolId int `query:"school_id"`
}
type ItemDropDownRequest struct {
	SchoolId  int    `query:"school_id"`
	SubjectId int    `query:"subject_id"`
	Type      string `query:"type"`
	Id        int    `query:"id"`
	Name      string `query:"name"`
}
type CoinDelete struct {
	CoinType string `query:"coin_type"`
}
