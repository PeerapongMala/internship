package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudentSortAnswerGet(questionPlayLogId int) ([]constant.StudentSortAnswerEntity, error) {
	query := `
		SELECT 
			"qstc"."id" AS "choice_id",
			"qstc"."index" AS "choice_index",
			"ssa"."index" AS "answer_index"
		FROM 
			"question"."student_sort_answer" ssa
		LEFT JOIN
			"question"."question_play_log" qpl
			ON "ssa"."question_play_log_id" = "qpl"."id"
		LEFT JOIN 
			"question"."question_sort_text_choice" qstc
			ON "ssa"."question_sort_text_choice_id" = "qstc".id 
		WHERE 
			"qpl"."id" = $1
		ORDER BY "ssa"."index" ASC
	`
	studentSortAnswerEntities := []constant.StudentSortAnswerEntity{}
	err := postgresRepository.Database.Select(&studentSortAnswerEntities, query, questionPlayLogId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return studentSortAnswerEntities, nil
}
