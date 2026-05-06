package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresTeacherStudentRepository *postgresTeacherStudentRepository) AcademicYearRangeCheck(academicYearRangeId int) (*bool, error) {
	query := `
		WITH ayr AS (
			SELECT
				"school_id",
				"name"
			FROM
				"school"."academic_year_range"
			WHERE
				"id" = $1
		)
		SELECT EXISTS (
			SELECT
				1
			FROM
				"class"."class" c
			LEFT JOIN ayr ON "c"."school_id" = "ayr"."school_id"
			WHERE
				"c"."academic_year"::TEXT = "ayr"."name"
		)		
	`
	isExists := false
	err := postgresTeacherStudentRepository.Database.QueryRowx(query, academicYearRangeId).Scan(&isExists)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &isExists, nil
}
