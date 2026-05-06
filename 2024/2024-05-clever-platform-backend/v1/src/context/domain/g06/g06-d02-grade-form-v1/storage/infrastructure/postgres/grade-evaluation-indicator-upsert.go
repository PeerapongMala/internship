package postgres

import (
	"log"
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) EvaluationFormIndicatorUpsert(tx *sqlx.Tx, entity *constant.GradeEvaluationFormIndicatorEntity) (insertId int, err error) {
	if entity.Id == nil {
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

	query := `
			UPDATE grade.evaluation_form_indicator
			SET
		`
	var setClauses []string
	var args []interface{}
	argID := 1

	setClauses = append(setClauses, `"clever_subject_template_indicator_id" = $`+strconv.Itoa(argID))
	args = append(args, entity.CleverSubjectTemplateIndicatorId)
	argID++

	if entity.EvaluationFormSubjectId != nil {
		setClauses = append(setClauses, `"evaluation_form_subject_id" = $`+strconv.Itoa(argID))
		args = append(args, entity.EvaluationFormSubjectId)
		argID++
	}

	if entity.Name != nil {
		setClauses = append(setClauses, `"name" = $`+strconv.Itoa(argID))
		args = append(args, entity.Name)
		argID++
	}

	if entity.MaxValue != nil {
		setClauses = append(setClauses, `"max_value" = $`+strconv.Itoa(argID))
		args = append(args, entity.MaxValue)
		argID++
	}

	if entity.Sort != nil {
		setClauses = append(setClauses, `"sort" = $`+strconv.Itoa(argID))
		args = append(args, entity.Sort)
		argID++
	}

	if entity.ScoreEvaluationType != nil {
		setClauses = append(setClauses, `"score_evaluation_type" = $`+strconv.Itoa(argID))
		args = append(args, entity.ScoreEvaluationType)
		argID++
	}

	if entity.CleverLessonId != nil {
		setClauses = append(setClauses, `"clever_lesson_id" = $`+strconv.Itoa(argID))
		args = append(args, entity.CleverLessonId)
		argID++
	}
	if entity.CleverSubLessonId != nil {
		setClauses = append(setClauses, `"clever_sub_lesson_id" = $`+strconv.Itoa(argID))
		args = append(args, entity.CleverSubLessonId)
		argID++
	}

	query += strings.Join(setClauses, ", ")
	query += ` WHERE "id" = $` + strconv.Itoa(argID)
	args = append(args, entity.Id)

	_, err = tx.Exec(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}

	return *entity.Id, nil
}
