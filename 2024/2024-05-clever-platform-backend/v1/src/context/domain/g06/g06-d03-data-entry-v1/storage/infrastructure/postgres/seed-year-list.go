package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SeedYearList() ([]string, error) {
	query := `
		SELECT
			"short_name"
		FROM
			"curriculum_group"."seed_year"
	`
	seedYears := []string{}
	err := postgresRepository.Database.Select(&seedYears, query)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return seedYears, nil
}
