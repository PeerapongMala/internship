package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) CheckOwner(userID string) (*bool, error) {
	query := `
		SELECT
			fm.is_owner
		FROM family.family_member fm
		WHERE fm.user_id = $1
	`

	args := []interface{}{userID}
	var is_owner bool
	err := postgresRepository.Database.QueryRowx(query, args...).Scan(&is_owner)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &is_owner, nil
}
