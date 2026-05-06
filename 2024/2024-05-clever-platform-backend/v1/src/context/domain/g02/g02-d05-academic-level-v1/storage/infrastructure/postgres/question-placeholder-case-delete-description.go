package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionPlaceholderCaseDeleteDescription(tx *sqlx.Tx, questionIds ...int) ([]string, error) {
	if len(questionIds) == 0 {
		return nil, nil
	}
	descriptionTextIdsQuery := `
    	SELECT "id"
    	FROM "question"."question_text"
    	WHERE "question_id" = ANY($1)
    	AND "type" = $2
    	AND "index" IS NOT NULL
	`
	descriptionTextIds := []int{}
	err := tx.Select(&descriptionTextIds, descriptionTextIdsQuery, questionIds, constant.Description)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	questionPlaceholderAnswerTextQuery := `
    	DELETE FROM "question"."question_placeholder_answer_text"
    	WHERE "question_placeholder_answer_id" IN (
    	    SELECT "id" 
    	    FROM "question"."question_placeholder_answer"
   		    WHERE "question_text_description_id" = ANY($1)
   		)
`
	_, err = tx.Exec(questionPlaceholderAnswerTextQuery, descriptionTextIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	questionPlaceholderAnswerQuery := `
    	DELETE FROM "question"."question_placeholder_answer"
    	WHERE "question_text_description_id" = ANY($1)
`
	_, err = tx.Exec(questionPlaceholderAnswerQuery, descriptionTextIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	questionTextQuery := `
    	DELETE FROM "question"."question_text"
    	WHERE "question_id" = ANY($1)
    	AND "type" = $2
    	AND "index" IS NOT NULL
    	RETURNING "saved_text_group_id"
`
	groupIds := []string{}
	err = tx.Select(&groupIds, questionTextQuery, questionIds, constant.Description)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query := `
		WITH deleted_rows AS (
			DELETE FROM "curriculum_group"."saved_text"	
			WHERE
				"group_id" = ANY($1)
			AND "status" = $2
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
