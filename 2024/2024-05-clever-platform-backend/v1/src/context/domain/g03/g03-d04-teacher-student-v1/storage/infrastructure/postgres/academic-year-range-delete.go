package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresTeacherStudentRepository) AcademicYearRangeDelete(academicYearRangeId int) error {
	query := `
		DELETE FROM "school"."academic_year_range"
		WHERE
			"id" = $1
	`
	_, err := postgresRepository.Database.Exec(query, academicYearRangeId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
