package postgres

import (
	"log"
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeAssesmentSettingUpdate(tx *sqlx.Tx, entity *constant.TemplateAssessmentSettingEntity) error {

	query := `
		UPDATE grade.template_assessment_setting
		SET
	`
	var setClauses []string
	var args []interface{}
	argID := 1

	if entity.EvaluationKey != nil {
		setClauses = append(setClauses, "evaluation_key = $"+strconv.Itoa(argID))
		args = append(args, entity.EvaluationKey)
		argID++
	}

	if entity.EvaluationTopic != nil {
		setClauses = append(setClauses, "evaluation_topic = $"+strconv.Itoa(argID))
		args = append(args, entity.EvaluationTopic)
		argID++
	}

	if entity.Value != nil {
		setClauses = append(setClauses, "value = $"+strconv.Itoa(argID))
		args = append(args, entity.Value)
		argID++
	}

	if entity.Weight != nil {
		setClauses = append(setClauses, "weight = $"+strconv.Itoa(argID))
		args = append(args, entity.Weight)
		argID++
	}

	if entity.LevelCount != nil {
		setClauses = append(setClauses, "level_count = $"+strconv.Itoa(argID))
		args = append(args, entity.LevelCount)
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
