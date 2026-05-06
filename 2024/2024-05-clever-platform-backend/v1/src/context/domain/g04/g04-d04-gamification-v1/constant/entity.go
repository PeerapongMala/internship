package constant

import "time"

type LevelRewardEntity struct {
	Id                 int    `json:"id" db:"id"`
	SeedSubjectGroupId int    `json:"seed_subject_group_id" db:"seed_subject_group_id"`
	LevelType          string `json:"level_type" db:"level_type"`
	StarRequired       int    `json:"star_required" db:"star_required"`
	GoldCoin           int    `json:"gold_coin" db:"gold_coin"`
	ArcadeCoin         int    `json:"arcade_coin" db:"arcade_coin"`
}

type SeedSubjectGroupEntity struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type LevelEntity struct {
	Id           int        `json:"id" db:"id"`
	RewardAmount int        `json:"reward_amount" db:"reward_amount"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
	Status       string     `json:"status" db:"status"`
}

type LevelDataEntity struct {
	Index           int    `json:"index" db:"index"`
	CurriculumGroup string `json:"curriculum_group" db:"curriculum_group"`
	Platform        string `json:"platform" db:"platform"`
	Year            string `json:"year" db:"year"`
	SubjectGroup    string `json:"subject_group" db:"subject_group"`
	Subject         string `json:"subject_name" db:"subject"`
	Lesson          string `json:"lesson" db:"lesson"`
	SubLesson       string `json:"sub_lesson" db:"sub_lesson"`
}

type SubjectEntity struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type LessonEntity struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type SubLessonEntity struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type ItemEntity struct {
	Id          int     `json:"id" db:"id"`
	Name        *string `json:"name" db:"name"`
	ImageUrl    *string `json:"image_url" db:"image_url"`
	Type        string  `json:"type" db:"type"`
	Description *string `json:"description" db:"description"`
}

type LevelSpecialRewardEntity struct {
	LevelId int `json:"level_id" db:"level_id"`
	ItemId  int `json:"item_id" db:"item_id"`
	Amount  int `json:"amount" db:"amount"`
}

type LevelSpecialRewardItemEntity struct {
	Id          int        `json:"id" db:"id"`
	Name        *string    `json:"name" db:"name"`
	ImageUrl    *string    `json:"image_url" db:"image_url"`
	Type        string     `json:"type" db:"type"`
	Description *string    `json:"description" db:"description"`
	Amount      int        `json:"amount" db:"amount"`
	UpdatedAt   *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy   *string    `json:"updated_by" db:"updated_by"`
	Status      string     `json:"status" db:"status"`
}
