package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) TeacherSubjectGet(teacherId string) (int, error) {
	query := `
		SELECT "subject_id"
		FROM "subject"."subject_teacher"
		WHERE "teacher_id" = $1
	`
	subjectId := 0
	err := postgresRepository.Database.Get(&subjectId, query, teacherId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return subjectId, err
	}
	return subjectId, nil
}
