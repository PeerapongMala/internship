package constant

import "time"

type StudentEntity struct {
	Id         string     `json:"id" db:"user_id"`
	StudentId  string     `json:"student_id" db:"student_id"`
	Title      string     `json:"title" db:"title"`
	FirstName  string     `json:"first_name" db:"first_name"`
	LastName   string     `json:"last_name" db:"last_name"`
	Email      *string    `json:"email" db:"email"`
	LastLogin  *time.Time `json:"last_login" db:"last_login"`
	Status     string     `json:"-" db:"status"`
	UpdatedAt  *time.Time `json:"-" db:"updated_at"`
	UpdatedBy  *string    `json:"-" db:"updated_by"`
	TotalCount int        `json:"-" db:"total_count"`
}

type ClassEntity struct {
	Id           int        `json:"id" db:"id"`
	AcademicYear int        `json:"academic_year" db:"academic_year"`
	Year         string     `json:"year" db:"year"` //ชั้นปี
	Name         string     `json:"name" db:"name"` //ห้อง
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
}

type LevelStatEntity struct {
	TotalPassed  int        `json:"total_passed_level" db:"total_passed"`
	TotalStar    int        `json:"total_star" db:"total_star"`
	TotalLevel   int        `json:"total_level" db:"total_level"`
	TotalAttempt int        `json:"total_attempt" db:"total_attempt"`
	LastPlayed   *time.Time `json:"last_played" db:"last_played"`
	AvgTimeUsed  float32    `json:"avg_time_used" db:"avg_time_used"`
}

type QuestionPlayLogStatEntity struct {
	AvgTimeUsed float32 `json:"avg_time_used" db:"avg_time_used"`
}

type StudentFamilyEntity struct {
	Id        int    `json:"family_id" db:"family_id"`
	UserId    string `json:"user_id" db:"user_id"`
	Title     string `json:"title" db:"title"`
	FirstName string `json:"first_name" db:"first_name"`
	LastName  string `json:"last_name" db:"last_name"`
	IsOwner   bool   `json:"is_owner" db:"is_owner"`
}

type TeacherStudentWithStateEntity struct {
	UserId           *string    `json:"user_id" db:"user_id"`
	StudentId        string     `json:"student_id" db:"student_id"`
	StudentTitle     string     `json:"student_title" db:"student_title"`
	StudentFirstName string     `json:"student_first_name" db:"student_first_name"`
	StudentLastName  string     `json:"student_last_name" db:"student_last_name"`
	StudentLastLogin *time.Time `json:"student_last_login" db:"student_last_login"`
	ClassId          int        `json:"class_id" db:"class_id"`
	ClassYear        string     `json:"class_year" db:"class_year"`
	ClassName        string     `json:"class_name" db:"class_name"`
	AcademicYear     int        `json:"academic_year" db:"academic_year"`
	TotalPassedStar  int        `json:"total_passed_star" db:"total_passed_star"`
	TotalPassedLevel int        `json:"total_passed_level" db:"total_passed_level"`
	TotalStar        int        `json:"total_star" db:"total_star"`
	TotalLevel       int        `json:"total_level" db:"total_level"`
	TotalAttempt     int        `json:"total_attempt" db:"total_attempt"`
	LastPlayed       *time.Time `json:"last_played" db:"last_played"`
	AvgTimeUsed      *float32   `json:"avg_time_used" db:"avg_time_used"`
}

type StudentDetail struct {
	Id        string     `json:"id" db:"id"`
	Title     string     `json:"title" db:"title"`
	FirstName string     `json:"first_name" db:"first_name"`
	LastName  string     `json:"last_name" db:"last_name"`
	LastLogin *time.Time `json:"last_login" db:"last_login"`
}

type ClassDetail struct {
	Id           int    `json:"id" db:"id"`
	Year         string `json:"year" db:"year"`
	Name         string `json:"name" db:"name"`
	AcademicYear int    `json:"academic_year" db:"academic_year"`
}

type LevelStat struct {
	TotalPassed  int        `json:"total_passed"`
	TotalStar    int        `json:"total_star"`
	TotalLevel   int        `json:"total_level"`
	TotalAttempt int        `json:"total_attempt"`
	LastPlayed   *time.Time `json:"last_played"`
	AvgTimeUsed  float32    `json:"avg_time_used"`
}

type LevelStatistics struct {
	Value float32 `json:"value"`
	Total int     `json:"total"`
}

type StudentLevelStat struct {
	Student            StudentDetail   `json:"student"`
	Class              ClassDetail     `json:"class"`
	LevelPassed        LevelStatistics `json:"level_passed"`
	TotalScore         LevelStatistics `json:"total_score"`
	TotalAttempt       int             `json:"total_attempt"`
	LastPlayed         *time.Time      `json:"last_played"`
	AvgTimeUsed        float32         `json:"avg_time_used"`
	IsEnableViewDetail bool            `json:"is_enable_view_detail"`
}

type TeacherStudentFilter struct {
	Id   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
}

type LevelClass struct {
	AcademicYear int        `json:"academic_year" db:"academic_year"`
	Year         string     `json:"year" db:"year"`
	Name         string     `json:"name" db:"name"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
}

type SchoolEntity struct {
	SchoolId    int    `db:"id"`
	SchoolName  string `db:"name"`
	SchoolCode  string `db:"code"`
	SchoolImage string `db:"image_url"`
}

type StatEntity struct {
	Score         *int       `db:"score"`
	TotalAttempt  *int       `db:"total_attempt"`
	TotalTimeUsed *int       `db:"total_time_used"`
	AvgTimeUsed   *float32   `db:"avg_time_used"`
	LastPlayedAt  *time.Time `db:"last_played_at"`
}

type StudentAcademicYearStatEntity struct {
	ClassEntity
	CurriculumGroupShortName string `db:"curriculum_group_short_name"`
	SubjectName              string `db:"subject_name"`
	LessonId                 int    `db:"lesson_id"`
	LessonIndex              int    `db:"lesson_index"`
	LessonName               string `db:"lesson_name"`
	TotalPassedLevel         *int   `db:"total_passed_level"`
	TotalLevel               *int   `db:"total_level"`

	StatEntity
}

type LessonStatEntity struct {
	SubLessonId    int    `db:"id"`
	SubLessonIndex int    `db:"index"`
	SubLessonName  string `db:"name"`
	MinLevelGroup  int    `db:"min_level_group"`
	MaxLevelGroup  int    `db:"max_level_group"`
	StatEntity
	TotalPassedLevel int `db:"total_passed_level"`
	TotalLevel       int `db:"total_level"`
}

type SubLessonStatEntity struct {
	LevelId      int    `db:"level_id"`
	LevelIndex   int    `db:"index"`
	LevelType    string `db:"level_type"`
	QuestionType string `db:"question_type"`
	Difficulty   string `db:"difficulty"`
	StatEntity
}

type LevelPlayStatEntity struct {
	PlayLogId       int       `db:"id"`
	PlaySequence    int       `db:"play_sequence"`
	Score           int       `db:"score"`
	AverageTimeUsed float32   `db:"average_time_used"`
	PlayedAt        time.Time `db:"played_at"`
}

type ItemEntity struct {
	RewardTransactionId int        `db:"id"`
	ItemId              int        `db:"item_id"`
	ItemType            string     `db:"type"`
	ItemImageUrl        string     `db:"image_url"`
	ItemName            string     `db:"name"`
	Description         string     `db:"description"`
	Status              string     `db:"status"`
	Amount              int        `db:"amount"`
	CreatedAt           time.Time  `db:"created_at"`
	CreatedBy           string     `db:"created_by"`
	UpdatedAt           *time.Time `db:"updated_at"`
}

type StudyGroupEntity struct {
	StudyGroupId   int    `db:"id"`
	StudyGroupName string `db:"name"`
}

type TeacherCommentEntity struct {
	Id             int        `db:"id" json:"comment_id"`
	TeacherUserId  string     `db:"teacher_id" json:"teacher_id"`
	Teacher        string     `db:"teacher" json:"teacher"`
	ImageUrl       string     `db:"image_url" json:"image_url"`
	AcademicYear   int        `db:"academic_year" json:"academic_year"`
	CreatedAt      *time.Time `db:"created_at" json:"created_at"`
	Year           string     `db:"year" json:"year"` //ชั้นปี
	SubjectName    string     `db:"subject_name" json:"subject"`
	LessonName     string     `db:"lesson_name" json:"lesson"`
	LessonIndex    int        `db:"lesson_index" json:"lesson_index"`
	SubLessonName  string     `db:"sub_lesson_name" json:"sub_lesson"`
	SubLessonIndex string     `db:"sub_lesson_index" json:"sub_lesson_index"`
	LevelIndex     int        `db:"level_index" json:"level_index"`
	Text           string     `db:"text" json:"text"`
}

type AcademicYearRangeEntity struct {
	Id        *int       `json:"id" db:"id"`
	SchoolId  *int       `json:"school_id" db:"school_id"`
	Name      *string    `json:"name" db:"name"`
	StartDate *time.Time `json:"start_date" db:"start_date"`
	EndDate   *time.Time `json:"end_date" db:"end_date"`
}

type SubjectEntity struct {
	ID   *int    `json:"id" db:"id"`
	Name *string `json:"name" db:"name"`
}
