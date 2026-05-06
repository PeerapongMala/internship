package storage

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g00/g00-d00-arriving-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	CurriculumGroupCaseListByContentCreator(pagination *helper.Pagination, filter *constant.CurriculumGroupFilter) ([]constant.CurriculumGroupEntity, error)
	AuthEmailPasswordCaseGetByUserId(userId string) (*constant.AuthEmailPasswordEntity, error)
	UserCaseGetByEmail(email string) (*constant.UserEntity, error)
	UserUpdate(tx *sqlx.Tx, user *constant.UserEntity) (*constant.UserEntity, error)
	UserRoleCaseGetByUserId(userId string) ([]int, error)
	TeacherAccessRoleGetByUserID(userId string) ([]int, error)
	SubjectTeacherGet(teacherId string) ([]constant.Subject, error)
	CurrentAcademicYearGet(schoolId int) (*int, error)
}
