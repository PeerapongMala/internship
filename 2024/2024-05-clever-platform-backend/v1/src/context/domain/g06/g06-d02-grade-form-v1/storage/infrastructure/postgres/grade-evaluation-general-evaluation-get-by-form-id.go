package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GradeEvaluationGeneralEvaluationGetByFormId(formId int) ([]constant.GradeEvaluationFormGeneralEvaluationEntity, error) {
	query := `
		SELECT 
			id,
			form_id,
			template_type,
			template_name ,
			additional_data,
			template_general_evaluation_id
		FROM grade.evaluation_form_general_evaluation efge 
		WHERE form_id = $1
		ORDER BY id
	`

	var entities []constant.GradeEvaluationFormGeneralEvaluationEntity
	err := postgresRepository.Database.Select(&entities, query, formId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
