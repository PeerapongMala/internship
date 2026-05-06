package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	GetSubjectBySchoolId(schoolId int, pagination *helper.Pagination, filter *constant.SubjectListFilter) ([]constant.SubjectListEntity, error)
	GetHomeworkTemplateBySchoolIdAndSubjectId(schoolId int, subjectId int, pagination *helper.Pagination, filter *constant.HomeWorkTemplateListFilter) ([]constant.HomeworkTemplateListEntity, error)
	GetHomeworkBySchoolIdAndSubjectId(schoolId int, subjectId int, pagination *helper.Pagination, filter *constant.HomeWorkListFilter) ([]constant.HomeworkListEntity, error)

	GetTargetsSeedYearShortNameByIds(seedYearIds []int) ([]string, error)
	GetTargetsClassRoomNameByIds(classRoomIds []int) ([]string, error)
	GetTargetsStudyGroupNameByIds(studyGroupIds []int) ([]string, error)

	InsertHomeworkTemplate(tx *sqlx.Tx, entity *constant.HomeworkTemplateEntity) (insertId int, err error)
	InsertHomeworkTemplateLevel(tx *sqlx.Tx, homeworkTemplateId int, levelId int) (err error)
	UpdateHomeworkTemplate(tx *sqlx.Tx, entity *constant.HomeworkTemplateEntity) error
	DeleteAllHomeworkTemplateLevel(tx *sqlx.Tx, homeworkTemplateId int) error
	GetHomeworkTemplateById(id int) (*constant.HomeworkTemplateEntity, error)
	GetSubLessonLevelByLessonId(lessonId int) ([]constant.SubLessonLevelEntity, error)
	GetLessonListBySubjectId(subjectId int) ([]constant.LessonListEntity, error)
	GetAllStudentIds(seedYearIds, studentGroupIds, classIds []int, schoolId int) ([]string, error)
	GetLevelTotalByHomeworkId(homeworkId int) (int, error)
	GetLevelsByHomeworkId(homeworkId int) ([]int, error)
	GetCountPassLevelByStudentId(homeworkId int, studentIds []string) ([]constant.ContPassLevelEntity, error)

	InsertHomework(tx *sqlx.Tx, entity *constant.HomeworkEntity) (insertId int, err error)
	UpdateHomework(tx *sqlx.Tx, entity *constant.HomeworkEntity) error
	GetHomeworkById(id int) (*constant.HomeworkEntity, error)
	GetHomeworkAssignedData(id int) (*constant.AssignedToEntity, error)

	InsertHomeworkAssignedToClass(tx *sqlx.Tx, homeworkId int, classId int) (err error)
	InsertHomeworkAssignedToStudyGroup(tx *sqlx.Tx, homeworkId int, studyGroupId int) (err error)
	InsertHomeworkAssignedToYear(tx *sqlx.Tx, homeworkId int, seedYearId int) (err error)
	DeleteAllHomeworkAssigned(tx *sqlx.Tx, homeworkId int) error

	GetAssignToDataBySchoolId(schoolId int, teacherId string, subjectId int) ([]constant.AssignToDataEntity, error)
	GetHomeworkDetailListByHomeworkId(homeworkId int, pagination *helper.Pagination) ([]constant.HomeworkDetailEntity, error)
	GetUserDataAndPlayWithHomeworkIdAndStudentIds(homeworkId int, studentIds []string, filter *constant.HomeworkSubmitDetailListFilter) ([]constant.UserDataPlayHomeworkEntity, error)
	GetStarCountByLevelIdsAndHomeworkId(homeworkId int, levelIds []int, studentId string) (int, error)
	GetStarAvgByLevelIdAndHomeworkIdByStudentsIds(homeworkId int, levelId int, studentIds []string) (float64, error)
	GetStudentDoneLevelHomeworkCount(homeworkId int, levelId int, studentIds []string) (int, error)
	GetStudentDoneLevelHomeworkUniqueCount(homeworkId int, levelId int, studentIds []string) (int, error)
	GetAvgTimeUsedByHomeworkLevelStudentId(homeworkId int, levelId int, studentIds []string) (float64, error)
	GetHomeworkWithIndexByStudentId(homeworkId int, studentId string) ([]constant.HomeworkWithIndexEntity, error)
	GetAvgCountDoHomeWorkLevelStudentId(homeworkId int, levelId int, studentIds []string) (float64, error)
	GetLatestDoHomeworkDateTime(homeworkId int, levelId int, studentIds []string) (string, error)

	GetClassListByYearId(schoolId int, yearId int) ([]constant.ClassListEntity, error)
	GetYearList() ([]constant.YearListEntity, error)
	GetCorrectQuestionCount(levelPlayLogId int) (int, error)
	GetTeacherSchoolId(teacherId string) (schoolId int, err error)
	TeacherSubjectGet(teacherId string) (int, error)

	StudentHomeworkStatGet(homeworkId int, levelId int, studentIds []string) (*constant.StudentHomeworkStatEntity, error)
}
