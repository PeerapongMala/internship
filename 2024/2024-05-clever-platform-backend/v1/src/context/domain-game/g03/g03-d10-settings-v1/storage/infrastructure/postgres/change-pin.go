package postgres

import (
	"fmt"
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ChangePin(userID string, pin string) error {
	query := `
		UPDATE auth.auth_pin SET
		pin = $1
		WHERE user_id = $2
	`

	args := []interface{}{pin, userID}
	Affect, err := postgresRepository.Database.Exec(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	rowsAffected, _ := Affect.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("no record found with user id = %s", userID)
	}

	return nil
}
