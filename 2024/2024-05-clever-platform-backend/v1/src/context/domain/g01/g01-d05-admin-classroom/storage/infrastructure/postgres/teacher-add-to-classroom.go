package postgres

import (
	"fmt"
	"github.com/jmoiron/sqlx"
)

func (repo *postgresRepository) TeacherAddToClassroom(tx *sqlx.Tx, classRoomId int, userId ...string) error {
	var err error

	if tx == nil {
		tx, err = repo.BeginTx()
		if err != nil {
			return err
		}

		defer func() {
			if err != nil {
				tx.Rollback()
				return
			}

			tx.Commit()
		}()
	}

	for _, id := range userId {
		_, err = tx.Exec(`
		INSERT INTO school.class_teacher (class_id, teacher_id)
		VALUES ($1, $2)
		ON CONFLICT (class_id, teacher_id) DO NOTHING `,
			classRoomId,
			id,
		)
		if err != nil {
			return fmt.Errorf("error inserting row into class_teacher with teacher id %s: %s", id, err)
		}
	}

	return nil
}
