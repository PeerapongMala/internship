package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetListEvaluationStudent(formID int) ([]constant.EvaluationStudentEntity, error) {
	query := `
		SELECT 
			*
		FROM
			grade.evaluation_student
		WHERE form_id = $1
		ORDER BY id
	`

	var entities []constant.EvaluationStudentEntity
	err := postgresRepository.Database.Select(&entities, query, formID)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
