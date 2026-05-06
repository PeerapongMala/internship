package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) InventoryGet(studentId string) (*int, error) {
	query := `
		SELECT
			"id"
		FROM
		    "inventory"."inventory"
		WHERE
		    "student_id" = $1
`
	var id int
	err := postgresRepository.Database.QueryRowx(query, studentId).Scan(&id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &id, nil
}
