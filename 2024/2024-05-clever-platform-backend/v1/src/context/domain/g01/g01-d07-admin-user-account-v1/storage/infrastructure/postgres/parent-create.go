package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ParentCreate(tx *sqlx.Tx, parent *constant.ParentEntity) (*constant.ParentEntity, error) {
	type QueryMethod func(query string, args ...interface{}) *sqlx.Row
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.QueryRowx
		}
		return postgresRepository.Database.QueryRowx
	}()
	query := `
		INSERT INTO "user"."parent" (
			"user_id",
			"relationship",
			"phone_number",
			"birth_date"	
		)
		VALUES ($1, $2, $3, $4)
		RETURNING *
	`
	parentEntity := constant.ParentEntity{}
	err := queryMethod(
		query,
		parent.UserId,
		parent.Relationship,
		parent.PhoneNumber,
		parent.BirthDate,
	).StructScan(&parentEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &parentEntity, nil
}
