package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) BeginTx() (*sqlx.Tx, error) {
	tx, err := postgresRepository.Database.Beginx()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return tx, nil
}
