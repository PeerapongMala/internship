package constant

import "time"

type LearningLessonList struct {
	Id                  int                 `json:"id" db:"id"`
	SubjectId           int                 `json:"subject_id" db:"subject_id"`
	Name                string              `json:"name" db:"name"`
	FontName            string              `json:"font_name" db:"font_name"`
	FontSize            string              `json:"font_size" db:"font_size"`
	BackgroundImagePath string              `json:"background_image_path" db:"background_image_path"`
	Index               int                 `json:"index" db:"index"`
	Status              string              `json:"status" db:"status"`
	CreatedAt           time.Time           `json:"created_at" db:"created_at"`
	CreatedBy           string              `json:"created_by" db:"created_by"`
	UpdatedAt           *time.Time          `json:"updated_at" db:"updated_at"`
	UpdatedBy           *string             `json:"updated_by" db:"updated_by"`
	AdminLoginAs        *string             `json:"admin_login_as" db:"admin_login_as"`
	WizardIndex         int                 `json:"wizard_index" db:"wizard_index"`
	Monsters            map[string][]string `json:"monsters"`
	Stat                *PlayStatEntity     `json:"stat"`
}

type Monster struct {
	ImagePath *string `json:"monster" db:"image_path"`
	LevelType *string `json:"level_type" db:"level_type"`
}
type LearningLessonEntity struct {
	Id                  int        `json:"id" db:"id"`
	SubjectId           int        `json:"subject_id" db:"subject_id"`
	SubjectName         string     `json:"subject_name" db:"subject_name"`
	YearId              int        `json:"year_id" db:"year_id"`
	YearName            string     `json:"year_name" db:"year_name"`
	SubLessonCount      int        `json:"sub_lesson_count" db:"sub_lesson_count"`
	Index               int        `json:"index" db:"index"`
	Name                string     `json:"name" db:"name"`
	FontName            string     `json:"font_name" db:"font_name"`
	FontSize            string     `json:"font_size" db:"font_size"`
	BackgroundImagePath string     `json:"background_image_path" db:"background_image_path"`
	Status              string     `json:"status" db:"status"`
	WizardIndex         int        `json:"wizard_index" db:"wizard_index"`
	CreatedAt           time.Time  `json:"created_at" db:"created_at"`
	CreatedBy           string     `json:"created_by" db:"created_by"`
	UpdatedAt           *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy           *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs        *string    `json:"admin_login_as" db:"admin_login_as"`
}

type LearningSublessonList struct {
	Id            int             `json:"id" db:"id"`
	LessonId      int             `json:"lesson_id" db:"lesson_id"`
	IndicatorId   int             `json:"indicator_id" db:"indicator_id"`
	Index         int             `json:"index" db:"index"`
	Name          *string         `json:"name" db:"name"`
	Status        string          `json:"status" db:"status"`
	CreatedAt     time.Time       `json:"created_at" db:"created_at"`
	CreatedBy     string          `json:"created_by" db:"created_by"`
	UpdatedAt     *time.Time      `json:"updated_at" db:"updated_at"`
	UpdatedBy     *string         `json:"updated_by" db:"updated_by"`
	AdminLoginAs  *string         `json:"admin_login_as" db:"admin_login_as"`
	IndicatorName *string         `json:"indicator_name" db:"indicator_name"`
	Stat          *PlayStatEntity `json:"stat"`
}

type LearningSublessonDataEntity struct {
	Id           int        `json:"id" db:"id"`
	SubjectId    int        `json:"subject_id" db:"subject_id"`
	SubjectName  string     `json:"subject_name" db:"subject_name"`
	YearId       int        `json:"year_id" db:"year_id"`
	YearName     string     `json:"year_name" db:"year_name"`
	LevelCount   int        `json:"level_count" db:"level_count"`
	LessonId     int        `json:"lesson_id" db:"lesson_id"`
	Index        int        `json:"index" db:"index"`
	IndicatorId  int        `json:"indicator_id" db:"indicator_id"`
	Name         *string    `json:"name" db:"name"`
	Status       string     `json:"status" db:"status"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	CreatedBy    string     `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs *string    `json:"admin_login_as" db:"admin_login_as"`
}

type PlayStatEntity struct {
	Id           *int `json:"-" db:"id"`
	PlayedLevels *int `json:"played_levels" db:"played_levels"`
	TotalLevels  *int `json:"total_levels" db:"total_levels"`
	PlayedStars  *int `json:"played_stars" db:"played_stars"`
	TotalStars   *int `json:"total_stars" db:"total_stars"`
}
