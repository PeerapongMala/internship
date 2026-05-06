package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionInputCaseDeleteDescription(tx *sqlx.Tx, questionIds ...int) ([]string, error) {
	if len(questionIds) == 0 {
		return nil, nil
	}
	descriptionTextIdsQuery := `
		WITH "description_text_ids" AS (
			SELECT "id"
			FROM "question"."question_text"
			WHERE "question_id" = ANY($1)
				AND (("type" = $2 AND "index" IS NOT NULL) OR ("type" = $3))
		),
		deleted_input_answer_text AS (
			DELETE FROM "question"."question_input_answer_text"
			WHERE "question_text_id" IN (SELECT "id" FROM "description_text_ids")
		),
		deleted_input_answer AS (
			DELETE FROM "question"."question_input_answer"
			WHERE "question_text_description_id" IN (SELECT "id" FROM "description_text_ids")
		)
		SELECT COUNT(*)
		FROM "description_text_ids"
	`
	descriptionTextIds := []int{}
	err := tx.Select(&descriptionTextIds, descriptionTextIdsQuery, questionIds, constant.Description, constant.Choice)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query := `
		DELETE FROM "question"."question_text"
		WHERE	
			"question_id" = ANY($1)
			AND
			("type" = $2 OR "type"  = $3)
			AND
			"index" IS NOT NULL
		RETURNING "saved_text_group_id"
	`
	groupIds := []string{}
	err = tx.Select(&groupIds, query, questionIds, constant.Description, constant.Choice)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query = `
		WITH deleted_rows AS (
			DELETE FROM "curriculum_group"."saved_text"
			WHERE 
				"group_id" = ANY($1) 
				AND 
				"status" = $2
			RETURNING "speech_url"
		)
		SELECT "speech_url" 
		FROM deleted_rows 
		WHERE "speech_url" IS NOT NULL
	`
	speechKeys := []string{}
	err = tx.Select(&speechKeys, query, groupIds, "hidden")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return speechKeys, nil
}
