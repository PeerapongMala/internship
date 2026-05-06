package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubLessonCaseSort(tx *sqlx.Tx, subLessons map[int]int, lessonId int) error {
	query := `
		UPDATE "subject"."sub_lesson"	
		SET
			"index" = $1
		WHERE
			"id" = $2
			AND
			"lesson_id" = $3
	`
	for id, index := range subLessons {
		_, err := tx.Exec(query, index, id, lessonId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
