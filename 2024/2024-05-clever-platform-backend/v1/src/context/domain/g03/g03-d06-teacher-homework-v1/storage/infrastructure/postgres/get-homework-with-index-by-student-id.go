package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetHomeworkWithIndexByStudentId(homeworkId int, studentId string) ([]constant.HomeworkWithIndexEntity, error) {

	query := `
		WITH level_order AS (
			SELECT
				"l"."id",
				ROW_NUMBER() OVER (ORDER BY "sl"."index", "l"."index") AS "new_index"
			FROM "homework"."homework" h
			INNER JOIN "homework"."homework_template" ht ON "h"."homework_template_id" = "ht"."id"
			INNER JOIN "subject"."sub_lesson" sl ON "ht"."lesson_id" = "sl"."lesson_id"
			INNER JOIN "level"."level" l ON "sl"."id" = "l"."sub_lesson_id"
			WHERE "h"."id" = $2
			ORDER BY "sl"."index", "l"."index"
		),
		best_attempts_per_submission AS (
			SELECT
				hs.index AS submission_index,
				lpl.level_id,
				MAX(lpl.star) AS max_star,
				AVG(lpl.time_used) AS avg_time_used
			FROM "level".level_play_log lpl
			JOIN homework.homework_submission hs ON hs.level_play_log_id = lpl.id
			WHERE lpl.student_id = $1
			AND lpl.homework_id = $2
			GROUP BY hs.index, lpl.level_id
		)
		SELECT
			bas.submission_index AS "index",
			(SELECT MIN(lpl.id)
			FROM "level".level_play_log lpl
			JOIN homework.homework_submission hs ON hs.level_play_log_id = lpl.id
			WHERE lpl.level_id = bas.level_id
			AND lpl.student_id = $1
			AND lpl.homework_id = $2
			AND hs.index = bas.submission_index
			AND lpl.star = bas.max_star) AS level_play_log_id,
			bas.level_id,
			lo."new_index" AS level_index,
			bas.max_star,
			bas.avg_time_used,
			(SELECT COUNT(DISTINCT q.id)
			FROM question.question q
			WHERE q.level_id = bas.level_id) AS total_question_count
		FROM best_attempts_per_submission bas
		LEFT JOIN "level"."level" l ON l.id = bas.level_id
		LEFT JOIN "level_order" lo ON l.id = lo.id
		ORDER BY bas.submission_index, lo."new_index"
	`

	var entities []constant.HomeworkWithIndexEntity
	err := postgresRepository.Database.Select(&entities, query, studentId, homeworkId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
