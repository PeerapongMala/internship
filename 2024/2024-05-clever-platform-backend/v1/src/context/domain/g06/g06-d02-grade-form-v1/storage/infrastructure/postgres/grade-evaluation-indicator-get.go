package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GradeEvaluationIndicatorGet(indicatorId int) (*constant.GradeEvaluationFormIndicatorEntity, error) {
	indicator := constant.GradeEvaluationFormIndicatorEntity{}

	err := postgresRepository.Database.QueryRowx(`
		SELECT 
		    "id",
			"evaluation_form_subject_id",
			"name",
			"max_value",
			"sort",
			"score_evaluation_type",
			"clever_lesson_id",
			"clever_sub_lesson_id",
			"clever_subject_template_indicator_id"
		FROM grade.evaluation_form_indicator WHERE id = $1
	`, indicatorId).StructScan(&indicator)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	err = postgresRepository.Database.Select(&indicator.Setting, `
		SELECT 
		    "id",
			"evaluation_form_indicator_id",
			"evaluation_key",
			"evaluation_topic",
			"value",
			"weight",
			COALESCE("level_count", 0) AS "level_count"
		FROM grade.evaluation_form_setting 
		WHERE evaluation_form_indicator_id = $1
	`, indicator.Id)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &indicator, nil
}
