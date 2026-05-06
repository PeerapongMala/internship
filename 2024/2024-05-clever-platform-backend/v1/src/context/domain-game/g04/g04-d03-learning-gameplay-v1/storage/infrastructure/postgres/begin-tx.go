package postgres

import (
	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) BeginTx() (*sqlx.Tx, error) {
	return postgresRepository.Database.Beginx()
}
