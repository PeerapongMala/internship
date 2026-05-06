package postgres

import (
	"github.com/jmoiron/sqlx"
	"log"
)

func (postgresRepository *postgresRepository) DeleteGradeTemplateNotActive(tx *sqlx.Tx, templateID int, activeGeneralTemplateID []int) error {

	query := "DELETE FROM grade.template_general_evaluation WHERE template_id = $1 AND id <> ALL($2)"
	result, err := tx.Exec(query, templateID, activeGeneralTemplateID)
	if err != nil {
		return err
	}
	count, _ := result.RowsAffected()
	log.Printf("delete template_general_evaluation %d rows", count)
	return nil
}
