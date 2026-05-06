package postgres

import (
	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) DeleteAllHomeworkTemplateLevel(tx *sqlx.Tx, homeworkTemplateId int) error {
	
	query := `DELETE FROM homework.homework_template_level WHERE homework_template_id = $1`

	result, err := tx.Exec(query, homeworkTemplateId)
	if err != nil {
		return err
	}
	
	_,  err = result.RowsAffected()
	if err != nil {
		return err
	}

	return nil
}
