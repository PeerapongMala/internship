package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) AcademicYearRangeGet(schoolId int, academicYear string) (*constant.AcademicYearRange, error) {
	query := `
		SELECT
			"start_date",
			"end_date"
		FROM
			"school"."academic_year_range"
		WHERE
		    "school_id" = $1
			AND "name" = $2
	`
	academicYearRange := constant.AcademicYearRange{}
	err := postgresRepository.Database.QueryRowx(query, schoolId, academicYear).StructScan(&academicYearRange)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return &academicYearRange, nil
}
