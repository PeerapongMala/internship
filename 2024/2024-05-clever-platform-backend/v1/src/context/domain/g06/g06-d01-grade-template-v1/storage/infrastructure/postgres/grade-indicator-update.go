package postgres

import (
	"log"
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeIndicatorUpdate(tx *sqlx.Tx, entity *constant.TemplateIndicatorEntity) error {

	query := `
		UPDATE grade.template_indicator
		SET
	`
	var setClauses []string
	var args []interface{}
	argID := 1

	setClauses = append(setClauses, "clever_subject_template_indicator_id = $"+strconv.Itoa(argID))
	args = append(args, entity.CleverSubjectTemplateIndicatorId)
	argID++

	if entity.TemplateSubjectId != 0 {
		setClauses = append(setClauses, "template_subject_id = $"+strconv.Itoa(argID))
		args = append(args, entity.TemplateSubjectId)
		argID++
	}

	if entity.IndicatorName != "" {
		setClauses = append(setClauses, "name = $"+strconv.Itoa(argID))
		args = append(args, entity.IndicatorName)
		argID++
	}

	if entity.MaxValue != nil {
		setClauses = append(setClauses, "max_value = $"+strconv.Itoa(argID))
		args = append(args, *entity.MaxValue)
		argID++
	}

	if entity.Sort != 0 {
		setClauses = append(setClauses, "sort = $"+strconv.Itoa(argID))
		args = append(args, entity.Sort)
		argID++
	}

	if entity.ScoreEvaluationType != nil {
		setClauses = append(setClauses, "score_evaluation_type = $"+strconv.Itoa(argID))
		args = append(args, *entity.ScoreEvaluationType)
		argID++
	}

	if entity.CleverLessonId != nil {
		setClauses = append(setClauses, "clever_lesson_id = $"+strconv.Itoa(argID))
		args = append(args, *entity.CleverLessonId)
		argID++
	}
	if entity.CleverSubLessonId != nil {
		setClauses = append(setClauses, "clever_sub_lesson_id = $"+strconv.Itoa(argID))
		args = append(args, *entity.CleverSubLessonId)
		argID++
	}

	query += strings.Join(setClauses, ", ")
	query += " WHERE id = $" + strconv.Itoa(argID)
	args = append(args, entity.Id)
	_, err := tx.Exec(query, args...)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
