package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ClassLessonList(teacherId string, classId int, filter constant.ClassLessonFilter, pagination *helper.Pagination) ([]constant.ClassLessonEntity, error) {
	query := `
		SELECT DISTINCT ON ("l"."id")
	        "l"."id" AS "lesson_id",
	        "cg"."name" AS "curriculum_group",
	        "cg"."short_name" AS "curriculum_group_short_name",
	        "s"."id" AS "subject_id",
			"s"."name" AS "subject",
			"sy"."short_name" AS "year",
			"l"."name" AS "lesson_name",
			"l"."index" AS "lesson_index",
			"sl"."is_enabled",
			CASE 
        		WHEN LOWER(l.name) LIKE '%extra%' THEN true
        		ELSE false
    		END AS is_extra
		FROM
			"subject"."subject" s
		LEFT JOIN
			"curriculum_group"."subject_group" sg
			ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN
			"subject"."lesson" l
			ON "s"."id" = "l"."subject_id"
		LEFT JOIN
			"school"."school_lesson" sl
			ON "l"."id" = "sl"."lesson_id"
		LEFT JOIN
			"curriculum_group"."year" y
			ON "sg"."year_id" = "y"."id"
		LEFT JOIN
			"curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		LEFT JOIN
			"curriculum_group"."curriculum_group" cg
			ON "y"."curriculum_group_id" = "cg"."id"
		LEFT JOIN
			"school"."school_subject" ss
			ON "s"."id" = "ss"."subject_id"
		LEFT JOIN
			"class"."class" c
			ON "ss"."school_id" = "c"."school_id"
		LEFT JOIN
			"school"."class_teacher" ct
			ON "c"."id" = "ct"."class_id"
		LEFT JOIN
			"subject"."subject_teacher" st
			ON "s"."id" = "st"."subject_id"
		WHERE
		    "c"."id" = $2
			AND
		    "sl"."class_id" = $2
			AND
            (("ct"."teacher_id" = $1 AND "sy"."short_name" = "c"."year")
            OR
		    ("st"."teacher_id" = $1 AND "st"."academic_year" = "c"."academic_year" AND "sy"."short_name" = "c"."year")
            OR $3 = TRUE)
	`
	args := []interface{}{teacherId, classId, filter.IsParent}
	argsIndex := len(args) + 1

	if filter.IsExtra != nil {
		query += fmt.Sprintf(` AND (LOWER(l.name) LIKE '%%extra%%') = $%d`, argsIndex)
		args = append(args, *filter.IsExtra)
		argsIndex++
	}
	if filter.CurriculumGroupId != 0 {
		query += fmt.Sprintf(` AND "cg"."id" = $%d`, argsIndex)
		args = append(args, filter.CurriculumGroupId)
		argsIndex++
	}
	if filter.SubjectId != 0 {
		query += fmt.Sprintf(` AND "s"."id" = $%d`, argsIndex)
		args = append(args, filter.SubjectId)
		argsIndex++
	}
	if filter.IsEnabled != nil {
		query += fmt.Sprintf(` AND "sl"."is_enabled" = $%d`, argsIndex)
		args = append(args, filter.IsEnabled)
		argsIndex++
	}
	if filter.LessonId != 0 {
		query += fmt.Sprintf(` AND "l"."id" = $%d`, argsIndex)
		args = append(args, filter.LessonId)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "l"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	classLessonEntities := []constant.ClassLessonEntity{}
	err := postgresRepository.Database.Select(&classLessonEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return classLessonEntities, nil
}
