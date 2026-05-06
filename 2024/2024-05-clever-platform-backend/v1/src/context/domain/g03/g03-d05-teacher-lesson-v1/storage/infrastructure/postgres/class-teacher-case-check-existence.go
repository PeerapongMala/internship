package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ClassTeacherCaseExistence(classId int, teacherId string) (*bool, error) {
	query := `
		SELECT EXISTS (
			SELECT
				1
			FROM
				"school"."class_teacher" ct
			WHERE
				"class_id" = $1
				AND
				"teacher_id" = $2
		)
	`
	var isExists *bool
	err := postgresRepository.Database.QueryRowx(query, classId, teacherId).Scan(&isExists)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return isExists, nil
}
