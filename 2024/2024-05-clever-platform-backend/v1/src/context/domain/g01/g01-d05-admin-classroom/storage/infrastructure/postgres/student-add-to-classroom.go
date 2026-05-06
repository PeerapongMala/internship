package postgres

import (
	"database/sql"
	"github.com/jmoiron/sqlx"
)

func (repo *postgresRepository) StudentAddToClassroom(tx *sqlx.Tx, classRoomId int, studentId string) error {
	var exec func(query string, args ...any) (sql.Result, error)
	if tx != nil {
		exec = tx.Exec
	} else {
		exec = repo.Database.Exec
	}
	_, err := exec(`
		INSERT INTO school.class_student (class_id, student_id) 
		VALUES ($1, $2) 
		ON CONFLICT DO NOTHING`,
		classRoomId,
		studentId,
	)
	return err
}
