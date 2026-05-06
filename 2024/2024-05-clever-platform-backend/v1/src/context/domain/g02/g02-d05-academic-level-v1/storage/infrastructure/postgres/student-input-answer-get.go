package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudentInputAnswerGet(questionPlayLogId int) ([]constant.StudentInputAnswerEntity, error) {
	query := `
		SELECT 
			"qt"."id" AS "description_id",
			"qt"."index" AS "description_index",
			"qip"."id" AS "answer_id",
			"qip"."answer_index" AS "answer_index",
			"sia"."answer" AS "answer"
		FROM 
			"question"."student_input_answer" sia
		LEFT JOIN
			"question"."question_play_log" qpl
			ON "sia"."question_play_log_id" = "qpl"."id"
		LEFT JOIN
			"question"."question_input_answer" qip
			ON "sia"."question_input_answer_id" = "qip".id 
		LEFT JOIN 
			"question"."question_text" qt
			ON "qip"."question_text_description_id" = "qt"."id"
		WHERE 
			"qpl"."id" = $1
		ORDER BY "description_index", "answer_index"
`
	studentInputAnswerEntities := []constant.StudentInputAnswerEntity{}
	err := postgresRepository.Database.Select(&studentInputAnswerEntities, query, questionPlayLogId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return studentInputAnswerEntities, nil
}
