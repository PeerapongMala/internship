package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d01-learning-lesson-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubLessonCaseGetStat(subLessonIds []int, userId string) ([]constant.PlayStatEntity, error) {
	query := `
		WITH "best_play" AS (
			SELECT
				"sl"."id",
				"lpl"."student_id",
				"lpl"."level_id",
				COALESCE(MAX("lpl"."star"), 0) AS "score"
			FROM
				"level"."level_play_log" lpl
			LEFT JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
			LEFT JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
			WHERE
				"sl"."id" = ANY($1)
				AND "lpl"."student_id" = $2
			GROUP BY
				"sl"."id", "lpl"."student_id", "lpl"."level_id"
		),
		"level_count" AS (
			SELECT
				"sl"."id" AS "sub_lesson_id",
				COUNT(*) AS "level_count"
			FROM "subject"."sub_lesson" sl 
			INNER JOIN "level"."level" l ON "sl"."id" = "l"."sub_lesson_id"
			WHERE
				"sl"."id" = ANY($1)
			GROUP BY "sl"."id"
		)
		SELECT
			"sl"."id",
			COALESCE(COUNT("bp"."level_id"), 0) AS "played_levels",
			COALESCE("lc"."level_count", 0) AS "total_levels",	
			COALESCE(SUM("bp"."score"), 0) AS "played_stars"
		FROM "subject"."sub_lesson" sl
		LEFT JOIN "best_play" bp ON "sl"."id" = "bp"."id"
		LEFT JOIN "level_count" lc ON "sl"."id" = "lc"."sub_lesson_id"
		WHERE
			"sl"."id" = ANY($1)
		GROUP BY "sl"."id", "lc"."level_count"
	`

	stats := []constant.PlayStatEntity{}
	err := postgresRepository.Database.Select(&stats, query, subLessonIds, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return stats, nil
}
