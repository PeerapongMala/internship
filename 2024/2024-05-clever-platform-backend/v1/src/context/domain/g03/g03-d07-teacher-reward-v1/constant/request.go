package constant

import (
	"github.com/lib/pq"
	"time"
)

type TeacherRewardCreateService struct {
	StudentId []StudentInfo `json:"student" validate:"required,dive"`
	SubjectId int           `json:"subject_id" validate:"required"`
	ItemId    int           `json:"item_id" validate:"required"`
	Amount    int           `json:"amount" validate:"required"`
	Status    string        `json:"status" validate:"required"`
	TeacherId string        `json:"-"`
	Roles     []int         `json:"-"`
}

type TeacherRewardCreate struct {
	SubjectId    *int    `db:"subject_id"`
	TeacherId    string  `db:"teacher_id"`
	StudentId    string  `db:"student"`
	ClassId      int     `db:"class_id"`
	ItemId       int     `db:"item_id"`
	Amount       int     `db:"amount"`
	Status       string  `db:"status"`
	CreatedBy    string  `db:"created_by"`
	AdminLoginAs *string `db:"admin_login_as"`
}
type StudentInfo struct {
	StudentId string `json:"id"`
}

type TeacherRewardListFilter struct {
	SubjectId    int    `query:"subject_id"`
	Status       string `query:"status"`
	Id           int    `query:"id"`
	ItemName     string `query:"item_name"`
	Amount       int    `query:"amount"`
	StudentId    string `query:"student_id"`
	FirstName    string `query:"first_name"`
	LastName     string `query:"last_name"`
	AcademicYear int    `query:"academic_year"`
	Year         string `query:"year"`
	ClassId      int    `query:"class_id"`
}

type TeacherRewardBulkEdit struct {
	Id int `json:"id" validate:"required"`
}

type CallbackUpdate struct {
	Id        int
	SubjectId string
	Roles     []int
}

type CheckRoleRequest struct {
	Roles     []int
	SubjectId string
}

type StudentFilter struct {
	TeacherId    string
	StudentId    string `query:"student_id"`
	AcademicYear int    `query:"academic_year"`
	Year         string `query:"year"`
	Class        string `query:"class_id"`
	StudyGroupId int    `query:"study_group_id"`
}

type CouponTransactionFilter struct {
	TeacherId    string
	SearchText   string `query:"search_text"`
	Year         string `query:"year"`
	ClassId      int    `query:"class_id"`
	Status       string `query:"status"`
	AcademicYear int    `query:"academic_year"`
}

type ItemEntity struct {
	Id           *int `db:"id"`
	Type         string
	Name         string
	Description  string
	ImageUrl     *string
	Status       string
	CreatedAt    time.Time
	CreatedBy    string
	UpdatedAt    *time.Time
	UpdatedBy    *string
	AdminLoginAs *string
}

type TeacherReward struct {
	RewardName     string         `json:"reward_name" db:"reward_name"`
	RewardImage    *string        `json:"reward_image" db:"reward_image"`
	RewardImageKey *string        `json:"reward_image_key" db:"reward_image_key"`
	RewardAmount   int            `json:"reward_amount" db:"reward_amount"`
	ItemId         int            `db:"item_id"`
	StudentIds     pq.StringArray `json:"student_ids" db:"student_ids"`
}
