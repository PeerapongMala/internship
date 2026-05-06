package constant

type LearningAreaResponse struct {
	Id                       int     `db:"id" json:"id"`
	CurriculumGroupId        int     `db:"curriculum_group_id" json:"curriculum_group_id"`
	CurriculumGroupName      string  `db:"curriculum_group_name" json:"curriculum_group_name"`
	CurriculumGroupShortName string  `db:"curriculum_group_short_name" json:"curriculum_group_short_name"`
	YearId                   int     `db:"year_id" json:"year_id"`
	SeedYearName             string  `db:"seed_year_name" json:"seed_year_name"`
	Name                     string  `db:"name" json:"name"`
	Status                   string  `db:"status" json:"status"`
	CreatedAt                string  `db:"created_at" json:"created_at"`
	CreatedBy                string  `db:"created_by" json:"created_by"`
	UpdatedAt                *string `db:"updated_at" json:"updated_at"`
	UpdatedBy                *string `db:"updated_by" json:"updated_by"`
	AdminLoginAs             *string `db:"admin_login_as" json:"admin_login_as"`
}

type ContentResponse struct {
	Id                  int     `db:"id" json:"id"`
	Name                string  `db:"name" json:"name"`
	CurriculumGroupId   int     `db:"curriculum_group_id" json:"curriculum_group_id"`
	CurriculumGroupName string  `db:"curriculum_group_name" json:"curriculum_group_name"`
	LearningAreaId      int     `db:"learning_area_id" json:"learning_area_id"`
	LearningAreaName    string  `db:"learning_area_name" json:"learning_area_name"`
	YearId              int     `db:"year_id" json:"year_id"`
	SeedYearName        string  `db:"seed_year_name" json:"seed_year_name"`
	Status              string  `db:"status" json:"status"`
	CreatedAt           string  `db:"created_at" json:"created_at"`
	CreatedBy           string  `db:"created_by" json:"created_by"`
	UpdatedAt           *string `db:"updated_at" json:"updated_at"`
	UpdatedBy           *string `db:"updated_by" json:"updated_by"`
	AdminLoginAs        *string `db:"admin_login_as" json:"admin_login_as"`
}

type CriteriaResponse struct {
	Id               int     `db:"id" json:"id"`
	ShortName        string  `db:"short_name" json:"short_name"`
	Name             string  `db:"name" json:"name"`
	LearningAreaId   int     `db:"learning_area_id" json:"learning_area_id"`
	LearningAreaName string  `db:"learning_area_name" json:"learning_area_name"`
	ContentId        int     `db:"content_id" json:"content_id"`
	ContentName      string  `db:"content_name" json:"content_name"`
	YearId           int     `db:"year_id" json:"year_id"`
	SeedYearName     string  `db:"seed_year_name" json:"seed_year_name"`
	Status           string  `db:"status" json:"status"`
	CreatedAt        string  `db:"created_at" json:"created_at"`
	CreatedBy        string  `db:"created_by" json:"created_by"`
	UpdatedAt        *string `db:"updated_at" json:"updated_at"`
	UpdatedBy        *string `db:"updated_by" json:"updated_by"`
	AdminLoginAs     *string `db:"admin_login_as" json:"admin_login_as"`
}

type LearningContentResponse struct {
	Id                int     `db:"id" json:"id"`
	Name              string  `db:"name" json:"name"`
	LearningAreaId    int     `db:"learning_area_id" json:"learning_area_id"`
	LearningAreaName  string  `db:"learning_area_name" json:"learning_area_name"`
	ContentId         int     `db:"content_id" json:"content_id"`
	ContentName       string  `db:"content_name" json:"content_name"`
	CriteriaId        int     `db:"criteria_id" json:"criteria_id"`
	CriteriaShortName string  `db:"criteria_short_name" json:"criteria_short_name"`
	CriteriaName      string  `db:"criteria_name" json:"criteria_name"`
	YearId            int     `db:"year_id" json:"year_id"`
	SeedYearName      string  `db:"seed_year_name" json:"seed_year_name"`
	Status            string  `db:"status" json:"status"`
	CreatedAt         string  `db:"created_at" json:"created_at"`
	CreatedBy         string  `db:"created_by" json:"created_by"`
	UpdatedAt         *string `db:"updated_at" json:"updated_at"`
	UpdatedBy         *string `db:"updated_by" json:"updated_by"`
	AdminLoginAs      *string `db:"admin_login_as" json:"admin_login_as"`
}

type IndicatorsResponse struct {
	Id                  int     `db:"id" json:"id"`
	ShortName           string  `db:"short_name" json:"short_name"`
	TranscriptName      string  `db:"transcript_name" json:"transcript_name"`
	Name                string  `db:"name" json:"name"`
	LearningAreaId      int     `db:"learning_area_id" json:"learning_area_id"`
	LearningAreaName    string  `db:"learning_area_name" json:"learning_area_name"`
	ContentId           int     `db:"content_id" json:"content_id"`
	ContentName         string  `db:"content_name" json:"content_name"`
	CriteriaId          int     `db:"criteria_id" json:"criteria_id"`
	CriteriaShortName   string  `db:"criteria_short_name" json:"criteria_short_name"`
	CriteriaName        string  `db:"criteria_name" json:"criteria_name"`
	LearningContentId   int     `db:"learning_content_id" json:"learning_content_id"`
	LearningContentName string  `db:"learning_content_name" json:"learning_content_name"`
	YearId              int     `db:"year_id" json:"year_id"`
	SeedYearName        string  `db:"seed_year_name" json:"seed_year_name"`
	Status              string  `db:"status" json:"status"`
	CreatedAt           string  `db:"created_at" json:"created_at"`
	CreatedBy           string  `db:"created_by" json:"created_by"`
	UpdatedAt           *string `db:"updated_at" json:"updated_at"`
	UpdatedBy           *string `db:"updated_by" json:"updated_by"`
	AdminLoginAs        *string `db:"admin_login_as" json:"admin_login_as"`
}

type TopicResponse struct {
	Id                  int     `db:"id" json:"id"`
	LearningAreaId      int     `db:"learning_area_id" json:"learning_area_id"`
	LearningAreaName    string  `db:"learning_area_name" json:"learning_area_name"`
	ContentId           int     `db:"content_id" json:"content_id"`
	ContentName         string  `db:"content_name" json:"content_name"`
	CriteriaId          int     `db:"criteria_id" json:"criteria_id"`
	CriteriaShortName   string  `db:"criteria_short_name" json:"criteria_short_name"`
	CriteriaName        string  `db:"criteria_name" json:"criteria_name"`
	LearningContentId   int     `db:"learning_content_id" json:"learning_content_id"`
	LearningContentName string  `db:"learning_content_name" json:"learning_content_name"`
	IndicatorId         int     `db:"indicator_id" json:"indicator_id"`
	IndicatorName       string  `db:"indicator_name" json:"indicator_name"`
	SubCriteriaId       int     `db:"sub_criteria_id" json:"sub_criteria_id"`
	YearId              int     `db:"year_id" json:"year_id"`
	SeedYearName        string  `db:"seed_year_name" json:"seed_year_name"`
	ShortName           string  `db:"short_name" json:"short_name"`
	Name                string  `db:"name" json:"name"`
	Status              string  `db:"status" json:"status"`
	CreatedAt           string  `db:"created_at" json:"created_at"`
	CreatedBy           string  `db:"created_by" json:"created_by"`
	UpdatedAt           *string `db:"updated_at" json:"updated_at"`
	UpdatedBy           *string `db:"updated_by" json:"updated_by"`
	AdminLoginAs        *string `db:"admin_login_as" json:"admin_login_as"`
}

type ReportResponse struct {
	IndicatorId         int     `db:"indicator_id" json:"indicator_id"`
	IndicatorShortName  string  `db:"indicator_short_name" json:"indicator_short_name"`
	SeedYearName        string  `db:"seed_year_name" json:"seed_year_name"`
	ContentName         string  `db:"content_name" json:"content_name"`
	CriteriaName        string  `db:"criteria_name" json:"criteria_name"`
	LearningContentName string  `db:"learning_content_name" json:"learning_content_name"`
	IndicatorName       string  `db:"indicator_name" json:"indicator_name"`
	LessonName          string  `db:"lesson_name" json:"lesson_name"`
	SubLesseonName      string  `db:"sub_lesson_name" json:"sub_lesson_name"`
	LevelId             int     `db:"level_id" json:"level_id"`
	CreatedAt           string  `db:"created_at" json:"created_at"`
	CreatedBy           string  `db:"created_by" json:"created_by"`
	UpdatedAt           *string `db:"updated_at" json:"updated_at"`
	UpdatedBy           *string `db:"updated_by" json:"updated_by"`
}
