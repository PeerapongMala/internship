package postgres

import (
	"database/sql"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (repo *postgresRepository) TeacherDeleteFromClassroom(tx *sqlx.Tx, classRoomId int, teacherId string) error {
	var exec func(query string, args ...any) (sql.Result, error)
	if tx != nil {
		exec = tx.Exec
	} else {
		exec = repo.Database.Exec
	}

	_, err := exec(`
		DELETE FROM "school"."class_teacher"
		WHERE class_id = $1
		AND teacher_id = $2
	`,
		classRoomId,
		teacherId,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
