package constant

import (
	"time"

	authConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d01-auth-v1/constant"
	adminUserConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
)

type SchoolInfo struct {
	SchoolId    int    `json:"school_id"`
	SchoolName  string `json:"school_name"`
	SchoolCode  string `json:"school_code"`
	SchoolImage string `json:"shool_image_url"`
}

type BaseStat struct {
	AverageTimeUsed float32    `json:"average_time_used"`
	TotalAttempt    int        `json:"total_attempt"`
	LastPlayedAt    *time.Time `json:"last_played_at"`
}

type OptionItem struct {
	Id       int    `json:"id" db:"id"`
	Label    string `json:"label" db:"label"`
	ParentId *int   `json:"parent_id" db:"parent_id"`
}

type OptionObject struct {
	OptionType string       `json:"option_type"`
	ParentKey  *string      `json:"parent_key"`
	Values     []OptionItem `json:"values"`
}

type StudentAcademicYearStat struct {
	ClassId                  int             `json:"class_id"`
	AcademicYear             int             `json:"academic_year"`
	ClassYear                string          `json:"class_year"` //ชั้นปี
	ClassName                string          `json:"class_name"` //ห้อง
	CurriculumGroupShortName string          `json:"curriculum_group_short_name"`
	SubjectName              string          `json:"subject_name"`
	LessonId                 int             `json:"lesson_id"`
	LessonIndex              int             `json:"lesson_index"`
	LessonName               string          `json:"lesson_name"`
	TotalScore               LevelStatistics `json:"total_score"`
	TotalPassedLevel         LevelStatistics `json:"total_passed_level"`
	BaseStat
}

type LevelGroup struct {
	From int `json:"from"`
	To   int `json:"to"`
}

type LessonStat struct {
	SubLessonId      int             `json:"sub_lesson_id"`
	SubLessonIndex   int             `json:"index"`
	SubLessonName    string          `json:"sub_lesson_name"`
	LevelGruop       LevelGroup      `json:"level_group"`
	TotalPassedLevel LevelStatistics `json:"total_passed_level"`
	TotalScore       LevelStatistics `json:"total_score"`
	BaseStat
}

type SubLessonStat struct {
	LevelId      int             `json:"level_id"`
	LevelIndex   int             `json:"index"`
	LevelType    string          `json:"level_type"`
	QuestionType string          `json:"question_type"`
	Difficulty   string          `json:"difficulty"`
	TotalScore   LevelStatistics `json:"total_score"`
	BaseStat
}

type LevelPlayStat struct {
	PlayLogId       int       `json:"play_log_id"`
	PlaySequence    int       `json:"play_sequence"`
	Score           int       `json:"score"`
	MaxScore        int       `json:"max_score"`
	AverageTimeUsed float32   `json:"average_time_used"`
	PlayedAt        time.Time `json:"played_at"`
}

type ItemInfo struct {
	RewardId     int        `json:"reward_id"`
	ItemId       int        `json:"item_id"`
	ItemType     string     `json:"item_type"`
	ItemImageUrl string     `json:"item_image_url"`
	ItemName     string     `json:"item_name"`
	Description  string     `json:"description"`
	Amount       int        `json:"amount"`
	GivedBy      string     `json:"gived_by"`
	ReceivedAt   time.Time  `json:"received_at"`
	UsedAt       *time.Time `json:"used_at"`
}

type StudyGroup struct {
	StudyGroupId   int    `json:"study_group_id"`
	StudyGroupName string `json:"study_group_name"`
}

type TeacherCommentCreateDTO struct {
	TeacherUserId string
	StudentUserId string
	LevelId       int    `json:"level_id" validate:"required"`
	Text          string `json:"text" validate:"required"`
	AcademicYear  int    `json:"academic_year" validate:"required"`
	CreatedAt     time.Time
	CreatedBy     string
	AdminLoginAs  *string `json:"admin_login_as"`
}

type StudentProfile struct {
	*adminUserConstant.StudentDataEntity
	OAuthList []authConstant.AuthOAuthEntity `json:"oauth"`
}

type TeacherCommentUpdate struct {
	CommentId    int
	Text         string
	UpdatedAt    time.Time
	UpdatedBy    string
	AdminLoginAs *string
}
