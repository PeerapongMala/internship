package postgres

import (
	"database/sql"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (repo *postgresRepository) StudentDeleteFromClassroom(tx *sqlx.Tx, classRoomId int, studentId string) error {
	var exec func(query string, args ...any) (sql.Result, error)
	if tx != nil {
		exec = tx.Exec
	} else {
		exec = repo.Database.Exec
	}

	_, err := exec(`
		DELETE FROM school.class_student 
		WHERE class_id = $1 
			AND student_id = $2`,
		classRoomId,
		studentId,
	)

	_, err = exec(`
		DELETE FROM "class"."study_group_student" 
		WHERE "student_id" = $2
		AND "study_group_id" IN (
    		SELECT "id" FROM "class"."study_group" 
    		WHERE "class_id" = $1
		)
	`, classRoomId, studentId)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return err
}
