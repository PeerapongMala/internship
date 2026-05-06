package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) StudentLevelStatListGetByStudentIdAndAcademicYear(
	userId string,
	academicYear int,
	filter constant.StudentAcademicYearStatFilter,
) ([]constant.StudentAcademicYearStatEntity, error) {

	stm := `
		WITH
		-- calculate stat of each level
		play_stat AS (
			SELECT
				lpl.level_id,
				MAX(lpl.star) AS score,
				SUM(lpl.time_used) AS total_time_used,
				COUNT(lpl.id) AS total_attempt,
				MAX(lpl.played_at) AS last_played_at

			FROM level.level_play_log AS lpl
			WHERE lpl.student_id = $1
			GROUP BY lpl.level_id
		),

		avg_time AS (
			SELECT
				"ls"."id" AS "lesson_id",
				COALESCE(AVG("qpl"."time_used"), 0) AS "avg_time_used"
			FROM
				"level"."level_play_log" lpl
			INNER JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
			INNER JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
			INNER JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
			INNER JOIN "question"."question_play_log" qpl ON "lpl"."id" = "qpl"."level_play_log_id"
			WHERE "lpl"."student_id" = $1
			GROUP BY "ls"."id"
		),

		level_stat AS (
			SELECT
				sl.lesson_id,
				COUNT(lvl.id) AS total_level,
				SUM(play_stat.score) AS score,
				COUNT(CASE WHEN play_stat.score > 0 THEN 1 END) AS total_passed_level,
				SUM(play_stat.total_time_used) AS total_time_used,
				SUM(play_stat.total_attempt) AS total_attempt,
				MAX(play_stat.last_played_at) AS last_played_at

			FROM level.level AS lvl
			INNER JOIN subject.sub_lesson AS sl ON sl.id = lvl.sub_lesson_id
			LEFT JOIN play_stat ON play_stat.level_id = lvl.id
			GROUP BY sl.lesson_id
		),
		
		school_id AS (
			SELECT
				"school_id"
			FROM "user"."student"
			WHERE "user_id" = $1		
			LIMIT 1
		)

		SELECT
			MAX(c.id) AS id,
			MAX(c."year") AS year,
			MAX(c."name") AS name,
			MAX(c.academic_year) AS academic_year,
			MAX(c.updated_at) AS updated_at,
			MAX(c.updated_by) AS updated_by,
			MAX(cg.short_name) AS curriculum_group_short_name,
			MAX(s.name) AS subject_name,
			ls.id AS lesson_id,
			ls.index AS lesson_index,
			ls.name AS lesson_name,
			MAX(level_stat.score) AS score,
			MAX(level_stat.total_time_used) AS total_time_used,
			MAX(level_stat.total_passed_level) AS total_passed_level,
			MAX(level_stat.total_attempt) AS total_attempt,
			MAX(level_stat.last_played_at) AS last_played_at,
			MAX(level_stat.total_level) AS total_level,
			SUM(at.avg_time_used) AS avg_time_used

		FROM subject.lesson AS ls
		INNER JOIN subject.subject s ON s.id = ls.subject_id
		INNER JOIN curriculum_group.subject_group sg ON sg.id = s.subject_group_id
		INNER JOIN curriculum_group."year" y ON y.id = sg.year_id
		INNER JOIN curriculum_group.curriculum_group cg ON cg.id = y.curriculum_group_id
		INNER JOIN curriculum_group.seed_year sy ON sy.id = y.seed_year_id
		INNER JOIN "class"."class" c ON c."year" = sy.short_name
		INNER JOIN school.class_student cs ON cs.class_id = c.id
		INNER JOIN "school"."school_subject" ss ON "s"."id" = "ss"."subject_id" AND "ss"."school_id" = (SELECT "school_id" FROM school_id)
		LEFT JOIN level_stat ON level_stat.lesson_id = ls.id
		LEFT JOIN "avg_time" at ON ls.id = at.lesson_id
		WHERE cs.student_id = $1
			AND c.academic_year = $2
	`

	closingQuery := "GROUP BY ls.id ORDER BY ls.index ASC"

	args := []interface{}{
		userId,
		academicYear,
	}

	queryBuilder := helper.NewQueryBuilder(stm, args...)

	if len(filter.Search) != 0 {
		searhCols := []string{
			"c.year",
			"c.name",
			"c.academic_year",
			"cg.short_name",
			"s.name",
			`ls."name"`,
		}
		queryBuilder.ApplySearch(searhCols, filter.Search)
	}

	if filter.CurriculumGroupId != 0 {
		queryBuilder.AddFilter("AND cg.id =", filter.CurriculumGroupId)
	}

	if filter.SeedYearId != 0 {
		queryBuilder.AddFilter("AND sy.id =", filter.SeedYearId)
	}

	if filter.LessonId != 0 {
		queryBuilder.AddFilter("AND ls.id =", filter.LessonId)
	}

	if filter.SubjectId != 0 {
		queryBuilder.AddFilter("AND ls.subject_id =", filter.SubjectId)
	}

	queryBuilder.AddClosingQuery(closingQuery)
	query, args := queryBuilder.Build()

	if filter.Pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&filter.Pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, queryBuilder.GetPlaceholderIndex(), queryBuilder.GetPlaceholderIndex()+1)
		args = append(args, filter.Pagination.Offset, filter.Pagination.Limit)
	}

	var stats []constant.StudentAcademicYearStatEntity

	if err := postgresRepository.Database.Select(&stats, query, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return stats, nil
}
