package postgres

import (
	"fmt"
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentCaseListByDate(schoolId int, startDate, endDate *time.Time) ([]constant.StudentDataEntity, error) {
	query := `
		SELECT
			*
		FROM
			"user"."student" s	
		LEFT JOIN
			"user"."user" u
			ON "s"."user_id" = "u"."id"
		WHERE
			"s"."school_id" = $1
	`
	args := []interface{}{schoolId}
	argsIndex := 2

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

	query += fmt.Sprintf(` ORDER BY "u"."created_at" ASC`)

	studentDataEntities := []constant.StudentDataEntity{}
	err := postgresRepository.Database.Select(&studentDataEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return studentDataEntities, nil
}
