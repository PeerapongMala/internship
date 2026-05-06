package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LessonCaseSort(tx *sqlx.Tx, lessons map[int]int, subjectId int) error {
	query := `
		UPDATE "subject"."lesson"	
		SET
			"index" = $1
		WHERE
			"id" = $2
			AND
			"subject_id" = $3
	`
	for id, index := range lessons {
		_, err := tx.Exec(query, index, id, subjectId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
