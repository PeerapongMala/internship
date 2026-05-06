package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionTextCaseDeleteByType(tx *sqlx.Tx, questionText *constant.QuestionTextEntity) ([]string, error) {
	savedTextDeleteQuery := `
		WITH deleted_rows AS (
			DELETE FROM "curriculum_group"."saved_text"
			WHERE 
				"group_id" = $1 
				AND 
				"status" = $2
			RETURNING "speech_url"
		)
		SELECT "speech_url" 
		FROM deleted_rows 
		WHERE "speech_url" IS NOT NULL
	`

	questionTextQuery := `
		DELETE FROM "question"."question_text"
		WHERE
			"question_id" = $1
			AND
			"type" = $2
			AND
		    (
				"type" != $3
				OR
				("type" = $4 AND "index" IS NULL)
			)
		RETURNING "saved_text_group_id"
	`

	savedTextGroupIds := []string{}
	err := tx.Select(&savedTextGroupIds, questionTextQuery, questionText.QuestionId, questionText.Type, constant.Description, constant.Description)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	speechKeys := []string{}
	for _, savedTextGroupId := range savedTextGroupIds {
		keys := []*string{}
		err := tx.Select(&keys, savedTextDeleteQuery, savedTextGroupId, constant.SavedTextHidden)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		for _, key := range keys {
			if key != nil {
				speechKeys = append(speechKeys, *key)
			}
		}
	}

	return speechKeys, nil
}
