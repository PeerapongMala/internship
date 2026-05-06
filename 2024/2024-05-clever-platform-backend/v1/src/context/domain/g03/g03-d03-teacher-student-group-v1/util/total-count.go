package domainutil

import (
	teacherStudentutil "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/util"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

func GetTotalCount(
	db *sqlx.DB,
	queryBuilder *helper.QueryBuilder,
	closingQuery string,
) (int, error) {
	return teacherStudentutil.GetTotalCount(db, queryBuilder, closingQuery)
}
