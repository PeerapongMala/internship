package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type TeacherRewardRepository interface {
	TeacherRewardCreate(tx *sqlx.Tx, req constant.TeacherRewardCreate) error
	GetSubjectTeacherBySubjectId(subjectId int, teacherId string) (int, error)
	GetClassByStudentId(studentId string) (int, error)
	TeacherRewardList(teacherId string, filter constant.TeacherRewardListFilter, pagination *helper.Pagination) ([]constant.TeacherRewardList, error)
	TeacherRewardCallBack(id int, subjectId string, Admin *string) error
	GetSubjectByTeacherId(teacherId string) ([]constant.SubjectTeacher, error)
	GetStudentIdByStudentName(firstname string, lastname string) (string, error)
	GetGlobalItem() ([]constant.ItemList, error)
	GetTeacherItem(teacherId string) ([]constant.ItemList, error)
	CheckReceived(id int) (bool, error)
	TeacherSubjectList(teacherId string, pagination *helper.Pagination) ([]constant.TeacherSubject, error)
	StudentListBySchoolId(teacherId string, filter constant.StudentFilter, pagination *helper.Pagination) ([]constant.StudentResponse, error)
	GetSchoolIdByTeacherId(teacherId string) (int, error)
	AcademicYearList(teacherId string, pagination *helper.Pagination) ([]constant.AcademicYear, error)
	YearList(teacherId string, pagination *helper.Pagination) ([]constant.Year, error)
	ClassList(teacherId string, year string, academicYear int, pagination *helper.Pagination) ([]constant.Class, error)
	StudyGroupList(teacherId string, classId int, pagination *helper.Pagination) ([]constant.StudyGroup, error)
	StudentGet(studentId string, schoolId int) (*constant.StudentGet, error)
	TeacherItem(teacherId string, subjectId int, pagination *helper.Pagination) ([]constant.ItemReponse, error)
	ItemGet(itemId int) (*constant.ItemInfo, error)
	CouponTransactionList(filter *constant.CouponTransactionFilter, pagination *helper.Pagination) (transactions []constant.CouponTransaction, err error)
	CouponTransactionUpdate(couponTransactionId int, status string) error
	ItemCreate(tx *sqlx.Tx, item constant.ItemEntity) (int, error)
	StudyGroupStudentGet(studyGroupIds []int) ([]string, error)
	ClassStudentGet(classIds []int) ([]string, error)
	TeacherRewardGet(teacherRewardId int) (*constant.TeacherReward, error)
	BeginTx() (*sqlx.Tx, error)
}
