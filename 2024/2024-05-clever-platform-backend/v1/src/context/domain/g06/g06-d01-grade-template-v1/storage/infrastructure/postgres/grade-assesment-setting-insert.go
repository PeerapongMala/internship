package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeAssesmentSettingInsert(tx *sqlx.Tx, entity *constant.TemplateAssessmentSettingEntity) (insertId int, err error) {

	query := `
		INSERT INTO grade.template_assessment_setting (
			"template_indicator_id",
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
		entity.TemplateIndicatorId,
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
