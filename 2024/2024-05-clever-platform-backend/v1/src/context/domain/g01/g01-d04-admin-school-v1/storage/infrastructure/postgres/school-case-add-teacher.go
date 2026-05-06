package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SchoolCaseAddTeacher(tx *sqlx.Tx, schoolId int, userId string) error {
	query := `
		INSERT INTO "school"."school_teacher" (
			"school_id",
			"user_id"
		)	
		VALUES ($1, $2)
	`
	_, err := tx.Exec(query, schoolId, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
