package storageRepository

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type RepositoryTeacherStudent interface {
	SchoolInfoGetByTeacherId(teacherId string) (constant.SchoolEntity, error)
	ClassDetailStudentByUserIdAndAcademicYear(userId string, academicYear int) (constant.ClassEntity, error)
	StudentListByTeacherId(teacherId string, pagination *helper.Pagination, filter constant.StudentListByTeacherIdFilter) ([]constant.StudentEntity, error)
	StudentListTotalCountByTeacherId(teacherId string, pagination *helper.Pagination, filter constant.StudentListByTeacherIdFilter) error
	StudentByStudentId(studentId string) (constant.StudentEntity, error)
	StudentFamilyMemberByStudentId(studentId string) ([]constant.StudentFamilyEntity, error)
	StudentClassListByStudentId(studentId string, pagination *helper.Pagination) ([]constant.ClassEntity, error)
	StudentLogLevelPlayClassListByStudentId(studentId string, pagination *helper.Pagination) ([]constant.ClassEntity, error)
	TeacherAcademicYearList(teacherId string, pagination *helper.Pagination) ([]int, error)
	TeacherYearListByAcademicYear(teacherId string, academicYear int, pagination *helper.Pagination) ([]string, error)
	TeacherClassNameByAcademicYearAndYear(teacherId string, academicYear int, year string) ([]string, error)
	TeacherStudentListWithStatByTeacherId(teacherId string, filter constant.TeacherStudentListWithStatFilter, pagination *helper.Pagination) ([]constant.TeacherStudentWithStateEntity, error)
	TeacherStudentListWithStatTotalByTeacherId(teacherId string, filter constant.TeacherStudentListWithStatFilter, pagination *helper.Pagination) error
	CurriculumGroupList(pagination *helper.Pagination) ([]constant.TeacherStudentFilter, error)
	SubjectListByCurriculumGroupId(curriculumGroupId int, pagination *helper.Pagination) ([]constant.TeacherStudentFilter, error)
	ClassListByTeacherIDAndYearAndAcademicYear(teacherID string, request constant.ClassListByTeacherIdAndAcademicYearAndYearRequest, pagination *helper.Pagination) ([]constant.ClassListByTeacherIdAndAcademicYearAndYearData, error)
	SubjectListByTeacherId(teacherId string, pagination *helper.Pagination) ([]constant.SubjectListByTeacherIdResponse, error)
	SubjectListGetByAcademicYearAndYear(teacherId string, request constant.SubjectListGetByAcademicYearYearRequest, pagination *helper.Pagination) ([]constant.SubjectEntity, error)
	LessonListBySubjectId(subjectId int, pagination *helper.Pagination) ([]constant.TeacherStudentFilter, error)
	SubLessonListByLessonId(subjectId int) ([]constant.TeacherStudentFilter, error)
	LevelClassListByStudentId(studentId, teacherId string, pagination *helper.Pagination) ([]constant.LevelClass, error)
	LevelLogStatGetByUserIdAndAcademicYear(userId string, academicYear int) (constant.LevelStatEntity, error)
	QuestionPlayLogStatGetByUserIdAndAcademicYear(userId string, academicYear int) (constant.QuestionPlayLogStatEntity, error)
	StudentLevelStatListGetByStudentIdAndAcademicYear(userId string, academicYear int, filter constant.StudentAcademicYearStatFilter) ([]constant.StudentAcademicYearStatEntity, error)

	StudentLevelStatListGetByStudentIdAndLessonId(userId string, lessonId int, filter constant.LessonStatFilter) ([]constant.LessonStatEntity, error)

	StudentLevelStatListGetByStudentIdAndSubLessonId(userId string, subLessonId int, filter constant.SubLessonStatFilter) ([]constant.SubLessonStatEntity, error)
	StudentLevelStatListGetByStudentIdAndSubLevelId(userId string, levelId int, pagination *helper.Pagination) ([]constant.LevelPlayStatEntity, error)

	StudentItemListGetByParams(filter constant.ItemFilter) ([]constant.ItemEntity, error)
	StudyGroupListGetByParams(filter constant.StudyGroupFilter) ([]constant.StudyGroupEntity, error)

	AcademicYearOptionsGetByParams(in constant.OptionParam) ([]constant.OptionItem, error)
	SeedYearOptionsGetByParams(in constant.OptionParam) ([]constant.OptionItem, error)
	CurriculumGroupOptionsGetByParams(in constant.OptionParam) ([]constant.OptionItem, error)
	SubjectOptionsGetByParams(in constant.OptionParam) ([]constant.OptionItem, error)
	LessonOptionsGetByParams(in constant.OptionParam) ([]constant.OptionItem, error)
	SubLessonOptionsGetByParams(in constant.OptionParam) ([]constant.OptionItem, error)
	LevelOptionsGetByParams(in constant.OptionParam) ([]constant.OptionItem, error)

	TeacherCommentCreate(in constant.TeacherCommentCreateDTO) error
	TeacherCommentListGetByParams(in constant.TeacherCommentFilter) ([]constant.TeacherCommentEntity, error)
	TeacherCommentUpdate(in constant.TeacherCommentUpdate) error
	TeacherCommentDelete(commentId int) error

	AcademicYearRangeList(pagination *helper.Pagination, schoolId int) ([]constant.AcademicYearRangeEntity, error)
	AcademicYearRangeCreate(schoolId int, name string, startDate, endDate *time.Time) error
	AcademicYearRangeDelete(academicYearRangeId int) error

	ClassList(pagination *helper.Pagination, teacherId string, academicYear string, year string, schoolId int) ([]constant.ClassEntity, error)
	YearList(pagination *helper.Pagination, teacherId string) ([]string, error)
	AcademicYearRangeCheck(academicYearRangeId int) (*bool, error)
}
