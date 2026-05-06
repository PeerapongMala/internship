package postgres

import (
	"github.com/pkg/errors"
	"log"
	"time"
)

func (postgresRepository *postgresTeacherStudentRepository) AcademicYearRangeCreate(schoolId int, name string, startDate, endDate *time.Time) error {
	query := `
		INSERT INTO "school"."academic_year_range" (
			"school_id",
			"name",
			"start_date",
			"end_date"
		)
		VALUES ($1, $2, $3, $4)
	`

	_, err := postgresRepository.Database.Exec(query, schoolId, name, startDate, endDate)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
