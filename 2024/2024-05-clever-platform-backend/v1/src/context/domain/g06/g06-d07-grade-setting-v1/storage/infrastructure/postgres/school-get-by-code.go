package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolGetIDByCode(tx *sqlx.Tx, schoolCode string) (schoolID int, err error) {
	err = tx.QueryRowx(`SELECT id FROM school.school WHERE code = $1`, schoolCode).Scan(&schoolID)
	if err != nil {
		return 0, errors.Wrap(err, "school not found")
	}

	return schoolID, nil
}
