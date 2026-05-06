package service

type ServiceInterface interface {
	ListAcademicYearFilters(in *listAcademicYearFiltersInput) ([]academicYearFilter, error)
	ListYearFilters(in *listYearFiltersInput) ([]yearFilter, error)
	ListClassFilters(in *listClassFiltersInput) ([]classFilter, error)
	GetTotalStudents(in *getTotalStudentsInput) (totalStudent, error)
	GetLatestHomeworkOverview(in *getLatestHomeworkOverviewInput) (lastestHomeworkOverviewData, error)
	GetLevelOverview(in *getLevelOverviewInput) (levelOverviewData, error)
	GetScoreOverview(in *getScoreOverviewInput) (scoreOverviewData, error)
	GetQuestionOverview(in *getQuestionOverviewInput) (questionOverviewData, error)
	ListSubjectFilters(in *listSubjectFiltersInput) ([]subjectFilter, error)
	ListLessonFilters(in *listLessonFiltersInput) ([]lessonFilter, error)
	GetTopStudents(in *getTopStudentsInput) ([]topStudent, error)
	GetBottomStudents(in *getBottomStudentsInput) ([]bottomStudent, error)

	GetLessonOverview(in *getLessonOverviewInput) ([]lessonOverviewData, error)
	GetSubLessonOverview(in *getSubLessonOverviewInput) ([]subLessonOverviewData, error)

	GetHomeworkOverview(in *getHomeworkOverviewInput) (outs homeworkOverview, err error)
	TeacherSubjectList(in *TeacherSubjectListInput) (*TeacherSubjectListOutput, error)
}
