package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthCaseBindAccountWithOAuth(provider, userId, subjectId string) error {
	query := `
		INSERT INTO "auth"."auth_oauth" (
			"provider",
			"user_id",
			"subject_id"	
		)
		VALUES ($1, $2, $3)
	`
	_, err := postgresRepository.Database.Exec(
		query,
		provider,
		userId,
		subjectId,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
