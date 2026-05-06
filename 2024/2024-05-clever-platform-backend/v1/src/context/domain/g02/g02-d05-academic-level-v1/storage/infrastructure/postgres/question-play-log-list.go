package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) QuestionPlayLogList(levelPlayLogId int) ([]constant.QuestionPlayLogEntity, error) {
	query := `
		SELECT		
			"qpl"."id" AS "question_play_log_id",
			"q"."id" AS "question_id",
			"q"."index" AS "question_index",
			"q"."question_type" AS "question_type",
			"qpl"."time_used", 
			"qpl"."is_correct"
		FROM
			"question"."question_play_log" qpl
		LEFT JOIN 
			"question"."question" q
			ON "qpl"."question_id" = "q"."id"
		LEFT JOIN
			"level"."level_play_log" lpl
			ON "qpl"."level_play_log_id" = "lpl"."id"
		WHERE
			"lpl"."id" = $1
		ORDER BY "q"."index"
	`
	questionPlayLogEntities := []constant.QuestionPlayLogEntity{}
	err := postgresRepository.Database.Select(&questionPlayLogEntities, query, levelPlayLogId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return questionPlayLogEntities, nil
}
