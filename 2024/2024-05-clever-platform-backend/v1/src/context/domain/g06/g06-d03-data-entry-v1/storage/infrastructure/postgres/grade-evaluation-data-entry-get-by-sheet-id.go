package postgres

import (
	"encoding/json"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetEvaluationDataBySheetId(sheetID int, version string) (*constant.EvaluationDataEntry, error) {
	query := `
		SELECT 
			ede.id,
			sheet_id,
			version,
			json_student_score_data,
			ede.is_lock,
			ede.status,
			ede.created_at,
			ede.created_by,
			ede.updated_at,
			(SELECT "sub_u"."first_name" FROM "user"."user" sub_u WHERE sub_u."id" = ede.updated_by LIMIT 1) AS updated_by,
			"efge"."additional_data"
		FROM
			grade.evaluation_data_entry ede
		LEFT JOIN "grade"."evaluation_sheet" es ON "ede"."sheet_id" = "es"."id"
		LEFT JOIN "grade"."evaluation_form_general_evaluation" efge ON "es"."evaluation_form_general_evaluation_id" = "efge"."id"
		WHERE
			sheet_id = $1
		AND (
			($2 = '' AND ede.id = (SELECT MAX(es.current_data_entry_id) FROM grade.evaluation_sheet es WHERE es.id = $1) ) OR version = $2
		)
		ORDER BY 
			version DESC
		LIMIT 1
	`

	var evaluationData constant.EvaluationDataEntry
	err := postgresRepository.Database.QueryRowx(query, sheetID, version).StructScan(&evaluationData)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	evaluationData.StudentScoreData = constant.StudentScoreDataList{}
	err = json.Unmarshal([]byte(evaluationData.JsonStudentScoreData), &evaluationData.StudentScoreData)
	if err != nil {
		log.Printf("Error unmarshalling evaluation data: %v", err)
		return nil, err
	}

	return &evaluationData, nil
}
