package postgres

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) LevelClassListByStudentId(
	studentId string,
	teacherId string,
	pagination *helper.Pagination,
) ([]constant.LevelClass, error) {
	sql := `
		SELECT c."year",
			c."name",
			c.academic_year,
			c.updated_at,
			u.first_name || ' ' || u.last_name AS updated_by
		FROM question.question_play_log qpl
		INNER JOIN "level".level_play_log lpl ON lpl.id = qpl.level_play_log_id
		INNER JOIN "level"."level" l ON l.id = lpl.level_id
		INNER JOIN subject.sub_lesson sl ON sl.id = l.sub_lesson_id
		INNER JOIN subject.lesson l2 ON l2.id = sl.lesson_id
		INNER JOIN subject.subject s ON s.id = l2.subject_id
		INNER JOIN curriculum_group.subject_group sg ON sg.id = s.subject_group_id
		INNER JOIN curriculum_group."year" y ON y.id = sg.year_id
		INNER JOIN curriculum_group.seed_year sy ON sy.id = y.seed_year_id
		INNER JOIN "class"."class" c ON c."year" = sy.short_name
		LEFT JOIN "user"."user" u ON u.id = c.updated_by
		WHERE lpl.student_id = $1
		GROUP BY lpl.student_id,
				c.id,
				u.id
		ORDER BY c.academic_year DESC
	`

	paginationQuery := `
		SELECT COUNT(*) AS total_count
		FROM (
			SELECT DISTINCT c."year", c."name"
			FROM question.question_play_log qpl
			INNER JOIN "level".level_play_log lpl ON lpl.id = qpl.level_play_log_id
			INNER JOIN "level"."level" l ON l.id = lpl.level_id
			INNER JOIN subject.sub_lesson sl ON sl.id = l.sub_lesson_id
			INNER JOIN subject.lesson l2 ON l2.id = sl.lesson_id
			INNER JOIN subject.subject s ON s.id = l2.subject_id
			INNER JOIN curriculum_group.subject_group sg ON sg.id = s.subject_group_id
			INNER JOIN curriculum_group."year" y ON y.id = sg.year_id
			INNER JOIN curriculum_group.seed_year sy ON sy.id = y.seed_year_id
			INNER JOIN "class"."class" c ON c."year" = sy.short_name
			WHERE lpl.student_id = $1
		) AS subquery;
	`

	if pagination != nil {
		err := postgresRepository.Database.QueryRowx(paginationQuery, studentId).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}
	if pagination != nil && pagination.Limit.Valid {
		sql += fmt.Sprintf(` LIMIT %d OFFSET %d`, pagination.Limit.Int64, pagination.Offset)
	}

	levelClassList := []constant.LevelClass{}
	err := postgresRepository.Database.Select(&levelClassList, sql, studentId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return levelClassList, helper.NewHttpError(http.StatusNotFound, nil)
	}

	return levelClassList, nil
}
