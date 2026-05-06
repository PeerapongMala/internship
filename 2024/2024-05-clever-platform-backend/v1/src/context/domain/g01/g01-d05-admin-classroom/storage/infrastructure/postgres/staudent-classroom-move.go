package postgres

import "errors"

func (repo *postgresRepository) StudentMove(classRoomId int, studentId string) error {
	tx, err := repo.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	classroom, err := repo.ClassGet(classRoomId)
	if err != nil {
		return err
	}
	if classroom == nil {
		return errors.New("classroom not found")
	}

	_, err = tx.Exec(`
		DELETE FROM school.class_student
		WHERE student_id = $1`,
		studentId,
	)
	if err != nil {
		return err
	}

	_, err = tx.Exec(`
		INSERT INTO school.class_student (class_id, student_id)
		VALUES ($1, $2)
		ON CONFLICT DO NOTHING`,
		classRoomId, studentId,
	)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}
