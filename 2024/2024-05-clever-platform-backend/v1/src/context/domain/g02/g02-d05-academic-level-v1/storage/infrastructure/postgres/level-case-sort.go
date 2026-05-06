package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LevelCaseSort(tx *sqlx.Tx, levels map[int]int, subLessonId int) error {
	query := `
		UPDATE "level"."level"
		SET
			"index" =  $1	
		WHERE
			"id" = $2
			AND
			"sub_lesson_id" = $3
	`
	for id, index := range levels {
		_, err := tx.Exec(query, index, id, subLessonId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
