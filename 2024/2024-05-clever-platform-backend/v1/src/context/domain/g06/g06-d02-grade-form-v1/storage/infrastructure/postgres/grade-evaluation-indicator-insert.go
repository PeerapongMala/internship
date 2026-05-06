package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) EvaluationFormIndicatorInsert(tx *sqlx.Tx, entity *constant.GradeEvaluationFormIndicatorEntity) (insertId int, err error) {

	query := `
		INSERT INTO grade.evaluation_form_indicator (
			"evaluation_form_subject_id",
			"name",
			"max_value",
			"sort",
			"score_evaluation_type",
			"clever_lesson_id",
			"clever_sub_lesson_id",
			"clever_subject_template_indicator_id"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id;
	`

	err = tx.QueryRowx(
		query,
		entity.EvaluationFormSubjectId,
		entity.Name,
		entity.MaxValue,
		entity.Sort,
		entity.ScoreEvaluationType,
		entity.CleverLessonId,
		entity.CleverSubLessonId,
		entity.CleverSubjectTemplateIndicatorId,
	).Scan(&insertId)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return insertId, err
	}

	return insertId, nil
}
