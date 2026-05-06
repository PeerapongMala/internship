package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionTextCaseDeleteByQuestionId(tx *sqlx.Tx, questionIds ...int) ([]string, error) {
	if len(questionIds) == 0 {
		return nil, nil
	}
	combinedQuery := `
	    WITH deleted_question_texts AS (
	        DELETE FROM "question"."question_text"
	        WHERE "question_id" = ANY($1)
	        RETURNING "saved_text_group_id"
	    ),
	    deleted_saved_texts AS (
	        DELETE FROM "curriculum_group"."saved_text"
	        WHERE "group_id" = ANY(SELECT "saved_text_group_id" FROM deleted_question_texts)
	        AND "status" = $2
	        RETURNING "speech_url"
	    )
	    SELECT "speech_url"
	    FROM deleted_saved_texts
	    WHERE "speech_url" IS NOT NULL
	`

	speechKeys := []string{}
	err := tx.Select(&speechKeys, combinedQuery, questionIds, "hidden")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return speechKeys, nil
}
