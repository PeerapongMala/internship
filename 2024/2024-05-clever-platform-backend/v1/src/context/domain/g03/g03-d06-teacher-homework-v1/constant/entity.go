package constant

import (
	"time"

	"github.com/jackc/pgx/pgtype"
)

type SubjectListEntity struct {
	SubjectId           *int    `json:"subject_id" db:"subject_id"`
	SubjectName         *string `json:"subject_name" db:"subject_name"`
	YearId              *int    `json:"year_id" db:"year_id"`
	YearName            *string `json:"year_name" db:"year_name"`
	CurriculumGroupName *string `json:"curriculum_group_name" db:"curriculum_group_name"`
}

type HomeworkTemplateListEntity struct {
	Id                   *int    `json:"id" db:"id"`
	YearName             *string `json:"year_name" db:"year_name"`
	YearShortName        *string `json:"year_short_name" db:"year_short_name"`
	HomeworkTemplateName *string `json:"homework_template_name" db:"homework_template_name"`
	SubjectName          *string `json:"subject_name" db:"subject_name"`
	LessonId             *int    `json:"lesson_id" db:"lesson_id"`
	LessonName           *string `json:"lesson_name" db:"lesson_name"`
	LevelCount           *int    `json:"level_count" db:"level_count"`
	Status               *string `json:"status" db:"status"`
}

type HomeworkListEntity struct {
	HomeworkId       *int             `json:"homework_id" db:"homework_id"`
	HomeworkName     *string          `json:"homework_name" db:"homework_name"`
	SubjectId        *int             `json:"subject_id" db:"subject_id"`
	SubjectName      *string          `json:"subject_name" db:"subject_name"`
	LessonId         *int             `json:"lesson_id" db:"lesson_id"`
	LessonName       *string          `json:"lesson_name" db:"lesson_name"`
	StartedAt        *time.Time       `json:"started_at" db:"started_at"`
	DueAt            *time.Time       `json:"due_at" db:"due_at"`
	ClosedAt         *time.Time       `json:"closed_at" db:"closed_at"`
	LevelCount       *int             `json:"level_count" db:"level_count"`
	ClassIds         pgtype.Int4Array `json:"-" db:"class_ids"`
	StudyGroupIds    pgtype.Int4Array `json:"-" db:"study_group_ids"`
	SeedYearIds      pgtype.Int4Array `json:"-" db:"seed_year_ids"`
	AssignTargetList []string         `json:"assign_target_list" db:"assign_target_list"`
	Status           *string          `json:"status" db:"status"`
	*HomeworkStatDTO
}

type HomeworkTemplateEntity struct {
	Id           *int       `json:"id" db:"id"`
	SubjectId    *int       `json:"homework_template_subject_id" db:"subject_id"`
	YearId       *int       `json:"homework_template_year_id" db:"year_id"`
	LessonId     *int       `json:"homework_template_lesson_id" db:"lesson_id"`
	TeacherId    *string    `json:"teacher_id" db:"teacher_id"`
	Name         *string    `json:"homework_template_name" db:"name"`
	Status       *string    `json:"homework_template_status" db:"status"`
	CreatedAt    *time.Time `json:"created_at" db:"created_at"`
	CreatedBy    *string    `json:"created_by" db:"created_by"`
	UpdatedAt    *time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy    *string    `json:"updated_by" db:"updated_by"`
	AdminLoginAs *string    `json:"-" db:"admin_login_as"`
	LevelIds     []int      `json:"level_ids"`
}

type SubLessonLevelEntity struct {
	SubLessonId     *int    `json:"sub_lesson_id" db:"sub_lesson_id"`
	SubLessonName   *string `json:"sub_lesson_name" db:"sub_lesson_name"`
	SubLessonIndex  *int    `json:"sub_lesson_index" db:"sub_lesson_index"`
	LevelId         *int    `json:"level_id" db:"level_id"`
	LevelIndex      *int    `json:"level_index" db:"level_index"`
	LevelDifficulty *string `json:"level_difficulty" db:"level_difficulty"`
}

type LessonListEntity struct {
	Id   *int    `json:"id" db:"id"`
	Name *string `json:"lesson_name" db:"name"`
}

type ContPassLevelEntity struct {
	StudentId   *string    `json:"student_id" db:"student_id"`
	Count       *int       `json:"count" db:"count"`
	MaxPlayedAt *time.Time `json:"max_played_at" db:"max_played_at"`
}

type HomeworkEntity struct {
	Id                 *int                    `json:"id" db:"id"`
	Name               *string                 `json:"name" db:"name"`
	SubjectId          *int                    `json:"subject_id" db:"subject_id"`
	YearId             *int                    `json:"year_id" db:"year_id"`
	HomeworkTemplateId *int                    `json:"homework_template_id" db:"homework_template_id"`
	StartedAt          string                  `json:"started_at"`
	StartedAtTime      *time.Time              `json:"-" db:"started_at,omitempty"`
	DueAt              string                  `json:"due_at"`
	DueAtTime          *time.Time              `json:"-" db:"due_at"`
	ClosedAt           string                  `json:"closed_at"`
	ClosedAtTime       *time.Time              `json:"-" db:"closed_at"`
	Status             *string                 `json:"status" db:"status"`
	CreatedAt          *time.Time              `json:"created_at" db:"created_at"`
	CreatedBy          *string                 `json:"created_by" db:"created_by"`
	UpdatedAt          *time.Time              `json:"updated_at" db:"updated_at"`
	UpdatedBy          *string                 `json:"updated_by" db:"updated_by"`
	AdminLoginAs       *string                 `json:"-" db:"admin_login_as"`
	AssignedTo         *AssignedToEntity       `json:"assigned_to"`
	HomeworkTemplate   *HomeworkTemplateEntity `json:"homework_template"`
}

type AssignedDataEntity struct {
	ClassIds      pgtype.Int4Array `json:"-" db:"class_ids"`
	StudyGroupIds pgtype.Int4Array `json:"-" db:"study_group_ids"`
	SeedYearIds   pgtype.Int4Array `json:"-" db:"seed_year_ids"`
}

type AssignedToEntity struct {
	ClassIds      []int `json:"class_ids" db:"class_ids"`
	StudyGroupIds []int `json:"study_group_ids" db:"study_group_ids"`
	SeedYearIds   []int `json:"seed_year_ids" db:"seed_year_ids"`
}

type AssignToDataEntity struct {
	SeedYearId        *int    `json:"seed_year_id" db:"seed_year_id"`
	SeedYearShortName *string `json:"seed_year_short_name" db:"seed_year_short_name"`
	ClassId           *int    `json:"class_id" db:"class_id"`
	ClassName         *string `json:"class_name" db:"class_name"`
	StudyGroupId      *int    `json:"study_group_id" db:"study_group_id"`
	StudyGroupName    *string `json:"study_group_name" db:"study_group_name"`
}

type HomeworkDetailEntity struct {
	SubLessonId     *int    `json:"sub_lesson_id" db:"sub_lesson_id"`
	SubLessonName   *string `json:"sub_lesson_name" db:"sub_lesson_name"`
	LevelId         *int    `json:"level_id" db:"level_id"`
	LevelIndex      *int    `json:"level_index" db:"level_index"`
	LevelType       *string `json:"level_type" db:"level_type"`
	QuestionType    *string `json:"question_type" db:"question_type"`
	LevelDifficulty *string `json:"level_difficulty" db:"level_difficulty"`
}

type UserDataPlayHomeworkEntity struct {
	UserId         *string    `json:"user_id" db:"user_id"`
	StudentNo      *string    `json:"student_no" db:"student_no"`
	Title          *string    `json:"title" db:"title"`
	FirstName      *string    `json:"first_name" db:"first_name"`
	LastName       *string    `json:"last_name" db:"last_name"`
	LevelPlayCount *int       `json:"level_play_count" db:"level_play_count"`
	MaxPlayedAt    *time.Time `json:"max_played_at" db:"max_played_at"`
}

type HomeworkWithIndexEntity struct {
	Index              *int     `json:"index" db:"index"`
	LevelId            *int     `json:"level_id" db:"level_id"`
	LevelPlayLogId     *int     `json:"level_play_log_id" db:"level_play_log_id"`
	LevelIndex         *int     `json:"level_index" db:"level_index"`
	MaxStar            *int     `json:"max_star" db:"max_star"`
	AvgTimeUsed        *float64 `json:"avg_time_used" db:"avg_time_used"`
	TotalQuestionCount *int     `json:"total_question_count" db:"total_question_count"`
}

type ClassListEntity struct {
	Id        *int    `json:"id" db:"id"`
	ClassName *string `json:"class_name" db:"class_name"`
}

type YearListEntity struct {
	Id       *int    `json:"id" db:"id"`
	YearName *string `json:"year_name" db:"year_name"`
}

type StudentHomeworkStatEntity struct {
	DistinctStudentCount  *int     `json:"distinct_student_count" db:"distinct_student_count"`
	TotalAttempts         *int     `json:"total_attempts" db:"total_attempts"`
	AvgTimeUsed           *float64 `json:"avg_time_used" db:"avg_time_used"`
	AvgAttemptsPerStudent *float64 `json:"avg_attempts_per_student" db:"avg_attempts_per_student"`
	LastPlayedAt          *string  `json:"last_played_at" db:"last_played_at"`
}
