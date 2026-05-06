package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudentHomeworkStatGet(homeworkId int, levelId int, studentIds []string) (*constant.StudentHomeworkStatEntity, error) {
	query := `
		WITH base_data AS (
		    SELECT
		        lpl.student_id,
		        lpl.time_used,
		        lpl.played_at
		    FROM "level".level_play_log lpl
		    WHERE lpl.student_id = ANY($1)
		    AND lpl.level_id = $2
		    AND lpl.homework_id = $3
		),
		aggregated_stats AS (
		    SELECT
		        COUNT(DISTINCT student_id) AS distinct_student_count,
		        COUNT(student_id) AS total_attempts,
		        COALESCE(AVG(time_used), 0) AS avg_time_used,
		        COALESCE(AVG(play_count), 0) AS avg_attempts_per_student,
		        MAX(played_at) AS last_played_at
		    FROM (
		        SELECT
		            student_id,
		            time_used,
		            played_at,
		            COUNT(*) OVER (PARTITION BY student_id) AS play_count
		        FROM base_data
		    ) subq
		)
		SELECT
		    distinct_student_count,
		    total_attempts,
		    avg_time_used,
		    avg_attempts_per_student,
		    last_played_at
		FROM aggregated_stats;
	`
	stat := constant.StudentHomeworkStatEntity{}
	err := postgresRepository.Database.QueryRowx(query, studentIds, levelId, homeworkId).StructScan(&stat)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return &stat, nil
}
