package postgres

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) QuestionPlayLogStatGetByUserIdAndAcademicYear(
	userId string,
	academicYear int,
) (constant.QuestionPlayLogStatEntity, error) {
	queryStm := `
		SELECT
			AVG(qpl.time_used) AS avg_time_used
		FROM
			question.question_play_log qpl
		INNER JOIN "level".level_play_log lpl ON lpl.id = qpl.level_play_log_id
		INNER JOIN "level"."level" l ON l.id = lpl.level_id
		INNER JOIN subject.sub_lesson sl ON sl.id = l.sub_lesson_id
		INNER JOIN subject.lesson l2 ON l2.id = sl.lesson_id
		INNER JOIN subject.subject s ON s.id = l2.subject_id
		INNER JOIN curriculum_group.subject_group sg ON sg.id = s.subject_group_id
		INNER JOIN curriculum_group."year" y ON y.id = sg.year_id
		INNER JOIN curriculum_group.seed_year sy ON sy.id = y.seed_year_id
		INNER JOIN "class"."class" c ON c."year" = sy.short_name
		WHERE lpl.student_id = $1 AND c.academic_year = $2
		GROUP BY
			lpl.student_id, c.academic_year
	`

	questionPlayLogStat := constant.QuestionPlayLogStatEntity{}
	err := postgresRepository.Database.QueryRowx(queryStm, userId, academicYear).StructScan(&questionPlayLogStat)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		log.Printf("%+v", errors.WithStack(err))
		return questionPlayLogStat, helper.NewHttpError(http.StatusNotFound, nil)
	}

	return questionPlayLogStat, nil
}
