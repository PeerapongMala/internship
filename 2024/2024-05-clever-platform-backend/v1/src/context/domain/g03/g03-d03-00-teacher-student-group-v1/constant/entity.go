package constant

type Status string

const (
	Enabled  Status = "enabled"
	Disabled Status = "disabled"
)

type SchoolIDParams struct {
	SchoolID int `params:"school_id"`
}

type StudentGroupResult struct {
	ID                  int     `db:"id" json:"id"`
	ClassID             int     `db:"class_id" json:"class_id"`
	StudyGroupName      *string `db:"study_group_name" json:"study_group_name"`
	CurriculumGroupID   int     `db:"curriculum_group_id" json:"curriculum_group_id"`
	SubjectName         *string `db:"subject_name" json:"subject_name"`
	Year                *string `db:"year" json:"year"`
	SchoolID            int     `db:"school_id" json:"school_id"`
	AcademicYear        *string `db:"academic_year" json:"academic_year"`
	Room                int     `db:"room" json:"room"`
	StudentCount        int     `db:"student_count" json:"student_count"`
	AvgStarsEarned      float64 `db:"avg_stars_earned" json:"avg_stars_earned"`
	AvgMaxPossibleStars float64 `db:"avg_max_possible_stars" json:"avg_max_possible_stars"`
	AvgPassedLevels     float64 `db:"avg_passed_levels" json:"avg_passed_levels"`
	AvgAllLevels        float64 `db:"avg_all_levels" json:"avg_all_levels"`
	AvgPlayTime         float64 `db:"avg_play_time" json:"avg_play_time"`
	AvgTimePerQuestion  float64 `db:"avg_time_per_question" json:"avg_time_per_question"`
	Status              string  `db:"status" json:"status"`
}

type PaginationResult struct {
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	TotalCount int `json:"total_count"`
}
