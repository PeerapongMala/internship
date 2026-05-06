package constant

import "time"

type PlatformEntity struct {
	Id                int        `json:"id" db:"id"`
	CurriculumGroupId int        `json:"curriculum_group_id" db:"curriculum_group_id"`
	SeedPlatformName  string     `json:"seed_platform_name,omitempty" db:"seed_platform_name"`
	SeedPlatformId    int        `json:"seed_platform_id" db:"seed_platform_id"`
	Status            string     `json:"status" db:"status"`
	CreatedAt         time.Time  `json:"created_at" db:"created_at"`
	CreatedBy         string     `json:"created_by" db:"created_by"`
	UpdatedAt         *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy         *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs      *string    `json:"admin_login_as" db:"admin_login_as"`
}

type PlatformWithSubjectsEntity struct {
	*PlatformEntity
	Subjects []SubjectEntity `json:"subjects"`
}

type SeedPlatformEntity struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type YearEntity struct {
	Id                int        `json:"id" db:"id"`
	CurriculumGroupId int        `json:"curriculum_group_id" db:"curriculum_group_id"`
	PlatformId        int        `json:"platform_id" db:"platform_id"`
	SeedYearName      string     `json:"seed_year_name,omitempty" db:"seed_year_name"`
	SeedYearId        int        `json:"seed_year_id" db:"seed_year_id"`
	Status            string     `json:"status" db:"status"`
	CreatedAt         time.Time  `json:"created_at" db:"created_at"`
	CreatedBy         string     `json:"created_by" db:"created_by"`
	UpdatedAt         *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy         *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs      *string    `json:"admin_login_as" db:"admin_login_as"`
}

type YearWithSubjectEntity struct {
	*YearEntity
	SeedYearName      string          `json:"seed_year_name" db:"seed_year_name"`
	SeedYearShortName string          `json:"seed_year_short_name" db:"seed_year_short_name"`
	Subjects          []SubjectEntity `json:"subjects"`
}

type SubjectGroupEntity struct {
	Id                   int        `json:"id" db:"id"`
	YearId               int        `json:"year_id" db:"year_id"`
	SeedSubjectGroupName string     `json:"seed_subject_group_name,omitempty" db:"seed_subject_group_name"`
	SeedSubjectGroupId   int        `json:"seed_subject_group_id" db:"seed_subject_group_id"`
	Status               string     `json:"status" db:"status"`
	CreatedAt            time.Time  `json:"created_at" db:"created_at"`
	CreatedBy            string     `json:"created_by" db:"created_by"`
	UpdatedAt            *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy            *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs         *string    `json:"admin_login_as" db:"admin_login_as"`
	FullOption           *bool      `json:"full_option" db:"full_option"`
	Theme                *string    `json:"theme" db:"theme"`
	Url                  *string    `json:"url" db:"url"`
}

type SubjectEntity struct {
	Id                          int        `json:"id" db:"id"`
	SubjectGroupId              int        `json:"subject_group_id" db:"subject_group_id"`
	Name                        string     `json:"name" db:"name"`
	Project                     *string    `json:"project" db:"project"`
	SubjectLanguageType         string     `json:"subject_language_type" db:"subject_language_type"`
	SubjectLanguage             *string    `json:"subject_language" db:"subject_language"`
	SubjectTranslationLanguages []string   `json:"subject_translation_languages"`
	ImageUrl                    *string    `json:"image_url" db:"image_url"`
	Status                      string     `json:"status" db:"status"`
	CreatedAt                   time.Time  `json:"created_at" db:"created_at"`
	CreatedBy                   string     `json:"created_by" db:"created_by"`
	UpdatedAt                   *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy                   *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs                *string    `json:"admin_login_as" db:"admin_login_as"`
}

type SubjectDataEntity struct {
	*SubjectEntity
	SeedSubjectGroupName string `json:"seed_subject_group_name" db:"seed_subject_group_name"`
	SeedYearId           *int   `json:"seed_year_id" db:"seed_year_id"`
	SeedYearShortName    string `json:"seed_year_short_name" db:"seed_year_short_name"`
	SeedSubjectGroupId   int    `json:"seed_subject_group_id" db:"seed_subject_group_id"`
}

type SubjectGroupDataEntity struct {
	SubjectGroupEntity
	SubjectGroupName string `json:"seed_subject_group_name" db:"name"`
}

type SubjectGroupWithSubjectEntity struct {
	SubjectGroupDataEntity
	Subjects []SubjectEntity `json:"subjects"`
}

type SeedYearEntity struct {
	Id        int        `json:"id" db:"id"`
	Name      string     `json:"name" db:"name"`
	ShortName string     `json:"short_name" db:"short_name"`
	Status    string     `json:"-" db:"status"`
	CreatedAt time.Time  `json:"-" db:"created_at"`
	CreatedBy string     `json:"-" db:"created_by"`
	UpdatedAt *time.Time `json:"-" db:"updated_at"`
	UpdatedBy *string    `json:"-" db:"updated_by"`
}

type SeedSubjectGroupEntity struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type TagGroupEntity struct {
	Id        int    `json:"id" db:"id"`
	Index     int    `json:"index" db:"index"`
	SubjectId int    `json:"-" db:"subject_id"`
	Name      string `json:"name" db:"name"`
}

type TagEntity struct {
	Id           int        `json:"id" db:"id"`
	TagGroupId   int        `json:"-" db:"tag_group_id"`
	Name         string     `json:"name" db:"name"`
	Status       string     `json:"status" db:"status"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	CreatedBy    string     `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs *string    `json:"admin_login_as" db:"admin_login_as"`
}

type TagGroupWithTagsEntity struct {
	*TagGroupEntity
	Tags []TagEntity `json:"tags"`
}

// subject translation

type SubjectTranslationEntity struct {
	Id        int    `json:"id" db:"id"`
	SubjectId int    `json:"subject_id" db:"subject_id"`
	Language  string `json:"language" db:"language"`
}
