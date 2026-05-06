package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SchoolAffiliationGetByName(name string) (*int, error) {
	query := `
		SELECT
			"id"
		FROM
			"school_affiliation"."school_affiliation"
		WHERE
			"name" = $1
	`
	var schoolAffiliationId int
	err := postgresRepository.Database.QueryRowx(query, name).Scan(&schoolAffiliationId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &schoolAffiliationId, nil
}
