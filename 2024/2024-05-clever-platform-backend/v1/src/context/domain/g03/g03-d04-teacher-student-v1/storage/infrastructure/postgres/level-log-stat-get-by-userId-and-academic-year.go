package postgres

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) LevelLogStatGetByUserIdAndAcademicYear(
	userId string,
	academicYear int,
) (constant.LevelStatEntity, error) {
	queryStm := `
		WITH level_log_stat AS (
			SELECT lpl.level_id,
					c.academic_year,
					lpl.student_id,
					MAX(lpl.star) AS max_star,
					COUNT(DISTINCT lpl.id) AS total_attempt
			FROM "level".level_play_log lpl
			INNER JOIN "level"."level" l ON l.id = lpl.level_id
			INNER JOIN subject.sub_lesson sl ON sl.id = l.sub_lesson_id
			INNER JOIN subject.lesson l2 ON l2.id = sl.lesson_id
			INNER JOIN subject.subject s ON s.id = l2.subject_id
			INNER JOIN curriculum_group.subject_group sg ON sg.id = s.subject_group_id
			INNER JOIN curriculum_group."year" y ON y.id = sg.year_id
			INNER JOIN curriculum_group.seed_year sy ON sy.id = y.seed_year_id
			INNER JOIN "class"."class" c ON c."year" = sy.short_name
			WHERE c.academic_year = $2 AND lpl.student_id = $1
			GROUP BY lpl.level_id, lpl.student_id, c.academic_year
		),
		level_last_play AS (
			SELECT
				lpl.student_id,
				MAX(lpl.played_at) AS last_played
			FROM "level".level_play_log lpl
			WHERE lpl.student_id = $1
			GROUP BY lpl.student_id
		)
		SELECT
			SUM(CASE
					WHEN lls.max_star > 0 THEN 1
					ELSE 0
				END) AS total_passed,
			SUM(lls.max_star) AS total_star,
			COUNT(lls.level_id) AS total_level,
			SUM(lls.total_attempt) AS total_attempt,
			llp.last_played
		FROM level_log_stat lls
		INNER JOIN level_last_play llp on llp.student_id = lls.student_id
		GROUP BY lls.student_id, lls.academic_year, llp.last_played
	`

	var levelStat constant.LevelStatEntity
	err := postgresRepository.Database.QueryRowx(queryStm, userId, academicYear).StructScan(&levelStat)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		log.Printf("%+v", errors.WithStack(err))
		return levelStat, helper.NewHttpError(http.StatusNotFound, nil)
	}

	if levelStat.LastPlayed != nil && levelStat.LastPlayed.IsZero() {
		levelStat.LastPlayed = nil
	}

	return levelStat, nil
}
