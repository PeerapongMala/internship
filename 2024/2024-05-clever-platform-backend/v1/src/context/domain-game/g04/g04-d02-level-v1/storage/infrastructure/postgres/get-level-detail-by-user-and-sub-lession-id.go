package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetLevelDetailByUserAndSubLessonId(userId string, subLessonId int) ([]constant.LevelWithDataEntity, error) {
	query := `
		WITH
			current_class AS (
				SELECT
					"c"."id" as class_id
				FROM
					"user"."student" s
					LEFT JOIN "school"."class_student" cs ON "cs"."student_id" = "s"."user_id"
					LEFT JOIN "class"."class" c ON "cs"."class_id" = "c"."id"
				WHERE
					"s"."user_id" = $2
				ORDER BY
					"c"."academic_year" DESC
				LIMIT
					1
		),
		study_group_ids AS (
				SELECT
					DISTINCT "study_group_id"
				FROM
					"class"."study_group_student" sgs
				WHERE "student_id" = $2
			)
		SELECT
			l.id as level_id,
			l.index,
			l.level_type,
			l.difficulty,
			lll.lock AS "lock_next_level",
			l.timer_type,
			l.timer_time,
			l.bloom_type,
			MAX(lpl.star) as star,
			MIN(lpl.time_used) as time_used,
			COUNT(distinct q.id) as question_count,
			(
				CASE WHEN lufs.level_id IS NOT NULL THEN TRUE ELSE FALSE END OR
				CASE WHEN lufsg.level_id IS NOT NULL THEN TRUE ELSE FALSE END
			)
			AS "is_unlocked"
		FROM
			level.level l
			LEFT JOIN level.level_play_log lpl ON l.id = lpl.level_id
			AND lpl.student_id = $2
			LEFT JOIN question.question q ON l.id = q.level_id
			LEFT JOIN "subject"."sub_lesson" sl ON "sl"."id" = $1
			LEFT JOIN current_class cc ON TRUE
			LEFT JOIN "school"."lesson_level_lock" lll ON "lll"."sub_lesson_id" = "sl"."id"
			AND "lll"."class_id" = cc.class_id
			LEFT JOIN "level"."level_unlocked_for_student" lufs ON "lufs"."level_id" = "l"."id" AND "lufs"."student_id" = $2
			LEFT JOIN "level"."level_unlocked_for_study_group" lufsg ON "lufsg"."level_id" = "l"."id" AND lufsg.study_group_id IN (SELECT study_group_id FROM study_group_ids)
		WHERE
			l.sub_lesson_id = $1
			AND l.status = 'enabled'
		GROUP BY
			l.id, lll.lock, lufs.level_id, lufsg.level_id
		ORDER BY
			l.index;
	`

	entities := []constant.LevelWithDataEntity{}
	err := postgresRepository.Database.Select(&entities, query, subLessonId, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
