package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)
	Commit(tx *sqlx.Tx) error

	ClassCreate(tx *sqlx.Tx, class *constant.ClassEntity) (*constant.ClassEntity, error)
	ClassCreateTx(tx *sqlx.Tx, class *constant.ClassEntity) (*constant.ClassEntity, error)
	ClassClone(tx *sqlx.Tx, sourceClassId int, class *constant.ClassEntity) (*constant.ClassEntity, error)
	ClassGet(classId int) (*constant.ClassEntity, error)
	ClassGetTx(tx *sqlx.Tx, classId int) (*constant.ClassEntity, error)
	ClassUpdate(tx *sqlx.Tx, class *constant.ClassEntity) (*constant.ClassEntity, error)
	ClassList(schoolId int, filter constant.ClassroomListFilter, pagination *helper.Pagination) ([]constant.ClassEntity, error)
	ClassroomAcademicYearGet(schoolId int) ([]string, error)
	ClassYearGet(schoolId int) ([]string, error)

	TeacherListBySchool(schoolId int, search string, excludeClassroomId int, pagination *helper.Pagination) ([]constant.TeacherEntity, error)
	TeacherAddToClassroom(tx *sqlx.Tx, classRoomId int, userId ...string) error
	TeacherGetByUserIdAndClassroom(tx *sqlx.Tx, classRoomId int, userId string) (*constant.UserEntity, error)
	TeacherListGetByClassroom(classRoomId int) ([]*constant.UserEntity, error)
	TeacherDeleteFromClassroom(tx *sqlx.Tx, classRoomId int, teacherId string) error
	TeacherListByClassroom(classRoomId int, search string, pagination *helper.Pagination) ([]constant.TeacherClassroomEntity, error)

	StudentListBySchool(schoolId int, search string, excludeClassroomId int, pagination *helper.Pagination) ([]constant.StudentSearchEntity, error)
	StudentListByClassroom(classRoomId int, search string, pagination *helper.Pagination) ([]constant.StudentClassroomEntity, error)
	StudentAddToClassroom(tx *sqlx.Tx, classRoomId int, studentId string) error
	StudentDeleteFromClassroom(tx *sqlx.Tx, classRoomId int, studentId string) error
	StudentMove(classRoomId int, studentId string) error
	StudentGetByUserIdAndClassroom(tx *sqlx.Tx, classRoomId int, userId string) (*constant.UserEntity, error)
	StudentListGetByClassroom(classRoomId int) ([]*constant.UserEntity, error)
	StudentClassCheck(studentId string, academicYear int) (*int, error)

	SchoolCaseListLesson(schoolId int) ([]int, error)
	SchoolCaseListSubLesson(schoolId int) ([]int, error)
	ClassLessonCreate(tx *sqlx.Tx, schoolId int, classId int, lessonIds []int) error
	ClassSubLessonCreate(tx *sqlx.Tx, schoolId int, classId int, subLessonIds []int) error
	ClassBulkCreate(tx *sqlx.Tx, schoolId int, userId string, studentClassMap map[string]constant.ClassEntity) (map[string]constant.ClassEntity, error)
	ClassBulkAddStudent(tx *sqlx.Tx, studentClassMap map[string]constant.ClassEntity) error
	ClassDeleteStudent(tx *sqlx.Tx, schoolId int, studentClassMap map[string]constant.ClassEntity) error
	StudentCaseGetUserId(schoolId int, studentId string) (string, error)
	ClassGetByAcademicYearYearName(tx *sqlx.Tx, schoolId, academicYear int, year string, name string) (int, error)
	StudentGetClassByAcademicYear(userId string, academicYear int) (*string, error)
}
