package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/constant"
)

// PlayLogStatListGetByParams implements storageRepository.Repository.
func (p *postgresRepository) PlayLogStatListGetByParams(in constant.PlayLogStatFilter) ([]constant.PlayLogStatEntity, error) {
	args := []any{in.StudyGroupId}
	argsIndex := 2

	whereMaxStarLogs := ``

	if in.StartDateStr != "" && in.EndDateStr != "" {
		whereMaxStarLogs += fmt.Sprintf(` AND lpl.played_at BETWEEN $%d AND $%d`, argsIndex, argsIndex+1)
		args = append(args, in.StartDateStr, in.EndDateStr)
		argsIndex += 2
	}

	query := fmt.Sprintf(`
		WITH all_logs AS (
			SELECT
				lpl.student_id,
				lpl.level_id,
				lpl.star,
				lpl.time_used,
				lpl.played_at
			FROM level.level_play_log lpl
			WHERE lpl.student_id IS NOT NULL
			%s
		),
		max_star_logs AS (
			SELECT DISTINCT ON (student_id, level_id)
				student_id,
				level_id,
				star
			FROM all_logs
			ORDER BY student_id, level_id, star DESC
		),
		max_star_score AS (
			SELECT
				student_id,
				SUM(star) AS total_max_star_score
			FROM max_star_logs
			GROUP BY student_id
		),
		student_level_stats AS (
			SELECT
				sgs.student_id                              AS user_id,
				u.title                                     AS title,
				u.first_name                                AS first_name,
				u.last_name                                 AS last_name,
				student.student_id                          AS student_id,
				u.last_login                                AS last_login_at,
				COUNT(DISTINCT CASE WHEN msl.star > 0 THEN msl.level_id END) AS total_passed_level,
				COUNT(DISTINCT lv.id)                       AS total_level,
				COUNT(al.student_id)                        AS total_attempt,
				COALESCE(mss.total_max_star_score, 0)       AS total_score,
				AVG(al.time_used)                           AS avg_time_used,
				MAX(al.played_at)                           AS last_played_at
			FROM class.study_group sg
			JOIN class.class c 
				ON c.id = sg.class_id
			JOIN subject.subject s 
				ON s.id = sg.subject_id
			JOIN subject.lesson l 
				ON l.subject_id = s.id
			JOIN subject.sub_lesson sl 
				ON sl.lesson_id = l.id
			JOIN level.level lv 
				ON lv.sub_lesson_id = sl.id
			LEFT JOIN class.study_group_student sgs 
				ON sgs.study_group_id = sg.id
			LEFT JOIN max_star_logs msl 
				ON msl.level_id = lv.id AND msl.student_id = sgs.student_id
			LEFT JOIN max_star_score mss 
				ON mss.student_id = sgs.student_id
			LEFT JOIN all_logs al
				ON al.level_id = lv.id AND al.student_id = sgs.student_id
			LEFT JOIN "user"."user" u 
				ON u.id = sgs.student_id
			LEFT JOIN "user".student student
				ON student.user_id = u.id
			WHERE sg.id = $1
	`, whereMaxStarLogs)

	if in.Search != "" {
		query += fmt.Sprintf(`
			AND (
				u.title ILIKE $%d OR
				u.first_name ILIKE $%d OR
				u.last_name ILIKE $%d OR
				student.student_id ILIKE $%d
			)`, argsIndex, argsIndex+1, argsIndex+2, argsIndex+3)

		searchTerm := "%" + in.Search + "%"
		args = append(args, searchTerm, searchTerm, searchTerm, searchTerm)
		argsIndex += 4
	}

	query += `
			GROUP BY 
				sgs.student_id, u.title, u.first_name, u.last_name,
				student.student_id, u.last_login, mss.total_max_star_score
		)
		SELECT
			user_id,
			student_id,
			title           AS student_title,
			first_name      AS student_first_name,
			last_name       AS student_last_name,
			last_login_at   AS lastest_login,
			total_passed_level,
			COALESCE(total_score, 0)     AS score,
			COALESCE(total_level, 0)     AS total_level,
			COALESCE(total_attempt, 0)   AS total_attempt,
			COALESCE(avg_time_used, 0)   AS avg_time_used,
			last_played_at
		FROM student_level_stats
		WHERE user_id IS NOT NULL
		ORDER BY student_id
	`

	var data []constant.PlayLogStatEntity
	err := p.Database.Select(&data, query, args...)
	if err != nil {
		log.Printf("%+v", err)
		return nil, err
	}

	return data, nil
}
