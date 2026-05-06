package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionCaseSort(tx *sqlx.Tx, questions map[int]int, levelId int) error {
	query := `
		UPDATE "question"."question"
		SET
			"index" = $1
		WHERE
			"id" = $2
			AND
			"level_id" = $3
	`
	for id, index := range questions {
		_, err := tx.Exec(query, index, id, levelId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
