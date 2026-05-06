package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetListEvaluationStudentBySheetID(sheetID int) ([]constant.EvaluationStudentEntity, error) {
	query := `
		SELECT 
			student.*
		FROM
			grade.evaluation_student student
		LEFT JOIN grade.evaluation_sheet sheet ON sheet.form_id = student.form_id
		WHERE sheet.id = $1
		ORDER BY id
	`

	var entities []constant.EvaluationStudentEntity
	err := postgresRepository.Database.Select(&entities, query, sheetID)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
