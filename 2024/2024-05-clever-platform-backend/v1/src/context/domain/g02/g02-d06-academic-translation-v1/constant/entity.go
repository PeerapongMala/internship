package constant

import "time"

type SavedTextEntity struct {
	Id                int        `json:"-" db:"id"`
	CurriculumGroupId int        `json:"-" db:"curriculum_group_id"`
	GroupId           string     `json:"-" db:"group_id"`
	Language          string     `json:"language" db:"language"`
	Text              *string    `json:"text" db:"text"`
	TextToAi          *string    `json:"text_to_ai" db:"text_to_ai"`
	SpeechUrl         *string    `json:"speech_url" db:"speech_url"`
	Status            string     `json:"-" db:"status"`
	CreatedAt         time.Time  `json:"-" db:"created_at"`
	CreatedBy         string     `json:"-" db:"created_by"`
	UpdatedAt         *time.Time `json:"-" db:"updated_at"`
	UpdatedBy         *string    `json:"-" db:"updated_by"`
	AdminLoginAs      *string    `json:"-" db:"admin_login_as"`
}

type SavedTextUpdateEntity struct {
	Id                int        `json:"-" db:"id"`
	CurriculumGroupId int        `json:"-" db:"curriculum_group_id"`
	GroupId           string     `json:"-" db:"group_id"`
	Language          string     `json:"language" db:"language"`
	Text              *string    `json:"text" db:"text"`
	TextToAi          *string    `json:"text_to_ai" db:"text_to_ai"`
	SpeechUrl         string     `json:"speech_url" db:"speech_url"`
	Status            string     `json:"-" db:"status"`
	CreatedAt         time.Time  `json:"-" db:"created_at"`
	CreatedBy         string     `json:"-" db:"created_by"`
	UpdatedAt         *time.Time `json:"-" db:"updated_at"`
	UpdatedBy         *string    `json:"-" db:"updated_by"`
	AdminLoginAs      *string    `json:"-" db:"admin_login_as"`
}

type SavedTextDataEntity struct {
	GroupId      string                     `json:"saved_text_group_id"`
	Translations map[string]SavedTextEntity `json:"translations"`
}

type SavedTextListDataEntity struct {
	Id        string     `json:"id" db:"id"`
	GroupId   string     `json:"saved_text_group_id" db:"group_id"`
	Language  string     `json:"language" db:"language"`
	Text      *string    `json:"text" db:"text"`
	TextToAi  *string    `json:"text_to_ai" db:"text_to_ai"`
	SpeechUrl *string    `json:"speech_url" db:"speech_url"`
	UpdatedAt *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy *string    `json:"updated_by" db:"updated_by"`
	Status    string     `json:"status" db:"status"`
}
