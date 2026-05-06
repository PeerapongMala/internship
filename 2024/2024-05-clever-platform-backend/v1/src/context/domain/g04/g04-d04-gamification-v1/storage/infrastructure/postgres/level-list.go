package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LevelList(filter *constant.LevelFilter, pagination *helper.Pagination) ([]constant.LevelEntity, error) {
	query := `
		SELECT
			"l"."id",
			COUNT("lsr"."id") AS "reward_amount",
			"l"."updated_at",
			"u"."first_name" AS "updated_by",
			"l"."status"
		FROM
		    "level"."level" l
		LEFT JOIN
			"subject"."sub_lesson" sl
			ON "l"."sub_lesson_id" = "sl"."id"
		LEFT JOIN
			"subject"."lesson" ls
			ON "sl"."lesson_id" = "ls"."id"
		LEFT JOIN
			"subject"."subject" s
			ON "ls"."subject_id" = "s"."id"
		LEFT JOIN
			"curriculum_group"."subject_group" sg
			ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN
			"curriculum_group"."year" y
			ON "sg"."year_id" = "y"."id"
		LEFT JOIN
			"curriculum_group"."platform" p
			ON "y"."platform_id" = "p"."id"
		LEFT JOIN
			"curriculum_group"."curriculum_group" cg
			ON "p"."curriculum_group_id" = "cg"."id"
		LEFT JOIN
			"level"."level_special_reward" lsr
			ON "lsr"."level_id" = "l"."id"
		LEFT JOIN
		    "user"."user" u
			ON "l"."updated_by" = "u"."id"
		WHERE
		    TRUE
	`
	args := []interface{}{}
	argsIndex := 1

	if filter.SubLessonId != 0 {
		query += fmt.Sprintf(` AND "sl"."id" = $%d`, argsIndex)
		args = append(args, filter.SubLessonId)
		argsIndex++
	}
	if filter.LessonId != 0 {
		query += fmt.Sprintf(` AND "ls"."id" = $%d`, argsIndex)
		args = append(args, filter.LessonId)
		argsIndex++
	}
	if filter.SubjectId != 0 {
		query += fmt.Sprintf(` AND "s"."id" = $%d`, argsIndex)
		args = append(args, filter.SubjectId)
		argsIndex++
	}
	if filter.SubjectGroupId != 0 {
		query += fmt.Sprintf(` AND "sg"."seed_subject_group_id" = $%d`, argsIndex)
		args = append(args, filter.SubjectGroupId)
		argsIndex++
	}
	if filter.YearId != 0 {
		query += fmt.Sprintf(` AND "y"."id" = $%d`, argsIndex)
		args = append(args, filter.YearId)
		argsIndex++
	}
	if filter.PlatformId != 0 {
		query += fmt.Sprintf(` AND "p"."id" = $%d`, argsIndex)
		args = append(args, filter.PlatformId)
		argsIndex++
	}
	if filter.CurriculumGroupId != 0 {
		query += fmt.Sprintf(` AND "cg"."id" = $%d`, argsIndex)
		args = append(args, filter.CurriculumGroupId)
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "l"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}
	if filter.Id != 0 {
		query += fmt.Sprintf(` AND "l"."id" = $%d`, argsIndex)
		args = append(args, filter.Id)
		argsIndex++
	}

	query += fmt.Sprintf(` GROUP BY "l"."id", "l"."updated_at", "u"."first_name", "l"."status"`)

	if filter.RewardAmount != nil {
		query += fmt.Sprintf(` HAVING COUNT("lsr"."id") = $%d`, argsIndex)
		args = append(args, filter.RewardAmount)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(` SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "l"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	levelEntities := []constant.LevelEntity{}
	err := postgresRepository.Database.Select(&levelEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return levelEntities, nil
}
