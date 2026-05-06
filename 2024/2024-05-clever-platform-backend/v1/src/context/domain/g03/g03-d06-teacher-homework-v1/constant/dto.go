package constant

import "time"

type SubLessonWithLevelResponse struct {
	SubLessonId    *int            `json:"sub_lesson_id"`
	SubLessonName  *string         `json:"sub_lesson_name"`
	SubLessonIndex *int            `json:"sub_lesson_index"`
	TotalLevel     int             `json:"total_level"`
	Level          []LevelResponse `json:"level"`
}

type LevelResponse struct {
	LevelId         *int    `json:"level_id"`
	LevelIndex      int     `json:"level_index"`
	LevelDifficulty *string `json:"level_difficulty"`
}

type HomeworkStatDTO struct {
	TotalStudentCount    int `json:"total_student_count" db:"total_student_count"`
	OnTimeStudentCount   int `json:"on_time_student_count" db:"on_time_student_count"`
	LateStudentCount     int `json:"late_student_count" db:"late_student_count"`
	DoingStudentCount    int `json:"doing_student_count" db:"doing_student_count"`
	NotStartStudentCount int `json:"not_start_student_count" db:"not_start_student_count"`
}

type GetAssignToTargetListResponse struct {
	SeedYearId        *int            `json:"seed_year_id"`
	SeedYearShortName *string         `json:"seed_year_short_name"`
	Class             []ClassResponse `json:"class"`
}

type ClassResponse struct {
	ClassId    *int                 `json:"class_id"`
	ClassName  *string              `json:"class_name"`
	StudyGroup []StudyGroupResponse `json:"study_group"`
}

type StudyGroupResponse struct {
	StudyGroupId   *int    `json:"study_group_id"`
	StudyGroupName *string `json:"study_group_name"`
}

type HomeworkDetailResponse struct {
	SubLessonId     *int    `json:"sub_lesson_id"`
	SubLessonName   *string `json:"sub_lesson_name"`
	LevelId         *int    `json:"level_id"`
	LevelIndex      *int    `json:"level_index"`
	LevelType       *string `json:"level_type"`
	LevelDifficulty *string `json:"level_difficulty"`
	QuestionType    *string `json:"question_type"`
	HomeworkDetailStat
}

type HomeworkDetailStat struct {
	AvgStarCount             float64 `json:"avg_star_count"`
	AvgMaxStarCount          int     `json:"avg_max_star_count"`
	StudentDoneHomeworkCount int     `json:"student_done_homework_count"`
	TotalStudentCount        int     `json:"total_student_count"`
	DoneHomeworkCount        int     `json:"done_homework_count"`
	AvgTimeUsed              float64 `json:"avg_time_used"`
	AvgCountDoHomework       float64 `json:"avg_count_do_homework"`
	LatestDoHomeworkDate     string  `json:"latest_do_homework_date"`
}

type HomeworkSubmitDetailResponse struct {
	UserId       *string    `json:"user_id"`
	StudentNo    *string    `json:"student_no"`
	Title        *string    `json:"title"`
	FirstName    *string    `json:"first_name"`
	LastName     *string    `json:"last_name"`
	StarCount    int        `json:"star_count"`
	MaxStarCount int        `json:"max_star_count"`
	SubmittedAt  *time.Time `json:"submitted_at"`
	Status       *string    `json:"status"`
}

type HomeworkStudentListResponse struct {
	HomeworkSubmissionIndex int           `json:"homework_submission_index"`
	TotalStarCount          int           `json:"total_star_count"`
	MaxStarCount            int           `json:"max_star_count"`
	AvgTimeUsed             float64       `json:"avg_time_used"`
	Status                  string        `json:"status"`
	DetailLevel             []DetailLevel `json:"detail_level"`
}

type DetailLevel struct {
	LevelId            int `json:"level_id"`
	LevelPlayLogId     int `json:"level_play_log_id"`
	LevelIndex         int `json:"level_index"`
	TotalQuestion      int `json:"total_question"`
	TotalStar          int `json:"total_star"`
	CorrectAnswerCount int `json:"correct_answer_count"`
}
