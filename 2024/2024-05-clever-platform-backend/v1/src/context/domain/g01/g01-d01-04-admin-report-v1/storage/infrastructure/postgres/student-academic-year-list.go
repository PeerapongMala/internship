package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudentAcademicYearList(pagination *helper.Pagination, userId string) ([]int, error) {
	query := `
		SELECT DISTINCT ON ("c"."academic_year")
			"c"."academic_year"
		FROM
			"school"."class_student" cs
		INNER JOIN "class"."class" c ON "cs"."class_id" = "c"."id"
		WHERE "cs"."student_id" = $1
	`
	args := []interface{}{userId}
	argsIndex := len(args) + 1

	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY "academic_year" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	academicYears := []int{}
	err := postgresRepository.Database.Select(&academicYears, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return academicYears, nil
}
