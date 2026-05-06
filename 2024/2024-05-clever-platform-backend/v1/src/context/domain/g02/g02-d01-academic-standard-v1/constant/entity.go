package constant

import "time"

type LearningAreaEntity struct {
	Id                int        `json:"id" db:"id"`
	CurriculumGroupId int        `json:"curriculum_group_id" db:"curriculum_group_id"`
	YearId            int        `json:"year_id" db:"year_id"`
	Name              string     `json:"name" db:"name"`
	Status            string     `json:"status" db:"status"`
	CreatedAt         time.Time  `json:"created_at" db:"created_at"`
	CreatedBy         string     `json:"created_by" db:"created_by"`
	UpdatedAt         *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy         *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs      *string    `json:"admin_login_as" db:"admin_login_as"`
	SeedYearName      string     `json:"seed_year_name,omitempty" db:"seed_year_name"`
}

type ContentEntity struct {
	Id               int        `json:"id" db:"id"`
	LearningAreaId   int        `json:"learning_area_id" db:"learning_area_id"`
	LearningAreaName string     `json:"learning_area_name" db:"learning_area_name"`
	Name             string     `json:"name" db:"name"`
	Status           string     `json:"status" db:"status"`
	CreatedAt        time.Time  `json:"created_at" db:"created_at"`
	CreatedBy        string     `json:"created_by" db:"created_by"`
	UpdatedAt        *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy        *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs     *string    `json:"admin_login_as" db:"admin_login_as"`
	SeedYearName     string     `json:"seed_year_name" db:"seed_year_name"`
}

type CriteriaEntity struct {
	Id               int        `json:"id" db:"id"`
	LearningAreaId   int        `json:"learning_area_id" db:"learning_area_id"`
	LearningAreaName string     `json:"learning_area_name" db:"learning_area_name"`
	SeedYearName     string     `json:"seed_year_name" db:"seed_year_name"`
	ContentId        int        `json:"content_id" db:"content_id"`
	ContentName      string     `json:"content_name" db:"content_name"`
	Name             string     `json:"name" db:"name"`
	ShortName        string     `json:"short_name" db:"short_name"`
	Status           string     `json:"status" db:"status"`
	CreatedAt        time.Time  `json:"created_at" db:"created_at"`
	CreatedBy        string     `json:"created_by" db:"created_by"`
	UpdatedAt        *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy        *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs     *string    `json:"admin_login_as" db:"admin_login_as"`
}

type LearningContentEntity struct {
	Id                int        `json:"id" db:"id"`
	LearningAreaId    int        `json:"learning_area_id" db:"learning_area_id"`
	LearningAreaName  string     `json:"learning_area_name" db:"learning_area_name"`
	SeedYearName      string     `json:"seed_year_name" db:"seed_year_name"`
	ContentId         int        `json:"content_id" db:"content_id"`
	ContentName       string     `json:"content_name" db:"content_name"`
	CriteriaId        int        `json:"criteria_id" db:"criteria_id"`
	CriteriaName      string     `json:"criteria_name" db:"criteria_name"`
	CriteriaShortName string     `json:"criteria_short_name" db:"criteria_short_name"`
	Name              string     `json:"name" db:"name"`
	Status            string     `json:"status" db:"status"`
	CreatedAt         time.Time  `json:"created_at" db:"created_at"`
	CreatedBy         string     `json:"created_by" db:"created_by"`
	UpdatedAt         *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy         *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs      *string    `json:"admin_login_as" db:"admin_login_as"`
}

type IndicatorEntity struct {
	Id                  int        `json:"id" db:"id"`
	YearId              int        `json:"year_id" db:"year_id"`
	LearningAreaId      int        `json:"learning_area_id" db:"learning_area_id"`
	LearningAreaName    string     `json:"learning_area_name" db:"learning_area_name"`
	SeedYearName        string     `json:"seed_year_name" db:"seed_year_name"`
	SeedYearShortName   string     `json:"seed_year_short_name" db:"seed_year_short_name"`
	ContentId           int        `json:"content_id" db:"content_id"`
	ContentName         string     `json:"content_name" db:"content_name"`
	CriteriaId          int        `json:"criteria_id" db:"criteria_id"`
	CriteriaName        string     `json:"criteria_name" db:"criteria_name"`
	CriteriaShortName   string     `json:"criteria_short_name" db:"criteria_short_name"`
	LearningContentId   int        `json:"learning_content_id" db:"learning_content_id"`
	LearningContentName string     `json:"learning_content_name" db:"learning_content_name"`
	Name                string     `json:"name" db:"name"`
	ShortName           string     `json:"short_name" db:"short_name"`
	TranscriptName      string     `json:"transcript_name" db:"transcript_name"`
	Status              string     `json:"status" db:"status"`
	CreatedAt           time.Time  `json:"created_at" db:"created_at"`
	CreatedBy           string     `json:"created_by" db:"created_by"`
	UpdatedAt           *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy           *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs        *string    `json:"admin_login_as" db:"admin_login_as"`
}

type YearEntity struct {
	Id           int    `json:"id" db:"id"`
	SeedYearName string `json:"seed_year_name" db:"seed_year_name"`
}

type SubCriteriaEntity struct {
	Id                int        `json:"id" db:"id"`
	CurriculumGroupId int        `json:"curriculum_group_id" db:"curriculum_group_id"`
	Index             int        `json:"index" db:"index"`
	Name              string     `json:"name" db:"name"`
	UpdatedAt         *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy         *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs      *string    `json:"admin_login_as" db:"admin_login_as"`
}

type SubCriteriaTopicEntity struct {
	Id                      int        `json:"id" db:"id"`
	SubCriteriaId           int        `json:"sub_criteria_id" db:"sub_criteria_id"`
	SubCriteriaName         string     `json:"sub_criteria_name" db:"sub_criteria_name"`
	IndicatorId             int        `json:"indicator_id" db:"indicator_id"`
	IndicatorName           string     `json:"indicator_name" db:"indicator_name"`
	IndicatorShortName      string     `json:"indicator_short_name" db:"indicator_short_name"`
	IndicatorTranscriptName string     `json:"indicator_transcript_name" db:"indicator_transcript_name"`
	LearningContentId       int        `json:"learning_content_id" db:"learning_content_id"`
	LearningContentName     string     `json:"learning_content_name" db:"learning_content_name"`
	CriteriaId              int        `json:"criteria_id" db:"criteria_id"`
	CriteriaName            string     `json:"criteria_name" db:"criteria_name"`
	CriteriaShortName       string     `json:"criteria_short_name" db:"criteria_short_name"`
	ContentId               int        `json:"content_id" db:"content_id"`
	ContentName             string     `json:"content_name" db:"content_name"`
	LearningAreaId          int        `json:"learning_area_id" db:"learning_area_id"`
	LearningAreaName        string     `json:"learning_area_name" db:"learning_area_name"`
	YearId                  int        `json:"year_id" db:"year_id"`
	SeedYearName            string     `json:"seed_year_name" db:"seed_year_name"`
	Name                    string     `json:"name" db:"name"`
	ShortName               string     `json:"short_name" db:"short_name"`
	Status                  string     `json:"status" db:"status"`
	CreatedAt               time.Time  `json:"created_at" db:"created_at"`
	CreatedBy               string     `json:"created_by" db:"created_by"`
	UpdatedAt               *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy               *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs            *string    `json:"admin_login_as" db:"admin_login_as"`
}
