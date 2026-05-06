package postgres

import (
	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) DeleteAllHomeworkAssigned(tx *sqlx.Tx, homeworkId int) error {
	
	query1 := `DELETE FROM homework.homework_assigned_to_class WHERE homework_id = $1`
	query2 := `DELETE FROM homework.homework_assigned_to_study_group WHERE homework_id = $1`
	query3 := `DELETE FROM homework.homework_assigned_to_year WHERE homework_id = $1`

	_, err := tx.Exec(query1, homeworkId)
	if err != nil {
		return err
	}

	_, err = tx.Exec(query2, homeworkId)
	if err != nil {
		return err
	}

	_, err = tx.Exec(query3, homeworkId)
	if err != nil {
		return err
	}

	return nil
}
