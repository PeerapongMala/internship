package postgres

import (
	"log"
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) EvaluationFormSettingUpsert(tx *sqlx.Tx, entity *constant.GradeEvaluationFormSettingEntity) (insertId int, err error) {
	if entity.Id == nil {
		query := `
			INSERT INTO grade.evaluation_form_setting (
				"evaluation_form_indicator_id",
				"evaluation_key",
				"evaluation_topic",
				"value",
				"weight",
				"level_count"
			)
			VALUES ($1, $2, $3, $4, $5, $6)
			RETURNING id;
		`

		err = tx.QueryRowx(
			query,
			entity.EvaluationFormIndicatorId,
			entity.EvaluationKey,
			entity.EvaluationTopic,
			entity.Value,
			entity.Weight,
			entity.LevelCount,
		).Scan(&insertId)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return insertId, err
		}

		return insertId, nil
	}

	query := `
			UPDATE grade.evaluation_form_setting
			SET
		`
	var setClauses []string
	var args []interface{}
	argID := 1

	if entity.EvaluationFormIndicatorId != nil {
		setClauses = append(setClauses, `"evaluation_form_indicator_id" = $`+strconv.Itoa(argID))
		args = append(args, entity.EvaluationFormIndicatorId)
		argID++
	}

	if entity.EvaluationKey != nil {
		setClauses = append(setClauses, `"evaluation_key" = $`+strconv.Itoa(argID))
		args = append(args, entity.EvaluationKey)
		argID++
	}

	if entity.EvaluationTopic != nil {
		setClauses = append(setClauses, `"evaluation_topic" = $`+strconv.Itoa(argID))
		args = append(args, entity.EvaluationTopic)
		argID++
	}

	if entity.Value != nil {
		setClauses = append(setClauses, `"value" = $`+strconv.Itoa(argID))
		args = append(args, entity.Value)
		argID++
	}

	if entity.Weight != nil {
		setClauses = append(setClauses, `"weight" = $`+strconv.Itoa(argID))
		args = append(args, entity.Weight)
		argID++
	}

	if entity.LevelCount != nil {
		setClauses = append(setClauses, `"level_count" = $`+strconv.Itoa(argID))
		args = append(args, entity.LevelCount)
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
