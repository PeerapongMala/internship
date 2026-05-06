package service

type ServiceInterface interface {
	ListLessonFilters(in *listLessonFiltersInput) ([]lessonFilter, error)
	ListSubLessonFilters(in *listSubLessonFiltersInput) ([]subLessonFilter, error)
	GetOverviewStats(in *getOverviewStatsInput) (overviewStats, error)
	GetLevelOverview(in *getLevelOverviewInput) (levelOverview, error)
	GetTopStudents(in *getTopStudentInput) ([]topStudent, error)
	GetLastLoggedInStudents(in *getLastLoggedInStudentsInput) (lastLoggedInStudentData, error)
	GetNotParticipateStudents(in *getNotParticipateStudentsInput) (notParticipateStudentData, error)
	GetLessonProgressions(in *getLessonProgressionsInput) ([]lessonProgression, error)
	GetSubLessonProgressions(in *getSubLessonProgressionsInput) ([]subLessonProgression, error)
}
