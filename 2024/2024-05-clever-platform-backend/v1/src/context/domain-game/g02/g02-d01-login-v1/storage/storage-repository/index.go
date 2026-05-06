package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d01-login-v1/constant"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)
	StudentCaseGetBySchoolCodeStudentId(schoolCode, studentId string) (*constant.StudentEntity, error)
	UserCreate(tx *sqlx.Tx, user constant.User) error
	ParentCreate(tx *sqlx.Tx, parent *constant.ParentEntity) error
	UserRoleCreate(tx *sqlx.Tx, userId string, roleId int) error
	UserGetBySubjectId(subjectId string) (*constant.UserEntity, error)
	UserGetByEmail(email string) (*string, error)
	AuthPinCaseGetByUserId(userId string) (*constant.AuthPinEntity, error)
	AuthEmailPasswordGet(userId string) (*constant.AuthEmailPasswordEntity, error)
	UserUpdate(tx *sqlx.Tx, user *constant.UserEntity) (*constant.UserEntity, error)
	StudentCaseGetBySubjectId(subjectId string) (*constant.StudentEntity, error)
	AuthOauthCreate(tx *sqlx.Tx, authOauth *constant.AuthOauthEntity) error
	SchoolCaseCheckExistence(schoolCode string) (*bool, error)
	AdminAuthEmailPasswordGet(email string) (*constant.AuthEmailPasswordEntity, error)
	UserCaseGetUserRoles(userId string) ([]int, error)
	GameAssetList() ([]constant.GameAssetEntity, error)
	UserGet(email string) (*constant.User, error)
	SubjectTeacherGet(teacherId string) ([]constant.Subject, error)
	CurrentAcademicYearGet(schoolId int) (*int, error)
	TeacherAccessRoleGetByUserID(userId string) ([]int, error)
	AuthOAuthCheck(provider, userId, subjectId string) (bool, error)
}
