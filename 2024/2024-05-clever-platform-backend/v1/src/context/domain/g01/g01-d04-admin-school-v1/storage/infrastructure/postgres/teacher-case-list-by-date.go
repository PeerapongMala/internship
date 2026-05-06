package postgres

import (
	"fmt"
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TeacherCaseListByDate(schoolId int, startDate, endDate *time.Time) ([]constant.UserWithTeacherAccesses, error) {
	query := `
		SELECT
			"u".*,
		  ARRAY_AGG(
           "uta"."teacher_access_id" ORDER BY "uta"."teacher_access_id" ASC
        ) filter (where "uta"."teacher_access_id" is not null) AS "teacher_accesses"
		FROM
			"user"."user" u	
		LEFT JOIN
			"user"."user_role" ur
			ON "u"."id" = "ur"."user_id"
		LEFT JOIN
			"school"."school_teacher" st
			ON "u"."id" = "st"."user_id"
		LEFT JOIN
			"user"."user_teacher_access" uta
			ON "u"."id" = "uta"."user_id"
		WHERE
			"ur"."role_id" = $1
			AND
			"st"."school_id" = $2
	`
	args := []interface{}{constant.Teacher, schoolId}
	argsIndex := 3

	if startDate != nil {
		query += fmt.Sprintf(` AND "u"."created_at" >= $%d`, argsIndex)
		args = append(args, startDate)
		argsIndex++
	}
	if endDate != nil {
		query += fmt.Sprintf(` AND "u"."created_at" <= $%d`, argsIndex)
		args = append(args, endDate)
		argsIndex++
	}

	query += fmt.Sprintf(` GROUP BY "u"."id" ORDER BY "u"."created_at" ASC`)

	userWithTeacherAccesses := []constant.UserWithTeacherAccesses{}
	err := postgresRepository.Database.Select(&userWithTeacherAccesses, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return userWithTeacherAccesses, nil
}
