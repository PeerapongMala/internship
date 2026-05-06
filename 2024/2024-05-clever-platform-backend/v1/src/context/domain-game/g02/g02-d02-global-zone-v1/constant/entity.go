package constant

type SubjectResponse struct {
	No                            *int    `json:"no" db:"no"`
	SeedSubjectGroupId            *int    `json:"seed_subject_group_id" db:"seed_subject_group_id"`
	SubjectName                   *string `json:"subject_name" db:"subject_name"`
	SubjectID                     *int    `json:"subject_id" db:"subject_id"`
	YearName                      *string `json:"year_name" db:"year_name"`
	YearShortName                 *string `json:"year_short_name" db:"year_short_name"`
	CurriculumGroupName           *string `json:"curriculum_group_name" db:"curriculum_group_name"`
	IsEnabled                     *bool   `json:"is_enabled" db:"is_enabled"`
	IsSchoolSubjectEnabled        *bool   `json:"is_school_subject_enabled" db:"is_school_subject_enabled"`
	IsContractEnabled             *bool   `json:"is_contract_enabled,omitempty" db:"is_contract_enabled"`
	IsInContractTime              *bool   `json:"is_in_contract_time,omitempty" db:"is_in_contract_time"`
	IsContractSubjectGroupEnabled *bool   `json:"is_contract_subject_group_enabled,omitempty" db:"is_contract_subject_group_enabled"`
	IsCurriculumGroupEnabled      *bool   `json:"is_curriculum_group_enabled,omitempty" db:"is_curriculum_group_enabled"`
	IsPlatformEnabled             *bool   `json:"is_platform_enabled" db:"is_platform_enabled"`
	IsYearEnabled                 *bool   `json:"is_year_enabled,omitempty" db:"is_year_enabled"`
	IsSubjectGroupEnabled         *bool   `json:"is_subject_group_enabled,omitempty" db:"is_subject_group_enabled"`
	IsSubjectEnabled              *bool   `json:"is_subject_enabled,omitempty" db:"is_subject_enabled"`
	ImageUrl                      *string `json:"image_url" db:"image_url"`
}

type AnnouncementEntity struct {
	AnnouncementId *int    `json:"announcement_id" db:"announcement_id"`
	StartedAt      *string `json:"started_at" db:"started_at"`
	EndedAt        *string `json:"ended_at" db:"ended_at"`
	Title          *string `json:"title" db:"title"`
	Description    *string `json:"description" db:"description"`
	ImageURL       *string `json:"image_url" db:"image_url"`
	IsRead         *bool   `json:"is_read" db:"is_read"`
	IsDeleted      *bool   `json:"-" db:"is_deleted"`
	IsReceived     *bool   `json:"-" db:"is_received"`
}

type UserAnnouncementEntity struct {
	UserId         *string `json:"user_id" db:"user_id"`
	AnnouncementId *int    `json:"announcement_id" db:"announcement_id"`
	IsRead         *bool   `json:"is_read" db:"is_read"`
	IsDeleted      *bool   `json:"is_deleted" db:"is_deleted"`
	IsReceived     *bool   `json:"is_received" db:"is_received"`
}
