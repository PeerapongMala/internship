package postgres

import (
	"github.com/jmoiron/sqlx"
	"log"
)

func (postgresRepository *postgresRepository) DeleteGradeEvaluationIndicatorAndSettingNotActive(tx *sqlx.Tx, subjectID int, activeIndicatorID []int) error {

	query := `DELETE FROM grade.evaluation_form_setting tas 
			  USING grade.evaluation_form_indicator efi 
              WHERE tas.evaluation_form_indicator_id = efi.id AND efi.evaluation_form_subject_id = $1 AND ($2::integer[] IS NULL OR efi.id <> ALL($2))`
	result, err := tx.Exec(query, subjectID, activeIndicatorID)
	if err != nil {
		return err
	}
	count, _ := result.RowsAffected()
	log.Printf("delete evaluation_form_setting %d rows", count)

	query = "DELETE FROM grade.evaluation_form_indicator WHERE evaluation_form_subject_id = $1 AND ($2::integer[] IS NULL OR id <> ALL($2))"
	result, err = tx.Exec(query, subjectID, activeIndicatorID)
	if err != nil {
		return err
	}
	count, _ = result.RowsAffected()
	log.Printf("delete evaluation_form_indicator %d rows", count)

	return nil
}
