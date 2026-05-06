package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionLearnCreate(tx *sqlx.Tx, questionLearn *constant.QuestionLearnEntity) (*constant.QuestionLearnEntity, error) {
	query := `
		INSERT INTO "question"."question_learn"	(
			"question_id",
			"text",
			"url"
		)
		VALUES ($1, $2, $3)
		RETURNING *
	`
	questionLearnEntity := constant.QuestionLearnEntity{}
	err := tx.QueryRowx(
		query,
		questionLearn.QuestionId,
		questionLearn.Text,
		questionLearn.Url,
	).StructScan(&questionLearnEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &questionLearnEntity, nil
}
