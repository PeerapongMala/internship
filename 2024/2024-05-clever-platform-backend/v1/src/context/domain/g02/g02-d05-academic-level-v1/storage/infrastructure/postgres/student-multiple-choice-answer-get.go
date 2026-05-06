package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudentMultipleChoiceAnswerGet(questionPlayLogId int) (*constant.StudentMultipleChoiceAnswerEntity, error) {
	query := `
		SELECT DISTINCT ON ("qmctc"."id", "qmctc"."index")
			"qmctc"."id" AS "text_choice_id",
			"qmcic"."id" AS "image_choice_id",
			"qmctc"."index" AS "text_choice_index",
			"qmcic"."index" AS "image_choice_index"
		FROM
			"question"."student_multiple_choice_answer" smca
		LEFT JOIN
			"question"."question_play_log" qpl
			ON "smca"."question_play_log_id" = "qpl"."id" 
		LEFT JOIN
			"question"."question_multiple_choice_text_choice" qmctc
			ON
			"smca"."question_multiple_choice_text_choice_id" = "qmctc"."id"
		LEFT JOIN
			"question"."question_multiple_choice_image_choice" qmcic
			ON
			"smca"."question_multiple_choice_image_choice_id" = "qmcic"."id"
		WHERE
			(
			"smca"."question_multiple_choice_text_choice_id" = "qmctc"."id"
			OR
			"smca"."question_multiple_choice_image_choice_id" = "qmcic"."id"
			)
			AND
			"qpl"."id" = $1
	`

	studentMultipleChoiceEntity := constant.StudentMultipleChoiceAnswerEntity{}
	err := postgresRepository.Database.QueryRowx(query, questionPlayLogId).StructScan(&studentMultipleChoiceEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &studentMultipleChoiceEntity, nil
}
