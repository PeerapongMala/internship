package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) TeacherStudentListWithStatTotalByTeacherId(
	teacherId string,
	filter constant.TeacherStudentListWithStatFilter,
	pagination *helper.Pagination,
) error {
	baseQuery := `
		WITH lesson_stats AS (
			select
				lpl.student_id,
				lpl.level_id,
				MAX(lpl.star) AS max_star,
				COUNT(DISTINCT lpl.id) AS total_attempts, -- Ensure unique count of attempts
				MAX(lpl.played_at) AS last_played
			FROM
				"level".level_play_log lpl
			GROUP BY
				lpl.student_id, lpl.level_id
		),
		class_year_short_name_list AS (
			SELECT
				sy.short_name AS class_year_short_name
			FROM 				subject.subject_teacher st
			LEFT JOIN subject.subject s ON s.id = st.subject_id
			LEFT JOIN curriculum_group.subject_group sg ON sg.id = s.subject_group_id
			LEFT JOIN curriculum_group."year" y ON y.id = sg.year_id
			LEFT JOIN curriculum_group.seed_year sy ON sy.id = y.seed_year_id
			WHERE
				st.teacher_id = $1
		)
		SELECT
			COUNT(*) AS total_count
		FROM
			lesson_stats ls
		INNER JOIN "level"."level" l ON l.id = ls.level_id
		INNER JOIN subject.sub_lesson sl ON sl.id = l.sub_lesson_id
		INNER JOIN subject.lesson l2 ON l2.id = sl.lesson_id
		INNER JOIN subject.subject s ON s.id = l2.subject_id
		INNER JOIN curriculum_group.subject_group sg ON sg.id = s.subject_group_id
		INNER JOIN curriculum_group."year" y ON y.id = sg.year_id
		INNER JOIN curriculum_group.seed_year sy ON sy.id = y.seed_year_id
		INNER JOIN "user".student s2 ON s2.user_id = ls.student_id
		INNER JOIN "user"."user" u ON u.id = ls.student_id
		INNER JOIN "class"."class" c ON c."year" = sy.short_name
		INNER JOIN school.class_teacher ct ON ct.class_id = c.id
		WHERE (
			ct.teacher_id = $1
			OR c."year" IN (SELECT class_year_short_name FROM class_year_short_name_list)
		)
	`

	queryBuilder := helper.NewQueryBuilder(baseQuery, teacherId)
	if filter.AcademicYear != "" {
		queryBuilder.AddFilter("AND c.academic_year =", filter.AcademicYear)
	}
	if filter.Year != "" {
		queryBuilder.AddFilter("AND c.year =", filter.Year)
	}
	if filter.Name != "" {
		queryBuilder.AddFilter("AND c.name =", filter.Name)
	}
	if filter.Search != "" {
		queryBuilder.AddFilter("AND ( CONCAT(u.first_name , ' ', u.last_name) ILIKE", "%"+filter.Search+"%")
		queryBuilder.AddFilter("OR s2.student_id ILIKE", "%"+filter.Search+"%")
		queryBuilder.AddFilter("OR u.email ILIKE", "%"+filter.Search+"%")
		queryBuilder.AddFilter(")", nil)
	}
	if filter.CurriculumGroupId != 0 {
		queryBuilder.AddFilter("AND y.curriculum_group_id =", filter.CurriculumGroupId)
	}
	if filter.SubjectId != 0 {
		queryBuilder.AddFilter("AND s.id =", filter.SubjectId)
	}
	if filter.LessonId != 0 {
		queryBuilder.AddFilter("AND l2.id =", filter.LessonId)
	}
	if filter.SubLessonId != 0 {
		queryBuilder.AddFilter("AND sl.id =", filter.SubLessonId)
	}

	query, args := queryBuilder.Build()
	err := postgresRepository.Database.QueryRowx(query, args...).Scan(&pagination.TotalCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return err
}
