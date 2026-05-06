package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceTeacherStudentInterface interface {
	SchoolInfoGet(teacherId string) (*constant.SchoolInfo, error)
	StudentListByTeacherId(teacherId string, pagination *helper.Pagination, filter constant.StudentListByTeacherIdFilter) ([]constant.StudentEntity, error)
	StudentListDownloadByTeacherId(teacherId string, filter constant.StudentListByTeacherIdFilter) ([]byte, error)
	StudentPinUpdateByStudentId(studentId string, newPin string) error
	StudentProfileGetByStudentId(studentId string) (*constant.StudentProfile, error)
	StudentByStudentId(studentId string) (constant.StudentEntity, error)
	StudentClassListByStudentId(studentId string, pagination *helper.Pagination) ([]constant.ClassEntity, error)
	StudentLogLevelPlayClassListByStudentId(studentId string, pagination *helper.Pagination) ([]constant.ClassEntity, error)
	StudentFamilyMemberByStudentId(studentId string) ([]constant.StudentFamilyEntity, error)
	TeacherAcademicYearListGet(teacherId string, pagination *helper.Pagination) ([]int, error)
	TeacherYearListGetByAcademicYear(teacherId string, academicYear int, pagination *helper.Pagination) ([]string, error)
	TeacherClassListGetByAcademicYearAndYear(teacherId string, academicYear int, year string, pagination *helper.Pagination) ([]string, error)
	ClassStatListGetByTeacherId(teacherId string, filter constant.TeacherStudentListWithStatFilter, pagination *helper.Pagination) ([]constant.TeacherStudentWithStateEntity, error)
	TeacherStudentListWithStatDownloadCsvGetByTeacherId(teacherId string, filter constant.TeacherStudentListWithStatFilter) ([]byte, error)
	CurriculumGroupListGet(pagination *helper.Pagination) ([]constant.TeacherStudentFilter, error)
	SubjectListGetByCurriculumGroupId(curriculumGroupId int, pagination *helper.Pagination) ([]constant.TeacherStudentFilter, error)
	SubjectListGetByTeacherId(teacherId string, pagination *helper.Pagination) ([]constant.SubjectListByTeacherIdResponse, error)
	SubjectListGetByAcademicYearAndYear(teacherId string, request constant.SubjectListGetByAcademicYearYearRequest, pagination *helper.Pagination) ([]constant.SubjectEntity, error)
	ClassListGetByTeacherIDYearAcademicYearSubjectID(teacherId string, request constant.ClassListByTeacherIdAndAcademicYearAndYearRequest, pagination *helper.Pagination) ([]constant.ClassListByTeacherIdAndAcademicYearAndYearData, error)
	LessonListGetBySubjectId(subjectId int, pagination *helper.Pagination) ([]constant.TeacherStudentFilter, error)
	SubLessonListGetByLessonId(lessonId int) ([]constant.TeacherStudentFilter, error)
	StudentLevelClassListGetByStudentId(studentId, teacherId string, pagination *helper.Pagination) ([]constant.LevelClass, error)
	GetLessonStatsByTeacherAndYear(teacherId string, academicYear int, filter constant.LessonStatAcademicYearListFilter, pagination *helper.Pagination) ([]constant.StudentLevelStat, error)
	GetLessonStatsCsvByTeacherAndYear(teacherId string, academicYear int, filter constant.LessonStatAcademicYearListFilter, pagination *helper.Pagination) ([]byte, error)

	StudentLevelStatListGetByStudentIdAndAcademicYear(studentId string, academicYear int, filter constant.StudentAcademicYearStatFilter) ([]constant.StudentAcademicYearStat, error)
	StudentLevelStatCsvGetByStudentIdAndAcademicYear(studentId string, academicYear int, filter constant.StudentAcademicYearStatFilter) ([]byte, error)

	StudentLevelStatListGetByStudentIdAndLessonId(studentId string, lessonId int, filter constant.LessonStatFilter) ([]constant.LessonStat, error)
	StudentLevelStatCsvGetByStudentIdAndLessonId(studentId string, lessonId int, filter constant.LessonStatFilter) ([]byte, error)

	StudentLevelStatListGetByStudentIdAndSubLessonId(studentId string, subLessonId int, filter constant.SubLessonStatFilter) ([]constant.SubLessonStat, error)
	StudentLevelStatCsvGetByStudentIdAndSubLessonId(studentId string, subLessonId int, filter constant.SubLessonStatFilter) ([]byte, error)

	StudentLevelStatListGetByStudentIdAndLevelId(studentId string, levelId int, pagination *helper.Pagination) ([]constant.LevelPlayStat, error)
	StudentLevelStatCsvGetByStudentIdAndLevelId(studentId string, levelId int, pagination *helper.Pagination) ([]byte, error)

	StudentItemListGetByParams(filter constant.ItemFilter) ([]constant.ItemInfo, error)
	StudentItemCsvGetByParams(filter constant.ItemFilter) ([]byte, error)

	StudyGroupListGetByParams(in constant.StudyGroupFilter) ([]constant.StudyGroup, error)
	StudyGroupCsvGetByParams(in constant.StudyGroupFilter) ([]byte, error)

	OptionsGetByParams(in constant.OptionFilter) (*constant.OptionObject, error)

	TeacherCommentCreate(in TeacherCommentCreateRequest) error
	TeacherCommentListGetByParams(in constant.TeacherCommentFilter) ([]constant.TeacherCommentEntity, error)
	TeacherCommentUpdate(in TeacherCommentUpdateRequest) error
	TeacherCommentDelete(in TeacherCommentDeleteRequest) error

	AcademicYearRangeList(in *AcademicYearRangeListInput) (*AcademicYearRangeListOutput, error)
	AcademicYearRangeCreate(in *AcademicYearRangeCreateInput) error
	AcademicYearRangeDelete(in *AcademicYearRangeDeleteInput) error

	TeacherClassList(in *TeacherClassListInput) (*TeacherClassListOutput, error)
	YearList(in *YearListInput) (*YearListOutput, error)
}
