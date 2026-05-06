package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetLevelPlayLogAttemtCount(in *constant.OverViewStatusFilter) (int, error) {
	query := `
		SELECT 
			COUNT(lpl.level_id)
		FROM level.level_play_log lpl
		INNER JOIN homework.homework_template_level htl
			ON lpl.level_id = htl.level_id
		INNER JOIN homework.homework_template ht
			ON htl.homework_template_id = ht.id
		WHERE 
			lpl.student_id = $1
			AND ht.subject_id = $2
			AND lpl.class_id = $3
			AND DATE(lpl.played_at) BETWEEN $4 AND $5
	`

	args := []interface{}{in.StudentID, in.SubjectID, in.ClassID, in.StartedAt, in.EndedAt}
	var attempCount int
	err := postgresRepository.Database.QueryRowx(query, args...).Scan(&attempCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, err
	}

	return attempCount, nil
}
