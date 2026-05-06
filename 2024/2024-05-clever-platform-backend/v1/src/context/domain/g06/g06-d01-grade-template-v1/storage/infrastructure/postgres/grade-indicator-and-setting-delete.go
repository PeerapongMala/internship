package postgres

import (
	"github.com/jmoiron/sqlx"
	"log"
)

func (postgresRepository *postgresRepository) DeleteGradeIndicatorAndSettingNotActive(tx *sqlx.Tx, subjectID int, activeIndicatorID []int) error {

	query := `DELETE FROM grade.template_assessment_setting tas 
			  USING grade.template_indicator ti 
              WHERE tas.template_indicator_id = ti.id AND ti.template_subject_id = $1 AND ($2::integer[] IS NULL OR ti.id <> ALL($2))`
	result, err := tx.Exec(query, subjectID, activeIndicatorID)
	if err != nil {
		return err
	}
	count, _ := result.RowsAffected()
	log.Printf("delete template_assessment_setting %d rows", count)

	query = "DELETE FROM grade.template_indicator WHERE template_subject_id = $1 AND ($2::integer[] IS NULL OR id <> ALL($2))"
	result, err = tx.Exec(query, subjectID, activeIndicatorID)
	if err != nil {
		return err
	}
	count, _ = result.RowsAffected()
	log.Printf("delete template_indicator %d rows", count)

	return nil
}
