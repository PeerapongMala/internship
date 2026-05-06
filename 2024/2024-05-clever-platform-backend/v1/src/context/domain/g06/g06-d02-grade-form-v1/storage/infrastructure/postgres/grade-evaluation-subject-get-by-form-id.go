package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeEvaluationSubjectGetByFormId(formId int, includeDetail bool) ([]constant.GradeEvaluationFormSubjectWithNameEntity, error) {
	query := `
		SELECT 
			efla.id,
			efla.form_id,
			efla.template_subject_id,
			efla.clever_subject_template_id,
			COALESCE(ts.subject_no, efla.subject_no) AS "subject_no",
			COALESCE(ts.learning_area, efla.learning_area) AS "learning_area",
			COALESCE(ts.credits, efla.credits) AS "credits",
			COALESCE(ts.is_extra, efla.is_extra) AS "is_extra",
			COALESCE(ts.clever_subject_id, efla.clever_subject_id) AS "clever_subject_id",
			COALESCE(ts.subject_name, efla.subject_name) AS "subject_name",
			COALESCE(ts.is_clever, efla.is_clever) AS "is_clever",
			COALESCE(ts.clever_subject_id, efla.clever_subject_id) AS "clever_subject_id",
			ts.clever_subject_name,
			COALESCE(ts.hours, efla.hours) AS "hours"
		FROM
			grade.evaluation_form_subject efla
		LEFT JOIN
		  grade.template_subject ts
		ON
		  efla.template_subject_id = ts.id
		WHERE efla.form_id = $1
		ORDER BY ts.subject_name, efla.subject_name
	`

	var entities []constant.GradeEvaluationFormSubjectWithNameEntity
	err := postgresRepository.Database.Select(&entities, query, formId)
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
				FROM grade.evaluation_form_indicator WHERE "evaluation_form_subject_id" = $1
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

	return entities, nil
}
