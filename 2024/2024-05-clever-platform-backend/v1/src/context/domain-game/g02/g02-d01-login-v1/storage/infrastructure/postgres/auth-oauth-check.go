package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthOAuthCheck(provider, userId, subjectId string) (bool, error) {
	query := `
		SELECT EXISTS (
			SELECT
				1
			FROM "auth"."auth_oauth" oa
			WHERE
			    "provider" = $1
				AND user_id = $2
				AND subject_id = $3
		)
	`
	var isExists bool
	err := postgresRepository.Database.QueryRowx(query, provider, userId, subjectId).Scan(&isExists)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return false, err
	}
	return isExists, nil
}
