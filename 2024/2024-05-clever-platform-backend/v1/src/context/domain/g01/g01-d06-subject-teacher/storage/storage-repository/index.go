package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	SchoolSubjectList(schoolId int, filter constant.SubjectFilter, pagination *helper.Pagination) ([]constant.SubjectEntity, error)
	SubjectTeacherList(schoolId int, subjectId int, filter *constant.SubjectTeacherFilter, pagination *helper.Pagination) ([]constant.TeacherEntity, error)
	SeedAcademicYearList(pagination *helper.Pagination) ([]int, error)
	SubjectTeacherDelete(subjectId int, bulkEditList []constant.SubjectTeacherBulkEditItem) error
	SubjectTeacherCreate(tx *sqlx.Tx, subjectId int, teacherIds []string, academicYear int) error
	SchoolTeacherList(schoolId int, filter *constant.SchoolTeacherFilter, pagination *helper.Pagination) ([]constant.TeacherEntity, error)
	SubjectGet(subjectId int) (*constant.SubjectEntity, error)

	TeacherItemGroupCreate(tx *sqlx.Tx, teacherItemGroups []constant.TeacherItemGroupEntity) error
	TeacherShopCreate(tx *sqlx.Tx, teacherShops []constant.TeacherItemGroupEntity) error
}
