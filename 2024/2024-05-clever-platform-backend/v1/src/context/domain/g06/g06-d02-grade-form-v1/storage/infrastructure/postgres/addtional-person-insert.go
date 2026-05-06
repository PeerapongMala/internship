package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/pkg/errors"

	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) InsertAdditionalPerson(tx *sqlx.Tx, entity *constant.GradeEvaluationFormAdditionalPersonEntity) (insertId int, err error) {

	query := `
		INSERT INTO grade.evaluation_form_additional_person (
			"form_id",
			"value_type",
			"value_id",
			"user_type",
			"user_id"
		)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT ("form_id", "value_type", "value_id", "user_type", "user_id") DO NOTHING
	`

	_, err = tx.Exec(
		query,
		entity.FormId,
		entity.ValueType,
		entity.ValueId,
		entity.UserType,
		entity.UserId,
	)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return insertId, err
	}

	return insertId, nil
}
