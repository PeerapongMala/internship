package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
)

func (postgresRepository *postgresRepository) GradeSettingList(sheetId int, indicatorId int) ([]constant.GradeEvaluationFormIndicatorEntity, error) {
	query := `
		SELECT
		    "efi"."id",
			"efi"."max_value",
			"efst"."evaluation_topic" AS "score_evaluation_type",
			"efi"."clever_sub_lesson_id",
			"efst"."weight",
			"efst"."level_count"
		FROM "grade"."evaluation_sheet" es
		INNER JOIN "grade"."evaluation_form_subject" efs ON "es"."evaluation_form_subject_id" = "efs"."id"
		INNER JOIN "grade"."evaluation_form_indicator" efi ON "efs"."id" = "efi"."evaluation_form_subject_id"
		INNER JOIN "grade"."evaluation_form_setting" efst ON "efi"."id" = "efst"."evaluation_form_indicator_id"
		WHERE "es"."id" = $1 
	`
	args := []interface{}{sheetId}
	argsIndex := len(args) + 1
	if indicatorId != 0 {
		query += fmt.Sprintf(` AND "efi"."id" = $%d`, argsIndex)
		argsIndex++
		args = append(args, indicatorId)
	}

	indicatorSetting := []constant.GradeEvaluationFormIndicatorEntity{}
	err := postgresRepository.Database.Select(&indicatorSetting, query, args...)
	if err != nil {
		return nil, err
	}
	return indicatorSetting, nil
}
