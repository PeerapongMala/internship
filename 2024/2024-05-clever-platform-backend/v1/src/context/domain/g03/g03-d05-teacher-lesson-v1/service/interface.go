package service

type ServiceInterface interface {
	ClassLessonList(in *ClassLessonListInput) (*ClassLessonListOutput, error)
	ClassLessonCaseToggle(in *ClassLessonCaseToggleInput) error
	ClassLessonCaseListCurriculumGroup(in *ClassLessonCaseListCurriculumGroupInput) (*ClassLessonCaseListCurriculumGroupOutput, error)
	TeacherCaseListSubject(in *ClassLessonCaseListSubjectInput) (*ClassLessonCaseListSubjectOutput, error)
	ClassSubLessonList(in *ClassSubLessonInput) (*ClassSubLessonOutput, error)
	ClassSubLessonCaseToggle(in *ClassSubLessonCaseToggleInput) error
	LevelList(in *LevelListInput) (*LevelListOutput, error)
	LevelCaseListUnlockedStudyGroup(in *LevelCaseListUnlockedStudyGroupInput) (*LevelCaseListUnlockedStudyGroupOutput, error)
	LevelCaseListUnlockedStudent(in *LevelCaseListUnlockedStudentInput) (*LevelCaseListUnlockedStudentOutput, error)
	LevelUnlockedForStudyGroupCreate(in *LevelUnlockedForStudyGroupCreateInput) error
	LevelUnlockedForStudentCreate(in *LevelUnlockedForStudentCreateInput) error
	StudentList(in *StudentListInput) (*StudentListOutput, error)
	StudyGroupList(in *StudyGroupListInput) (*StudyGroupListOutput, error)
	UnlockedStudyGroupCaseBulkEdit(in *UnlockedStudyGroupCaseBulkEditInput) error
	UnlockedStudentCaseBulkEdit(in *UnlockedStudentCaseBulkEditInput) error
	ClassList(in *ClassListInput) (*ClassListOutput, error)
	SeedAcademicYearList(in *SeedAcademicYearListInput) (*SeedAcademicYearListOutput, error)
	LessonLevelLockToggle(in *LessonLevelLockToggleInput) error

	LessonUnlockedForStudyGroupCreate(in *LessonUnlockedForStudyGroupCreateInput) error
	LessonCaseListUnlockedStudyGroup(in *LessonCaseListUnlockedStudyGroupInput) (*LessonCaseListUnlockedStudyGroupOutput, error)
	LessonUnlockedStudyGroupCaseBulkEdit(in *LessonUnlockedStudyGroupCaseBulkEditInput) error

	LessonUnlockedForStudentCreate(in *LessonUnlockedForStudentCreateInput) error
	LessonCaseListUnlockedStudent(in *LessonCaseListUnlockedStudentInput) (*LessonCaseListUnlockedStudentOutput, error)
	LessonUnlockedStudentCaseBulkEdit(in *LessonUnlockedStudentCaseBulkEditInput) error

	ValidateTeacherClass(in *ValidateTeacherClassInput) error
}
