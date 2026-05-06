package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LessonLevelToggle(subLessonId int, classId int, lock *bool) error {
	query := `
		INSERT INTO "school"."lesson_level_lock" ("lock", "class_id", "sub_lesson_id")
		VALUES ($1, $2, $3)
		ON CONFLICT ("class_id", "sub_lesson_id")
		DO UPDATE SET "lock" = EXCLUDED."lock"
	`
	_, err := postgresRepository.Database.Exec(query, lock, classId, subLessonId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
