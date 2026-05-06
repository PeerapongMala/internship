package constant

import (
	"time"
)

type SubjectCheckinEntity struct {
	StudentId         string    `db:"student_id" json:"student_id"`
	SubjectId         int       `db:"subject_id" json:"subject_id"`
	LastCheckin       time.Time `db:"last_checkin" json:"last_checkin"`
	CurrentStreak     int       `db:"current_streak" json:"current_streak"`
	HighestStreak     int       `db:"highest_streak" json:"highest_streak"`
	MissLoginDay      *string   `db:"miss_login_day" json:"-"`
	MissLoginDaySlice []int     `db:"-" json:"miss_login_day"`
	AdminLoginAs      *string   `db:"admin_login_as" json:"-"`
}

type SubjectRewardEntity struct {
	SubjectId        *int `db:"subject_id" json:"subject_id"`
	Day              *int `db:"day" json:"day"`
	ItemId           *int `db:"item_id" json:"item_id"`
	GoldCoinAmount   *int `db:"gold_coin_amount" json:"gold_coin_amount"`
	ArcadeCoinAmount *int `db:"arcade_coin_amount" json:"arcade_coin_amount"`
	IceAmount        *int `db:"ice_amount" json:"ice_amount"`
	ItemAmount       *int `db:"item_amount" json:"item_amount"`
	Tier             *int `db:"tier" json:"tier"`
}

type ItemEntity struct {
	Id                 *int       `db:"id" json:"-"`
	TeacherItemGroupId *int       `db:"teacher_item_group_id" json:"-"`
	TemplateItemId     *int       `db:"template_item_id" json:"-"`
	Type               *string    `db:"type" json:"type,omitempty"`
	Name               *string    `db:"name" json:"name,omitempty"`
	Description        *string    `db:"description" json:"description,omitempty"`
	ImageUrl           *string    `db:"image_url" json:"image_url,omitempty"`
	Status             *string    `db:"status" json:"-"`
	CreatedAt          *time.Time `db:"created_at" json:"-"`
	CreatedBy          *string    `db:"created_by" json:"-"`
	UpdatedAt          *time.Time `db:"updated_at" json:"-"`
	UpdatedBy          *string    `db:"updated_by" json:"-"`
	AdminLoginAs       *string    `db:"admin_login_as" json:"-"`
}

type SubjectRewardWithItemEntity struct {
	SubjectRewardEntity
	ItemEntity
	Status string `db:"-" json:"status"`
}

type CheckinEntity struct {
	StudentId    string  `json:"student_id" binding:"required"`
	SubjectId    int     `json:"subject_id" binding:"required"`
	AdminLoginAs *string `json:"admin_login_as"`
}

type RewardByIdEntity struct {
	SubjectId int `json:"subject_id" binding:"required"`
}

type InventoryEntity struct {
	Id         *int    `db:"id"`
	StudentId  *string `db:"student_id"`
	GoldCoin   *int    `db:"gold_coin"`
	ArcadeCoin *int    `db:"arcade_coin"`
	Ice        *int    `db:"ice"`
}

type AnnouncementEntity struct {
	Id           *int       `db:"id" json:"id"`
	SchoolId     *int       `db:"school_id" json:"school_id,omitempty"`
	Scope        *string    `db:"scope" json:"scope"`
	Type         *string    `db:"type" json:"type"`
	StartedAt    *time.Time `db:"started_at" json:"started_at"`
	EndedAt      *time.Time `db:"ended_at" json:"ended_at"`
	Title        *string    `db:"title" json:"title"`
	Description  *string    `db:"description" json:"description"`
	ImageUrl     *string    `db:"image_url" json:"image_url,omitempty"`
	Status       *string    `db:"status" json:"status"`
	CreatedAt    *time.Time `db:"created_at" json:"created_at"`
	CreatedBy    *string    `db:"created_by" json:"created_by"`
	UpdatedAt    *time.Time `db:"updated_at" json:"updated_at,omitempty"`
	UpdatedBy    *string    `db:"updated_by" json:"updated_by,omitempty"`
	AdminLoginAs *string    `db:"admin_login_as" json:"admin_login_as,omitempty"`
}

type AnnouncementRewardEntity struct {
	AnnouncementId *int `db:"announcement_id" json:"announcement_id"`
	SubjectId      *int `db:"subject_id" json:"subject_id"`
	AcademicYear   *int `db:"academic_year" json:"academic_year"`
}

type AnnouncementRewardItemEntity struct {
	ItemId               *int       `db:"item_id" json:"item_id"`
	AnnouncementRewardId *int       `db:"announcement_reward_id" json:"announcement_reward_id"`
	Amount               *int       `db:"amount" json:"amount"`
	ExpiredAt            *time.Time `db:"expired_at" json:"expired_at"`
}

type RewardLogEntity struct {
	Id               *int       `db:"id" json:"id"`
	UserId           *string    `db:"user_id" json:"user_id"`
	GoldCoinAmount   *int       `db:"gold_coin_amount" json:"gold_coin_amount"`
	ArcadeCoinAmount *int       `db:"arcade_coin_amount" json:"arcade_coin_amount"`
	IceAmount        *int       `db:"ice_amount" json:"ice_amount"`
	ItemId           *int       `db:"item_id" json:"item_id"`
	ItemAmount       *int       `db:"item_amount" json:"item_amount"`
	AvatarId         *int       `db:"avatar_id" json:"avatar_id"`
	AvatarAmount     *int       `db:"avatar_amount" json:"avatar_amount"`
	PetId            *int       `db:"pet_id" json:"pet_id"`
	PetAmount        *int       `db:"pet_amount" json:"pet_amount"`
	Description      *string    `db:"description" json:"description"`
	ReceivedAt       *time.Time `db:"received_at" json:"received_at"`
	CreatedAt        *time.Time `db:"created_at" json:"created_at"`
}
