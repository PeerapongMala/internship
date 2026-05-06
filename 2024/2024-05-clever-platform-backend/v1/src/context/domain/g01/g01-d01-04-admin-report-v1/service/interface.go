package service

type ServiceInterface interface {
	SchoolReportList(in *SchoolReportListInput) (*SchoolReportListOutput, error)
	ClassReportList(in *ClassReportListInput) (*ClassReportListOutput, error)
	StudentReportList(in *StudentReportListInput) (*StudentReportListOutput, error)
	LessonReportList(in *LessonReportListInput) (*LessonReportListOutput, error)
	SubLessonReportList(in *SubLessonReportListInput) (*SubLessonReportListOutput, error)
	LevelReportList(in *LevelReportListInput) (*LevelReportListOutput, error)
	LevelPlayLogList(in *LevelPlayLogListInput) (*LevelPlayLogListOutput, error)

	CurriculumGroupList(in *CurriculumGroupListInput) (*CurriculumGroupListOutput, error)
	SubjectList(in *SubjectListInput) (*SubjectListOutput, error)
	LessonList(in *LessonListInput) (*LessonListOutput, error)
	SubLessonList(in *SubLessonListInput) (*SubLessonListOutput, error)
	StudentAcademicYearList(in *StudentAcademicYearListInput) (*StudentAcademicYearListOutput, error)

	SchoolReportCaseDownloadCsv(in *SchoolReportCaseDownloadCsvInput) (*SchoolReportCaseDownloadCsvOutput, error)
	ClassReportCaseDownloadCsv(in *ClassReportCaseDownloadCsvInput) (*ClassReportCaseDownloadCsvOutput, error)
	StudentReportCaseDownloadCsv(in *StudentReportCaseDownloadCsvInput) (*StudentReportCaseDownloadCsvOutput, error)
	LessonReportCaseDownloadCsv(in *LessonReportCaseDownloadCsvInput) (*LessonReportCaseDownloadCsvOutput, error)
	SubLessonReportCaseDownloadCsv(in *SubLessonReportCaseDownloadCsvInput) (*SubLessonReportCaseDownloadCsvOutput, error)
	LevelReportCaseDownloadCsv(in *LevelReportCaseDownloadCsvInput) (*LevelReportCaseDownloadCsvOutput, error)
	LevelPlayLogCaseDownloadCsv(in *LevelPlayLogCaseDownloadCsvInput) (*LevelPlayLogCaseDownloadCsvOutput, error)
}
