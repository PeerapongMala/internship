package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) CheckMemberNotExist(userID string) (*bool, error) {
	query := `
		SELECT NOT EXISTS (
			SELECT 
				1
			FROM family.family f
			LEFT JOIN family.family_member fm 
				ON f.id = fm.family_id
			WHERE fm.user_id = $1
		)
	`

	args := []interface{}{userID}
	var exist bool
	err := postgresRepository.Database.QueryRowx(query, args...).Scan(&exist)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &exist, nil
}
