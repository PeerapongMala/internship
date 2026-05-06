package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeEvaluationSubjectGetBySheetId(sheetId int, includeDetail bool) (*constant.GradeEvaluationFormSubjectWithNameEntity, error) {
	query := `
		SELECT 
			efla.*,
			COALESCE(tla.subject_name, efla.subject_name) AS subject_name,
			COALESCE(tla.is_clever, false) AS "is_clever",
			tla.clever_subject_id
		FROM
		    grade.evaluation_sheet es
		LEFT JOIN
			grade.evaluation_form_subject efla ON es.evaluation_form_subject_id = efla.id
		LEFT JOIN
		  grade.template_subject tla ON efla.template_subject_id = tla.id
		WHERE es.id = $1
		ORDER BY COALESCE(tla.subject_name, efla.subject_name)
	`

	var entities []constant.GradeEvaluationFormSubjectWithNameEntity
	err := postgresRepository.Database.Select(&entities, query, sheetId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if includeDetail {
		for i, subject := range entities {
			err := postgresRepository.Database.Select(&entities[i].Indicator, `
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
				FROM grade.evaluation_form_indicator 
				WHERE evaluation_form_subject_id = $1
				ORDER by "sort"
			`, subject.GradeEvaluationSubjectId)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}

			for j, indicator := range entities[i].Indicator {
				err := postgresRepository.Database.Select(&entities[i].Indicator[j].Setting, `
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
			}
		}

	}

	if len(entities) == 0 || entities[0].GradeEvaluationSubjectId == nil {
		return nil, nil
	}

	return &entities[0], nil
}
