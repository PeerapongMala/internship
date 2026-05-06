package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudentGroupAnswerGet(questionPlayLogId int) ([]constant.StudentGroupAnswerEntity, error) {
	query := `
		SELECT 
			"qgc"."id" AS "choice_id",
			"qgc"."index" AS "choice_index",
			"qgg"."id" AS "group_id",
			"qgg"."index" AS "group_index"
		FROM
			"question"."student_group_answer" sga
		LEFT JOIN
			"question"."question_play_log" qpl
			ON "sga"."question_play_log_id" = "qpl"."id"
		LEFT JOIN 
			"question"."question_group_choice" qgc
			ON "sga"."question_group_choice_id" = "qgc"."id"
		LEFT JOIN
			"question"."question_group_group" qgg
			ON "sga"."question_group_group_id" = "qgg"."id"
		WHERE 
			"qpl"."id" = $1
		ORDER BY "qgg"."index"
	`
	studentGroupAnswerEntities := []constant.StudentGroupAnswerEntity{}
	err := postgresRepository.Database.Select(&studentGroupAnswerEntities, query, questionPlayLogId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return studentGroupAnswerEntities, nil
}
