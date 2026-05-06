package postgres

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AuthCaseUpdatePin(userId, pin string) error {
	query := `
		UPDATE auth.auth_pin
		SET pin = $2
		WHERE "user_id" = $1
	`
	result, err := postgresRepository.Database.Exec(
		query,
		userId,
		pin,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	if rowsAffected == 0 {
		return helper.NewHttpError(http.StatusNotFound, nil)
	}

	return nil
}
