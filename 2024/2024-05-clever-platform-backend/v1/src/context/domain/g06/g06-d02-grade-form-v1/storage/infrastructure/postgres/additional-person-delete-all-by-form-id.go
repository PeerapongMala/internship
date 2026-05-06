package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
)


func (postgresRepository *postgresRepository) DeleteAllAdditionalPersonByFormId(tx *sqlx.Tx, id int) error {
	
	query := "DELETE FROM grade.evaluation_form_additional_person WHERE form_id = $1"
	result, err := tx.Exec(
		query,
		id,
	)

	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		log.Println("No rows affected")
	}

	return nil
}
