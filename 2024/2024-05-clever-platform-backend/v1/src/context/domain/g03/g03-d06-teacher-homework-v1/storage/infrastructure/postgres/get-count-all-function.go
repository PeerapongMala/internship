package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetStarCountByLevelIdsAndHomeworkId(homeworkId int, levelIds []int, studentId string) (int, error) {

	query := `
		WITH submission_scores AS (
		    SELECT
		        hs.index AS submission_index,
		        SUM(lpl.star) AS total_stars
		    FROM homework.homework_submission hs
		    JOIN level.level_play_log lpl ON lpl.id = hs.level_play_log_id
		    WHERE lpl.student_id = $1
		    AND lpl.homework_id = $2
		    GROUP BY hs.index
		    ORDER BY total_stars DESC
		    LIMIT 1
		),
		best_submission_levels AS (
		    SELECT DISTINCT ON (lpl.level_id)
		        lpl.id,
		        lpl.level_id,
		        lpl.star,
		        hs.index AS submission_index
		    FROM level.level_play_log lpl
		    JOIN homework.homework_submission hs ON lpl.id = hs.level_play_log_id
		    WHERE lpl.student_id = $1
		    AND lpl.homework_id = $2
		    AND hs.index = (SELECT submission_index FROM submission_scores)
		    ORDER BY lpl.level_id, lpl.star DESC, lpl.id
		)
		SELECT
		    bl.star AS max_star
		FROM best_submission_levels bl
		LEFT JOIN "level"."level" l ON l.id = bl.level_id
	`

	rows, err := postgresRepository.Database.Queryx(query, studentId, homeworkId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}

	var sumStar int
	for rows.Next() {
		var starCount int
		err := rows.Scan(&starCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return 0, err
		}
		sumStar += starCount
	}

	return sumStar, err
}

func (postgresRepository *postgresRepository) GetStarAvgByLevelIdAndHomeworkIdByStudentsIds(homeworkId int, levelId int, studentIds []string) (float64, error) {

	query := `
		SELECT 
			COALESCE(SUM(lpl.star), 0) AS "star"
		FROM "level".level_play_log lpl 
		WHERE lpl.student_id = ANY($1)
		AND lpl.level_id = $2
		AND lpl.homework_id = $3
	`

	var avgStar float64
	err := postgresRepository.Database.QueryRowx(query, studentIds, levelId, homeworkId).Scan(&avgStar)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}

	return avgStar, err
}

func (postgresRepository *postgresRepository) GetStudentDoneLevelHomeworkUniqueCount(homeworkId int, levelId int, studentIds []string) (int, error) {

	query := `
		SELECT 
			count(DISTINCT lpl.student_id)
		FROM "level".level_play_log lpl 
		WHERE lpl.student_id = ANY($1)
		AND lpl.level_id = $2
		AND lpl.homework_id = $3
	`

	var count int
	err := postgresRepository.Database.QueryRowx(query, studentIds, levelId, homeworkId).Scan(&count)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}

	return count, err
}

func (postgresRepository *postgresRepository) GetStudentDoneLevelHomeworkCount(homeworkId int, levelId int, studentIds []string) (int, error) {

	query := `
		SELECT 
			count(lpl.student_id)
		FROM "level".level_play_log lpl 
		WHERE lpl.student_id = ANY($1)
		AND lpl.level_id = $2
		AND lpl.homework_id = $3
	`

	var count int
	err := postgresRepository.Database.QueryRowx(query, studentIds, levelId, homeworkId).Scan(&count)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}

	return count, err
}

func (postgresRepository *postgresRepository) GetAvgTimeUsedByHomeworkLevelStudentId(homeworkId int, levelId int, studentIds []string) (float64, error) {

	query := `
		SELECT 
			COALESCE(avg(lpl.time_used), 0)
		FROM "level".level_play_log lpl 
		WHERE lpl.student_id = ANY($1)
		AND lpl.level_id = $2
		AND lpl.homework_id = $3
	`

	var count float64
	err := postgresRepository.Database.QueryRowx(query, studentIds, levelId, homeworkId).Scan(&count)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}

	return count, err
}

func (postgresRepository *postgresRepository) GetAvgCountDoHomeWorkLevelStudentId(homeworkId int, levelId int, studentIds []string) (float64, error) {

	query := `
		SELECT 
			COALESCE(avg(play_time), 0) AS avg_count_do_home_work
		FROM (
			SELECT 
			lpl.student_id,
			COUNT(*) AS play_time
			FROM "level".level_play_log lpl 
			WHERE lpl.student_id = ANY($1)
			AND lpl.level_id = $2
			AND lpl.homework_id = $3
			GROUP BY student_id 
		)
	`

	var count float64
	err := postgresRepository.Database.QueryRowx(query, studentIds, levelId, homeworkId).Scan(&count)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}

	return count, err
}

func (postgresRepository *postgresRepository) GetLatestDoHomeworkDateTime(homeworkId int, levelId int, studentIds []string) (string, error) {

	query := `
		SELECT 
			lpl.played_at
		FROM "level".level_play_log lpl 
		WHERE lpl.student_id = ANY($1)
		AND lpl.level_id = $2
		AND lpl.homework_id = $3
		ORDER BY lpl.played_at DESC
		LIMIT 1
	`

	var dateTime string
	err := postgresRepository.Database.QueryRowx(query, studentIds, levelId, homeworkId).Scan(&dateTime)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return "", err
	}

	return dateTime, err
}
