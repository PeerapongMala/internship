package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ClassStudentGet(classIds []int) ([]string, error) {
	query := `
		SELECT DISTINCT ON ("student_id")
			"student_id"
		FROM
		    "school"."class_student"
		WHERE "class_id" = ANY($1)
	`
	ids := []string{}
	err := postgresRepository.Database.Select(&ids, query, classIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return ids, err
	}
	return ids, nil
}
