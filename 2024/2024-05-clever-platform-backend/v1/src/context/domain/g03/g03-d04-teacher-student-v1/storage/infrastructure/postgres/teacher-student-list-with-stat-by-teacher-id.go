package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) TeacherStudentListWithStatByTeacherId(
	teacherId string,
	filter constant.TeacherStudentListWithStatFilter,
	pagination *helper.Pagination,
) ([]constant.TeacherStudentWithStateEntity, error) {
	query := `
		WITH target_students AS (
			SELECT DISTINCT ON ("u"."id")
			    "u"."id" AS "user_id", 
				"stu"."student_id",
				"u"."title",
				"u"."first_name",
				"u"."last_name",
				"u"."email",
				"u"."last_login"
			FROM "subject"."subject_teacher" st
			INNER JOIN "subject"."subject" s ON "st"."subject_id" = "s"."id"
			INNER JOIN "curriculum_group"."subject_group" sjg ON "s"."subject_group_id" = "sjg"."id"
			INNER JOIN "curriculum_group"."year" y ON "sjg"."year_id" = "y"."id"
			INNER JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
			INNER JOIN "school"."class_teacher" ct ON "ct"."teacher_id" = $1
			INNER JOIN "class"."class" c ON "sy"."short_name" = "c"."year" AND "ct"."class_id" = "c"."id"
			INNER JOIN "school"."school_teacher" sct ON "c"."school_id" = "sct"."school_id" 
			INNER JOIN "school"."class_student" cst ON "c"."id" = "cst"."class_id"
			INNER JOIN "user"."user" u ON "cst"."student_id" = "u"."id"
			INNER JOIN "user"."student" stu ON "u"."id" = "stu"."user_id"
			WHERE	
				"st"."teacher_id" = $1 AND "sct"."user_id" = $1 AND "c"."status" = 'enabled'
	`
	args := []interface{}{teacherId, filter.SubjectId, filter.AcademicYear}
	argsIndex := len(args) + 1

	if filter.ClassId != 0 {
		query += fmt.Sprintf(` AND "c"."id" = $%d`, argsIndex)
		argsIndex++
		args = append(args, filter.ClassId)
	}
	if filter.AcademicYear != "" {
		query += fmt.Sprintf(` AND "c"."academic_year" = $%d`, argsIndex)
		argsIndex++
		args = append(args, filter.AcademicYear)
	}
	if filter.Search != "" {
		query += fmt.Sprintf(`
			AND (
				"u"."first_name" ILIKE $%d
				OR "u"."last_name" ILIKE $%d
				OR "stu"."student_id" ILIKE $%d
			)
		`, argsIndex, argsIndex, argsIndex)
		args = append(args, "%"+filter.Search+"%")
		argsIndex++
	}

	query += `
			),
			level_stat AS (
				SELECT
					COUNT(*) AS "level_count"
				FROM
					"subject"."subject" s
				INNER JOIN "subject"."lesson" ls ON "s"."id" = "ls"."subject_id"
				INNER JOIN "subject"."sub_lesson" sl ON "sl"."lesson_id" = "ls"."id"
				INNER JOIN "level"."level" l ON "l"."sub_lesson_id" = "sl"."id"
				WHERE "s"."id" = $2
			),
			level_play_log AS (
				SELECT
					"lpl".*,
					"s"."id" AS "subject_id"
				FROM
					"target_students" ts
				LEFT JOIN "level"."level_play_log" lpl ON "ts"."user_id" = "lpl"."student_id"	
				INNER JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
				INNER JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
				INNER JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
				INNER JOIN "subject"."subject" s ON "ls"."subject_id" = "s"."id"
				WHERE "s"."id" = $2
			),
			best_play AS (
				SELECT
					"lpl"."student_id",
					"lpl"."level_id",
					COALESCE(MAX("lpl"."star"), 0) AS "max_star",
					COALESCE(COUNT("lpl"."id"), 0) AS "attempts",
					COALESCE(AVG("lpl"."time_used"), 0) AS "avg_time_used"
				FROM
					"level_play_log" lpl
				GROUP BY "lpl"."level_id", "lpl"."student_id"
			),
			"avg_time" AS (
				SELECT
					"lpl"."student_id", 
					COALESCE(AVG("qpl"."time_used"), 0) AS "avg_time_used"
				FROM
					"level_play_log" lpl
				LEFT JOIN "question"."question_play_log" qpl ON "lpl"."id" = "qpl"."level_play_log_id"
				GROUP BY "lpl"."student_id"
			),
			"current_class" AS (
				SELECT DISTINCT ON (ts.user_id)
    				ts.user_id AS student_id,
    				c.*
				FROM target_students ts
				LEFT JOIN school.class_student cs ON ts.user_id = cs.student_id
				LEFT JOIN class.class c ON cs.class_id = c.id
				WHERE "c"."academic_year" = $3
				ORDER BY ts.user_id, c.academic_year DESC
			)
			SELECT
				"ts"."user_id",
				"ts"."student_id" AS "student_id",
				"ts"."title" AS "student_title",
				"ts"."first_name" AS "student_first_name",
				"ts"."last_name" AS "student_last_name",
				"ts"."last_login" AS "student_last_login",
				"at"."avg_time_used" AS "avg_time_used",
				COALESCE(SUM(CASE WHEN bp.max_star >= 1 THEN 1 ELSE 0 END)) AS total_passed_level,
				"ls"."level_count" AS "total_level",
				COALESCE(SUM("bp"."max_star"), 0) AS "total_passed_star",
				COALESCE("ls"."level_count" * 3) AS "total_star",
				COALESCE(SUM("bp"."attempts"), 0) AS "total_attempt",
				"cc"."id" AS "class_id",
				"cc"."name" AS "class_name",
				"cc"."year" AS "class_year",
				"cc"."academic_year" AS "academic_year"
			FROM "target_students" ts
			LEFT JOIN "best_play" bp ON "ts"."user_id" = "bp"."student_id"
			LEFT JOIN "avg_time" at ON "ts"."user_id" = "at"."student_id"
			LEFT JOIN "level_stat" ls ON TRUE
			LEFT JOIN "current_class" cc ON "ts"."user_id" = "cc"."student_id"
			GROUP BY "ts"."user_id","ts"."student_id","ts"."title", "ts"."first_name", "ts"."last_name", "ls"."level_count", "ts"."last_login", "cc"."id", "cc"."name", "cc"."year", "cc"."academic_year", "at"."avg_time_used"
	`

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "ts"."user_id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	teacherStudentList := []constant.TeacherStudentWithStateEntity{}
	err := postgresRepository.Database.Select(&teacherStudentList, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return teacherStudentList, nil
}
