package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) BestTeacherListByLesson(pagination *helper.Pagination, filter *constant.BestTeacherListByClassStarsFilter) ([]constant.BestTeacherListByLesson, error) {
	query := `
		WITH play_logs_ids AS (
			SELECT
				lpl.id,
				lpl.student_id,
				sl.id AS sub_lesson_id,
				lpl.level_id,
				lpl.star,
				lpl.class_id
			FROM "level".level_play_log lpl 
			INNER JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
			INNER JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
	`
	args := []interface{}{}
	argsIndex := len(args) + 1

	if filter.StartDate != nil {
		query += fmt.Sprintf(` AND "lpl"."played_at" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex += 1
	}
	if filter.EndDate != nil {
		query += fmt.Sprintf(` AND "lpl"."played_at" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex += 1
	}

	query += `
		),
		play_logs AS (
			SELECT
				pli.student_id,
				pli.class_id,
				pli.sub_lesson_id,
				pli.level_id,
				MAX(pli.star) AS max_stars
			FROM play_logs_ids pli
			GROUP BY pli.student_id, pli.class_id, pli.sub_lesson_id, pli.level_id
		),
		sub_lesson_stat AS (
			SELECT
				pl.sub_lesson_id,
				pl.class_id,
				SUM(pl.max_stars) AS total_stars,
				COUNT(pl.level_id) AS total_levels
			FROM play_logs pl
			GROUP BY pl.sub_lesson_id, pl.class_id
		),
		class_student_count AS (
			SELECT
				c.id AS class_id,
				COALESCE(COUNT(cs.student_id), 0) AS student_count
			FROM class.class c 
			LEFT JOIN school.class_student cs ON c.id = cs.class_id
			GROUP BY c.id
		),
		attempts AS (
			SELECT
				pli.sub_lesson_id,
				pli.class_id,
				COUNT(id) AS "attempts"
			FROM play_logs_ids pli
			GROUP BY pli.sub_lesson_id, pli.class_id
		),
		avg_time AS (
			SELECT
				pli.sub_lesson_id,
				pli.class_id,
				AVG(qpl.time_used) AS avg_time
			FROM play_logs_ids pli
			INNER JOIN question.question_play_log qpl ON pli.id = qpl.level_play_log_id
			GROUP BY pli.sub_lesson_id, pli.class_id
		)
		SELECT
			cg."name" AS curriculum_group_name,
			ls."name" AS lesson_name,
			sl."name" AS sub_lesson_name,
			COALESCE(
				CAST(sls.total_stars AS FLOAT) / NULLIF(csc.student_count, 0),
				0
			) AS stars,
			COALESCE(
				CAST(sls.total_levels AS FLOAT) / NULLIF(csc.student_count, 0),
				0
			) AS levels,
			COALESCE(a.attempts, 0) AS attempts,
			COALESCE(at.avg_time, 0) AS avg_time,
			sc.name AS school_name,
			c.academic_year,
			c.year,
			c.name AS class_name
		FROM sub_lesson_stat sls  
		LEFT JOIN subject.sub_lesson sl ON sls.sub_lesson_id = sl.id
		LEFT JOIN subject.lesson ls ON sl.lesson_id = ls.id
		LEFT JOIN subject.subject s ON ls.subject_id = s.id
		LEFT JOIN curriculum_group.subject_group sg ON s.subject_group_id = sg.id
		LEFT JOIN curriculum_group."year" y ON sg.year_id = y.id
		LEFT JOIN curriculum_group.seed_year sy ON y.seed_year_id = sy.id
		LEFT JOIN curriculum_group.curriculum_group cg ON y.curriculum_group_id = cg.id
		LEFT JOIN class.class c ON sls.class_id = c.id
		LEFT JOIN class_student_count csc ON c.id = csc.class_id
		LEFT JOIN school.school sc ON c.school_id = sc.id
		LEFT JOIN attempts a ON sl.id = a.sub_lesson_id AND c.id = a.class_id
		LEFT JOIN avg_time "at" ON sl.id = "at"."sub_lesson_id" AND c.id = at.class_id
		WHERE TRUE
	`

	if filter.SubjectName != nil {
		query += fmt.Sprintf(` AND "s"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+helper.Deref(filter.SubjectName)+"%")
		argsIndex += 1
	}
	if filter.AcademicYear != nil {
		query += fmt.Sprintf(` AND "c"."academic_year" = $%d`, argsIndex)
		args = append(args, filter.AcademicYear)
		argsIndex += 1
	}

	if pagination != nil {
		query += fmt.Sprintf(`
			ORDER BY COALESCE(
				CAST(sls.total_stars AS FLOAT) / NULLIF(csc.student_count, 0),
				0
			) DESC
			OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)

	}

	bestTeachers := []constant.BestTeacherListByLesson{}
	err := postgresRepository.Database.Select(&bestTeachers, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return bestTeachers, nil
}
