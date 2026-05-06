package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LessonCaseCheckDuplicateIndex(tx *sqlx.Tx, subjectId, index int) (*bool, error) {
	query := `
		SELECT
			EXISTS
		(
			SELECT
				1
			FROM	
				"subject"."lesson" l
			WHERE
			    "subject_id" = $1
				AND 
			    "index" = $2
		)
`
	var isExists bool
	err := tx.QueryRowx(query, subjectId, index).Scan(&isExists)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &isExists, nil
}
