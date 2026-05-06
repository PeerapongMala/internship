package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) EvaluationFormSettingInsert(tx *sqlx.Tx, entity *constant.GradeEvaluationFormSettingEntity) (insertId int, err error) {

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
