package postgres

import (
	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) GradeEvaluationSubjectNotActiveDelete(tx *sqlx.Tx, activeSubjectIds []int, formId int) error {
	query := `
		DELETE FROM grade.evaluation_form_setting tas 
		USING
			grade.evaluation_form_indicator efi,
			grade.evaluation_form_subject efs
        WHERE 
			tas.evaluation_form_indicator_id = efi.id
			AND NOT (efi.evaluation_form_subject_id = ANY($1))
    `
	_, err := tx.Exec(query, activeSubjectIds)
	if err != nil {
		return err
	}

	query = `
		DELETE FROM grade.evaluation_form_indicator
		WHERE 
			NOT (evaluation_form_subject_id = ANY($1))
	`
	_, err = tx.Exec(query, activeSubjectIds)
	if err != nil {
		return err
	}

	query = `
		UPDATE grade.evaluation_sheet es
		SET current_data_entry_id = NULL
		WHERE 
		   	es.form_id = $1 
    		AND NOT (es.evaluation_form_subject_id = ANY($2));
	`
	_, err = tx.Exec(query, formId, activeSubjectIds)
	if err != nil {
		return err
	}

	query = `
		DELETE FROM grade.evaluation_data_entry ede
		USING grade.evaluation_sheet es
		WHERE
		    es.form_id = $1
		    AND NOT (es.evaluation_form_subject_id = ANY($2))
			AND ede.sheet_id = es.id
	`
	_, err = tx.Exec(query, formId, activeSubjectIds)
	if err != nil {
		return err
	}

	query = `
		DELETE FROM grade.evaluation_form_note efn
		USING grade.evaluation_sheet es
		WHERE
			efn.sheet_id = es.id
			AND es.form_id = $1
		    AND NOT (es.evaluation_form_subject_id = ANY($2));
	`
	_, err = tx.Exec(query, formId, activeSubjectIds)
	if err != nil {
		return err
	}

	query = `
		DELETE FROM grade.evaluation_sheet es
		WHERE 
    		es.form_id = $1
    	AND NOT (es.evaluation_form_subject_id = ANY($2));
	`
	_, err = tx.Exec(query, formId, activeSubjectIds)
	if err != nil {
		return err
	}

	query = `
		DELETE FROM grade.evaluation_form_subject efs
		WHERE
			efs.form_id = $1
  			AND NOT (efs.id = ANY($2))
	`
	_, err = tx.Exec(query, formId, activeSubjectIds)
	if err != nil {
		return err
	}

	return nil
}
