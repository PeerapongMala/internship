package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ClassLessonCaseToggle(classId, lessonId int, isEnabled *bool) error {
	query := `
		UPDATE 
			"school"."school_lesson"
		SET
		    "is_enabled" = $3
		WHERE
			"class_id" = $1
			AND
			"lesson_id" = $2
	`
	_, err := postgresRepository.Database.Exec(query, classId, lessonId, isEnabled)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
