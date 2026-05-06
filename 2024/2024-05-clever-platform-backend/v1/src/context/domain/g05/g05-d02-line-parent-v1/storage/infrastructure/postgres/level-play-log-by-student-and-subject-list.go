package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetLevelTotalByStudentAndSubject(in *constant.OverViewStatusFilter) ([]*constant.PlayLogData, error) {
	query := `
		SELECT DISTINCT ON (lpl.level_id) 
			lpl.level_id,
			lpl.played_at,
			lpl.star,
			lpl.time_used
		FROM level.level_play_log lpl
		INNER JOIN homework.homework_template_level htl
			ON lpl.level_id = htl.level_id
		INNER JOIN homework.homework_template ht
			ON htl.homework_template_id = ht.id
		WHERE 
			ht.subject_id = $2
			AND DATE(lpl.played_at) BETWEEN $3 AND $4
			AND lpl.student_id = $1
            AND lpl.class_id = $5
		ORDER BY lpl.level_id, lpl.star DESC, lpl.played_at DESC
	`

	args := []interface{}{in.StudentID, in.SubjectID, in.StartedAt, in.EndedAt, in.ClassID}
	playLogs := []*constant.PlayLogData{}

	err := postgresRepository.Database.Select(&playLogs, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return playLogs, nil
}
