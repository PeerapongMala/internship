package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TeacherCaseUpdateTeacherAccesses(tx *sqlx.Tx, userId string, teacherAccesses []int) error {
	query := `
		DELETE FROM "user"."user_teacher_access"
		WHERE
			"user_id" = $1;	
	`
	_, err := tx.Exec(query, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	query = `
		INSERT INTO "user"."user_teacher_access" (
			"user_id",
			"teacher_access_id"
		)	
		VALUES ($1, $2)
	`
	for _, teacherAcccess := range teacherAccesses {
		_, err := tx.Exec(query, userId, teacherAcccess)
		if err != nil {
			return err
		}
	}

	return nil
}
