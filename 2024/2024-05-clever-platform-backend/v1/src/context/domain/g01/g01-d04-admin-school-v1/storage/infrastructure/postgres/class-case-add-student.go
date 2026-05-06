package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ClassCaseAddStudent(tx *sqlx.Tx, classId int, studentId string) error {
	query := `
		INSERT INTO "school"."class_student" (
		    "class_id",
			"student_id"
		)
		VALUES ($1, $2)
		ON CONFLICT ("class_id", "student_id") DO NOTHING
	`
	_, err := tx.Exec(query, classId, studentId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
