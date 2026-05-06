package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionPlaceholderAnswerCaseDeleteByQuestionId(tx *sqlx.Tx, questionId int) error {
	query := `
		SELECT
			*
		FROM "question"."question_placeholder_text_choice"
		WHERE
			"question_placeholder_id" = $1	
	`
	questionPlaceholderTextChoiceEntities := []constant.QuestionPlaceholderTextChoiceEntity{}
	err := postgresRepository.Database.Select(&questionPlaceholderTextChoiceEntities, query, questionId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	deleteQuery := `
		DELETE FROM "question"."question_placeholder_answer"
		WHERE
			"question_placeholder_text_choice_id" = $1	
	`
	choiceDeleteQuery := `
		DELETE FROM "question"."question_placeholder_text_choice"
		WHERE
			"id" = $1	
	`
	for _, questionPlaceholderTextChoiceEntity := range questionPlaceholderTextChoiceEntities {
		_, err := tx.Exec(deleteQuery, questionPlaceholderTextChoiceEntity.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}

		_, err = tx.Exec(choiceDeleteQuery, questionPlaceholderTextChoiceEntity.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
