package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d08-admin-family-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AddFamily(tx *sqlx.Tx, family *constant.Family) (int, error) {
	log.Println("family 01.08: ", family)

	type QueryMethod func(query string, args ...interface{}) *sqlx.Row
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.QueryRowx
		}
		return postgresRepository.Database.QueryRowx
	}()

	query := `
		INSERT INTO "family"."family" (
			"created_at",
			"created_by",
			"status"
		)
		VALUES ($1, $2, $3)
		RETURNING id;
	`

	agrs := []interface{}{family.CreatedAt, family.CreatedBy, family.Status}

	var familyID int
	err := queryMethod(query, agrs...).Scan(&familyID)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}

	return familyID, nil
}
