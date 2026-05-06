package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentCaseListLessonPlayLog(studentId string, classId int, filter *constant.LessonPlayLogFilter, pagination *helper.Pagination) ([]constant.LessonPlayLogEntity, error) {
	query := `
	WITH level_count AS (
		SELECT 
			"sl"."lesson_id", 
			COUNT("l"."id") AS "total_level_count"
		FROM 
			"level"."level" l
		LEFT JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
		WHERE
			"l"."status" = $3
		GROUP BY 
			"sl"."lesson_id"
	),
	max_star_per_level AS (
		SELECT 
			lpl.level_id,
			MAX(lpl.star) AS max_star
		FROM 
			"level"."level_play_log" lpl
		WHERE 
			class_id = $1
			AND student_id = $2
		GROUP BY 
			lpl.level_id
	)
	SELECT 
		"cs"."academic_year",
		"cs"."year",
		"cs"."name" AS "class",
		"c"."name" AS "curriculum_group",
		"s"."name" AS "subject",
		"ls"."name" AS "lesson",
		COUNT(DISTINCT CASE WHEN "lpl".star > 0 THEN "lpl"."level_id" ELSE NULL END) AS "passed_level_count",
		COALESCE("lc"."total_level_count", 0) AS "total_level_count",
		SUM(DISTINCT COALESCE(mspl.max_star, 0)) AS "point_count",
		COALESCE("lc"."total_level_count", 0) * 3 AS "total_point",
		COUNT(DISTINCT "lpl"."id") AS "play_count",
		COALESCE(AVG("qpl"."time_used"), 0) AS "avg_time_per_question",
		MAX("lpl"."played_at") AS "last_played_at"
	FROM
		"level"."level_play_log" lpl
		LEFT JOIN "class"."class" cs ON "lpl"."class_id" = "cs"."id"
		LEFT JOIN "user"."user" u ON "lpl"."student_id" = "u"."id"
		LEFT JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
		LEFT JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
		LEFT JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
		LEFT JOIN "subject"."subject" s ON "ls"."subject_id" = "s"."id"
		LEFT JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
		LEFT JOIN "curriculum_group"."curriculum_group" c ON "y"."curriculum_group_id" = "c"."id"
		LEFT JOIN "level_count" lc ON "ls"."id" = "lc"."lesson_id"
		LEFT JOIN "question"."question_play_log" qpl ON "qpl"."level_play_log_id" = "lpl"."id"
		LEFT JOIN "max_star_per_level" mspl ON "lpl"."level_id" = "mspl"."level_id"
	WHERE
		"lpl"."class_id" = $1
		AND "lpl"."student_id" = $2
	`
	args := []interface{}{classId, studentId, constant.Enabled}
	argsIndex := 4

	if filter.StartDate != "" {
		query += fmt.Sprintf(` AND "lpl"."played_at" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}
	if filter.EndDate != "" {
		query += fmt.Sprintf(` AND "lpl"."played_at" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}
	if filter.AcademicYear != 0 {
		query += fmt.Sprintf(` AND "cs"."academic_year" = $%d`, argsIndex)
		args = append(args, filter.AcademicYear)
		argsIndex++
	}
	if filter.CurriculumGroupId != 0 {
		query += fmt.Sprintf(` AND "c"."id" = $%d`, argsIndex)
		args = append(args, filter.CurriculumGroupId)
		argsIndex++
	}
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
	if filter.CurriculumGroup != "" {
		query += fmt.Sprintf(` AND "c"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.CurriculumGroup+"%")
		argsIndex++
	}
	if filter.Subject != "" {
		query += fmt.Sprintf(` AND "s"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Subject+"%")
		argsIndex++
	}
	if filter.Lesson != "" {
		query += fmt.Sprintf(` AND "ls"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.Lesson+"%")
		argsIndex++
	}

	query += fmt.Sprintf(`
		GROUP BY 
			"ls"."id", 
			"cs"."academic_year", 
			"cs"."year", 
			"cs"."name",
			"c"."name",
			"s"."name",
			"ls"."name",
			"lc"."total_level_count"
	`)

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	lessonPlayLogEntities := []constant.LessonPlayLogEntity{}
	err := postgresRepository.Database.Select(&lessonPlayLogEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return lessonPlayLogEntities, nil
}
