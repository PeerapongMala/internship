package postgres

import (
	"github.com/jmoiron/sqlx"
	"log"
)

func (postgresRepository *postgresRepository) DeleteGradeSubjectNotActive(tx *sqlx.Tx, templateID int, activeSubjectID []int) error {

	query := `DELETE FROM grade.template_assessment_setting tas 
			  USING grade.template_indicator ti
       		  LEFT JOIN grade.template_subject ts ON ti.template_subject_id = ts.id AND ts.template_id = $1
              WHERE tas.template_indicator_id = ti.id AND ts.id <> ALL($2)`
	result, err := tx.Exec(query, templateID, activeSubjectID)
	if err != nil {
		return err
	}
	count, _ := result.RowsAffected()
	log.Printf("delete template_assessment_setting %d rows", count)

	query = `DELETE FROM grade.template_indicator ti 
			  USING grade.template_subject ts
              WHERE ti.template_subject_id = ts.id AND ts.template_id = $1 AND ts.id <> ALL($2)`
	result, err = tx.Exec(query, templateID, activeSubjectID)
	if err != nil {
		return err
	}
	count, _ = result.RowsAffected()
	log.Printf("delete template_indicator %d rows", count)

	query = "DELETE FROM grade.template_subject WHERE template_id = $1 AND id <> ALL($2)"
	result, err = tx.Exec(query, templateID, activeSubjectID)
	if err != nil {
		return err
	}
	count, _ = result.RowsAffected()
	log.Printf("delete template_subject %d rows", count)

	return nil
}
