package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LessonCaseGetStat(lessonIds []int, userId string) ([]constant.PlayStatEntity, error) {
	query := `
		WITH "best_play" AS (
			SELECT
				"sl"."lesson_id",
				"lpl"."student_id",
				"lpl"."level_id",
				COALESCE(MAX("lpl"."star"), 0) AS "score"
			FROM
				"level"."level_play_log" lpl
			LEFT JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
			LEFT JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
			WHERE
				"sl"."lesson_id" = ANY($1)
				AND "lpl"."student_id" = $2
			GROUP BY
				"sl"."lesson_id", "lpl"."student_id", "lpl"."level_id"
		),
		"level_count" AS (
			SELECT
				"ls"."id" AS "lesson_id",
				COUNT(*) AS "level_count"
			FROM "subject"."lesson" ls 
			INNER JOIN "subject"."sub_lesson" sl ON "ls"."id" = "sl"."lesson_id"
			INNER JOIN "level"."level" l ON "sl"."id" = "l"."sub_lesson_id"
			WHERE
				"ls"."id" = ANY($1)
			GROUP BY "ls"."id"
		)
		SELECT
			"ls"."id",
			COALESCE(COUNT("bp"."level_id"), 0) AS "played_levels",
			COALESCE("lc"."level_count", 0) AS "total_levels",	
			COALESCE(SUM("bp"."score"), 0) AS "played_stars"
		FROM "subject"."lesson" ls
		LEFT JOIN "best_play" bp ON "ls"."id" = "bp"."lesson_id"
		LEFT JOIN "level_count" lc ON "ls"."id" = "lc"."lesson_id"
		WHERE
			"ls"."id" = ANY($1)
		GROUP BY "ls"."id", "lc"."level_count"
	`

	stats := []constant.PlayStatEntity{}
	err := postgresRepository.Database.Select(&stats, query, lessonIds, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return stats, nil
}
