package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GeneralSheetListBySubject(formId int, evaluationFormSubjectId int) ([]constant.SubjectGeneralEvaluation, error) {
	query := `
		SELECT
			DISTINCT es.id, 
			es.id, 
			efge.template_type as "name"
		FROM grade.evaluation_sheet es
		INNER JOIN grade.evaluation_form_general_evaluation efge ON es.evaluation_form_general_evaluation_id = efge.id
		WHERE
		    es.form_id = $1
			AND es.evaluation_form_subject_id = $2
			AND es.evaluation_form_general_evaluation_id IS NOT NULL
	`

	sheets := []constant.SubjectGeneralEvaluation{}
	err := postgresRepository.Database.Select(&sheets, query, formId, evaluationFormSubjectId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return sheets, nil
}
