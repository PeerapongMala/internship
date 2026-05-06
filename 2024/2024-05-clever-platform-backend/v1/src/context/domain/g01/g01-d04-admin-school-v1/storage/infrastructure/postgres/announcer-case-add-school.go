package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AnnouncerCaseAddSchool(tx *sqlx.Tx, in *constant.SchoolAnnouncerEntity) error {
	type QueryMethod func(query string, args ...interface{}) (sql.Result, error)
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.Exec
		}
		return postgresRepository.Database.Exec
	}()
	query := `
		INSERT INTO "school"."school_announcer" (
			"school_id",
			"user_id"	
		)
		VALUES ($1, $2)
	`
	_, err := queryMethod(
		query,
		in.SchoolId,
		in.UserId,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
