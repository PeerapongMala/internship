package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentCaseListAcademicYear(userId string) ([]int, error) {
	query := `
		SELECT DISTINCT
			"c"."academic_year"
		FROM
			"school"."school"	s
		LEFT JOIN
			"user"."student" st
			ON "s"."id" = "st"."school_id"
		LEFT JOIN
			"class"."class" c
			ON "s"."id" = "c"."school_id"
		WHERE
			"st"."user_id" = $1
			AND
			"c"."academic_year" IS NOT NULL;
	`
	academicYears := []int{}
	err := postgresRepository.Database.Select(&academicYears, query, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return academicYears, nil
}
