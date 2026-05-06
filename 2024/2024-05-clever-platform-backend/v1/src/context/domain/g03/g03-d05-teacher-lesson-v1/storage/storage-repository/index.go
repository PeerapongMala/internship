package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type Repository interface {
	ClassLessonList(teacherId string, classId int, filter constant.ClassLessonFilter, pagination *helper.Pagination) ([]constant.ClassLessonEntity, error)
	ClassLessonCaseToggle(classId, subjectId int, isEnabled *bool) error
	TeacherCaseListCurriculumGroup(teacherId string, classId int, pagination *helper.Pagination, isParent bool) ([]constant.CurriculumGroupEntity, error)
	TeacherCaseListSubject(teacherId string, classId int, filter constant.SubjectFilter, pagination *helper.Pagination, isParent bool) ([]constant.SubjectEntity, error)
	ClassSubLessonList(classId int, filter constant.ClassSubLessonFilter, pagination *helper.Pagination) ([]constant.ClassSubLessonEntity, error)
	ClassSubLessonCaseToggle(classId, subLessonId int, isEnabled *bool) error
	LevelList(classId, subLessonId int, filter constant.LevelFilter, pagination *helper.Pagination) ([]constant.LevelEntity, error)
	LevelCaseListUnlockedStudyGroup(classId, levelId int, pagination *helper.Pagination) ([]constant.LevelUnlockedForStudyGroupEntity, error)
	LevelCaseListUnlockedStudent(classId, levelId int, pagination *helper.Pagination) ([]constant.StudentEntity, error)
	LevelUnlockedForStudyGroupCreate(levelUnlockedForStudyGroup []constant.LevelUnlockedForStudyGroup) error
	LevelUnlockedForStudentCreate(levelUnlockedForStudent []constant.LevelUnlockedForStudent) error
	StudentList(classId int, filter constant.StudentFilter, pagination *helper.Pagination) ([]constant.StudentEntity, error)
	StudyGroupList(classId, subjectId int, filter constant.StudyGroupFilter, pagination *helper.Pagination) ([]constant.StudyGroupEntity, error)
	UnlockedStudyGroupCaseBulkDelete(levelId int, studyGroupIds []int) error
	UnlockedStudentCaseBulkDelete(classId, levelId int, studentIds []string) error
	ClassTeacherCaseExistence(classId int, teacherId string) (*bool, error)
	ClassList(filter *constant.ClassFilter, pagination *helper.Pagination) ([]constant.ClassEntity, error)
	SeedAcademicYearList(pagination *helper.Pagination, teacherId string) ([]int, error)
	StudentClassList(filter *constant.ClassFilter, pagination *helper.Pagination) ([]constant.ClassEntity, error)
	LessonLevelToggle(lessonId int, classId int, lock *bool) error

	LessonUnlockedForStudyGroupCreate(lessonId int, studyGroupIds []int) error
	LessonCaseListUnlockedStudyGroup(classId, lessonId int, pagination *helper.Pagination) (studyGroups []constant.LevelUnlockedForStudyGroupEntity, err error)
	LessonUnlockedStudyGroupBulkDelete(lessonId int, studyGroupIds []int) error

	LessonUnlockedForStudentCreate(lessonUnlockedForStudent []constant.LessonUnlockedForStudent) error
	LessonCaseListUnlockedStudent(classId, lessonId int, pagination *helper.Pagination) (students []constant.StudentEntity, err error)
	LessonUnlockedStudentCaseBulkDelete(classId, lessonId int, studentIds []string) error
}
