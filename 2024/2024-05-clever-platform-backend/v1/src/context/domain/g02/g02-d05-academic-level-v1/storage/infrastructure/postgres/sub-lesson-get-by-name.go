package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubLessonCaseGetByName(tx *sqlx.Tx, lessonId int, name string) (*int, error) {
	query := `
		SELECT
			"id"
		FROM
		    "subject"."sub_lesson"
		WHERE
		    "lesson_id" = $1
			AND "name" = $2
	`
	var id int
	err := tx.QueryRowx(query, lessonId, name).Scan(&id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &id, nil
}
