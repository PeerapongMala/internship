package storageRepository

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	UserCreate(tx *sqlx.Tx, user *constant.UserEntity) (*constant.UserEntity, error)
	UserGet(userId string) (*constant.UserEntity, error)
	UserUpdate(tx *sqlx.Tx, user *constant.UserEntity) (*constant.UserEntity, error)
	UserCaseAddUserRole(tx *sqlx.Tx, userId string, roles []int) ([]int, error)
	UserCaseGetUserRole(userId string) ([]int, error)
	UserCaseDeleteOauth(userId string, provider string) error

	StudentCreate(tx *sqlx.Tx, studentData *constant.StudentDataEntity) (*constant.StudentDataEntity, error)
	StudentGet(userId string) (*constant.StudentEntity, error)
	StudentUpdate(tx *sqlx.Tx, studentData *constant.StudentDataEntity) (*constant.StudentDataEntity, error)
	StudentList(filter *constant.StudentFilter, pagination *helper.Pagination) ([]constant.StudentDataWithOauthEntity, error)
	StudentCaseListClasses(userId string, pagination *helper.Pagination) ([]constant.ClassEntity, error)
	StudentCaseListLessonPlayLog(studentId string, classId int, filter *constant.LessonPlayLogFilter, pagination *helper.Pagination) ([]constant.LessonPlayLogEntity, error)
	StudentCaseGetFamily(userId string) (*constant.FamilyEntity, error)
	StudentCaseListAcademicYear(userId string) ([]int, error)
	StudentCaseListCurriculumGroup(userId string, filter *constant.CurriculumGroupFilter) ([]constant.CurriculumGroupEntity, error)
	StudentCaseListSubject(userId string, filter *constant.SubjectFilter) ([]constant.SubjectEntity, error)
	StudentCaseListLesson(userId string, filter constant.LessonFilter) ([]constant.LessonEntity, error)
	StudentCaseListSubLesson(userId string, filter *constant.SubLessonFilter) ([]constant.SubLessonEntity, error)
	StudentCaseListTeacherNote(userId string, filter *constant.TeacherNoteFilter, pagination *helper.Pagination) ([]constant.TeacherNoteEntity, error)
	StudentCaseListByDate(schoolId int, startDate, endDate *time.Time) ([]constant.StudentDataEntity, error)

	TeacherList(filter *constant.TeacherFilter, pagination *helper.Pagination) ([]constant.TeacherEntity, error)
	TeacherCaseUpdateTeacherAccesses(tx *sqlx.Tx, userId string, teacherAccesses []int) error
	TeacherCaseGetTeacherAccesses(userId string) ([]int, error)
	TeacherAccessList(pagination *helper.Pagination) ([]constant.TeacherAccessEntity, error)
	TeacherCaseListTeachingLog(teacherId string, pagination *helper.Pagination) ([]constant.TeachingLogEntity, error)
	TeacherCaseListClassLog(teacherId string, pagination *helper.Pagination) ([]constant.ClassLogEntity, error)
	TeacherCaseListByDate(schoolId int, startDate, endDate *time.Time) ([]constant.UserWithTeacherAccesses, error)

	SchoolCaseAddTeacher(tx *sqlx.Tx, schoolId int, userId string) error

	AnnouncerList(filter *constant.AnnouncerFilter, pagination *helper.Pagination) ([]constant.UserEntity, error)
	AnnouncerCaseAddSchool(tx *sqlx.Tx, in *constant.SchoolAnnouncerEntity) error

	ObserverList(pagination *helper.Pagination, filter *constant.ObserverFilter) ([]constant.ObserverWithAccesses, error)
	ObserverCaseGetObserverAccesses(userId string) ([]constant.ObserverAccessEntity, error)

	SchoolCaseAddObserver(tx *sqlx.Tx, schoolId int, observerId string) error

	AuthEmailPasswordCreate(tx *sqlx.Tx, auth *constant.AuthEmailPasswordEntity) (*constant.AuthEmailPasswordEntity, error)
	AuthEmailPasswordGet(userId string) (*constant.AuthEmailPasswordEntity, error)
	AuthEmailPasswordUpdate(tx *sqlx.Tx, auth *constant.AuthEmailPasswordEntity) error

	AuthOauthCaseGetByUserId(userId string) ([]constant.AuthOauthEntity, error)

	AuthPinGet(userId string) (*constant.AuthPinEntity, error)
	AuthPinCreate(tx *sqlx.Tx, auth *constant.AuthPinEntity) (*constant.AuthPinEntity, error)

	GetSchoolById(SchoolId int) (constant.SchoolResponse, error)
	SchoolCreate(c constant.SchoolCreateRequest, txs ...*sqlx.Tx) error
	SchoolUpdate(c constant.SchoolUpdateRequest) error
	SchoolUpdateCSV(c constant.SchoolUpdateRequest, txs ...*sqlx.Tx) error
	SchoolList(filter constant.SchoolListFilter, pagination *helper.Pagination) ([]constant.SchoolListResponse, error)
	SchoolBulkEdit(req constant.SchoolBulkEdit, SubjectId string) error

	GetSchoolContracts(SchoolId int, filter constant.FilterSchoolContract, pagination *helper.Pagination) ([]constant.SchoolContractsResponse, int, error)
	SubjectList(SchoolId int, filter constant.FilterSubject, pagination *helper.Pagination) ([]constant.SubjectResponse, int, error)
	UpdateSubjectStatus(req constant.UpdatedSubjectRequest) error
	SubjectBulkEdit(SchoolId int, req constant.SubjectBulkEdit) error

	SchoolAffiliationList(filter constant.SchoolAffiliationFilter, pagination *helper.Pagination) ([]constant.SchoolAffiliationList, int, error)
	GetSchoolAffiliation(SchoolAffiliationId int) (constant.SchoolAffilation, error)

	SchoolListCsv() ([]constant.SchoolResponseCsv, error)
	AuthPinUpdate(tx *sqlx.Tx, auth *constant.AuthPinEntity) error

	ProvinceList(pagination *helper.Pagination) ([]constant.ProvinceList, int, error)
	SchoolAffiliationDoeList(pagination *helper.Pagination) ([]constant.SchoolAffiliationDoeList, int, error)
	ContractSubjectGroup(pagination *helper.Pagination, contractId int, filter constant.FilterSubject) ([]constant.ContractsSubjectGroup, int, error)

	SeedYearList(pagination *helper.Pagination) ([]constant.SeedYearEntity, error)
	SchoolAffiliationGetByName(name string) (*int, error)

	ClassCreate(tx *sqlx.Tx, userId, name, year string, academicYear, schoolId int) (int, error)
	ClassCaseAddStudent(tx *sqlx.Tx, classId int, studentId string) error

	SchoolCaseListLesson(schoolId int) ([]int, error)
	SchoolCaseListSubLesson(schoolId int) ([]int, error)
	ClassLessonCreate(tx *sqlx.Tx, schoolId int, classId int, lessonIds []int) error
	ClassSubLessonCreate(tx *sqlx.Tx, schoolId int, classId int, subLessonIds []int) error

	CurrentAcademicYearGet(schoolId int) (*int, error)
	SubjectTeacherGet(teacherId string) ([]constant.Subject, error)
	TeacherAccessRoleGetByUserID(userId string) ([]int, error)
}
