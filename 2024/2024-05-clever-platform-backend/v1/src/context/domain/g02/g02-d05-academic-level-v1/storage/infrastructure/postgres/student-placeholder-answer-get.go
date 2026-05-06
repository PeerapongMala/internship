package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudentPlaceholderAnswerGet(questionPlayLogId int) ([]constant.StudentPlaceholderAnswerEntity, error) {
	query := `
		SELECT 
			"qptc"."id" AS "choice_id",
			"qptc"."index" AS "choice_index",
			"qt"."id" AS "description_id",
			"qt"."index" AS "description_index",
			"qpa"."id" AS "answer_id",
			"qpa"."answer_index" AS "answer_index"
		FROM 
			"question"."student_placeholder_answer" spa
		LEFT JOIN
			"question"."question_play_log" qpl
			ON "spa"."question_play_log_id" = "qpl"."id"
		LEFT JOIN
			"question"."question_placeholder_text_choice" qptc
			ON "spa"."question_placeholder_text_choice_id" = "qptc"."id"
		LEFT JOIN 
			"question"."question_placeholder_answer" qpa
			ON "spa"."question_placeholder_answer_id" = "qpa"."id"
		LEFT JOIN 
			"question"."question_text" qt
			ON "qpa"."question_text_description_id" = "qt"."id"
		WHERE 
			"qpl"."id" = $1
			ORDER BY "description_index", "answer_index"
	`
	studentPlaceholderAnswerEntities := []constant.StudentPlaceholderAnswerEntity{}
	err := postgresRepository.Database.Select(&studentPlaceholderAnswerEntities, query, questionPlayLogId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return studentPlaceholderAnswerEntities, nil
}
