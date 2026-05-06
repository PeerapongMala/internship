package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) ClassSubLessonList(classId int, filter constant.ClassSubLessonFilter, pagination *helper.Pagination) ([]constant.ClassSubLessonEntity, error) {
	query := `
		SELECT
			"sl"."id" AS "sub_lesson_id",
			"c"."name" AS "curriculum_group",
			"c"."short_name" AS "curriculum_group_short_name",
			"s"."name" AS "subject",
			"sy"."short_name" AS "year",
			"ls"."index" AS "lesson_index",
			"sl"."name" AS "sub_lesson_name",
			"sl"."index" AS "sub_lesson_index",
			"ssl"."is_enabled" AS "is_enabled",
			not "lll"."lock" AS "is_enabled_level"
		FROM
			"school"."school_sub_lesson" ssl
		LEFT JOIN
			"school"."lesson_level_lock" lll
			ON "ssl"."class_id" = "lll"."class_id"
			AND "ssl"."sub_lesson_id" = "lll"."sub_lesson_id"
		LEFT JOIN
			"subject"."sub_lesson" sl
			ON "ssl"."sub_lesson_id" = "sl"."id"
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
			"curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		LEFT JOIN
			"curriculum_group"."curriculum_group" c
			ON "y"."curriculum_group_id" = "c"."id"
		WHERE
			"ssl"."class_id" = $1
`
	args := []interface{}{classId}
	argsIndex := 2

	if filter.SubjectId != 0 {
		query += fmt.Sprintf(` AND "s"."id" = $%d`, argsIndex)
		args = append(args, filter.SubjectId)
		argsIndex++
	}
	if filter.LessonId != 0 {
		query += fmt.Sprintf(` AND "ls"."id" = $%d`, argsIndex)
		args = append(args, filter.LessonId)
		argsIndex++
	}
	if filter.IsEnabled != nil {
		query += fmt.Sprintf(` AND "ssl"."is_enabled" = $%d`, argsIndex)
		args = append(args, filter.IsEnabled)
		argsIndex++
	}
	if filter.SubLessonId != 0 {
		query += fmt.Sprintf(` AND "sl"."id" = $%d`, argsIndex)
		args = append(args, filter.SubLessonId)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "ls"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	classSubLessonEntities := []constant.ClassSubLessonEntity{}
	err := postgresRepository.Database.Select(&classSubLessonEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return classSubLessonEntities, nil
}
